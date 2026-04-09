// ===== JMP GENERATOR MODULE =====
// Handles AI-powered Hazard Register JMP generation

function navigateToJMPGenerator() {
    if (typeof navigateToSubscreen === 'function') {
        navigateToSubscreen('jmp-generator');
    }
}

async function generateJMP() {
    const input = document.getElementById('jmp-input');
    const notes = input.value.trim();
    const btn = document.getElementById('generate-jmp-btn');
    const loading = document.getElementById('jmp-loading');
    const resultArea = document.getElementById('jmp-result-area');
    const content = document.getElementById('jmp-content');

    if (!notes) {
        alert('Silakan masukkan catatan hasil survei atau kondisi jalan terlebih dahulu.');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API Key belum diatur! Silakan atur di menu Pengaturan.');
        return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Menganalisis...';
    loading.classList.remove('hidden');
    resultArea.classList.add('hidden');

    const systemPrompt = `
    Peran Anda:
    Anda adalah seorang Ahli HSSE (Health, Safety, Security, and Environment) di industri Minyak dan Gas, khusus menangani Journey Management Plan (JMP) dan Route Risk Assessment untuk operasi Moving dan Rig Up.

    Tugas Utama:
    Saya akan memberikan daftar catatan lapangan (hasil survei) berupa kondisi jalan atau lokasi sebelum proses moving armada rig. Tugas Anda adalah mengubah daftar mentah tersebut menjadi Tabel Hazard Register JMP yang profesional dan terstruktur.

    Aturan Analisis Risiko:
    Untuk setiap poin yang diberikan, Anda wajib melakukan ekstraksi dan analisis berikut:

    1. Lokasi / Kondisi: Tulis ulang kondisi survei agar lebih rapi.
    2. Identifikasi Bahaya: Tentukan kategori energi bahaya berdasarkan kerangka "10 Hazard Energy" (misalnya: Bahaya Gravitasi, Bahaya Gerak, Bahaya Biologis, Bahaya Mekanik) beserta potensi insiden spesifiknya (misal: armada amblas, tertabrak, tersandung, dll).
    3. Tingkat Risiko: Tentukan secara logis apakah risikonya Tinggi, Sedang, atau Rendah.
    4. Pengendalian Risiko (Mitigasi): Buat 2-3 langkah mitigasi praktis yang wajib dilakukan sebelum armada moving/rig masuk. Fokus pada tindakan korektif lapangan (misal: scrapping, clearing, pasang rambu, pengawalan) dan kewajiban penggunaan APD.
    5. PIC: Tentukan pihak yang bertanggung jawab. Anda HANYA BOLEH memilih dari daftar berikut (boleh lebih dari satu): WOWS, HSSE, SCM, RAM. Jangan gunakan nama divisi lain.

    Format Output:
    Berikan jawaban HANYA dalam bentuk tabel Markdown dengan header persis seperti ini:
    | No | Lokasi / Kondisi Hasil Survei | Identifikasi Bahaya (Sesuai 10 Hazard) | Tingkat Risiko | Pengendalian Risiko (Mitigasi) Sebelum Moving & Rig Up | PIC |

    PENTING: Jangan tambahkan teks pembuka atau penutup di luar tabel.
    `;

    const userPrompt = `DAFTAR CATATAN SURVEI:\n${notes}`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ 
                    role: "user", 
                    parts: [{ text: systemPrompt + "\n\n" + userPrompt }] 
                }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                    responseMimeType: "text/plain"
                }
            })
        });

        if (!response.ok) throw new Error('Gagal menghubungi AI');

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) throw new Error('Respon AI kosong');

        // Render table
        content.innerHTML = window.formatAIText(text);
        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error('JMP Error:', error);
        alert('Gagal generate JMP: ' + error.message);
    } finally {
        loading.classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '⚡ Generate Tabel Hazard Register JMP';
    }
}

function copyJMP() {
    const content = document.getElementById('jmp-content');
    const table = content.querySelector('table');
    if (!table) return;

    // A simpler way is to just grab the raw text if we store it, 
    // but we can also convert the DOM table back to CSV/Markdown or just copy the text.
    const text = table.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Tabel JMP berhasil disalin!');
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
    const content = document.getElementById('jmp-content');
    if (!content || !content.innerHTML) return;

    const printWindow = window.open('', '_blank');
    const title = "JOURNEY MANAGEMENT PLAN - HAZARD REGISTER";
    
    printWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                @page { size: landscape; margin: 10mm; }
                body { font-family: Arial, sans-serif; padding: 20px; font-size: 10pt; color: #333; }
                header { text-align: center; border-bottom: 3px solid #e11d48; padding-bottom: 10px; margin-bottom: 20px; }
                h1 { color: #e11d48; margin: 0; font-size: 18pt; }
                h2 { font-size: 12pt; color: #666; margin: 5px 0 0 0; }
                .meta { text-align: right; font-size: 8pt; color: #999; margin-bottom: 10px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: fixed; }
                th { background-color: #e11d48 !important; color: white !important; font-weight: bold; border: 1px solid #991b1b; padding: 8px; text-align: center; }
                td { border: 1px solid #ccc; padding: 8px; vertical-align: top; word-wrap: break-word; }
                tr:nth-child(even) { background-color: #f9fafb; }
                footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; font-size: 8pt; text-align: center; color: #999; }
            </style>
        </head>
        <body>
            <header>
                <h1>HSE DEPARTMENT - RIG OPERATIONS</h1>
                <h2>JOURNEY MANAGEMENT PLAN (JMP) HAZARD REGISTER</h2>
            </header>
            <div class="meta">Generated by Jurnal AI - ${new Date().toLocaleString('id-ID')}</div>
            <div id="content">${content.innerHTML}</div>
            <footer>
                © 2026 Jurnal AI Precision. Dokumen ini hanya untuk tujuan operasional internal.
            </footer>
            <script>
                window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}
