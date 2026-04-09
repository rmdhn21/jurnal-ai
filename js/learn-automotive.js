// ============================================
// AUTOMOTIVE MASTERY - Mesin & Kendaraan
// Level 1 - 5 dengan AI Lessons & Quiz
// ============================================

const autoSyllabus = {
    L1: {
        title: "Dasar Mesin & Komponen Utama",
        color: "#f59e0b",
        modules: [
            { id: "au1_1", skill: "Engine", title: "Prinsip Kerja Motor Bakar", desc: "Siklus Otto (bensin) vs Diesel, 4 langkah: intake, compression, power, exhaust." },
            { id: "au1_2", skill: "Engine", title: "Komponen Mesin (Engine Parts)", desc: "Piston, connecting rod, crankshaft, camshaft, cylinder head, valve." },
            { id: "au1_3", skill: "Engine", title: "Sistem Pelumasan (Lubrication)", desc: "Jenis oli, pompa oli, oil filter, oil cooler, SAE grading." },
            { id: "au1_4", skill: "Engine", title: "Sistem Pendinginan (Cooling)", desc: "Radiator, thermostat, water pump, coolant, overheating troubleshoot." },
            { id: "au1_5", skill: "Bahan Bakar", title: "Sistem Bahan Bakar Bensin", desc: "Fuel tank, fuel pump, fuel filter, injector, throttle body." },
            { id: "au1_6", skill: "Bahan Bakar", title: "Sistem Bahan Bakar Diesel", desc: "Common rail, injection pump, glow plug, turbocharger, intercooler." },
            { id: "au1_7", skill: "Udara", title: "Sistem Intake & Exhaust", desc: "Air filter, manifold, catalytic converter, muffler, EGR valve." },
            { id: "au1_8", skill: "Udara", title: "Turbocharger & Supercharger", desc: "Prinsip kerja forced induction, wastegate, boost pressure." },
            { id: "au1_9", skill: "Praktik", title: "Tune-Up Dasar Mesin", desc: "Penggantian oli, filter udara, busi, pengecekan timing." },
            { id: "au1_10", skill: "Praktik", title: "Membaca Kode Error (DTC/OBD)", desc: "Scanner OBD-II, kode P0xxx, cara reset CEL." }
        ]
    },
    L2: {
        title: "Transmisi & Drivetrain",
        color: "#8b5cf6",
        modules: [
            { id: "au2_1", skill: "Kopling", title: "Sistem Kopling (Clutch)", desc: "Clutch disc, pressure plate, release bearing, cara kerja, bleeding." },
            { id: "au2_2", skill: "Transmisi", title: "Transmisi Manual", desc: "Gear ratio, synchronizer, shift fork, troubleshoot grinding." },
            { id: "au2_3", skill: "Transmisi", title: "Transmisi Otomatis (AT/CVT)", desc: "Torque converter, planetary gear, CVT belt/pulley, ATF fluid." },
            { id: "au2_4", skill: "Drivetrain", title: "Propeller Shaft & Differential", desc: "Universal joint, CV joint, final drive, LSD (Limited Slip Diff)." },
            { id: "au2_5", skill: "Drivetrain", title: "Sistem Penggerak (FWD/RWD/AWD/4WD)", desc: "Perbedaan layout, transfer case, center diff." },
            { id: "au2_6", skill: "Roda", title: "Roda & Ban", desc: "Ukuran ban (misal 265/70 R16), tekanan angin, rotasi, balancing." },
            { id: "au2_7", skill: "Roda", title: "Sistem Kemudi (Steering)", desc: "Rack & pinion, power steering (hidrolik vs electric), alignment." },
            { id: "au2_8", skill: "Praktik", title: "Perawatan Transmisi", desc: "Penggantian ATF, pengecekan level oli transmisi, filter." }
        ]
    },
    L3: {
        title: "Kelistrikan & Elektronik Kendaraan",
        color: "#3b82f6",
        modules: [
            { id: "au3_1", skill: "Dasar", title: "Dasar Kelistrikan Otomotif", desc: "Tegangan, arus, hambatan, hukum Ohm, rangkaian seri/paralel." },
            { id: "au3_2", skill: "Dasar", title: "Baterai (Aki)", desc: "Lead-acid vs AGM, CCA, cara charge, jump start, maintenance." },
            { id: "au3_3", skill: "Starting", title: "Sistem Starter", desc: "Motor starter, solenoid, bendix, troubleshoot mesin tidak mau hidup." },
            { id: "au3_4", skill: "Charging", title: "Sistem Pengisian (Charging)", desc: "Alternator, voltage regulator, drive belt, undercharge/overcharge." },
            { id: "au3_5", skill: "Ignition", title: "Sistem Pengapian (Ignition)", desc: "Busi, ignition coil, ECU, timing pengapian, misfire troubleshoot." },
            { id: "au3_6", skill: "Lampu", title: "Sistem Penerangan & Sinyal", desc: "Headlamp (halogen/LED/HID), relay, fuse box, wiring diagram." },
            { id: "au3_7", skill: "Sensor", title: "Sensor-Sensor Mesin", desc: "O2 sensor, MAF, MAP, TPS, CKP, CMP, knock sensor." },
            { id: "au3_8", skill: "Sensor", title: "ECU & Sistem Manajemen Mesin", desc: "Cara ECU mengontrol injeksi, timing, idle, fuel trim." },
            { id: "au3_9", skill: "Praktik", title: "Menggunakan Multimeter & Oscilloscope", desc: "Mengukur tegangan, arus, hambatan, sinyal sensor." }
        ]
    },
    L4: {
        title: "Sistem Rem, Suspensi & Keselamatan",
        color: "#ef4444",
        modules: [
            { id: "au4_1", skill: "Rem", title: "Sistem Rem Hidrolik", desc: "Master cylinder, caliper, disc/drum brake, brake fluid (DOT)." },
            { id: "au4_2", skill: "Rem", title: "ABS, EBD, BA & ESP", desc: "Anti-lock Braking, Electronic Stability, Traction Control." },
            { id: "au4_3", skill: "Rem", title: "Perawatan Rem", desc: "Penggantian kampas rem, bleeding, rotor resurfacing." },
            { id: "au4_4", skill: "Suspensi", title: "Sistem Suspensi", desc: "MacPherson strut, double wishbone, leaf spring, coil spring." },
            { id: "au4_5", skill: "Suspensi", title: "Shock Absorber & Bushing", desc: "Hydraulic vs gas shock, worn bushing symptoms, replacement." },
            { id: "au4_6", skill: "Safety", title: "Airbag & Seatbelt System", desc: "SRS, pretensioner, crash sensor, airbag deployment." },
            { id: "au4_7", skill: "Safety", title: "Sistem ADAS (Advanced Driver Assist)", desc: "Lane departure, blind spot, auto emergency braking, adaptive cruise." },
            { id: "au4_8", skill: "Praktik", title: "Wheel Alignment & Balancing", desc: "Camber, caster, toe, cara membaca alignment report." }
        ]
    },
    L5: {
        title: "Advanced: Diesel Engine & Heavy Equipment",
        color: "#059669",
        modules: [
            { id: "au5_1", skill: "Diesel", title: "Mesin Diesel Heavy Duty", desc: "Inline-6, V8, engine displacement, compression ratio, torque curve." },
            { id: "au5_2", skill: "Diesel", title: "Common Rail Diesel Injection (CRDi)", desc: "Rail pressure, piezo injector, pilot/main/post injection." },
            { id: "au5_3", skill: "Diesel", title: "Turbo VGT & Aftertreatment", desc: "Variable Geometry Turbo, DPF, SCR, DEF (AdBlue), EGR." },
            { id: "au5_4", skill: "Heavy Equipment", title: "Sistem Hidrolik Alat Berat", desc: "Pompa hidrolik, cylinder, valve, reservoir, filter, troubleshoot." },
            { id: "au5_5", skill: "Heavy Equipment", title: "Undercarriage & Track System", desc: "Track link, idler, sprocket, roller, track tension adjustment." },
            { id: "au5_6", skill: "Heavy Equipment", title: "Preventive Maintenance Schedule", desc: "PM 250/500/1000/2000 jam, checklist, oil sampling." },
            { id: "au5_7", skill: "Troubleshoot", title: "Diagnostic & Troubleshooting Lanjut", desc: "Flowchart diagnosis, pressure test, electrical schematic reading." },
            { id: "au5_8", skill: "Troubleshoot", title: "Engine Overhaul Procedure", desc: "Top overhaul vs major overhaul, clearance, torque specs, sealant." }
        ]
    }
};

let originalAutoHtml = '';
document.addEventListener('DOMContentLoaded', () => { const s = document.getElementById('automotive-screen'); if (s) originalAutoHtml = s.innerHTML; updateAutoProgressUI(); });

function getAutoProgress() { return JSON.parse(localStorage.getItem('auto_progress') || '{}'); }
function saveAutoProgress(p) { localStorage.setItem('auto_progress', JSON.stringify(p)); }

function updateAutoProgressUI() {
    const progress = getAutoProgress();
    Object.keys(autoSyllabus).forEach(level => {
        const total = autoSyllabus[level].modules.length;
        const completed = progress[level] ? progress[level].length : 0;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        const bar = document.getElementById(`auto-prog-${level}`);
        const txt = document.getElementById(`auto-pct-${level}`);
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.innerHTML = `${pct}%`;
    });
}

window.openAutoLevel = function(level) {
    const data = autoSyllabus[level]; if (!data) return;
    const progress = getAutoProgress(); const completed = progress[level] || [];
    const screen = document.getElementById('automotive-screen');
    const skillGroups = {}; data.modules.forEach(m => { if (!skillGroups[m.skill]) skillGroups[m.skill] = []; skillGroups[m.skill].push(m); });
    const icons = { Engine:'🔧', 'Bahan Bakar':'⛽', Udara:'💨', Praktik:'🛠️', Kopling:'⚙️', Transmisi:'🔄', Drivetrain:'🔗', Roda:'🛞', Dasar:'⚡', Starting:'🔑', Charging:'🔋', Ignition:'💥', Lampu:'💡', Sensor:'📡', Rem:'🛑', Suspensi:'🏎️', Safety:'🛡️', Diesel:'🚛', 'Heavy Equipment':'🏗️', Troubleshoot:'🔍' };

    let html = `<div class="header-back"><button class="back-btn" onclick="backToAutoDashboard()"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>Level ${level.replace('L','')}: ${data.title}</h2><p class="text-muted">${completed.length}/${data.modules.length} modul selesai</p>
    <div class="progress-bar-bg" style="margin-top:10px;"><div class="progress-bar-fill" style="width:${Math.round(completed.length/data.modules.length*100)}%;"></div></div></div>`;

    Object.keys(skillGroups).forEach(skill => {
        html += `<div class="card mt-md"><h3>${icons[skill]||'📚'} ${skill}</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">`;
        skillGroups[skill].forEach(mod => { const isDone = completed.includes(mod.id);
            html += `<div style="background:var(--surface-hover);padding:12px;border-radius:10px;border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;gap:12px;" onclick="openAutoLesson('${level}','${mod.id}')"><div style="font-size:1.3rem;min-width:30px;text-align:center;">${isDone?'✅':'📝'}</div><div style="flex:1;"><div style="font-weight:600;font-size:0.95rem;color:var(--text-color);${isDone?'text-decoration:line-through;opacity:0.7;':''}">${mod.title}</div><div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${mod.desc}</div></div><span style="font-size:0.8rem;color:var(--text-muted);">→</span></div>`;
        });
        html += `</div></div>`;
    });
    screen.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.backToAutoDashboard = function() { const s = document.getElementById('automotive-screen'); if (s && originalAutoHtml) { s.innerHTML = originalAutoHtml; updateAutoProgressUI(); } window.scrollTo({ top: 0, behavior: 'smooth' }); };

window.openAutoLesson = function(level, moduleId, forceRefresh = false) {
    const data = autoSyllabus[level];
    const mod = data.modules.find(m => m.id === moduleId);
    if (!mod) return;

    const prompt = `Kamu adalah Mekanik Senior (Master Technician) bersertifikat dengan pengalaman 25 tahun di bengkel resmi brand ternama dan industri alat berat. Buatkan materi pelajaran yang LENGKAP dan MENDALAM untuk topik berikut:

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

⚠️ ATURAN PENTING PENULISAN SIMBOL (WAJIB):
- JANGAN GUNAKAN LaTeX ($...$, \\(...\\), \\[...\\], \\text{...}).
- Gunakan tag HTML sederhana untuk simbol/satuan:
    - Pangkat: gunakan <sup> (contoh: cm<sup>2</sup>, m<sup>3</sup>).
    - Indeks: gunakan <sub> (contoh: H<sub>2</sub>O).
    - Perkalian: gunakan &times; (×).
    - Pembagian: gunakan &divide; (÷).

FORMAT MATERI WAJIB (dalam Bahasa Indonesia):

1. **📖 Penjelasan Konsep & Cara Kerja** (minimal 5 paragraf, jelaskan fundamental mekanis dan fisika di balik sistem ini dengan bahasa yang sangat mudah dipahami.)

2. **⚙️ Komponen Utama & Fungsinya** (daftar komponen krusial beserta penjelasan teknis fungsinya.)

3. **⚠️ Gejala Kerusakan (Diagnostics)** (berikan panduan mendiagnosis masalah: suara, getaran, atau kode DTC yang mungkin muncul.)

4. **🛠️ Panduan Perawatan & Rebuild** (minimal 5 langkah teknis untuk perawatan atau prosedur bongkar-pasang sesuai standar pabrik.)

5. **💡 Tips Mekanik Veteran** (3-5 "trade secrets" atau tips praktis untuk memecahkan soal atau memahami konsep ini lebih cepat.)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda (A, B, C, D) dengan format berikut UNTUK SETIAP SOAL:
[QUIZ]
Pertanyaan: (tulis pertanyaan teknis)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar, contoh: B)
Penjelasan: (jelaskan alasan teknis dan logika mekanis jawabannya)
[/QUIZ]

Pastikan materi sangat praktis, detail, dan setara manual servis profesional!`;

    const onComplete = () => {
        const progress = JSON.parse(localStorage.getItem('auto_progress') || '{}');
        if (!progress[level]) progress[level] = [];
        if (!progress[level].includes(moduleId)) {
            progress[level].push(moduleId);
            localStorage.setItem('auto_progress', JSON.stringify(progress));
            updateAutoProgressUI();
        }
        backToAutoDashboard();
    };

    showAiLessonScreen('automotive-screen', mod.title, prompt, onComplete, `auto_${moduleId}`, forceRefresh, () => openAutoLevel(level));
};

// ============== SHARED UTILITIES (used by all 3 systems) ==============

window.checkGenericAnswer = function(qId, selected, correct, btnEl, encodedExp) {
    const container = document.getElementById(qId);
    const resultDiv = document.getElementById(`${qId}_result`);
    const buttons = container.querySelectorAll('button');
    const explanation = decodeURIComponent(encodedExp);
    buttons.forEach(b => { b.disabled = true; b.style.opacity = '0.7'; });
    if (selected === correct) {
        btnEl.style.background = '#38a169'; btnEl.style.color = 'white'; btnEl.style.border = '2px solid #38a169';
        resultDiv.style.background = 'rgba(56,161,105,0.15)'; resultDiv.style.color = '#38a169';
        resultDiv.innerHTML = `✅ <strong>Benar!</strong> ${explanation}`;
    } else {
        btnEl.style.background = '#e53e3e'; btnEl.style.color = 'white'; btnEl.style.border = '2px solid #e53e3e';
        buttons.forEach(b => { if (b.textContent.trim().startsWith(correct + ')')) { b.style.background = '#38a169'; b.style.color = 'white'; b.style.border = '2px solid #38a169'; } });
        resultDiv.style.background = 'rgba(229,62,62,0.15)'; resultDiv.style.color = '#e53e3e';
        resultDiv.innerHTML = `❌ <strong>Salah.</strong> Jawaban: <strong>${correct}</strong>. ${explanation}`;
    }
    resultDiv.style.display = 'block';
};

window.completeGenericModule = function(system, level, moduleId) {
    const keyMap = { 
        physics: 'physics_progress', hsse: 'hsse_progress', auto: 'auto_progress',
        psychology: 'psy_progress', investment: 'inv_progress', coding: 'code_progress', pertamina: 'ptm_progress'
    };
    const key = keyMap[system];
    const progress = JSON.parse(localStorage.getItem(key) || '{}');
    if (!progress[level]) progress[level] = [];
    if (!progress[level].includes(moduleId)) progress[level].push(moduleId);
    localStorage.setItem(key, JSON.stringify(progress));
    
    // Refresh UI
    if (system === 'physics') openPhysicsLevel(level);
    else if (system === 'hsse') openHsseLevel(level);
    else if (system === 'auto') openAutoLevel(level);
    else if (system === 'psychology') openPsyLevel(level);
    else if (system === 'investment') openInvLevel(level);
    else if (system === 'coding') openCodeLevel(level);
    else if (system === 'pertamina') openPtmLevel(level);
}
