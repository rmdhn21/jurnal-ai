// ===== BPS Roster (Jadwal 13 Jam) =====

const BPS_STORAGE_KEY = 'jurnal_ai_bps_roster_v1';

document.addEventListener('DOMContentLoaded', () => {
    initBpsRoster();
});

function initBpsRoster() {
    loadBpsCheckboxes();
    
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
    const state = {};
    checkboxes.forEach(cb => {
        if (cb.id) {
            state[cb.id] = cb.checked;
        }
    });
    localStorage.setItem(BPS_STORAGE_KEY, JSON.stringify(state));
}

function loadBpsCheckboxes() {
    try {
        const saved = localStorage.getItem(BPS_STORAGE_KEY);
        if (saved) {
            const state = JSON.parse(saved);
            Object.keys(state).forEach(id => {
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
