// ===== JMP GENERATOR MODULE =====
// Handles AI-powered Hazard Register JMP generation

function navigateToJMPGenerator() {
    if (typeof navigateToSubscreen === 'function') {
        navigateToSubscreen('jmp-generator');
        
        // Set default date to today
        const dateInput = document.getElementById('jmp-date');
        if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

async function generateJMP() {
    const route = document.getElementById('jmp-route')?.value || '';
    const date = document.getElementById('jmp-date')?.value || '';
    const distTime = document.getElementById('jmp-dist-time')?.value || '';
    const genCond = document.getElementById('jmp-general-cond')?.value || '';
    
    // New Metadata
    const docNo = document.getElementById('jmp-doc-no')?.value || '';
    const revNo = document.getElementById('jmp-rev-no')?.value || '';
    const effDate = document.getElementById('jmp-eff-date')?.value || '';
    const pageNo = document.getElementById('jmp-page-no')?.value || '';
    
    // New Team Assessment
    const team = {
        wows: document.getElementById('jmp-team-wows')?.value || '-',
        hsse: document.getElementById('jmp-team-hsse')?.value || '-',
        ram: document.getElementById('jmp-team-ram')?.value || '-',
        scm: document.getElementById('jmp-team-scm')?.value || '-'
    };

    const input = document.getElementById('jmp-input');
    const findings = input?.value?.trim();
    
    const mode = document.querySelector('input[name="jmp-mode"]:checked')?.value || 'ai';
    
    const btn = document.getElementById('generate-jmp-btn');
    const loading = document.getElementById('jmp-loading');
    const resultArea = document.getElementById('jmp-result-area');
    const content = document.getElementById('jmp-content');

    if (!findings) {
        alert('Silakan masukkan detail temuan lokasi terlebih dahulu.');
        return;
    }

    if (mode === 'manual') {
        generateManualJMP(route, date, distTime, genCond, findings);
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API Key belum diatur! Silakan atur di menu Pengaturan.');
        return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Menganalisis Kondisi Jalan...';
    loading.classList.remove('hidden');
    resultArea.classList.add('hidden');

    // STRUCTURED PROMPT FOR 7-COLUMN OFFICIAL FORMAT
    const systemPrompt = `Anda adalah Asisten Ahli K3 (HSSE Rig Officer) yang sangat teliti.
TUGAS: Buat Laporan Hazard Register JMP dlm format TABEL MARKDOWN dengan PERSIS 7 KOLOM (NO, LOKASI, DOKUMENTASI / FOTO, IDENTIFIKASI BAHAYA (HAZARD), RISK LEVEL, PENGENDALIAN RESIKO (MITIGASI), PIC).

WAJIB GUNAKAN 10 KATEGORI ENERGI BAHAYA INI (JANGAN GUNAKAN KATEGORI LAIN):
1. Gravitasi (Gravity): Bahaya akibat gaya tarik bumi/perbedaan elevasi (benda jatuh, orang tersandung, jalan berlubang, unit kendaraan amblas).
2. Gerak (Motion): Bahaya dari perpindahan fisik alat/kendaraan (pergerakan LV/alat berat di area operasi, unit bermanuver).
3. Mekanikal (Mechanical): Bahaya dari titik interaksi mesin/peralatan (pinch point/titik jepit, peralatan berputar).
4. Listrik (Electrical): Bahaya dari arus atau tegangan listrik (kabel panel terkelupas, korsleting genset).
5. Tekanan (Pressure): Bahaya pelepasan energi tekanan tiba-tiba (ledakan ban unit, kebocoran hose hidrolik, tekanan pipa).
6. Suhu (Temperature): Bahaya paparan panas/dingin ekstrem (permukaan pipa panas, percikan api las, heat stress/cuaca terik).
7. Kimia (Chemical): Bahaya dari material B3 (paparan gas H2S, tumpahan fluida/solar, uap beracun).
8. Biologi (Biological): Bahaya dari makhluk hidup (gigitan ular/serangga, bakteri/virus).
9. Radiasi (Radiation): Bahaya paparan energi radiasi (pekerjaan NDT/Radiografi, sinar UV pengelasan).
10. Suara (Noise): Bahaya kebisingan di atas ambang batas (suara mesin rig, genset, atau kompresor).

ATURAN KONTEN:
1. LOKASI: MASUKKAN SELURUH TEKS TEMUAN DARI USER SECARA UTUH, EKSAK, DAN VERBATIM (KATA PER KATA). JANGAN DIKURANGI ATAU DIUBAH.
2. IDENTIFIKASI BAHAYA (HAZARD): Berpikir sebagai Ahli HSE Senior. ANALISIS SETIAP TEMUAN DARI BERBAGAI SUDUT PANDANG ENERGI. Satu temuan bisa memiliki LEBIH DARI SATU kategori energi. 
   - Contoh: "Cellar terisi cairan" memiliki bahaya Kimia (kontaminasi) DAN Gravitasi (pekerja terperosok/terjatuh ke lubang). 
   - Tuliskan semua kategori yang relevan dengan format: "- [Nama Energi]: [Detail Bahaya]".
3. PENGENDALIAN RESIKO (MITIGASI): Buat mitigasi yang komprehensif untuk SETIAP bahaya yang diidentifikasi. Format per poin dengan "-" dan kategorikan: (Rekayasa, Administratif, Praktek Kerja Aman).
4. PIC: Wajib pilih dari: [HSSE, RAM, WOWS, PO, SCM].
5. DOKUMENTASI / FOTO: Isi "[Klik untuk Upload Foto]".
6. RISK LEVEL: [Rendah, Sedang, Tinggi].
7. LARANGAN: JANGAN MENAMBAHKAN KOLOM LAIN SEPERTI "STATUS". JANGAN GUNAKAN KATEGORI BAHAYA SELAIN 10 DI ATAS.
8. HANYA KELUARKAN TABEL SAJA.`;

    const userPrompt = `Rute: ${route}\nTanggal: ${date}\nJarak: ${distTime}\nKondisi: ${genCond}\nTemuan Lapangan:\n${findings}`;

    const performAiCall = async () => {
        const apiUrl = window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent';
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
            })
        });

        if (!response.ok) {
            if (response.status === 429) throw new Error('Batas kuota tercapai. Tunggu sejenak.');
            throw new Error(`Server Sibuk (${response.status})`);
        }

        return await response.json();
    };

    try {
        let data;
        try {
            data = await performAiCall();
        } catch (err) {
            console.warn('Retrying AI call due to:', err.message);
            await new Promise(r => setTimeout(r, 2000));
            data = await performAiCall();
        }

        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('Respon AI kosong');

        // Render the official view instead of just raw Markdown
        renderOfficialJMPPreview(text);
        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error('JMP Error:', error);
        alert('Gagal generate: ' + error.message + '. Gunakan "Mode Manual" jika API sedang sibuk.');
    } finally {
        loading.classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '⚡ Generate Professional JMP Report';
        attachPhotoUploaders();
    }
}

function renderOfficialJMPPreview(tableMarkdown) {
    const content = document.getElementById('jmp-content');
    
    const docNo = document.getElementById('jmp-doc-no')?.value || '-';
    const revNo = document.getElementById('jmp-rev-no')?.value || '-';
    const effDate = document.getElementById('jmp-eff-date')?.value || '-';
    const pageNo = document.getElementById('jmp-page-no')?.value || '-';
    
    const route = document.getElementById('jmp-route')?.value || '-';
    const date = document.getElementById('jmp-date')?.value || '-';
    const distTime = document.getElementById('jmp-dist-time')?.value || '-';
    const genCond = document.getElementById('jmp-general-cond')?.value || '-';
    
    const team = {
        wows: document.getElementById('jmp-team-wows')?.value || '-',
        hsse: document.getElementById('jmp-team-hsse')?.value || '-',
        ram: document.getElementById('jmp-team-ram')?.value || '-',
        scm: document.getElementById('jmp-team-scm')?.value || '-'
    };

    const tableHtml = window.formatAIText ? window.formatAIText(tableMarkdown) : tableMarkdown;

    content.innerHTML = `
        <div class="jmp-official-preview" style="background: white; color: #333; padding: 25px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border: 1px solid #ddd;">
            <!-- Header Group -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 2px solid #333;">
                <tr>
                    <td rowspan="2" style="width: 15%; border: 1px solid #333; text-align: center; padding: 10px;">
                        <div style="font-weight: bold; font-size: 1.2rem; color: #e11d48;">PERTAMINA</div>
                    </td>
                    <td rowspan="2" style="width: 45%; border: 1px solid #333; text-align: center; padding: 10px;">
                        <div style="font-weight: bold; font-size: 1.1rem;">JOURNEY MANAGEMENT PLAN & ROAD RISK ASSESSMENT</div>
                        <div style="font-size: 0.8rem; margin-top: 5px;">(HAZARD REGISTER JMP)</div>
                    </td>
                    <td style="width: 20%; border: 1px solid #333; padding: 5px; font-size: 0.7rem; font-weight: bold; background: #f3f4f6;">No. Dokumen / No. Revisi</td>
                    <td style="width: 20%; border: 1px solid #333; padding: 5px; font-size: 0.7rem;">${docNo} / ${revNo}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #333; padding: 5px; font-size: 0.7rem; font-weight: bold; background: #f3f4f6;">Tgl Efektif / Hal</td>
                    <td style="border: 1px solid #333; padding: 5px; font-size: 0.7rem;">${effDate} / ${pageNo}</td>
                </tr>
                <tr>
                    <td colspan="2" style="border: 1px solid #333; padding: 8px; font-size: 0.85rem; background: #fdf2f2;">
                        <b>🚩 Rute:</b> ${route}
                    </td>
                    <td style="border: 1px solid #333; padding: 8px; font-size: 0.75rem;">
                        <b>📅 Tanggal:</b> ${date}
                    </td>
                    <td style="border: 1px solid #333; padding: 8px; font-size: 0.75rem;">
                        <b>📏 Jarak:</b> ${distTime}
                    </td>
                </tr>
                <tr>
                    <td colspan="4" style="border: 1px solid #333; padding: 8px; font-size: 0.85rem;">
                        <b>🛣️ Kondisi Umum:</b> ${genCond}
                    </td>
                </tr>
            </table>

            <!-- Table Body -->
            <div class="official-jmp-table-wrapper">
                ${tableHtml}
            </div>

            <!-- Team Group -->
            <div style="margin-top: 20px; border-top: 2px solid #333; padding-top: 15px;">
                <div style="font-weight: bold; font-size: 0.8rem; margin-bottom: 10px; text-transform: uppercase;">Team Route Risk Assessment:</div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 0.75rem;">
                    <div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;">
                        <div style="color: #666; font-size: 0.65rem;">WOWS:</div>
                        <div style="font-weight: bold;">${team.wows}</div>
                    </div>
                    <div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;">
                        <div style="color: #666; font-size: 0.65rem;">HSSE:</div>
                        <div style="font-weight: bold;">${team.hsse}</div>
                    </div>
                    <div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;">
                        <div style="color: #666; font-size: 0.65rem;">RAM:</div>
                        <div style="font-weight: bold;">${team.ram}</div>
                    </div>
                    <div style="border: 1px solid #ddd; padding: 8px; border-radius: 4px;">
                        <div style="color: #666; font-size: 0.65rem;">SCM:</div>
                        <div style="font-weight: bold;">${team.scm}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function attachPhotoUploaders() {
    const table = document.querySelector('#jmp-content table');
    if (!table) return;

    const cells = table.querySelectorAll('td');
    cells.forEach(cell => {
        if (cell.innerText.includes('[Klik untuk Upload Foto]')) {
            cell.style.cursor = 'pointer';
            cell.style.background = 'rgba(var(--primary-rgb), 0.05)';
            cell.style.border = '1px dashed var(--primary)';
            cell.style.textAlign = 'center';
            cell.style.padding = '10px';
            cell.innerHTML = `
                <div class="photo-uploader" onclick="triggerPhotoUpload(this)">
                    <span style="font-size: 1.5rem; display: block;">📸</span>
                    <span style="font-size: 0.7rem; color: var(--primary);">Upload Foto</span>
                    <input type="file" accept="image/*" style="display:none;" onchange="handlePhotoSelect(this)">
                </div>
            `;
        }
    });
}

window.triggerPhotoUpload = function(div) {
    div.querySelector('input').click();
};

window.handlePhotoSelect = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const container = input.parentElement;
            container.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

function generateManualJMP(route, date, distTime, genCond, findings) {
    const resultArea = document.getElementById('jmp-result-area');
    
    // Split findings by lines to create rows
    const lines = findings.split('\n').filter(line => line.trim() !== '');
    
    let md = `\n| NO | LOKASI | DOKUMENTASI / FOTO | IDENTIFIKASI BAHAYA (HAZARD) | RISK LEVEL | PENGENDALIAN RESIKO (MITIGASI) | PIC |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :---| :--- |\n`;
    
    lines.forEach((line, index) => {
        md += `| ${index + 1} | ${line.trim()} | [Klik untuk Upload Foto] | [Tentukan Bahaya] | [Sedang] | [Tentukan Mitigasi] | [HSE/RAM] |\n`;
    });

    renderOfficialJMPPreview(md);
    resultArea.classList.remove('hidden');
    attachPhotoUploaders();
}

function copyJMP() {
    const content = document.getElementById('jmp-content');
    if (!content) return;

    // Copy the entire formatted text content (including all tables)
    const text = content.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Laporan JMP berhasil disalin!');
    });
}

async function saveJMPToLibrary() {
    const content = document.getElementById('jmp-content').innerHTML;
    const input = document.getElementById('jmp-input').value.substring(0, 30) + '...';
    
    const item = {
        title: `JMP Survey: ${input}`,
        content: content,
        category: 'HSE',
        type: 'jmp_table',
        timestamp: new Date().toISOString()
    };

    if (typeof saveGeneration === 'function') {
        await saveGeneration(item);
        alert('JMP berhasil disimpan ke Perpustakaan AI!');
    }
}

function exportJMPToPDF() {
    const title = document.getElementById('jmp-route')?.value || 'JMP Report';
    const content = document.getElementById('jmp-content');
    if (!content) return;

    // Create a temporary cleaning div (similar to library logic)
    const cleanDiv = document.createElement('div');
    cleanDiv.innerHTML = content.innerHTML;
    
    // Clean up unwanted UI elements
    cleanDiv.querySelectorAll('.no-print, .action-bar, button, .badge-ai, .loading-spinner').forEach(el => el.remove());
    
    // Inject print-specific styles to elements
    cleanDiv.querySelectorAll('*').forEach(el => {
        el.style.setProperty('color', '#000', 'important');
        el.style.setProperty('background-color', 'transparent', 'important');
        el.style.setProperty('background', 'transparent', 'important');
        el.style.transition = 'none';
        el.style.animation = 'none';

        if (el.tagName === 'TABLE') {
            el.style.width = '100%';
            el.style.tableLayout = 'auto'; 
            el.style.borderCollapse = 'collapse';
            el.style.border = '2px solid #000';
            el.style.marginBottom = '15px';
        }
        if (el.tagName === 'TH' || el.tagName === 'TD') {
            el.style.border = '1px solid #000';
            el.style.padding = '8px';
            el.style.wordBreak = 'break-word';
            el.style.fontSize = '9pt';
            el.style.verticalAlign = 'top';
        }
        if (el.tagName === 'TH') {
            el.style.backgroundColor = '#f2f2f2';
            el.style.fontWeight = 'bold';
        }
    });

    const finalContent = cleanDiv.innerHTML;
    const printWindow = window.open('', '_blank', 'height=800,width=1200');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>JMP ST-191 - ${title}</title>
            <style>
                @page {
                    size: landscape;
                    margin: 10mm;
                }
                body { 
                    font-family: Arial, Helvetica, sans-serif; 
                    line-height: 1.4; 
                    color: #000 !important; 
                    background: #fff;
                    margin: 0;
                    padding: 15px;
                    font-size: 10pt;
                }
                .document-wrapper { width: 100%; margin: 0 auto; }
                header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 3px solid #e11d48;
                    padding-bottom: 10px;
                }
                header h2 { margin: 0; color: #e11d48; font-size: 20px; text-transform: uppercase; }
                header h1 { font-size: 16px; margin: 8px 0 0 0; color: #000; font-weight: bold; }
                
                .meta-info {
                    font-size: 10px;
                    color: #333;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                    text-align: right;
                    display: flex;
                    justify-content: space-between;
                }

                table { width: 100%; border-collapse: collapse; margin: 10px 0; page-break-inside: auto; border: 2px solid #000; }
                tr { page-break-inside: avoid; }
                th, td { border: 1px solid #000; padding: 6px; text-align: left; vertical-align: top; word-wrap: break-word; }
                th { background: #f2f2f2 !important; font-weight: bold; text-align: center; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 9pt; }
                
                img { max-width: 150px; max-height: 120px; display: block; border: 1px solid #eee; margin-top: 5px; }

                footer {
                    margin-top: 25px;
                    font-size: 9px;
                    color: #555;
                    text-align: center;
                    border-top: 1px solid #ddd;
                    padding-top: 8px;
                }
                @media print {
                    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <div class="document-wrapper">
                <header>
                    <h2>HSE DEPARTMENT - ST-191</h2>
                    <h1>JOURNEY MANAGEMENT PLAN & ROAD RISK ASSESSMENT</h1>
                </header>
                
                <div class="meta-info">
                    <span><strong>Project:</strong> Rig Operations - RRA Survey</span>
                    <span><strong>Tgl Terbit:</strong> ${new Date().toLocaleString('id-ID', { dateStyle: 'full' })} WIB</span>
                </div>

                <div id="content">${finalContent}</div>
                
                <footer>
                    Dicetak melalui Jurnal AI - Intelligent Professional System Hub (HSSE Integration Module)<br>
                    © 2026 Jurnal AI. Keamanan adalah prioritas utama. Layak diunduh untuk Lampiran HSSE Plan.
                </footer>
            </div>
            <script>
                window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 800); };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

async function exportJMPToWord() {
    const content = document.getElementById('jmp-content');
    if (!content || !content.innerHTML) return;

    const route = document.getElementById('jmp-route')?.value || 'JMP-Report';
    const filename = `JMP_Official_ST191_${route.replace(/[^a-z0-9]/gi, '_')}.docx`;

    try {
        // 1. Collect Data from UI
        const data = {
            doc_no: document.getElementById('jmp-doc-no')?.value || '',
            rev_no: document.getElementById('jmp-rev-no')?.value || '',
            eff_date: document.getElementById('jmp-eff-date')?.value || '',
            page_no: document.getElementById('jmp-page-no')?.value || '',
            route: document.getElementById('jmp-route')?.value || '',
            date: document.getElementById('jmp-date')?.value || '',
            dist_time: document.getElementById('jmp-dist-time')?.value || '',
            gen_cond: document.getElementById('jmp-general-cond')?.value || '',
            team_wows: document.getElementById('jmp-team-wows')?.value || '-',
            team_hsse: document.getElementById('jmp-team-hsse')?.value || '-',
            team_ram: document.getElementById('jmp-team-ram')?.value || '-',
            team_scm: document.getElementById('jmp-team-scm')?.value || '-',
            hazards: []
        };

        // 2. Parse Hazard Table from Rendered HTML
        const table = content.querySelector('.official-jmp-table-wrapper table');
        if (table) {
            const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Skip header
            data.hazards = rows.map(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 7) {
                    return {
                        no: cells[0]?.innerText.trim() || '',
                        location: cells[1]?.innerText.trim() || '',
                        photo: cells[2]?.innerText.trim() || '', // Word template might not support dynamic images easily without complex blobs
                        hazard: cells[3]?.innerText.trim() || '',
                        risk: cells[4]?.innerText.trim() || '',
                        mitigation: cells[5]?.innerText.trim() || '',
                        pic: cells[6]?.innerText.trim() || ''
                    };
                }
                return null;
            }).filter(h => h !== null);
        }

        // 3. Load Template from Base64 (Bypass CORS)
        if (!window.JMP_TEMPLATE_B64) {
            throw new Error('Template tidak ditemukan. Pastikan jmp-template-b64.js dimuat.');
        }

        // Helper: Base64 to ArrayBuffer
        const binaryString = window.atob(window.JMP_TEMPLATE_B64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const buffer = bytes.buffer;
        
        const zip = new PizZip(buffer);
        const doc = new window.docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // 4. Render template
        doc.render(data);

        // 5. Output and Download
        const out = doc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        
        saveAs(out, filename);
        
    } catch (error) {
        console.error('Export Error:', error);
        alert('Gagal mengekspor Word: ' + (error.message || 'Template error atau library belum termuat.'));
    }
}
