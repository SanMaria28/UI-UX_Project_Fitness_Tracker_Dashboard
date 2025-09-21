// Enhanced Fitness Tracker Application - Fixed Delete and Forms Functionality
class FitnessTracker {
    constructor() {
        this.workouts = [];
        this.bodyMetrics = [];
        this.nutritionEntries = [];
        this.sleepLogs = [];
        this.nextWorkoutId = 1;
        this.nextMetricId = 1;
        this.nextNutritionId = 1;
        this.nextSleepId = 1;
        this.workoutToDelete = null;
        this.charts = {};
        this.currentSection = 'dashboard';
        
        // Initialize with sample data
        this.initializeSampleData();
        this.initializeEventListeners();
        this.initializeApp();
    }

    initializeSampleData() {
        // Sample workouts data
        this.workouts = [
            {id: 1, date: "2025-01-20", type: "Running", duration: 30, calories: 300, intensity: 7, notes: "Great morning run", equipment: "None", heartRate: 145},
            {id: 2, date: "2025-01-19", type: "Weightlifting", duration: 45, calories: 250, intensity: 8, notes: "Personal record on bench press", equipment: "Barbell, Dumbbells", heartRate: 130},
            {id: 3, date: "2025-01-18", type: "Cycling", duration: 60, calories: 400, intensity: 6, notes: "Scenic route through park", equipment: "Road Bike", heartRate: 125},
            {id: 4, date: "2025-01-17", type: "Yoga", duration: 45, calories: 150, intensity: 4, notes: "Relaxing session", equipment: "Mat", heartRate: 90},
            {id: 5, date: "2025-01-16", type: "HIIT", duration: 25, calories: 280, intensity: 9, notes: "Intense workout", equipment: "None", heartRate: 160},
            {id: 6, date: "2025-01-15", type: "Swimming", duration: 50, calories: 350, intensity: 6, notes: "Pool workout", equipment: "None", heartRate: 135}
        ];

        // Sample body metrics
        this.bodyMetrics = [
            {id: 1, date: "2025-01-20", weight: 75.2, bodyFat: 15.5, muscleMass: 45.8, bmi: 22.1},
            {id: 2, date: "2025-01-13", weight: 75.8, bodyFat: 16.1, muscleMass: 45.2, bmi: 22.3}
        ];

        // Sample nutrition entries
        this.nutritionEntries = [
            {id: 1, date: "2025-01-20", name: "Oatmeal with berries", time: "Breakfast", calories: 350, protein: 12, carbs: 65, fat: 8},
            {id: 2, date: "2025-01-20", name: "Grilled chicken salad", time: "Lunch", calories: 450, protein: 35, carbs: 25, fat: 18}
        ];

        // Sample sleep logs
        this.sleepLogs = [
            {id: 1, date: "2025-01-19", bedtime: "23:00", wakeTime: "07:30", duration: 8.5, quality: "Good", efficiency: 85},
            {id: 2, date: "2025-01-18", bedtime: "22:45", wakeTime: "07:15", duration: 8.5, quality: "Excellent", efficiency: 92}
        ];

        this.nextWorkoutId = this.workouts.length + 1;
        this.nextMetricId = this.bodyMetrics.length + 1;
        this.nextNutritionId = this.nutritionEntries.length + 1;
        this.nextSleepId = this.sleepLogs.length + 1;
    }

    initializeEventListeners() {
        // Navigation - Fixed to work properly
        document.addEventListener('click', (e) => {
            // Handle navigation clicks
            const navElement = e.target.closest('[data-section]');
            if (navElement) {
                e.preventDefault();
                e.stopPropagation();
                const section = navElement.getAttribute('data-section');
                console.log('Navigation clicked:', section);
                this.showSection(section);
                return;
            }

            // Handle delete button clicks with proper event delegation
            if (e.target.matches('.btn-delete') || e.target.closest('.btn-delete')) {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.matches('.btn-delete') ? e.target : e.target.closest('.btn-delete');
                const workoutId = parseInt(button.getAttribute('data-id'));
                console.log('Delete button clicked for workout ID:', workoutId);
                this.showDeleteModal(workoutId);
                return;
            }
            
            // Handle edit button clicks
            if (e.target.matches('.btn-edit') || e.target.closest('.btn-edit')) {
                e.preventDefault();
                e.stopPropagation();
                const button = e.target.matches('.btn-edit') ? e.target : e.target.closest('.btn-edit');
                const workoutId = parseInt(button.getAttribute('data-id'));
                this.editWorkout(workoutId);
                return;
            }

            // Handle modal overlay clicks
            if (e.target.classList.contains('modal-overlay')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
                return;
            }
        });

        // Add workout button and form
        const addWorkoutBtn = document.getElementById('add-workout-btn');
        if (addWorkoutBtn) {
            addWorkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddWorkoutModal();
            });
        }

        const workoutForm = document.getElementById('workout-form');
        if (workoutForm) {
            workoutForm.addEventListener('submit', (e) => this.handleAddWorkout(e));
        }

        // Body Metrics Form - FIXED
        const addMetricBtn = document.getElementById('add-metric-btn');
        if (addMetricBtn) {
            addMetricBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddMetricModal();
            });
        }

        const bodyMetricsForm = document.getElementById('bodyMetricsForm');
        if (bodyMetricsForm) {
            bodyMetricsForm.addEventListener('submit', (e) => this.handleAddBodyMetric(e));
        }

        // Nutrition Form - FIXED
        const addMealBtn = document.getElementById('add-meal-btn');
        if (addMealBtn) {
            addMealBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddMealModal();
            });
        }

        const nutritionForm = document.getElementById('nutritionForm');
        if (nutritionForm) {
            nutritionForm.addEventListener('submit', (e) => this.handleAddNutrition(e));
        }

        // Sleep Form - FIXED
        const addSleepBtn = document.getElementById('add-sleep-btn');
        if (addSleepBtn) {
            addSleepBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAddSleepModal();
            });
        }

        const sleepForm = document.getElementById('sleepForm');
        if (sleepForm) {
            sleepForm.addEventListener('submit', (e) => this.handleAddSleep(e));
        }
        
        // Modal controls - Workout
        const closeWorkoutModal = document.getElementById('close-workout-modal');
        if (closeWorkoutModal) {
            closeWorkoutModal.addEventListener('click', () => this.hideModal('add-workout-modal'));
        }

        const cancelWorkout = document.getElementById('cancel-workout');
        if (cancelWorkout) {
            cancelWorkout.addEventListener('click', () => this.hideModal('add-workout-modal'));
        }

        // Modal controls - Body Metrics
        const closeMetricModal = document.getElementById('close-metric-modal');
        if (closeMetricModal) {
            closeMetricModal.addEventListener('click', () => this.hideModal('add-metric-modal'));
        }

        const cancelMetric = document.getElementById('cancel-metric');
        if (cancelMetric) {
            cancelMetric.addEventListener('click', () => this.hideModal('add-metric-modal'));
        }

        // Modal controls - Nutrition
        const closeMealModal = document.getElementById('close-meal-modal');
        if (closeMealModal) {
            closeMealModal.addEventListener('click', () => this.hideModal('add-meal-modal'));
        }

        const cancelMeal = document.getElementById('cancel-meal');
        if (cancelMeal) {
            cancelMeal.addEventListener('click', () => this.hideModal('add-meal-modal'));
        }

        // Modal controls - Sleep
        const closeSleepModal = document.getElementById('close-sleep-modal');
        if (closeSleepModal) {
            closeSleepModal.addEventListener('click', () => this.hideModal('add-sleep-modal'));
        }

        const cancelSleep = document.getElementById('cancel-sleep');
        if (cancelSleep) {
            cancelSleep.addEventListener('click', () => this.hideModal('add-sleep-modal'));
        }

        // Delete modal controls
        const closeDeleteModal = document.getElementById('close-delete-modal');
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => this.hideModal('delete-modal'));
        }

        const cancelDelete = document.getElementById('cancel-delete');
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => this.hideModal('delete-modal'));
        }

        const confirmDelete = document.getElementById('confirm-delete');
        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => this.confirmDeleteWorkout());
        }

        // Filter
        const workoutFilter = document.getElementById('workout-filter');
        if (workoutFilter) {
            workoutFilter.addEventListener('change', (e) => this.filterWorkouts(e.target.value));
        }

        // Set today's date as default for all forms
        this.setDefaultDates();
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const workoutDateInput = document.getElementById('workout-date');
        const metricDateInput = document.getElementById('metric-date');
        const sleepDateInput = document.getElementById('sleep-date');
        
        if (workoutDateInput) workoutDateInput.value = today;
        if (metricDateInput) metricDateInput.value = today;
        if (sleepDateInput) sleepDateInput.value = today;
    }

    initializeApp() {
        console.log('Initializing fitness tracker app...');
        this.updateDashboardStats();
        this.updateWorkoutsTable();
        this.updateRecentWorkouts();
        this.updateProgressBars();
        this.updateBodyMetricsDisplay();
        this.updateNutritionDisplay();
        this.updateSleepDisplay();
        this.showSection('dashboard');
        console.log('Fitness Tracker initialized with', this.workouts.length, 'workouts');
    }

    // Body Metrics Form Handler - FIXED
    showAddMetricModal() {
        this.showModal('add-metric-modal');
        const form = document.getElementById('bodyMetricsForm');
        if (form) form.reset();
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('metric-date');
        if (dateInput) dateInput.value = today;
    }

    handleAddBodyMetric(e) {
        e.preventDefault();
        
        const formData = {
            date: document.getElementById('metric-date').value,
            weight: parseFloat(document.getElementById('metric-weight').value),
            bodyFat: parseFloat(document.getElementById('metric-body-fat').value) || 0,
            muscleMass: parseFloat(document.getElementById('metric-muscle-mass').value) || 0
        };

        if (!formData.date || !formData.weight) {
            this.showToast('Please fill in date and weight fields', 'error');
            return;
        }

        // Calculate BMI
        const height = 1.75; // Default height in meters - you could make this configurable
        formData.bmi = parseFloat((formData.weight / (height * height)).toFixed(1));

        const newMetric = {
            id: this.nextMetricId++,
            ...formData
        };

        this.bodyMetrics.unshift(newMetric);
        this.hideModal('add-metric-modal');
        this.updateBodyMetricsDisplay();
        this.updateCharts();
        this.showToast('Body metrics added successfully!', 'success');
        console.log('Body metric added:', newMetric);
    }

    // Nutrition Form Handler - FIXED
    showAddMealModal() {
        this.showModal('add-meal-modal');
        const form = document.getElementById('nutritionForm');
        if (form) form.reset();
    }

    handleAddNutrition(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('meal-name').value,
            time: document.getElementById('meal-time').value,
            calories: parseInt(document.getElementById('meal-calories').value),
            protein: parseFloat(document.getElementById('meal-protein').value),
            carbs: parseFloat(document.getElementById('meal-carbs').value),
            fat: parseFloat(document.getElementById('meal-fat').value)
        };

        if (!formData.name || !formData.time || !formData.calories || 
            formData.protein === null || formData.carbs === null || formData.fat === null) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        const newNutrition = {
            id: this.nextNutritionId++,
            date: new Date().toISOString().split('T')[0],
            ...formData
        };

        this.nutritionEntries.unshift(newNutrition);
        this.hideModal('add-meal-modal');
        this.updateNutritionDisplay();
        this.showToast('Meal added successfully!', 'success');
        console.log('Nutrition entry added:', newNutrition);
    }

    // Sleep Form Handler - FIXED WITH BETTER TIME HANDLING
    showAddSleepModal() {
        this.showModal('add-sleep-modal');
        const form = document.getElementById('sleepForm');
        if (form) form.reset();
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('sleep-date');
        if (dateInput) dateInput.value = today;
    }

    handleAddSleep(e) {
        e.preventDefault();
        
        const formData = {
            date: document.getElementById('sleep-date').value,
            bedtime: document.getElementById('sleep-bedtime').value,
            wakeTime: document.getElementById('sleep-wake-time').value,
            quality: document.getElementById('sleep-quality').value,
            efficiency: parseInt(document.getElementById('sleep-efficiency').value) || 85
        };

        // Better validation
        if (!formData.date) {
            this.showToast('Please select a date', 'error');
            return;
        }
        if (!formData.bedtime) {
            this.showToast('Please enter bedtime', 'error');
            return;
        }
        if (!formData.wakeTime) {
            this.showToast('Please enter wake time', 'error');
            return;
        }
        if (!formData.quality) {
            this.showToast('Please select sleep quality', 'error');
            return;
        }

        // Improved time calculation with better error handling
        let duration = 0;
        try {
            // Parse times - handle both 24-hour format and ensure valid times
            const bedtimeMinutes = this.timeToMinutes(formData.bedtime);
            const wakeTimeMinutes = this.timeToMinutes(formData.wakeTime);
            
            if (bedtimeMinutes === null || wakeTimeMinutes === null) {
                throw new Error('Invalid time format');
            }
            
            // Calculate duration considering overnight sleep
            if (wakeTimeMinutes <= bedtimeMinutes) {
                // Wake time is next day
                duration = (24 * 60 - bedtimeMinutes + wakeTimeMinutes) / 60;
            } else {
                // Same day (unusual but possible for naps)
                duration = (wakeTimeMinutes - bedtimeMinutes) / 60;
            }
            
            duration = parseFloat(duration.toFixed(1));
            
            // Validate reasonable duration (between 0.5 and 16 hours)
            if (duration < 0.5 || duration > 16) {
                throw new Error('Invalid sleep duration');
            }
            
        } catch (error) {
            console.error('Sleep time calculation error:', error);
            this.showToast('Invalid time format. Please use HH:MM format (e.g., 23:30)', 'error');
            return;
        }

        const newSleep = {
            id: this.nextSleepId++,
            ...formData,
            duration: duration
        };

        this.sleepLogs.unshift(newSleep);
        this.hideModal('add-sleep-modal');
        this.updateSleepDisplay();
        this.showToast('Sleep log added successfully!', 'success');
        console.log('Sleep log added:', newSleep);
    }

    // Helper function to convert time string to minutes
    timeToMinutes(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return null;
        
        // Handle HH:MM format
        const timeParts = timeStr.split(':');
        if (timeParts.length !== 2) return null;
        
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        
        // Validate hours and minutes
        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return null;
        }
        
        return hours * 60 + minutes;
    }

    // Update displays for new sections
    updateBodyMetricsDisplay() {
        this.updateBodyComposition();
        this.updateMetricsTable();
        this.updateWeightChart();
    }

    updateBodyComposition() {
        const container = document.getElementById('body-composition');
        if (!container) return;

        if (this.bodyMetrics.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No body metrics recorded</p></div>';
            return;
        }

        const latest = this.bodyMetrics[0];
        container.innerHTML = `
            <div class="metric-item">
                <span>Weight</span>
                <span>${latest.weight} kg</span>
            </div>
            <div class="metric-item">
                <span>BMI</span>
                <span>${latest.bmi}</span>
            </div>
            <div class="metric-item">
                <span>Body Fat</span>
                <span>${latest.bodyFat}%</span>
            </div>
            <div class="metric-item">
                <span>Muscle Mass</span>
                <span>${latest.muscleMass} kg</span>
            </div>
        `;
    }

    updateMetricsTable() {
        const tbody = document.getElementById('metrics-tbody');
        if (!tbody) return;

        if (this.bodyMetrics.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="empty-state"><p>No metrics recorded</p></div></td></tr>';
            return;
        }

        tbody.innerHTML = this.bodyMetrics.map(metric => `
            <tr>
                <td>${this.formatDate(metric.date)}</td>
                <td>${metric.weight} kg</td>
                <td>${metric.bodyFat}%</td>
                <td>${metric.muscleMass} kg</td>
                <td>${metric.bmi}</td>
            </tr>
        `).join('');
    }

    updateNutritionDisplay() {
        this.updateNutritionStats();
        this.updateNutritionTable();
    }

    updateNutritionStats() {
        const today = new Date().toISOString().split('T')[0];
        const todayEntries = this.nutritionEntries.filter(entry => entry.date === today);
        
        const totalCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
        const totalProtein = todayEntries.reduce((sum, entry) => sum + entry.protein, 0);
        const totalCarbs = todayEntries.reduce((sum, entry) => sum + entry.carbs, 0);
        const totalFat = todayEntries.reduce((sum, entry) => sum + entry.fat, 0);

        const caloriesEl = document.getElementById('daily-calories');
        const proteinEl = document.getElementById('daily-protein');
        const carbsEl = document.getElementById('daily-carbs');
        const fatEl = document.getElementById('daily-fat');

        if (caloriesEl) caloriesEl.textContent = `${totalCalories} cal`;
        if (proteinEl) proteinEl.textContent = `${totalProtein.toFixed(1)}g`;
        if (carbsEl) carbsEl.textContent = `${totalCarbs.toFixed(1)}g`;
        if (fatEl) fatEl.textContent = `${totalFat.toFixed(1)}g`;
    }

    updateNutritionTable() {
        const tbody = document.getElementById('nutrition-tbody');
        if (!tbody) return;

        if (this.nutritionEntries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="empty-state"><p>No meals recorded</p></div></td></tr>';
            return;
        }

        tbody.innerHTML = this.nutritionEntries.slice(0, 10).map(entry => `
            <tr>
                <td>${entry.time}</td>
                <td>${entry.name}</td>
                <td>${entry.calories} cal</td>
                <td>${entry.protein}g</td>
                <td>${entry.carbs}g</td>
                <td>${entry.fat}g</td>
            </tr>
        `).join('');
    }

    updateSleepDisplay() {
        this.updateSleepStats();
        this.updateSleepTable();
    }

    updateSleepStats() {
        const lastNightEl = document.getElementById('last-night-sleep');
        const avgSleepEl = document.getElementById('avg-sleep');
        const avgQualityEl = document.getElementById('avg-quality');

        if (this.sleepLogs.length === 0) {
            if (lastNightEl) lastNightEl.textContent = '-- hours';
            if (avgSleepEl) avgSleepEl.textContent = '-- hours';
            if (avgQualityEl) avgQualityEl.textContent = '--';
            return;
        }

        const lastNight = this.sleepLogs[0];
        const avgDuration = this.sleepLogs.reduce((sum, log) => sum + log.duration, 0) / this.sleepLogs.length;
        const qualities = this.sleepLogs.map(log => log.quality);
        const mostCommonQuality = this.getMostFrequent(qualities);

        if (lastNightEl) lastNightEl.textContent = `${lastNight.duration} hours`;
        if (avgSleepEl) avgSleepEl.textContent = `${avgDuration.toFixed(1)} hours`;
        if (avgQualityEl) avgQualityEl.textContent = mostCommonQuality;
    }

    updateSleepTable() {
        const tbody = document.getElementById('sleep-tbody');
        if (!tbody) return;

        if (this.sleepLogs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center"><div class="empty-state"><p>No sleep logs recorded</p></div></td></tr>';
            return;
        }

        tbody.innerHTML = this.sleepLogs.slice(0, 10).map(log => `
            <tr>
                <td>${this.formatDate(log.date)}</td>
                <td>${log.bedtime}</td>
                <td>${log.wakeTime}</td>
                <td>${log.duration}h</td>
                <td><span class="status status--${this.getQualityClass(log.quality)}">${log.quality}</span></td>
                <td>${log.efficiency}%</td>
            </tr>
        `).join('');
    }

    // Keep all the existing workout functionality exactly the same
    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Remove active class from all sections and menu items
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show target section and update menu
        const targetSection = document.getElementById(sectionId);
        const menuItem = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            console.log('Section activated:', sectionId);
        } else {
            console.error('Section not found:', sectionId);
        }
        
        if (menuItem) {
            menuItem.classList.add('active');
            console.log('Menu item activated');
        } else {
            console.error('Menu item not found for section:', sectionId);
        }

        // Initialize charts if showing analytics
        if (sectionId === 'analytics') {
            setTimeout(() => this.initializeCharts(), 100);
        }

        // Update displays for specific sections
        if (sectionId === 'workouts') {
            this.updateWorkoutsTable();
        }
        if (sectionId === 'body-metrics') {
            this.updateBodyMetricsDisplay();
        }
        if (sectionId === 'nutrition') {
            this.updateNutritionDisplay();
        }
        if (sectionId === 'sleep') {
            this.updateSleepDisplay();
        }
    }

    showAddWorkoutModal() {
        this.showModal('add-workout-modal');
        // Reset form
        const form = document.getElementById('workout-form');
        if (form) form.reset();
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('workout-date');
        if (dateInput) {
            dateInput.value = today;
        }
    }

    handleAddWorkout(e) {
        e.preventDefault();
        
        const formData = {
            date: document.getElementById('workout-date').value,
            type: document.getElementById('workout-type').value,
            duration: parseInt(document.getElementById('workout-duration').value),
            calories: parseInt(document.getElementById('workout-calories').value),
            intensity: parseInt(document.getElementById('workout-intensity').value),
            notes: document.getElementById('workout-notes').value || ''
        };

        if (!formData.date || !formData.type || !formData.duration || !formData.calories || !formData.intensity) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const newWorkout = {
            id: this.nextWorkoutId++,
            ...formData,
            equipment: 'None', // Default value
            heartRate: this.estimateHeartRate(formData.type, formData.intensity)
        };

        this.workouts.unshift(newWorkout);
        this.hideModal('add-workout-modal');
        this.updateAllDisplays();
        this.showToast('Workout added successfully!', 'success');
        console.log('Workout added:', newWorkout);
    }

    showDeleteModal(workoutId) {
        console.log('Showing delete modal for workout ID:', workoutId);
        const workout = this.workouts.find(w => w.id === workoutId);
        if (!workout) {
            console.error('Workout not found:', workoutId);
            return;
        }

        this.workoutToDelete = workout;
        console.log('Workout to delete:', this.workoutToDelete);
        
        const details = document.getElementById('delete-details');
        if (details) {
            details.innerHTML = `
                <strong>${workout.type}</strong> from ${this.formatDate(workout.date)}<br>
                <small>Duration: ${workout.duration} minutes | Calories: ${workout.calories}</small>
            `;
        }

        this.showModal('delete-modal');
    }

    confirmDeleteWorkout() {
        console.log('Confirming delete for workout:', this.workoutToDelete);
        if (!this.workoutToDelete) {
            console.error('No workout to delete');
            return;
        }

        const workoutId = this.workoutToDelete.id;
        const row = document.querySelector(`[data-id="${workoutId}"]`)?.closest('tr');
        
        console.log('Deleting workout with ID:', workoutId);
        console.log('Row element found:', row);
        
        // Add deletion animation
        if (row) {
            row.classList.add('workout-row-deleting');
        }

        setTimeout(() => {
            const originalLength = this.workouts.length;
            // Remove from array
            this.workouts = this.workouts.filter(w => w.id !== workoutId);
            
            console.log(`Workout deleted. Array length: ${originalLength} -> ${this.workouts.length}`);
            
            // Update all displays
            this.updateAllDisplays();
            
            // Hide modal and show success
            this.hideModal('delete-modal');
            this.showToast('Workout deleted successfully!', 'success');
            
            this.workoutToDelete = null;
        }, 300);
    }

    editWorkout(workoutId) {
        // For now, just show a simple edit functionality
        // In a full implementation, this would open an edit modal
        this.showToast('Edit functionality coming soon!', 'info');
    }

    filterWorkouts(type) {
        const tbody = document.getElementById('workouts-tbody');
        if (!tbody) return;

        const filteredWorkouts = type === 'all' ? this.workouts : this.workouts.filter(w => w.type === type);
        this.renderWorkoutsTable(filteredWorkouts);
    }

    updateAllDisplays() {
        this.updateDashboardStats();
        this.updateWorkoutsTable();
        this.updateRecentWorkouts();
        this.updateProgressBars();
        this.updateCharts();
    }

    updateDashboardStats() {
        const totalWorkouts = this.workouts.length;
        const weekStart = this.getStartOfWeek();
        const weekWorkouts = this.workouts.filter(w => new Date(w.date) >= new Date(weekStart));
        
        const weekMinutes = weekWorkouts.reduce((sum, w) => sum + w.duration, 0);
        const weekCalories = weekWorkouts.reduce((sum, w) => sum + w.calories, 0);
        const weekCount = weekWorkouts.length;

        this.animateCounter('total-workouts', totalWorkouts);
        this.animateCounter('week-minutes', weekMinutes);
        this.animateCounter('week-calories', weekCalories);
        this.animateCounter('week-workouts', weekCount);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue === targetValue) return;

        element.classList.add('updating');
        
        const increment = targetValue > currentValue ? 1 : -1;
        const updateInterval = Math.abs(targetValue - currentValue) > 50 ? 10 : 50;
        
        let current = currentValue;
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if (current === targetValue) {
                clearInterval(timer);
                element.classList.remove('updating');
            }
        }, updateInterval);
    }

    updateWorkoutsTable() {
        this.renderWorkoutsTable(this.workouts);
    }

    renderWorkoutsTable(workouts) {
        const tbody = document.getElementById('workouts-tbody');
        if (!tbody) {
            console.warn('Workouts table body not found');
            return;
        }

        tbody.innerHTML = '';
        console.log('Rendering workouts table with', workouts.length, 'workouts');

        if (workouts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        <div class="empty-state">
                            <i class="fas fa-dumbbell"></i>
                            <h3>No workouts found</h3>
                            <p>Start by adding your first workout!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        workouts.forEach(workout => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.formatDate(workout.date)}</td>
                <td>
                    <span class="workout-type-${workout.type.toLowerCase().replace(/\s+/g, '')}">
                        <i class="${this.getWorkoutIcon(workout.type)}"></i>
                        ${workout.type}
                    </span>
                </td>
                <td><span class="status status--info">${workout.duration} min</span></td>
                <td><span class="status status--success">${workout.calories} cal</span></td>
                <td>
                    <div class="intensity-bar">
                        ${'★'.repeat(workout.intensity)}${'☆'.repeat(10 - workout.intensity)}
                    </div>
                </td>
                <td>
                    <button class="btn-action btn-edit" data-id="${workout.id}" title="Edit workout" type="button">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${workout.id}" title="Delete workout" type="button">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
            console.log('Added row for workout:', workout.id, workout.type);
        });
    }

    updateRecentWorkouts() {
        const container = document.getElementById('recent-workouts');
        if (!container) return;

        const recentWorkouts = this.workouts.slice(0, 5);
        
        if (recentWorkouts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No recent workouts</p></div>';
            return;
        }

        container.innerHTML = recentWorkouts.map(workout => `
            <div class="recent-workout-item">
                <div class="workout-info">
                    <h5><i class="${this.getWorkoutIcon(workout.type)}"></i> ${workout.type}</h5>
                    <p>${this.formatDate(workout.date)}</p>
                </div>
                <div class="workout-stats">
                    <span>${workout.duration}min</span>
                    <span>${workout.calories}cal</span>
                </div>
            </div>
        `).join('');
    }

    updateProgressBars() {
        const weekStart = this.getStartOfWeek();
        const weekWorkouts = this.workouts.filter(w => new Date(w.date) >= new Date(weekStart));
        
        const currentMinutes = weekWorkouts.reduce((sum, w) => sum + w.duration, 0);
        const currentCalories = weekWorkouts.reduce((sum, w) => sum + w.calories, 0);
        
        const minutesGoal = 300;
        const caloriesGoal = 2000;
        
        const minutesProgress = Math.min((currentMinutes / minutesGoal) * 100, 100);
        const caloriesProgress = Math.min((currentCalories / caloriesGoal) * 100, 100);
        
        const minutesBar = document.getElementById('minutes-progress-bar');
        const caloriesBar = document.getElementById('calories-progress-bar');
        const minutesText = document.getElementById('minutes-progress-text');
        const caloriesText = document.getElementById('calories-progress-text');
        
        if (minutesBar) minutesBar.style.width = minutesProgress + '%';
        if (caloriesBar) caloriesBar.style.width = caloriesProgress + '%';
        if (minutesText) minutesText.textContent = `${currentMinutes}/${minutesGoal}`;
        if (caloriesText) caloriesText.textContent = `${currentCalories}/${caloriesGoal}`;
    }

    initializeCharts() {
        this.initializeCaloriesChart();
        this.initializeTypesChart();
        this.initializeMonthlyChart();
        this.initializeIntensityChart();
        this.initializeWeightChart();
    }

    initializeCaloriesChart() {
        const canvas = document.getElementById('calories-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.charts.calories) {
            this.charts.calories.destroy();
        }

        // Get last 7 days of data
        const last7Days = this.getLast7Days();
        const chartData = last7Days.map(date => {
            const dayWorkouts = this.workouts.filter(w => w.date === date);
            return dayWorkouts.reduce((sum, w) => sum + w.calories, 0);
        });

        this.charts.calories = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => this.formatDate(date, true)),
                datasets: [{
                    label: 'Calories Burned',
                    data: chartData,
                    borderColor: '#1FB8CD',
                    backgroundColor: '#1FB8CD30',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Calories'
                        }
                    }
                }
            }
        });
    }

    initializeTypesChart() {
        const canvas = document.getElementById('types-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.types) {
            this.charts.types.destroy();
        }

        const typeData = {};
        this.workouts.forEach(workout => {
            if (!typeData[workout.type]) {
                typeData[workout.type] = 0;
            }
            typeData[workout.type] += workout.duration;
        });

        const types = Object.keys(typeData);
        const durations = Object.values(typeData);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'];

        this.charts.types = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: types,
                datasets: [{
                    data: durations,
                    backgroundColor: colors.slice(0, types.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    initializeMonthlyChart() {
        const canvas = document.getElementById('monthly-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        // Group workouts by month
        const monthData = {};
        this.workouts.forEach(workout => {
            const month = workout.date.substring(0, 7); // YYYY-MM format
            if (!monthData[month]) {
                monthData[month] = { workouts: 0, calories: 0 };
            }
            monthData[month].workouts++;
            monthData[month].calories += workout.calories;
        });

        const months = Object.keys(monthData).sort();
        const workoutCounts = months.map(month => monthData[month].workouts);
        const caloriesSums = months.map(month => monthData[month].calories);

        this.charts.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months.map(month => new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
                datasets: [
                    {
                        label: 'Workouts',
                        data: workoutCounts,
                        backgroundColor: '#1FB8CD80',
                        borderColor: '#1FB8CD',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Calories',
                        data: caloriesSums,
                        type: 'line',
                        borderColor: '#FFC185',
                        backgroundColor: '#FFC18530',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Workouts'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Calories'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    initializeIntensityChart() {
        const canvas = document.getElementById('intensity-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.intensity) {
            this.charts.intensity.destroy();
        }

        const intensityData = {};
        for (let i = 1; i <= 10; i++) {
            intensityData[i] = 0;
        }
        
        this.workouts.forEach(workout => {
            intensityData[workout.intensity]++;
        });

        this.charts.intensity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(intensityData),
                datasets: [{
                    label: 'Number of Workouts',
                    data: Object.values(intensityData),
                    backgroundColor: '#B4413C80',
                    borderColor: '#B4413C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Workouts'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Intensity Level'
                        }
                    }
                }
            }
        });
    }

    updateWeightChart() {
        this.initializeWeightChart();
    }

    initializeWeightChart() {
        const canvas = document.getElementById('weight-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (this.charts.weight) {
            this.charts.weight.destroy();
        }

        const dates = this.bodyMetrics.map(m => this.formatDate(m.date, true));
        const weights = this.bodyMetrics.map(m => m.weight);

        this.charts.weight = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Weight (kg)',
                    data: weights,
                    borderColor: '#5D878F',
                    backgroundColor: '#5D878F30',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#5D878F',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Weight (kg)'
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        if (this.currentSection === 'analytics') {
            setTimeout(() => this.initializeCharts(), 100);
        }
        if (this.currentSection === 'body-metrics') {
            setTimeout(() => this.updateWeightChart(), 100);
        }
    }

    // Utility methods
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            console.log('Modal shown:', modalId);
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            console.log('Modal hidden:', modalId);
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icon = toast.querySelector('.toast-icon');
        const messageEl = toast.querySelector('.toast-message');
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        if (icon) icon.className = `toast-icon ${icons[type] || icons.success}`;
        if (messageEl) messageEl.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    formatDate(dateStr, short = false) {
        const date = new Date(dateStr);
        if (short) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    getWorkoutIcon(type) {
        const icons = {
            'Running': 'fas fa-running',
            'Cycling': 'fas fa-biking',
            'Weightlifting': 'fas fa-dumbbell',
            'Yoga': 'fas fa-leaf',
            'Swimming': 'fas fa-swimmer',
            'HIIT': 'fas fa-fire',
            'Pilates': 'fas fa-praying-hands',
            'CrossFit': 'fas fa-fist-raised'
        };
        return icons[type] || 'fas fa-heartbeat';
    }

    getQualityClass(quality) {
        const classes = {
            'Excellent': 'success',
            'Good': 'success',
            'Fair': 'warning',
            'Poor': 'error'
        };
        return classes[quality] || 'info';
    }

    getMostFrequent(arr) {
        return arr.sort((a,b) =>
            arr.filter(v => v===a).length
            - arr.filter(v => v===b).length
        ).pop();
    }

    estimateHeartRate(type, intensity) {
        const baseRates = {
            'Running': 140,
            'Cycling': 130,
            'Weightlifting': 110,
            'Yoga': 80,
            'Swimming': 130,
            'HIIT': 160,
            'Pilates': 90
        };
        const base = baseRates[type] || 120;
        return Math.round(base + (intensity - 5) * 10);
    }

    getStartOfWeek() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek;
        return new Date(now.setDate(diff)).toISOString().split('T')[0];
    }

    getStartOfMonth() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    }

    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new FitnessTracker();
});
