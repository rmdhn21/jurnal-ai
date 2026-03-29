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

    const prompt = `Kamu adalah "Jarvis", asisten cerdas untuk aplikasi Jurnal AI. 
${currentTimeContext}

KONTEKS DATA PENGGUNA (14 HARI TERAKHIR):
${userContext}

TUGASMU:
Analisis kalimat pengguna: "${transcript}" dan:
1. Berikan respon tekstual (ngobrol/penjelasan/mentor).
2. Deteksi jika ada perintah otomatis (BULK) di dalamnya.

INTENT PERINTAH YANG DIDUKUNG:
1. "SAVE_TRANSACTION": Catat uang (pengeluaran/pemasukan).
2. "SAVE_SCHEDULE": Acara/Janji temu (HARUS ADA JAM/WAKTU SPESIFIK).
3. "SAVE_TASK_TODAY": Tugas harian (To-Do List Hari Ini).
4. "SAVE_TASK_KANBAN": Tugas umum, ide, atau proyek (Kanban Board).
5. "NAVIGATE": Berpindah halaman.
6. "CHAT": Percakapan umum atau konsultasi data (Tanpa aksi otomatis).

ATURAN OUTPUT:
KEMBALIKAN HANYA JSON dengan struktur:
{
  "textResponse": "Kalimat respon verbal dari Jarvis (Gunakan format markdown-ish)",
  "commands": [
    {
      "intent": "SAVE_TRANSACTION" | "SAVE_SCHEDULE" | "SAVE_TASK_TODAY" | "SAVE_TASK_KANBAN" | "NAVIGATE",
      "data": { 
         // Jika SAVE_TRANSACTION: { amount, type, category, description, walletId }
         // Jika SAVE_SCHEDULE: { title, datetime, priority }
         // Jika SAVE_TASK_TODAY: { text, priority }
         // Jika SAVE_TASK_KANBAN: { title, priority }
         // Jika NAVIGATE: { targetScreen }
      },
      "message": "Konfirmasi singkat u/ kartu"
    }
  ]
}

PENTING:
- Pastikan field 'text' (untuk SAVE_TASK_TODAY) atau 'title' (untuk SAVE_SCHEDULE/KANBAN) TIDAK BOLEH kosong. Ambil dari inti kalimat pengguna.
- 'amount' harus angka murni tanpa titik/koma.
- Gunakan bahasa Indonesia yang asertif dan cerdas (ala Jarvis Iron Man).
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
            const tx = { ...data, date: getTodayString(), createdAt: new Date().toISOString() };
            await saveTransaction(tx);
            await updateWalletBalance(tx.walletId, tx.amount, tx.type);
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
