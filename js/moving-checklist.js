/**
 * MOVING CHECKLIST MODULE
 * Handles the interactive pre-moving (demobilization) checklist.
 */

const MOVING_CHECKLIST_DATA = {
    "Peralatan & Mesin": [
        { id: "m1", text: "Ablas fire pump." },
        { id: "m2", text: "Cabut aki dan bawa ke mobil." },
        { id: "m3", text: "Tutup tangki." },
        { id: "m4", text: "Gulung dan ikat selang." },
        { id: "m5", text: "Ikat kabel-kabel." }
    ],
    "Fasilitas Keselamatan (HSE)": [
        { id: "h1", text: "Cabut wind sock di area porta dan mud tank." },
        { id: "h2", text: "Angkat rambu peringatan." },
        { id: "h3", text: "Angkat tiang muster point." },
        { id: "h4", text: "Tutup rapat eyewash." },
        { id: "h5", text: "Ikat APAR (Alat Pemadam Api Ringan) & simpan beserta papannya." }
    ],
    "Logistik & Area Sumur": [
        { id: "l1", text: "Angkat papan sumur." },
        { id: "l2", text: "Angkat tiang parkir." },
        { id: "l3", text: "Masukkan barang-barang ke dalam boks." },
        { id: "l4", text: "Ikat lemari agar aman dan tidak bergeser." }
    ],
    "Administrasi & Prosedur": [
        { id: "a1", text: "JMP (Journey Management Plan): Rencana perjalanan armada disetujui." },
        { id: "a2", text: "SIKA (Surat Izin Kerja Aman): Pastikan izin kerja ditutup benar." }
    ]
};

function initMovingChecklist() {
    const container = document.getElementById('moving-checklist-categories');
    if (!container) return;

    // Load state
    const savedState = JSON.parse(localStorage.getItem('moving_checklist_state') || '{}');

    let html = '';
    
    for (const [category, items] of Object.entries(MOVING_CHECKLIST_DATA)) {
        html += `
            <div class="card mt-md" style="padding-bottom: 5px;">
                <h3 style="font-size: 1rem; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    ${getCategoryIcon(category)} ${category}
                </h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        items.forEach(item => {
            const isChecked = savedState[item.id] || false;
            html += `
                <label class="checklist-item" style="display: flex; align-items: flex-start; gap: 12px; padding: 10px; background: var(--surface-hover); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                    <input type="checkbox" id="chk-${item.id}" 
                           ${isChecked ? 'checked' : ''} 
                           style="width: 20px; height: 20px; margin-top: 2px; accent-color: var(--primary);"
                           onchange="toggleMovingItem('${item.id}', this.checked)">
                    <span style="font-size: 0.95rem; line-height: 1.4; color: var(--text-color);">${item.text}</span>
                </label>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    updateMovingProgress();
}

function getCategoryIcon(cat) {
    if (cat.includes('Peralatan')) return '🔧';
    if (cat.includes('HSE')) return '🦺';
    if (cat.includes('Logistik')) return '📦';
    if (cat.includes('Administrasi')) return '📋';
    return '📝';
}

function toggleMovingItem(id, isChecked) {
    const savedState = JSON.parse(localStorage.getItem('moving_checklist_state') || '{}');
    savedState[id] = isChecked;
    localStorage.setItem('moving_checklist_state', JSON.stringify(savedState));
    updateMovingProgress();
}

function updateMovingProgress() {
    const savedState = JSON.parse(localStorage.getItem('moving_checklist_state') || '{}');
    const totalItems = Object.values(MOVING_CHECKLIST_DATA).flat().length;
    const checkedItems = Object.values(savedState).filter(v => v === true).length;
    
    const percentage = Math.round((checkedItems / totalItems) * 100);
    
    const progressBar = document.getElementById('moving-progress-fill');
    const progressText = document.getElementById('moving-progress-text');
    
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressText) progressText.innerText = `${percentage}%`;
}

function resetMovingChecklist() {
    if (confirm('Apakah Anda yakin ingin mereset seluruh ceklis moving ini?')) {
        localStorage.removeItem('moving_checklist_state');
        initMovingChecklist();
    }
}

// Global scope access
window.initMovingChecklist = initMovingChecklist;
window.toggleMovingItem = toggleMovingItem;
window.resetMovingChecklist = resetMovingChecklist;
