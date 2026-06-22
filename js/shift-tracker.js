// Shift Tracker JS for Jurnal AI
const shiftsData = {
    // Array of available shift types
    types: [
        'Cuti', 'Pagi h-25', 'Pagi L-350', 'Izin', 
        'Malam h-25', 'Malam L-350', 'Kantor', 'Dinas Siang', 'Dinas Malam', 'Dinas (Hari Off)', 'Off'
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
        'Dinas Siang': 'dinassiang',
        'Dinas Malam': 'dinasmalam',
        'Dinas (Hari Off)': 'dinasoff',
        'Off': 'off'
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
        'Dinas Siang': '#0ea5e9',
        'Dinas Malam': '#0284c7',
        'Dinas (Hari Off)': '#0369a1',
        'Off': '#64748b'
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
    if (typeof calculateAIForecast === 'function') calculateAIForecast();
}

// Format Date as YYYY-MM-DD
function formatShiftDateString(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Render the calendar for the curent month
function renderShiftCalendar() {
    const calendarGrids = document.querySelectorAll('#shift-calendarGrid');
    const currentMonthLabels = document.querySelectorAll('#shift-currentMonthLabel');
    if(calendarGrids.length === 0 || currentMonthLabels.length === 0) return;
    
    const year = shiftCurrentDate.getFullYear();
    const month = shiftCurrentDate.getMonth(); // 0-indexed
    
    // Set Header Label
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    currentMonthLabels.forEach(label => {
        label.textContent = `${monthNames[month]} ${year}`;
    });
    
    // First day of month (0 = Sunday, 1 = Monday ...)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Current date for highlighting "today"
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    
    // Track stats for the month
    const monthStats = {};
    shiftsData.types.forEach(type => monthStats[type] = 0);
    
    calendarGrids.forEach(calendarGrid => {
        calendarGrid.innerHTML = '';
        
        // Add empty cells for days before the 1st
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
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
            }
            
            // Add click event for the day
            dayCell.addEventListener('click', () => openShiftModal(dateString, day, monthNames[month], year));
            
            calendarGrid.appendChild(dayCell);
        }
    });
    
    // Calculate stats globally (independent of number of grids)
    for (let day = 1; day <= daysInMonth; day++) {
        const dateString = formatShiftDateString(year, month, day);
        const shiftType = shiftSavedShifts[dateString];
        if (shiftType && monthStats[shiftType] !== undefined) {
            monthStats[shiftType]++;
        }
    }
    
    renderShiftSummary(monthStats);
    calculateSalary(); // Panggil fungsi kalkulasi gaji setelah kalender di-render
}

// Salary Calculation Feature
function calculateSalary() {
    const breakdownEls = document.querySelectorAll('#salary-breakdown');
    const netTotalEls = document.querySelectorAll('#salary-net-total');
    const periodLabelEls = document.querySelectorAll('#salary-period-label');
    const paydayLabelEls = document.querySelectorAll('#salary-payday-label');
    
    if (breakdownEls.length === 0 || netTotalEls.length === 0) return;
    
    // Perhitungan dilakukan berdasarkan bulan kalender yang sedang DIBUKA (shiftCurrentDate),
    // atau bisa juga selalu bulan INI. Karena gaji dibayarkan sesuai bulan saat ini berjalan,
    // kita gunakan tanggal berjalan (real-time) sebagai acuan periode berjalan
    const today = new Date();
    
    // Determine Cut-Off Period
    // If today is <= 20, period is 21st of prev month to 20th of current month
    // If today is > 20, period is 21st of current month to 20th of next month
    let periodStart, periodEnd, payday;
    if (today.getDate() <= 20) {
        periodEnd = new Date(today.getFullYear(), today.getMonth(), 20);
        periodStart = new Date(today.getFullYear(), today.getMonth() - 1, 21);
        payday = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    } else {
        periodEnd = new Date(today.getFullYear(), today.getMonth() + 1, 20);
        periodStart = new Date(today.getFullYear(), today.getMonth(), 21);
        payday = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    }
    
    const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' });
    const monthFormatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
    
    periodLabelEls.forEach(el => {
        el.textContent = `Cut-off: ${formatter.format(periodStart)} - ${formatter.format(periodEnd)}`;
    });
    paydayLabelEls.forEach(el => {
        el.textContent = `Gajian: 1 ${monthFormatter.format(payday)}`;
    });
    
    let workDaysCount = 0;
    let fieldDaysCount = 0;
    
    // Iterate from periodStart to periodEnd
    let current = new Date(periodStart);
    while (current <= periodEnd) {
        const dateString = formatShiftDateString(current.getFullYear(), current.getMonth(), current.getDate());
        const shiftType = shiftSavedShifts[dateString];
        
        if (shiftType) {
            if (['Pagi h-25', 'Pagi L-350', 'Malam h-25', 'Malam L-350', 'Kantor'].includes(shiftType)) {
                workDaysCount++;
            } else if (['Dinas Siang', 'Dinas Malam'].includes(shiftType)) {
                workDaysCount++; // Dapat upah harian
                fieldDaysCount++; // Dapat 1x dinas
            } else if (shiftType === 'Dinas (Hari Off)') {
                workDaysCount++; // Dapat upah harian
                fieldDaysCount += 2; // Dapat 2x dinas karena hari off
            }
        }
        current.setDate(current.getDate() + 1);
    }
    
    // Constants
    const baseSalary = 3660000;
    const workDayRate = 140000;
    const fieldDayRate = 260000;
    const bpjsDeduction = 149758;
    
    // Calculates
    const workDayTotal = workDaysCount * workDayRate;
    const fieldDayTotal = fieldDaysCount * fieldDayRate;
    const grossSalary = baseSalary + workDayTotal + fieldDayTotal;
    
    // Get PTKP Category
    const ptkpSelect = document.querySelector('#salary-ptkp-select');
    const ptkpCategory = ptkpSelect ? ptkpSelect.value : 'A';
    
    // PPh 21 Calculation (TER PMK 168/2023)
    let pph21Rate = 0;
    const g = grossSalary;
    
    if (ptkpCategory === 'A') {
        if (g <= 5400000) pph21Rate = 0;
        else if (g <= 5650000) pph21Rate = 0.0025;
        else if (g <= 5950000) pph21Rate = 0.005;
        else if (g <= 6300000) pph21Rate = 0.0075;
        else if (g <= 6700000) pph21Rate = 0.01;
        else if (g <= 7180000) pph21Rate = 0.0125;
        else if (g <= 7390000) pph21Rate = 0.015;
        else if (g <= 7920000) pph21Rate = 0.0175;
        else if (g <= 8320000) pph21Rate = 0.02;
        else if (g <= 8700000) pph21Rate = 0.0225;
        else if (g <= 9140000) pph21Rate = 0.025;
        else if (g <= 9680000) pph21Rate = 0.03;
        else if (g <= 10420000) pph21Rate = 0.04;
        else if (g <= 10900000) pph21Rate = 0.05;
        else if (g <= 11250000) pph21Rate = 0.06;
        else if (g <= 12050000) pph21Rate = 0.07;
        else if (g <= 12950000) pph21Rate = 0.08;
        else if (g <= 14150000) pph21Rate = 0.09;
        else if (g <= 15550000) pph21Rate = 0.10;
        else pph21Rate = 0.11;
    } else if (ptkpCategory === 'B') {
        if (g <= 6200000) pph21Rate = 0;
        else if (g <= 6500000) pph21Rate = 0.0025;
        else if (g <= 6850000) pph21Rate = 0.005;
        else if (g <= 7300000) pph21Rate = 0.0075;
        else if (g <= 9200000) pph21Rate = 0.01;
        else if (g <= 10750000) pph21Rate = 0.015;
        else if (g <= 11250000) pph21Rate = 0.02;
        else if (g <= 11600000) pph21Rate = 0.025;
        else if (g <= 12600000) pph21Rate = 0.03;
        else if (g <= 13600000) pph21Rate = 0.04;
        else if (g <= 14050000) pph21Rate = 0.05;
        else if (g <= 15350000) pph21Rate = 0.06;
        else pph21Rate = 0.07;
    } else if (ptkpCategory === 'C') {
        if (g <= 6600000) pph21Rate = 0;
        else if (g <= 6950000) pph21Rate = 0.0025;
        else if (g <= 7350000) pph21Rate = 0.005;
        else if (g <= 7800000) pph21Rate = 0.0075;
        else if (g <= 8850000) pph21Rate = 0.01;
        else if (g <= 9800000) pph21Rate = 0.0125;
        else if (g <= 10950000) pph21Rate = 0.015;
        else if (g <= 11200000) pph21Rate = 0.0175;
        else if (g <= 12050000) pph21Rate = 0.02;
        else if (g <= 12950000) pph21Rate = 0.03;
        else if (g <= 14150000) pph21Rate = 0.04;
        else if (g <= 15550000) pph21Rate = 0.05;
        else pph21Rate = 0.06;
    }
    
    const pph21 = grossSalary * pph21Rate;
    
    const netSalary = grossSalary - bpjsDeduction - pph21;
    
    const formatRp = (num) => 'Rp ' + Math.round(num).toLocaleString('id-ID');
    
    const breakdownHtml = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Gaji Pokok</span>
            <span>${formatRp(baseSalary)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>H. Kerja (${workDaysCount}x)</span>
            <span style="color: #10b981;">+${formatRp(workDayTotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Dinas (${fieldDaysCount}x)</span>
            <span style="color: #10b981;">+${formatRp(fieldDayTotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.1);">
            <span>BPJS (Tetap)</span>
            <span style="color: #ef4444;">-${formatRp(bpjsDeduction)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Est. PPh 21</span>
            <span style="color: #ef4444;">-${formatRp(pph21)}</span>
        </div>
    `;
    
    breakdownEls.forEach(el => el.innerHTML = breakdownHtml);
    netTotalEls.forEach(el => el.textContent = formatRp(netSalary));
}

// Render the summary cards at the bottom
function renderShiftSummary(stats) {
    const summaryGrids = document.querySelectorAll('#shift-summaryGrid, #shift-summaryContainer');
    if(summaryGrids.length === 0) return;
    
    summaryGrids.forEach(summaryGrid => {
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
    });
}

// Open Shift Selection Modal
function openShiftModal(dateString, day, monthName, year) {
    const shiftModals = document.querySelectorAll('#shift-Modal');
    const modalDateLabels = document.querySelectorAll('#shift-modalDateLabel');
    if(shiftModals.length === 0) return;
    
    shiftSelectedDateString = dateString;
    modalDateLabels.forEach(label => {
        label.textContent = `${day} ${monthName} ${year}`;
    });
    
    shiftModals.forEach(modal => {
        modal.classList.add('active');
        modal.classList.remove('hidden');
    });
}

// Close Modal
function closeShiftModal() {
    const shiftModals = document.querySelectorAll('#shift-Modal');
    if(shiftModals.length === 0) return;
    
    shiftModals.forEach(modal => {
        modal.classList.remove('active');
        modal.classList.add('hidden');
    });
    shiftSelectedDateString = null;
}

// Set shift for the selected date
function setShiftEvent(shiftType) {
    if (shiftSelectedDateString) {
        shiftSavedShifts[shiftSelectedDateString] = shiftType;
        saveShiftData();
        renderShiftCalendar();
        closeShiftModal();
        if (typeof updateDashboardReminders === 'function') updateDashboardReminders();
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
    if (typeof updateDashboardReminders === 'function') updateDashboardReminders();
}

// Event Listeners Setup
function setupShiftEventListeners() {
    const prevMonthBtns = document.querySelectorAll('#shift-prevMonth');
    const nextMonthBtns = document.querySelectorAll('#shift-nextMonth');
    const closeModalBtns = document.querySelectorAll('#shift-closeModal');
    const shiftModals = document.querySelectorAll('#shift-Modal');
    const clearShiftBtns = document.querySelectorAll('#shift-clearShiftBtn');
    
    prevMonthBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', () => {
            shiftCurrentDate.setMonth(shiftCurrentDate.getMonth() - 1);
            renderShiftCalendar();
        });
    });
    
    nextMonthBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', () => {
            shiftCurrentDate.setMonth(shiftCurrentDate.getMonth() + 1);
            renderShiftCalendar();
        });
    });
    
    closeModalBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', closeShiftModal);
    });
    
    shiftModals.forEach(modal => {
        if (!modal.dataset.listenerAdded) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeShiftModal();
                }
            });
            modal.dataset.listenerAdded = "true";
        }
    });
    
    document.querySelectorAll('.shift-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            const shiftType = e.target.getAttribute('data-shift');
            setShiftEvent(shiftType);
        });
    });
    
    clearShiftBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', clearShiftEvent);
    });
    
    const ptkpSelects = document.querySelectorAll('#salary-ptkp-select');
    ptkpSelects.forEach(select => {
        if (!select.dataset.listenerAdded) {
            select.addEventListener('change', (e) => {
                // Synchronize dropdown values across duplicate selectors
                ptkpSelects.forEach(s => { s.value = e.target.value; });
                calculateSalary();
            });
            select.dataset.listenerAdded = "true";
        }
    });
}

// Bind to DOMContentLoaded or execute immediately 
document.addEventListener('DOMContentLoaded', () => {
    initShiftTracker();
});
// Execute in case it's loaded dynamically
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initShiftTracker();
}
