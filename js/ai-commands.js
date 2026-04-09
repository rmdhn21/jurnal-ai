// ===== JARVIS AI COMMANDS MODULE (V3 - UNIFIED INTELLIGENCE) =====
let pendingCommands = [];

async function processAICommand(transcript) {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API Key belum diatur!');
        return;
    }

    // Get context for AI
    const wallets = await getWallets();
    const walletContext = wallets.map(w => `- ${w.name} (ID: ${w.id})`).join('\n');
    const now = new Date();
    const currentTimeContext = `Sekarang adalah ${now.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
    
    // Add user data context (14 days summary)
    let userContext = "";
    if (typeof aggregateUserContext === 'function') {
        userContext = await aggregateUserContext();
    }

    // --- OMNIPOTENT CONTROLLER CONTEXT ---
    const todayTodos = Array.isArray(dailyTodos) ? dailyTodos.filter(t => !t.completed) : [];
    const todoContext = todayTodos.map(t => `- ID: ${t.id} | Teks: ${t.text}`).join('\n') || 'Tidak ada todo';
    
    let kanbanContext = 'Tidak ada kanban';
    if (typeof getTasks === 'function') {
        const allKanbanTasks = await getTasks();
        const activeKanban = allKanbanTasks.filter(t => !t.done);
        kanbanContext = activeKanban.map(t => `- ID: ${t.id} | Judul: ${t.title}`).join('\n') || 'Tidak ada kanban';
    }
    
    let islamTrackText = 'Belum ada data hari ini';
    if (typeof getIslamicTrackByDate === 'function') {
        const todayTrack = await getIslamicTrackByDate(getTodayString());
        islamTrackText = `- Subuh: ${todayTrack.prayers?.subuh ? 'Sudah' : 'Belum'}
- Dzuhur: ${todayTrack.prayers?.dzuhur ? 'Sudah' : 'Belum'}
- Ashar: ${todayTrack.prayers?.ashar ? 'Sudah' : 'Belum'}
- Maghrib: ${todayTrack.prayers?.maghrib ? 'Sudah' : 'Belum'}
- Isya: ${todayTrack.prayers?.isya ? 'Sudah' : 'Belum'}
- Qobliyah/Badiyah: ${todayTrack.qobliyah ? 'Sudah' : 'Belum'}
- Sedekah: ${todayTrack.sedekah ? 'Sudah' : 'Belum'}`;
    }

    // --- NEW EXTENDED CONTEXT ---
    let habitContext = 'Tidak ada habit';
    if (typeof getHabits === 'function') {
        const allHabits = await getHabits();
        const undoneHabits = allHabits.filter(h => !h.completedDates?.includes(getTodayString()));
        habitContext = undoneHabits.map(h => `- ID: ${h.id} | Nama: ${h.name}`).join('\n') || 'Semua habit selesai/kosong';
    }

    const workoutContext = 'Kategori Workout: gym1 (Leg), gym2 (Upper), home1 (Endurance), home2 (Band mobility).';
    const nutritionContext = 'Kategori Nutrisi: pagi, siang, preWorkout, postWorkout, malam, opsional.';

    const prompt = `Kamu adalah "Jarvis", asisten cerdas untuk aplikasi Jurnal AI. 
${currentTimeContext}

KONTEKS DATA PENGGUNA (14 HARI TERAKHIR):
${userContext}

KONTEKS OPERASIONAL SAAT INI (STATUS BELUM SELESAI):
- Todo Hari Ini (Pilih ID di sini):
${todoContext}

- Kanban Board (Pilih ID di sini):
${kanbanContext}

- Status Ibadah Hari ini (Pilih field di sini):
${islamTrackText}

- Habit Hari Ini (Pilih ID di sini):
${habitContext}

- Workout & Nutrisi:
${workoutContext}
${nutritionContext}

PERAN TAMBAHAN 1: Kamu adalah HSE SAFETY MENTOR. 
- Kuasai UU No 1 Tahun 1970 (Keselamatan Kerja), PTK 005 SKK Migas, Corporate Life Saving Rules (CLSR), dan standar internasional (OSHA/NEBOSH).
- Berikan saran teknis yang akurat jika ditanya tentang prosedur keselamatan (misal: jarak aman hot work, prosedur confined space, dll).

PERAN TAMBAHAN 2: Kamu adalah FINANCIAL ADVISOR & WEALTH PLANNER.
- Analisis data pengeluaran vs pemasukan pengguna dengan kritis.
- Jika pengguna bertanya tentang keuangan, berikan insight berbasis data (misal: "Pengeluaran makanmu naik 20% minggu ini").
- Berikan saran penghematan yang spesifik dan realistis.
- Bantu planning cicilan, tabungan (misal: Tabungan Nikah), dan manajemen arus kas.
- Gunakan nada yang asertif namun suportif (ala penasihat profesional).

PERAN TAMBAHAN 3: Kamu adalah TECHNICAL STANDARD AUDITOR (HSE & RIG).
- Kamu memiliki akses ke pengetahuan standar industri internasional (OSHA, API, ASME, ISO, IADC, Kemenaker).
- Jika ditanya tentang standar teknis (misal: tekanan pipa, jarak scaffolding, prosedur kerja), berikan jawaban yang sangat AKURAT.
- FORMAT WAJIB:
  1. Mulai dengan penjelasan teknis yang jelas.
  2. Gunakan tag [REF: Nama Standar] untuk rujukan (misal: [REF: ASME B31.3] atau [REF: OSHA 1926.451]).
  3. Di akhir jawaban, WAJIB tambahkan tag [DISCLAIMER] untuk mengingatkan verifikasi manual.
- Jika standar yang ditanya tidak ada di basis pengetahuanmu, katakan secara jujur dan asertif bahwa kamu tidak punya data pastinya.

TUGASMU:
Analisis kalimat pengguna: "${transcript}" dan:
1. Berikan respon tekstual (ngobrol/penjelasan/mentor).
2. Deteksi jika ada perintah otomatis (BULK) di dalamnya.

INTENT PERINTAH YANG DIDUKUNG:
1. "SAVE_TRANSACTION": Catat uang.
   - Schema Data: { amount: number, type: "expense"|"income", category: "string", description: "string", walletId: "id/nama_dompet" }
   - DAFTAR KATEGORI WAJIB:
     * PEMASUKAN: "Gaji", "Profit Trading/Investasi", "Pemasukan Lainnya".
     * PENGELUARAN: "Makan & Minum", "Kebutuhan Harian/Bulanan", "Transportasi", "Tagihan & Utilitas", "Tempat Tinggal", "Tabungan Nikah", "Edukasi & Pengembangan", "Hiburan & Nongkrong", "Sosial & Sedekah", "Lain-lain / Tak Terduga".
   - LOGIKA EKSTRAKSI:
     * Jika pengguna menyebut item spesifik (misal: "beli telur", "bayar parkir"), masukkan item tersebut ke "description".
     * Map item tersebut ke KATEGORI WAJIB yang paling relevan (misal: telur -> "Makan & Minum" atau "Kebutuhan Harian/Bulanan").
     * JANGAN gunakan kategori di luar daftar di atas.
2. "SAVE_SCHEDULE": Acara/Janji temu (HARUS ADA JAM/WAKTU). Data: { title: "string", datetime: "YYYY-MM-DDTHH:mm" }
3. "SAVE_TASK_TODAY": Tugas harian BARU (To-Do). Data: { text: "isi tugas", priority: "p1"|"p2"|"p3" }
4. "SAVE_TASK_KANBAN": Tugas umum/ide/proyek. Data: { title: "judul", description: "detail" }
5. "NAVIGATE": Berpindah halaman. Data: { targetScreen: "screen_id" }
6. "CHAT": Percakapan umum atau konsultasi data (Tanpa aksi otomatis).
7. "UPDATE_TODO": Menceklis status Todo Hari Ini. Data: { id: "string" }
8. "UPDATE_KANBAN": Memindahkan kartu Kanban menjadi selesai. Data: { id: "string" }
9. "UPDATE_ISLAMIC": Memperbarui status ibadah. Data: { field: "subuh"|"dzuhur"|"ashar"|"maghrib"|"isya"|"sedekah"|"qobliyah"|dll }
10. "SAVE_HABIT": Buat Target Habit Baru. Data: { name: "string" }
11. "UPDATE_HABIT": Menceklis Habit hari ini. Data: { id: "string" }
12. "SAVE_JOURNAL": Simpan Jurnal Rahasia. Data: { content: "string", mood: "senang"|"biasa"|"sedih" }
13. "UPDATE_WORKOUT": Menceklis kategori workout. Data: { category: "gym1"|"gym2"|"home1"|"home2" }
14. "UPDATE_NUTRITION": Menceklis nutrisi harian. Data: { category: "pagi"|"siang"|"malam"|"water"|dll }
15. "GENERATE_HSE": Buat dokumen HSE baru. Data: { type: "jsa"|"pjsm"|"rca"|"tbt"|"jmp", description: "inti tugas", jsaType: "JSA"|"RA" }
16. "SEARCH_LIBRARY": Cari item di Perpustakaan AI. Data: { query: "kata kunci" }

ATURAN OUTPUT:
KEMBALIKAN HANYA JSON dengan struktur:
{
  "textResponse": "Kalimat respon verbal dari Jarvis (Asertif, cerdas, ala Iron Man)",
  "commands": [
    {
      "intent": "INTENT_NAME",
      "data": { ... sesuai schema di atas ... },
      "message": "Konfirmasi singkat u/ kartu"
    }
  ]
}

PENTING:
- JANGAN GUNAKAN CATEGORY "Lain-lain" JIKA BISA DIIDENTIFIKASI (Misal: Makan, Transport, Belanja, Gaji).
- JANGAN GUNAKAN TITLE/TEXT "Tanpa Nama" JIKA ADA INFO DI TRANSCRIPT.
- Gunakan bahasa Indonesia yang formal namun asertif (Bahasa Jarvis).
`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) throw new Error('Gagal memproses ke intelijen Jarvis');

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        const resultData = JSON.parse(jsonText);
        
        handleUnifiedJarvisResponse(resultData);

    } catch (error) {
        console.error('Unified Jarvis Error:', error);
        renderAssistantMessage('Maaf, Jarvis mengalami gangguan sinyal.', 'bot');
    }
}

function handleUnifiedJarvisResponse(result) {
    const { textResponse, commands } = result;

    // 1. Render text response first
    if (textResponse) {
        renderAssistantMessage(textResponse, 'bot');
    }

    // 2. Clear old pending commands
    pendingCommands = [];
    
    // 3. Process each command
    if (commands && Array.isArray(commands)) {
        commands.forEach((cmd, index) => {
            if (cmd.intent === 'NAVIGATE') {
                executeNavigation(cmd.data.targetScreen, cmd.message);
            } else if (cmd.intent === 'CHAT') {
                // Already handled by textResponse
            } else {
                const cmdWithId = { ...cmd, id: `cmd_${Date.now()}_${index}` };
                pendingCommands.push(cmdWithId);
                showUniversalConfirmCard(cmdWithId);
            }
        });

        // If multiple commands, show "Confirm All" button at the end
        if (pendingCommands.length > 1) {
            showConfirmAllButton();
        }
    }
}

function executeNavigation(targetScreen, message) {
    if (typeof showScreen === 'function') {
        showScreen(targetScreen);
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.screen === targetScreen));
    }
}

function showUniversalConfirmCard(cmd) {
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    if (!chatHistory) return;

    const { intent, data, message, id } = cmd;
    let icon = '📝';
    let detailsHtml = '';
    let confirmTitle = 'Konfirmasi Perintah';

    if (intent === 'SAVE_TRANSACTION') {
        icon = '💰';
        confirmTitle = 'Catatan Keuangan';
        const amount = data.amount || 0;
        const typeClass = (data.type || 'expense') === 'expense' ? 'text-danger' : 'text-success';
        detailsHtml = `
            <div class="confirm-row"><span>Nominal:</span><strong class="${typeClass}">${formatCurrency(amount)}</strong></div>
            <div class="confirm-row"><span>Kategori:</span><strong>${data.category || 'Lain-lain'}</strong></div>
            <div class="confirm-row"><span>Info:</span><strong>${data.description || 'Tanpa keterangan'}</strong></div>
            <div class="confirm-row"><span>Dompet:</span><strong>${data.walletId || 'Utama'}</strong></div>
        `;
    } else if (intent === 'SAVE_SCHEDULE') {
        icon = '📅';
        confirmTitle = 'Jadwal Baru';
        const displayTime = (data.datetime || "").replace('T', ' ') || 'Waktu tidak ditentukan';
        detailsHtml = `
            <div class="confirm-row"><span>Kegiatan:</span><strong>${data.title || 'Tanpa Nama'}</strong></div>
            <div class="confirm-row"><span>Waktu:</span><strong>${displayTime}</strong></div>
        `;
    } else if (intent === 'SAVE_TASK_TODAY') {
        icon = '📝';
        confirmTitle = 'Tugas Hari Ini';
        detailsHtml = `
            <div class="confirm-row"><span>Tugas:</span><strong>${data.text || data.title || 'Tanpa Nama'}</strong></div>
            <div class="confirm-row"><span>Prioritas:</span><strong>${(data.priority || 'P2').toUpperCase()}</strong></div>
        `;
    } else if (intent === 'SAVE_TASK_KANBAN') {
        icon = '📋';
        confirmTitle = 'Ide Kanban';
        detailsHtml = `
            <div class="confirm-row"><span>Tugas:</span><strong>${data.title || 'Tanpa Nama'}</strong></div>
        `;
    } else if (intent === 'UPDATE_TODO') {
        icon = '✅';
        confirmTitle = 'Ceklis Todo Hari Ini';
        detailsHtml = `
            <div class="confirm-row"><span>Selesaikan:</span><strong>${data.title_context || 'Tugas Terpilih'}</strong></div>
        `;
    } else if (intent === 'UPDATE_KANBAN') {
        icon = '✅';
        confirmTitle = 'Selesaikan Kanban';
        detailsHtml = `
            <div class="confirm-row"><span>Selesaikan:</span><strong>${data.title_context || 'Tugas Terpilih'}</strong></div>
        `;
    } else if (intent === 'UPDATE_ISLAMIC') {
        icon = '🕌';
        confirmTitle = 'Ceklis Ibadah';
        detailsHtml = `
            <div class="confirm-row"><span>Ibadah:</span><strong style="text-transform: capitalize;">${data.field || 'Ibadah Terpilih'}</strong></div>
        `;
    } else if (intent === 'SAVE_HABIT') {
        icon = '🌱';
        confirmTitle = 'Target Habit Baru';
        detailsHtml = `
            <div class="confirm-row"><span>Nama:</span><strong>${data.name || 'Habit Baru'}</strong></div>
        `;
    } else if (intent === 'UPDATE_HABIT') {
        icon = '✅';
        confirmTitle = 'Ceklis Habit';
        detailsHtml = `
            <div class="confirm-row"><span>Selesaikan:</span><strong>${data.title_context || 'Habit Terpilih'}</strong></div>
        `;
    } else if (intent === 'SAVE_JOURNAL') {
        icon = '📖';
        confirmTitle = 'Tulis Jurnal';
        const m = data.mood || 'biasa';
        const txt = (data.content || '').substring(0, 40) + '...';
        detailsHtml = `
            <div class="confirm-row"><span>Cerita:</span><strong>${txt}</strong></div>
            <div class="confirm-row"><span>Mood:</span><strong style="text-transform: capitalize;">${m}</strong></div>
        `;
    } else if (intent === 'UPDATE_WORKOUT') {
        icon = '💪';
        confirmTitle = 'Ceklis Workout';
        detailsHtml = `
            <div class="confirm-row"><span>Kategori:</span><strong style="text-transform: uppercase;">${data.category || 'Workout'}</strong></div>
        `;
    } else if (intent === 'UPDATE_NUTRITION') {
        icon = '🥗';
        confirmTitle = 'Ceklis Nutrisi';
        detailsHtml = `
            <div class="confirm-row"><span>Kategori:</span><strong style="text-transform: capitalize;">${data.category || 'Nutrisi'}</strong></div>
        `;
    } else if (intent === 'GENERATE_HSE') {
        icon = '🛡️';
        confirmTitle = `Buat Dokumen ${data.type?.toUpperCase()}`;
        detailsHtml = `
            <div class="confirm-row"><span>Jenis:</span><strong>${data.type?.toUpperCase()}</strong></div>
            <div class="confirm-row"><span>Pekerjaan:</span><strong>${data.description || 'Pekerjaan Baru'}</strong></div>
        `;
    } else if (intent === 'SEARCH_LIBRARY') {
        icon = '🔍';
        confirmTitle = 'Cari Perpustakaan';
        detailsHtml = `
            <div class="confirm-row"><span>Cari:</span><strong>${data.query || ''}</strong></div>
        `;
    } else if (intent === 'GENERATE_HSE' && data.type?.toLowerCase() === 'jmp') {
        icon = '🗺️';
        confirmTitle = 'Buat JMP (Hazard Register)';
        detailsHtml = `
            <div class="confirm-row"><span>Tipe:</span><strong>JMP Generator</strong></div>
            <div class="confirm-row"><span>Catatan:</span><strong>${(data.description || data.notes || '').substring(0, 30)}...</strong></div>
        `;
    }

    const cardHtml = `
        <div class="universal-confirm-card bot-message" id="${id}">
            <div class="confirm-header">${icon} ${confirmTitle}</div>
            <div class="confirm-body">${detailsHtml}</div>
            <div class="confirm-actions mt-sm">
                <button class="btn btn-primary btn-sm" onclick="executeCommandById('${id}')">✅ Simpan</button>
                <button class="btn btn-secondary btn-sm" onclick="cancelCommandById('${id}')">✕ Batal</button>
            </div>
        </div>
    `;
    
    const div = document.createElement('div');
    div.innerHTML = cardHtml;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showConfirmAllButton() {
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    const div = document.createElement('div');
    div.className = 'confirm-all-container mt-sm mb-sm';
    div.innerHTML = `<button class="btn btn-primary w-100" onclick="executeAllPendingCommands()">✅ Simpan Semua Sejarah/Perintah</button>`;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function executeCommandById(id) {
    const cmd = pendingCommands.find(c => c.id === id);
    if (!cmd) return;

    await executeSingleCommand(cmd);
    
    pendingCommands = pendingCommands.filter(c => c.id !== id);
    const card = document.getElementById(id);
    if (card) card.remove();
}

async function executeSingleCommand(cmd) {
    const { intent, data } = cmd;
    try {
        if (intent === 'SAVE_TRANSACTION') {
            const parsedAmount = parseFloat(data.amount) || 0;
            const resolvedType = data.type || 'expense';
            
            if (parsedAmount <= 0) {
                console.error('❌ Jarvis SAVE_TRANSACTION: invalid amount', data);
                return;
            }

            // Resolve walletId: AI often sends wallet NAME instead of ID
            let resolvedWalletId = data.walletId || 'wallet_default';
            const walletByIdCheck = await idbGet('wallets', resolvedWalletId);
            if (!walletByIdCheck) {
                // Try to find by name
                const allWallets = await getWallets();
                const matchedWallet = allWallets.find(w => 
                    w.name && w.name.toLowerCase().trim() === resolvedWalletId.toLowerCase().trim()
                );
                if (matchedWallet) {
                    console.log(`🔍 Resolved wallet name '${resolvedWalletId}' → ID: ${matchedWallet.id}`);
                    resolvedWalletId = matchedWallet.id;
                } else {
                    console.warn(`⚠️ Wallet '${resolvedWalletId}' not found, using wallet_default`);
                    resolvedWalletId = 'wallet_default';
                }
            }

            const tx = { 
                id: generateId(),
                amount: parsedAmount,
                type: resolvedType,
                category: data.category || 'Lain-lain',
                description: data.description || '',
                walletId: resolvedWalletId,
                date: getTodayString(), 
                createdAt: new Date().toISOString() 
            };
            
            console.log('💰 Jarvis saving transaction:', tx);
            
            await saveTransaction(tx);
            await updateWalletBalance(tx.walletId, tx.amount, tx.type);
            
            // Refresh finance UI immediately
            if (typeof renderTransactionList === 'function') await renderTransactionList();
            if (typeof updateFinanceSummary === 'function') await updateFinanceSummary();
            if (typeof renderWalletListSummary === 'function') await renderWalletListSummary();
            if (typeof updateWalletSelectOptions === 'function') await updateWalletSelectOptions();
        } else if (intent === 'SAVE_SCHEDULE') {
            const sch = { ...data, id: generateId(), createdAt: new Date().toISOString(), createdFrom: 'jarvis_unified' };
            await saveSchedule(sch);
        } else if (intent === 'SAVE_TASK_TODAY') {
            const newTodo = { 
                id: Date.now().toString(), 
                text: data.text || data.title || 'Tanpa Nama', 
                priority: data.priority || 'p2', 
                completed: false 
            };
            if (typeof dailyTodos !== 'undefined') {
                dailyTodos.push(newTodo);
                if (typeof saveTodos === 'function') saveTodos();
            }
        } else if (intent === 'SAVE_TASK_KANBAN') {
            const task = { ...data, id: generateId(), done: false, createdAt: new Date().toISOString(), createdFrom: 'jarvis_unified' };
            await saveTask(task);
        } else if (intent === 'UPDATE_TODO') {
            if (data.id && typeof toggleDailyTodo === 'function') {
                const todoTarget = dailyTodos.find(t => t.id === data.id);
                if (todoTarget && !todoTarget.completed) toggleDailyTodo(data.id);
            }
        } else if (intent === 'UPDATE_KANBAN') {
            if (data.id && typeof toggleTask === 'function') {
                const kanbanTasks = await getTasks();
                const kbTarget = kanbanTasks.find(t => t.id === data.id);
                if (kbTarget && !kbTarget.done) await toggleTask(data.id);
            }
        } else if (intent === 'UPDATE_ISLAMIC') {
            if (data.field && typeof getIslamicTrackByDate === 'function' && typeof saveIslamicTrack === 'function') {
                const todayStr = getTodayString();
                const todayTrack = await getIslamicTrackByDate(todayStr);
                const pr = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
                if (pr.includes(data.field)) {
                    todayTrack.prayers[data.field] = true;
                } else {
                    todayTrack[data.field] = true;
                }
                await saveIslamicTrack(todayStr, todayTrack);
                if (typeof renderIslamicDashboard === 'function') renderIslamicDashboard();
            }
        } else if (intent === 'SAVE_HABIT') {
            if (data.name && typeof saveHabit === 'function') {
                const hb = { id: generateId(), name: data.name, createdAt: new Date().toISOString() };
                await saveHabit(hb);
                if (typeof renderHabits === 'function') renderHabits();
            }
        } else if (intent === 'UPDATE_HABIT') {
            if (data.id && typeof toggleHabitCompletion === 'function') {
                await toggleHabitCompletion(data.id, getTodayString());
                if (typeof renderHabits === 'function') renderHabits();
            }
        } else if (intent === 'SAVE_JOURNAL') {
            if (data.content && typeof saveJournal === 'function') {
                const txtHtml = `<p>${data.content}</p>`;
                const jr = { id: generateId(), content: txtHtml, plainText: data.content, mood: data.mood || 'biasa', createdAt: new Date().toISOString() };
                await saveJournal(jr);
                if (typeof renderJournals === 'function') renderJournals();
            }
        } else if (intent === 'UPDATE_WORKOUT') {
            const cat = data.category;
            if (cat && typeof workoutData !== 'undefined' && workoutData[cat] && typeof toggleWorkoutTask === 'function') {
                workoutData[cat].forEach(task => {
                    if (!workoutState.progress[cat] || !workoutState.progress[cat].includes(task.id)) {
                        toggleWorkoutTask(cat, task.id);
                    }
                });
            }
        } else if (intent === 'UPDATE_NUTRITION') {
            if (data.category && typeof nutritionData !== 'undefined' && typeof toggleNutritionTask === 'function') {
                if (data.category === 'water') {
                    if (typeof changeWater === 'function') changeWater(1);
                } else if (nutritionData[data.category]) {
                    nutritionData[data.category].forEach(task => {
                        if (!workoutState.nutritionProgress || !workoutState.nutritionProgress[data.category] || !workoutState.nutritionProgress[data.category].includes(task.id)) {
                            toggleNutritionTask(data.category, task.id);
                        }
                    });
                }
            }
        } else if (intent === 'GENERATE_HSE') {
            const type = data.type?.toLowerCase();
            const desc = data.description;
            if (type === 'pjsm') {
                showScreen('hse-rig-screen');
                if (typeof generatePJSM === 'function') generatePJSM(desc);
            } else if (type === 'jsa' || type === 'ra') {
                showScreen('hsse-screen');
                if (typeof generateJSADocument === 'function') generateJSADocument(desc, data.jsaType || 'JSA');
            } else if (type === 'rca') {
                showScreen('hsse-screen');
                if (typeof generateRCADocument === 'function') generateRCADocument(desc);
            } else if (type === 'tbt') {
                showScreen('hsse-screen');
                if (typeof generateTBTDocument === 'function') generateTBTDocument(desc);
            } else if (type === 'jmp') {
                if (typeof navigateToJMPGenerator === 'function') navigateToJMPGenerator();
                const jmpInput = document.getElementById('jmp-input');
                if (jmpInput) {
                    jmpInput.value = desc || data.notes || '';
                    if (typeof generateJMP === 'function') setTimeout(generateJMP, 500);
                }
            }
        } else if (intent === 'SEARCH_LIBRARY') {
            const query = data.query;
            if (query && typeof searchLibrary === 'function') {
                searchLibrary(query);
            }
        }
        
        if (typeof updateGlobalBudgetUI === 'function') updateGlobalBudgetUI();
        if (typeof renderScheduleList === 'function') renderScheduleList();
        if (typeof renderKanbanBoard === 'function') renderKanbanBoard();
        if (typeof renderDailyTodos === 'function') renderDailyTodos();

    } catch (e) {
        console.error('Execute Unified error:', e);
    }
}

async function executeAllPendingCommands() {
    for (const cmd of pendingCommands) {
        await executeSingleCommand(cmd);
    }
    document.querySelectorAll('.universal-confirm-card').forEach(c => c.remove());
    document.querySelectorAll('.confirm-all-container').forEach(c => c.remove());
    pendingCommands = [];
}

function cancelCommandById(id) {
    pendingCommands = pendingCommands.filter(c => c.id !== id);
    const card = document.getElementById(id);
    if (card) card.remove();
    if (pendingCommands.length <= 1) {
        document.querySelectorAll('.confirm-all-container').forEach(c => c.remove());
    }
}
