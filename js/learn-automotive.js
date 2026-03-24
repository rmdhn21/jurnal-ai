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

window.openAutoLesson = async function(level, moduleId) {
    const data = autoSyllabus[level]; const mod = data.modules.find(m => m.id === moduleId); if (!mod) return;
    const screen = document.getElementById('automotive-screen');
    screen.innerHTML = `<div class="header-back"><button class="back-btn" onclick="openAutoLevel('${level}')"><span class="back-icon">←</span> Kembali</button></div>
    <div class="card mt-md" style="border-left:4px solid ${data.color};"><h2>${mod.title}</h2><p class="text-muted">${mod.skill} • Level ${level.replace('L','')}</p></div>
    <div class="card mt-md" id="auto-lesson-content"><div class="loading-spinner" style="margin:20px auto;"></div><p class="text-center text-muted">🔧 AI Mekanik sedang menyusun materi...</p></div>`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const apiKey = typeof getApiKey === 'function' ? getApiKey() : null;
    if (!apiKey) { document.getElementById('auto-lesson-content').innerHTML = '<p style="color:#e53e3e;">⚠️ API Key belum diatur.</p>'; return; }

    const prompt = `Kamu adalah mekanik senior bersertifikat dengan pengalaman 20 tahun di bengkel resmi dan alat berat (heavy equipment). Kamu juga memahami mesin diesel industri dan kendaraan operasional rig.

📌 TOPIK: ${mod.title}
📌 LEVEL: ${level.replace('L','Level ')} - ${data.title}
📌 DESKRIPSI: ${mod.desc}

Buatkan materi pelajaran LENGKAP dalam Bahasa Indonesia:

1. **📖 Penjelasan Konsep** (min 5 paragraf, jelaskan cara kerja komponen/sistem dengan bahasa sederhana)

2. **🔧 Komponen & Fungsinya** (daftar komponen utama beserta fungsi masing-masing)

3. **⚠️ Gejala Kerusakan & Troubleshooting** (tabel gejala → kemungkinan penyebab → solusi)

4. **🛠️ Langkah Perawatan / Perbaikan** (SOP perawatan berkala atau langkah perbaikan step-by-step)

5. **💡 Tips Mekanik Pro** (3-5 tips dari pengalaman mekanik veteran)

6. **📋 KUIS INTERAKTIF** — Buat TEPAT 5 soal pilihan ganda:
[QUIZ]
Pertanyaan: (pertanyaan)
A) pilihan a
B) pilihan b
C) pilihan c
D) pilihan d
Jawaban: (huruf benar)
Penjelasan: (penjelasan)
[/QUIZ]

Pastikan materinya sangat praktis dan bisa langsung diterapkan di bengkel!`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 8192 } })
        });
        if (!response.ok) throw new Error('API Error');
        const result = await response.json();
        let text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Gagal.';
        const quizBlocks = [];
        text = text.replace(/\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/g, (_, block) => { const q=block.match(/Pertanyaan:\s*(.*)/i),a=block.match(/^A\)\s*(.*)/mi),b=block.match(/^B\)\s*(.*)/mi),c=block.match(/^C\)\s*(.*)/mi),d=block.match(/^D\)\s*(.*)/mi),ans=block.match(/Jawaban:\s*([A-D])/i),exp=block.match(/Penjelasan:\s*([\s\S]*?)$/i); if(q&&ans) quizBlocks.push({q:q[1].trim(),a:a?.[1]?.trim()||'',b:b?.[1]?.trim()||'',c:c?.[1]?.trim()||'',d:d?.[1]?.trim()||'',answer:ans[1].trim().toUpperCase(),explanation:exp?.[1]?.trim()||''}); return ''; });
        text = text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/^### (.*$)/gim,'<h4 style="color:var(--primary);margin-top:15px;">$1</h4>').replace(/^## (.*$)/gim,'<h3 style="color:var(--primary);margin-top:20px;">$1</h3>').replace(/^# (.*$)/gim,'<h2 style="color:var(--primary);margin-top:20px;">$1</h2>').replace(/\n/g,'<br>');
        let quizHtml = '';
        if (quizBlocks.length) { quizHtml = `<div style="margin-top:25px;border-top:2px solid var(--primary);padding-top:15px;"><h3 style="color:var(--primary);">📋 Kuis (${quizBlocks.length} Soal)</h3>`; quizBlocks.forEach((q,i)=>{const qId=`aquiz_${moduleId}_${i}`; quizHtml+=`<div id="${qId}" style="background:var(--surface-hover);padding:15px;border-radius:10px;margin-bottom:15px;border:1px solid var(--border);"><p style="font-weight:600;margin-bottom:10px;">${i+1}. ${q.q}</p>${['a','b','c','d'].map(o=>`<button class="btn btn-secondary" style="display:block;width:100%;text-align:left;margin-bottom:6px;padding:10px;font-size:0.9rem;" onclick="checkGenericAnswer('${qId}','${o.toUpperCase()}','${q.answer}',this,'${encodeURIComponent(q.explanation)}')">${o.toUpperCase()}) ${q[o]}</button>`).join('')}<div id="${qId}_result" style="display:none;margin-top:10px;padding:10px;border-radius:8px;font-size:0.9rem;"></div></div>`;}); quizHtml+=`<button class="btn btn-primary" style="width:100%;margin-top:10px;border-radius:20px;padding:12px;" onclick="completeGenericModule('auto','${level}','${moduleId}')">✅ Tandai Modul Selesai</button></div>`; }
        else { quizHtml = `<button class="btn btn-primary" style="width:100%;margin-top:20px;border-radius:20px;padding:12px;" onclick="completeGenericModule('auto','${level}','${moduleId}')">✅ Tandai Modul Selesai</button>`; }
        document.getElementById('auto-lesson-content').innerHTML = `<div style="line-height:1.8;font-size:0.95rem;">${text}</div>${quizHtml}`;
    } catch(err) { document.getElementById('auto-lesson-content').innerHTML = `<p style="color:#e53e3e;">❌ Gagal memuat.</p><button class="btn btn-secondary mt-sm" onclick="openAutoLesson('${level}','${moduleId}')">🔄 Coba Lagi</button>`; }
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
    const keyMap = { physics: 'physics_progress', hsse: 'hsse_progress', auto: 'auto_progress' };
    const key = keyMap[system];
    const progress = JSON.parse(localStorage.getItem(key) || '{}');
    if (!progress[level]) progress[level] = [];
    if (!progress[level].includes(moduleId)) progress[level].push(moduleId);
    localStorage.setItem(key, JSON.stringify(progress));
    if (system === 'physics') openPhysicsLevel(level);
    else if (system === 'hsse') openHsseLevel(level);
    else if (system === 'auto') openAutoLevel(level);
};
