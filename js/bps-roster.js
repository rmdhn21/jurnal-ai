// ===== BPS Roster (Jadwal 13 Jam) =====

const BPS_STORAGE_KEY = 'jurnal_ai_bps_roster_v1';

document.addEventListener('DOMContentLoaded', () => {
    initBpsRoster();
});

function initBpsRoster() {
    loadBpsCheckboxes();
    
    // Auto-select BPS tab based on today's shift from Shift Tracker
    try {
        const saved = localStorage.getItem('work_shift_data');
        if (saved) {
            const shiftSavedShifts = JSON.parse(saved);
            const today = new Date();
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const todayShift = shiftSavedShifts[todayStr];
            
            if (todayShift) {
                if (todayShift.includes('Pagi') || todayShift === 'Kantor' || todayShift === 'Dinas Siang' || todayShift === 'Dinas') {
                    bpsSwitchTab('shiftPagi');
                } else if (todayShift.includes('Malam') || todayShift === 'Dinas Malam') {
                    bpsSwitchTab('shiftMalam');
                } else if (todayShift === 'Off' || todayShift === 'Cuti' || todayShift === 'Izin') {
                    bpsSwitchTab('hariOff');
                }
            }
        }
    } catch (e) {
        console.error("Gagal mengintegrasikan shift dengan BPS Roster", e);
    }
    
    // Listeners for auto-save and toast logic
    document.querySelectorAll('.bps-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            saveBpsCheckboxes();
            
            // Visual feedback when all daily focus tasks are done in the current tab
            if (cb.classList.contains('red-check')) {
                const parentTab = cb.closest('.bps-tab-content');
                if (parentTab) {
                    const focusChecks = parentTab.querySelectorAll('.red-check');
                    let allChecked = true;
                    
                    focusChecks.forEach(c => {
                        if(!c.checked) allChecked = false;
                    });
                    
                    if(allChecked && cb.checked) {
                        showBpsToast("Mantap! Target belajar hari ini selesai 🔥");
                    }
                }
            }
        });
    });
}

function bpsSwitchTab(tabId) {
    document.querySelectorAll('.bps-tab-content').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('.bps-tab-btn').forEach(el => {
        el.classList.remove('bps-tab-active');
        el.style.background = 'transparent';
        el.style.color = 'rgba(255,255,255,0.8)';
        el.style.boxShadow = 'none';
    });

    const activeContent = document.getElementById('bps-content-' + tabId);
    if(activeContent) activeContent.style.display = 'block';
    
    const activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) {
        activeBtn.classList.add('bps-tab-active');
        activeBtn.style.background = 'white';
        activeBtn.style.color = '#0054A6';
        activeBtn.style.boxShadow = '0 1px 2px 0 rgba(0,0,0,0.05)';
    }
}

function bpsResetCheckboxes() {
    const checkboxes = document.querySelectorAll('.bps-checkbox');
    let isAnyChecked = false;
    
    checkboxes.forEach(cb => {
        if(cb.checked) isAnyChecked = true;
        cb.checked = false;
    });
    
    saveBpsCheckboxes(); // Save the reset state
    
    if(isAnyChecked) {
        showBpsToast("Jadwal direset untuk hari esok!");
    } else {
        showBpsToast("Semua jadwal masih kosong.");
    }
}

function showBpsToast(message) {
    const toast = document.getElementById('bps-toast');
    const toastMessage = document.getElementById('bps-toastMessage');
    
    if(!toast || !toastMessage) return;
    
    toastMessage.innerText = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, -10px)';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 0)';
    }, 2500);
}

// LocalStorage Persistence
function saveBpsCheckboxes() {
    const checkboxes = document.querySelectorAll('.bps-checkbox');
    const state = { date: new Date().toISOString().split('T')[0] };
    checkboxes.forEach(cb => {
        if (cb.id) {
            state[cb.id] = cb.checked;
        }
    });
    localStorage.setItem(BPS_STORAGE_KEY, JSON.stringify(state));
    if (typeof refreshWidget === 'function') refreshWidget('bps-roster');
}

function loadBpsCheckboxes() {
    try {
        const saved = localStorage.getItem(BPS_STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);
            const today = new Date().toISOString().split('T')[0];
            
            // Auto-reset if it's a new day
            if (state.date && state.date !== today) {
                localStorage.removeItem(BPS_STORAGE_KEY);
                return;
            }
            
            Object.keys(state).forEach(id => {
                if (id === 'date') return;
                const cb = document.getElementById(id);
                if (cb) {
                    cb.checked = state[id];
                }
            });
        }
    } catch(e) {
        console.error("Gagal memuat status BPS Roster", e);
    }
}
