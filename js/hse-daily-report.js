/**
 * JS/HSE-DAILY-REPORT.JS
 * Generator teks laporan Daily HSSE untuk dikirim ke WhatsApp.
 * Enhanced with smart defaults from HSSE Sangatta chat patterns.
 */

// Storage constant
const HSE_REPORT_DRAFT_KEY = 'hse-daily-report-draft';

const defaultOfficerNames = "Ferdi A, M Rafi";
const defaultCoordName = "Denny Wicaksana";

function initHSEDailyReport() {
    // Set default date to today
    const dateInput = document.getElementById('wr-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Load draft if exists
    loadReportDraft();

    // Attach listeners
    const copyBtn = document.getElementById('wr-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyWAGReport);
    }

    // Watch for changes to save draft automatically
    const inputs = document.querySelectorAll('#hse-wag-generator-screen .input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
             saveReportDraft();
             generateWAGReport(); // Live preview
        });
    });

    // Watch checklist changes
    const checkboxes = document.querySelectorAll('.wr-hsse-chk');
    checkboxes.forEach(chk => {
        chk.addEventListener('change', () => {
            saveReportDraft();
            generateWAGReport();
        });
    });

    // Custom weather/ops input listeners
    const weatherCustom = document.getElementById('wr-weather-custom');
    if (weatherCustom) {
        weatherCustom.addEventListener('input', () => {
            saveReportDraft();
            generateWAGReport();
        });
    }
    const opsCustom = document.getElementById('wr-ops-custom');
    if (opsCustom) {
        opsCustom.addEventListener('input', () => {
            saveReportDraft();
            generateWAGReport();
        });
    }

    // Initial generate
    generateWAGReport();
}

/**
 * Tab switching logic
 */
function switchWAGSection(sectionId) {
    // Update tabs UI
    const tabs = document.querySelectorAll('#wag-report-tabs .tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.innerText.toLowerCase().includes(sectionId) || 
            (sectionId === 'general' && tab.innerText === 'Umum')) {
            tab.classList.add('active');
        }
    });

    // Update sections visibility
    const sections = document.querySelectorAll('.wag-section');
    sections.forEach(sec => {
        sec.classList.add('hidden');
    });
    document.getElementById(`wag-sec-${sectionId}`).classList.remove('hidden');
}

/**
 * Quick insert activity item into Section C textarea
 */
function insertActivity(text) {
    const textarea = document.getElementById('wr-activity-c');
    if (!textarea) return;

    const current = textarea.value.trim();
    if (current) {
        textarea.value = current + '\n' + text;
    } else {
        textarea.value = text;
    }

    // Focus and scroll to end
    textarea.focus();
    textarea.scrollTop = textarea.scrollHeight;

    saveReportDraft();
    generateWAGReport();
}

/**
 * Clear Section C textarea
 */
function clearActivityC() {
    const textarea = document.getElementById('wr-activity-c');
    if (textarea) {
        textarea.value = '';
        saveReportDraft();
        generateWAGReport();
    }
}

/**
 * Add custom HSSE checklist item
 */
function addCustomHSSEItem() {
    const input = document.getElementById('wr-hsse-custom-item');
    if (!input || !input.value.trim()) return;

    const checklist = document.getElementById('wr-hsse-checklist');
    const label = document.createElement('label');
    label.className = 'wag-check-item';
    label.style.cssText = 'display: flex; align-items: flex-start; gap: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; cursor: pointer; font-size: 0.8rem;';
    label.innerHTML = `
        <input type="checkbox" class="wr-hsse-chk" value="${input.value.trim()}" checked style="margin-top: 2px; accent-color: var(--primary);">
        <span>${input.value.trim()}</span>
    `;

    checklist.appendChild(label);

    // Add event listener
    label.querySelector('input').addEventListener('change', () => {
        saveReportDraft();
        generateWAGReport();
    });

    input.value = '';
    saveReportDraft();
    generateWAGReport();
}

/**
 * Get weather value (handles custom input)
 */
function getWeatherValue() {
    const select = document.getElementById('wr-weather');
    if (select && select.value === 'custom') {
        const custom = document.getElementById('wr-weather-custom');
        return custom ? custom.value || 'Cerah' : 'Cerah';
    }
    return select ? select.value : 'Cerah';
}

/**
 * Get operation value (handles custom input)
 */
function getOpsValue() {
    const select = document.getElementById('wr-ops-desc');
    if (select && select.value === 'custom') {
        const custom = document.getElementById('wr-ops-custom');
        return custom ? custom.value || 'Well Service' : 'Well Service';
    }
    return select ? select.value : 'Well Service';
}

/**
 * Build Section D text from checklist
 */
function buildSectionDText() {
    const rig = document.getElementById('wr-rig-name')?.value || 'H-25';
    const checkboxes = document.querySelectorAll('.wr-hsse-chk:checked');
    const items = [];

    checkboxes.forEach(chk => {
        let text = chk.value;
        // Replace {RIG} placeholder with actual rig name
        text = text.replace(/\{RIG\}/g, rig);
        items.push('- ' + text);
    });

    return items.join('\n');
}

/**
 * Core Text Generation Logic
 */
function generateWAGReport() {
    // Get all values
    const data = {
        recipient: document.getElementById('wr-recipient')?.value || '',
        location: document.getElementById('wr-location')?.value || '',
        zona: document.getElementById('wr-zona')?.value || '',
        date: formatDate(document.getElementById('wr-date')?.value),
        pob: document.getElementById('wr-pob')?.value || '',
        visitor: document.getElementById('wr-visitor')?.value || '-',
        smh: document.getElementById('wr-smh')?.value || '',
        smc: document.getElementById('wr-smc')?.value || '-',
        cum: document.getElementById('wr-cum')?.value || '-',
        jsaCum: document.getElementById('wr-jsa-cum')?.value || '',
        rig: document.getElementById('wr-rig-name')?.value || 'H-25',
        weather: getWeatherValue(),
        ops: getOpsValue(),
        coord: document.getElementById('wr-coord')?.value || defaultCoordName,
        spv: document.getElementById('wr-spv')?.value || '',
        officers: document.getElementById('wr-officers')?.value || defaultOfficerNames,
        activityC: document.getElementById('wr-activity-c')?.value || '',
        bbmStart: document.getElementById('wr-bbm-start')?.value || '-',
        bbmUsed: document.getElementById('wr-bbm-used')?.value || '0',
        planC: document.getElementById('wr-plan-c')?.value || '• ',
        activityNight: document.getElementById('wr-activity-night')?.value || '-',
        planNight: document.getElementById('wr-plan-night')?.value || '-',
    };

    // Build Section D from checklist
    const activityD = buildSectionDText();
    // Section E from its own textarea
    const nextHsse = document.getElementById('wr-next-hsse')?.value || '-';

    // Auto-calculate BBM End
    const bbmUsedVal = parseFloat(data.bbmUsed) || 0;
    const bbmStartVal = parseFloat(data.bbmStart) || 0;
    const bbmEnd = data.bbmStart === '-' ? '-' : (bbmStartVal - bbmUsedVal);

    // Build the template string
    const reportText = `Assalamualaikum Warahmatullahi Wabarakatuh,

Dengan Hormat, ${data.recipient} 
Berikut terlampir Daily HSSE Report Lokasi / Sumur: ${data.location} ${data.zona} , tanggal ${data.date} :

A. Safety Performance (Rig ${data.rig}) 
- POB  : ${data.pob} Person
- visitor : ${data.visitor} person
- SMH Rig ${data.rig} : ${data.smh} Hours
- SMC : ${data.smc} 
- Cum : ${data.cum}
- JSA/PTW :  Cum  : ${data.jsaCum}

B. Current operation: 
- Location/ Well   : ${data.location}
- Name Rig          : ${data.rig}
- Date                  : ${data.date}
- Weather           : ${data.weather}
- Operation         : ${data.ops}
- HSSE Coord     : ${data.coord}
- Rig Spv             : ${data.spv}
- HSSE Officer   : ${data.officers} 

C. Summary Activity 

07.00-19.00 WITA :
${data.activityC}

Plan : 
${data.planC}
 
Weather : ${data.weather} 
 
Laporan BBM fire pump ( 12 jam )
- Stock Awal  : ${data.bbmStart} liter
- Terima bbm : 0 liter
- Pemakaian  : ${data.bbmUsed} liter 
- Stock Akhir  : ${bbmEnd === '-' ? '-' : bbmEnd + ' liter'}
 
Activity : 
19.00 - 07.00 WITA :
${data.activityNight}
 
Plan
${data.planNight}

Weather : 

D. Summary Activity HSSE:
${activityD}


E. Next HSSE Activity:
${nextHsse}
F. Dokumentasi terlampir

${data.officers} 
HSSE Officer Rig`;

    const output = document.getElementById('wr-final-output');
    if (output) output.value = reportText;
}

/**
 * Copy to Clipboard
 */
function copyWAGReport() {
    const textarea = document.getElementById('wr-final-output');
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile

    try {
        navigator.clipboard.writeText(textarea.value);
        
        const btn = document.getElementById('wr-copy-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Berhasil Disalin!';
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
        }, 2000);
    } catch (err) {
        alert('Gagal menyalin teks. Silakan salin manual.');
    }
}

/**
 * Draft local storage
 */
function saveReportDraft() {
    const weatherSelect = document.getElementById('wr-weather');
    const opsSelect = document.getElementById('wr-ops-desc');

    const draft = {
        recipient: document.getElementById('wr-recipient')?.value || '',
        location: document.getElementById('wr-location')?.value || '',
        zona: document.getElementById('wr-zona')?.value || '',
        pob: document.getElementById('wr-pob')?.value || '',
        smh: document.getElementById('wr-smh')?.value || '',
        rig: document.getElementById('wr-rig-name')?.value || 'H-25',
        coord: document.getElementById('wr-coord')?.value || '',
        spv: document.getElementById('wr-spv')?.value || '',
        officers: document.getElementById('wr-officers')?.value || '',
        weather: weatherSelect?.value || 'Cerah',
        weatherCustom: document.getElementById('wr-weather-custom')?.value || '',
        ops: opsSelect?.value || 'Well Service',
        opsCustom: document.getElementById('wr-ops-custom')?.value || '',
        activityC: document.getElementById('wr-activity-c')?.value || '',
        'plan-c': document.getElementById('wr-plan-c')?.value || '',
        'activity-night': document.getElementById('wr-activity-night')?.value || '',
        'plan-night': document.getElementById('wr-plan-night')?.value || '',
        'next-hsse': document.getElementById('wr-next-hsse')?.value || '',
        // Save checklist states
        hsseChecks: Array.from(document.querySelectorAll('.wr-hsse-chk')).map(chk => ({
            value: chk.value,
            checked: chk.checked
        }))
    };
    localStorage.setItem(HSE_REPORT_DRAFT_KEY, JSON.stringify(draft));
}

function loadReportDraft() {
    const saved = localStorage.getItem(HSE_REPORT_DRAFT_KEY);
    if (saved) {
        try {
            const draft = JSON.parse(saved);
            
            // Restore simple fields
            const simpleFields = ['recipient', 'location', 'zona', 'pob', 'smh', 'coord', 'spv', 'officers'];
            simpleFields.forEach(key => {
                const el = document.getElementById(`wr-${key}`);
                if (el && draft[key] !== undefined) el.value = draft[key];
            });

            // Restore rig select
            const rigSelect = document.getElementById('wr-rig-name');
            if (rigSelect && draft.rig) rigSelect.value = draft.rig;

            // Restore weather
            const weatherSelect = document.getElementById('wr-weather');
            if (weatherSelect && draft.weather) {
                weatherSelect.value = draft.weather;
                if (draft.weather === 'custom') {
                    weatherSelect.style.display = 'none';
                    const customInput = document.getElementById('wr-weather-custom');
                    if (customInput) {
                        customInput.style.display = '';
                        customInput.value = draft.weatherCustom || '';
                    }
                }
            }

            // Restore operation
            const opsSelect = document.getElementById('wr-ops-desc');
            if (opsSelect && draft.ops) {
                opsSelect.value = draft.ops;
                if (draft.ops === 'custom') {
                    opsSelect.style.display = 'none';
                    const customInput = document.getElementById('wr-ops-custom');
                    if (customInput) {
                        customInput.style.display = '';
                        customInput.value = draft.opsCustom || '';
                    }
                }
            }

            // Restore activity C
            const actC = document.getElementById('wr-activity-c');
            if (actC && draft.activityC !== undefined) actC.value = draft.activityC;

            // Restore textareas
            ['plan-c', 'activity-night', 'plan-night', 'next-hsse'].forEach(key => {
                const el = document.getElementById(`wr-${key}`);
                if (el && draft[key] !== undefined) el.value = draft[key];
            });

            // Restore checklist
            if (draft.hsseChecks && Array.isArray(draft.hsseChecks)) {
                const existing = document.querySelectorAll('.wr-hsse-chk');
                const existingValues = new Set();
                existing.forEach(chk => existingValues.add(chk.value));

                // Update existing checkboxes
                existing.forEach(chk => {
                    const saved = draft.hsseChecks.find(s => s.value === chk.value);
                    if (saved !== undefined) {
                        chk.checked = saved.checked;
                    }
                });

                // Add custom items that were saved but don't exist in HTML
                draft.hsseChecks.forEach(item => {
                    if (!existingValues.has(item.value)) {
                        const checklist = document.getElementById('wr-hsse-checklist');
                        if (checklist) {
                            const label = document.createElement('label');
                            label.className = 'wag-check-item';
                            label.style.cssText = 'display: flex; align-items: flex-start; gap: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 8px; cursor: pointer; font-size: 0.8rem;';
                            label.innerHTML = `
                                <input type="checkbox" class="wr-hsse-chk" value="${item.value}" ${item.checked ? 'checked' : ''} style="margin-top: 2px; accent-color: var(--primary);">
                                <span>${item.value}</span>
                            `;
                            checklist.appendChild(label);
                            label.querySelector('input').addEventListener('change', () => {
                                saveReportDraft();
                                generateWAGReport();
                            });
                        }
                    }
                });
            }

        } catch (e) {
            console.error('Failed to load WAG draft:', e);
        }
    }
}

/**
 * Helper to format date into "11 April 2026"
 */
function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Copy Section D checklist text into Section E textarea
 */
function copyDtoE() {
    const dText = buildSectionDText();
    const eTextarea = document.getElementById('wr-next-hsse');
    if (eTextarea) {
        eTextarea.value = dText;
        saveReportDraft();
        generateWAGReport();
    }
}

// Expose functions to window
window.insertActivity = insertActivity;
window.clearActivityC = clearActivityC;
window.addCustomHSSEItem = addCustomHSSEItem;
window.switchWAGSection = switchWAGSection;
window.generateWAGReport = generateWAGReport;
window.copyWAGReport = copyWAGReport;
window.copyDtoE = copyDtoE;
window.initHSEDailyReport = initHSEDailyReport;
