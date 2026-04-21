// Shift Tracker JS for Jurnal AI
const shiftsData = {
    // Array of available shift types
    types: [
        'Cuti', 'Pagi h-25', 'Pagi L-350', 'Izin', 
        'Malam h-25', 'Malam L-350', 'Kantor', 'Dinas'
    ],
    // Map shift to CSS class suffix
    classMap: {
        'Cuti': 'cuti',
        'Pagi h-25': 'pagi25',
        'Pagi L-350': 'pagi350',
        'Izin': 'izin',
        'Malam h-25': 'malam25',
        'Malam L-350': 'malam350',
        'Kantor': 'kantor',
        'Dinas': 'dinas'
    },
    // Map shift to border colors for summary items
    colorMap: {
        'Cuti': '#f59e0b',
        'Pagi h-25': '#3b82f6',
        'Pagi L-350': '#1d4ed8',
        'Izin': '#f97316',
        'Malam h-25': '#8b5cf6',
        'Malam L-350': '#5b21b6',
        'Kantor': '#10b981',
        'Dinas': '#0ea5e9'
    }
};

let shiftCurrentDate = new Date();
let shiftSelectedDateString = null;
let shiftSavedShifts = {};

// Default values for initialization if localstorage is empty
const SHIFT_STORAGE_KEY = 'work_shift_data';

// Init function called maybe when screen is shown or loaded
function initShiftTracker() {
    console.log("Initializing Shift Tracker...");
    loadShiftData();
    renderShiftCalendar();
    setupShiftEventListeners();
}

// Load from LocalStorage
function loadShiftData() {
    const data = localStorage.getItem(SHIFT_STORAGE_KEY);
    if (data) {
        try {
            shiftSavedShifts = JSON.parse(data);
        } catch (e) {
            console.error("Failed to parse shift data", e);
            shiftSavedShifts = {};
        }
    }
}

// Save to LocalStorage
function saveShiftData() {
    localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(shiftSavedShifts));
}

// Format Date as YYYY-MM-DD
function formatShiftDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Render the calendar for the curent month
function renderShiftCalendar() {
    const calendarGrid = document.getElementById('shift-calendarGrid');
    const currentMonthLabel = document.getElementById('shift-currentMonthLabel');
    if(!calendarGrid || !currentMonthLabel) return;
    
    calendarGrid.innerHTML = '';
    
    const year = shiftCurrentDate.getFullYear();
    const month = shiftCurrentDate.getMonth(); // 0-indexed
    
    // Set Header Label
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    currentMonthLabel.textContent = `${monthNames[month]} ${year}`;
    
    // First day of month (0 = Sunday, 1 = Monday ...)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Current date for highlighting "today"
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    // Track stats for the month
    const monthStats = {};
    shiftsData.types.forEach(type => monthStats[type] = 0);
    
    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day shift-calendar-day';
        
        if (isCurrentMonth && day === today.getDate()) {
            dayCell.classList.add('today');
        }
        
        const dateString = formatShiftDateString(year, month, day);
        const shiftType = shiftSavedShifts[dateString];
        
        // Day number
        const numSpan = document.createElement('span');
        numSpan.className = 'day-number';
        numSpan.textContent = day;
        dayCell.appendChild(numSpan);
        
        // Set styling if a shift is assigned
        if (shiftType && shiftsData.classMap[shiftType]) {
            const classSuffix = shiftsData.classMap[shiftType];
            dayCell.classList.add(`bg-shift-${classSuffix}`);
            
            const labelSpan = document.createElement('span');
            labelSpan.className = `shift-label text-shift-${classSuffix}`;
            labelSpan.textContent = shiftType;
            dayCell.appendChild(labelSpan);
            
            // Increment stat
            if (monthStats[shiftType] !== undefined) {
                monthStats[shiftType]++;
            }
        }
        
        // Add click event for the day
        dayCell.addEventListener('click', () => openShiftModal(dateString, day, monthNames[month], year));
        
        calendarGrid.appendChild(dayCell);
    }
    
    renderShiftSummary(monthStats);
}

// Render the summary cards at the bottom
function renderShiftSummary(stats) {
    const summaryGrid = document.getElementById('shift-summaryGrid');
    if(!summaryGrid) return;
    summaryGrid.innerHTML = '';
    let hasShifts = false;
    
    shiftsData.types.forEach(type => {
        const count = stats[type];
        if (count > 0) {
            hasShifts = true;
            const item = document.createElement('div');
            item.className = 'shift-summary-item';
            item.style.borderLeftColor = shiftsData.colorMap[type];
            
            item.innerHTML = `
                <span class="shift-summary-name">${type}</span>
                <span class="shift-summary-count">${count}</span>
            `;
            summaryGrid.appendChild(item);
        }
    });

    if (!hasShifts) {
        summaryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 1rem 0;">
                Belum ada shift terjadwal bulan ini.
            </div>
        `;
    }
}

// Open Shift Selection Modal
function openShiftModal(dateString, day, monthName, year) {
    const shiftModal = document.getElementById('shift-Modal');
    const modalDateLabel = document.getElementById('shift-modalDateLabel');
    if(!shiftModal) return;
    
    shiftSelectedDateString = dateString;
    modalDateLabel.textContent = `${day} ${monthName} ${year}`;
    shiftModal.classList.add('active');
}

// Close Modal
function closeShiftModal() {
    const shiftModal = document.getElementById('shift-Modal');
    if(!shiftModal) return;
    
    shiftModal.classList.remove('active');
    shiftSelectedDateString = null;
}

// Set shift for the selected date
function setShiftEvent(shiftType) {
    if (shiftSelectedDateString) {
        shiftSavedShifts[shiftSelectedDateString] = shiftType;
        saveShiftData();
        renderShiftCalendar();
        closeShiftModal();
    }
}

// Clear shift for the selected date
function clearShiftEvent() {
    if (shiftSelectedDateString && shiftSavedShifts[shiftSelectedDateString]) {
        delete shiftSavedShifts[shiftSelectedDateString];
        saveShiftData();
        renderShiftCalendar();
    }
    closeShiftModal();
}

// Event Listeners Setup
function setupShiftEventListeners() {
    const prevMonthBtn = document.getElementById('shift-prevMonth');
    const nextMonthBtn = document.getElementById('shift-nextMonth');
    const closeModalBtn = document.getElementById('shift-closeModal');
    const shiftModal = document.getElementById('shift-Modal');
    const clearShiftBtn = document.getElementById('shift-clearShiftBtn');
    
    if(prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            shiftCurrentDate.setMonth(shiftCurrentDate.getMonth() - 1);
            renderShiftCalendar();
        });
    }
    
    if(nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            shiftCurrentDate.setMonth(shiftCurrentDate.getMonth() + 1);
            renderShiftCalendar();
        });
    }
    
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeShiftModal);
    
    if(shiftModal) {
        shiftModal.addEventListener('click', (e) => {
            if (e.target === shiftModal) {
                closeShiftModal();
            }
        });
    }
    
    document.querySelectorAll('.shift-btn').forEach(btn => {
        // remove old listeners to prevent duplicates if called multiple times
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            const shiftType = e.target.getAttribute('data-shift');
            setShiftEvent(shiftType);
        });
    });
    
    if(clearShiftBtn) {
        const newClearBtn = clearShiftBtn.cloneNode(true);
        clearShiftBtn.parentNode.replaceChild(newClearBtn, clearShiftBtn);
        newClearBtn.addEventListener('click', clearShiftEvent);
    }
}

// Bind to DOMContentLoaded or execute immediately 
document.addEventListener('DOMContentLoaded', () => {
    initShiftTracker();
});
// Execute in case it's loaded dynamically
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initShiftTracker();
}
