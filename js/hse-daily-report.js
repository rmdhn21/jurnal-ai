/**
 * JS/HSE-DAILY-REPORT.JS
 * Generator teks laporan Daily HSSE untuk dikirim ke WhatsApp.
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
 * Core Text Generation Logic
 */
function generateWAGReport() {
    // Get all values
    const data = {
        recipient: document.getElementById('wr-recipient').value,
        location: document.getElementById('wr-location').value,
        zona: document.getElementById('wr-zona').value,
        date: formatDate(document.getElementById('wr-date').value),
        pob: document.getElementById('wr-pob').value,
        visitor: document.getElementById('wr-visitor').value || '-',
        smh: document.getElementById('wr-smh').value,
        smc: document.getElementById('wr-smc').value,
        cum: document.getElementById('wr-cum').value,
        jsaCum: document.getElementById('wr-jsa-cum').value,
        rig: document.getElementById('wr-rig-name').value,
        weather: document.getElementById('wr-weather').value,
        ops: document.getElementById('wr-ops-desc').value,
        coord: document.getElementById('wr-coord').value,
        spv: document.getElementById('wr-spv').value,
        officers: document.getElementById('wr-officers').value,
        activityC: document.getElementById('wr-activity-c').value,
        bbmStart: document.getElementById('wr-bbm-start').value,
        bbmUsed: document.getElementById('wr-bbm-used').value,
        activityD: document.getElementById('wr-activity-d').value
    };

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
• 

Weather : ${data.weather} 

Laporan BBM fire pump ( 12 jam )
- Stock Awal  : ${data.bbmStart} liter
- Terima bbm : 0 liter
- Pemakaian  : ${data.bbmUsed} liter 
- Stock Akhir  : ${bbmEnd === '-' ? '-' : bbmEnd + ' liter'}

Activity : 
19.00 - 07.00 WITA :
-  

Plan
- 

Weather : 

D. Summary Activity HSSE:
${data.activityD}


E. Next HSSE Activity:
- 
F. Dokumentasi terlampir

${data.officers} 
HSSE Officer Rig`;

    document.getElementById('wr-final-output').value = reportText;
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
    const draft = {
        recipient: document.getElementById('wr-recipient').value,
        location: document.getElementById('wr-location').value,
        zona: document.getElementById('wr-zona').value,
        pob: document.getElementById('wr-pob').value,
        smh: document.getElementById('wr-smh').value,
        rig: document.getElementById('wr-rig-name').value,
        coord: document.getElementById('wr-coord').value,
        spv: document.getElementById('wr-spv').value,
        officers: document.getElementById('wr-officers').value
    };
    localStorage.setItem(HSE_REPORT_DRAFT_KEY, JSON.stringify(draft));
}

function loadReportDraft() {
    const saved = localStorage.getItem(HSE_REPORT_DRAFT_KEY);
    if (saved) {
        try {
            const draft = JSON.parse(saved);
            Object.keys(draft).forEach(key => {
                const el = document.getElementById(`wr-${key}`);
                if (el) el.value = draft[key];
            });
        } catch (e) {}
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
