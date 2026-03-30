// ===== GLOBAL AI ASSISTANT MODULE =====
let assistantMessages = [];

async function initAIAssistant() {
    const sendBtn = document.getElementById('send-ai-assistant-btn');
    const input = document.getElementById('ai-assistant-input');

    if (!sendBtn || !input) return;

    sendBtn.addEventListener('click', handleAssistantSend);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAssistantSend();
        }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    });

    // Handle Quick Actions
    const quickActions = document.getElementById('ai-quick-actions');
    if (quickActions) {
        quickActions.addEventListener('click', (e) => {
            const btn = e.target.closest('.qa-btn');
            if (btn) {
                const query = btn.dataset.query;
                if (query) {
                    input.value = query;
                    handleAssistantSend();
                }
            }
        });
    }
}

// Helper to scroll chat to bottom
function scrollToBottom() {
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    if (chatHistory) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}


async function handleAssistantSend() {
    const input = document.getElementById('ai-assistant-input');
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    const text = input.value.trim();

    if (!text) return;

    // Add user message to UI
    renderAssistantMessage(text, 'user');
    input.value = '';
    input.style.height = 'auto';

    // Show typing indicator
    const typingId = 'typing-' + Date.now();
    const typingHtml = `<div id="${typingId}" class="ai-typing bot-message">Jarvis sedang memproses...</div>`;
    chatHistory.insertAdjacentHTML('beforeend', typingHtml);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        // Unified Brain: Both Text and Voice now use processAICommand
        await processAICommand(text);
        
        // Remove typing indicator
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

    } catch (error) {
        console.error('Assistant Error:', error);
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        renderAssistantMessage('Maaf, saya (Jarvis) mengalami kendala teknis. Pastikan API Key sudah benar.', 'bot');
    }
}

function renderAssistantMessage(text, sender) {
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    if (!chatHistory) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `${sender}-message`;
    
    if (sender === 'bot') {
        // Basic Markdown-ish to HTML conversion
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/^- (.*)/gm, '• $1');
        msgDiv.innerHTML = html;
    } else {
        msgDiv.textContent = text;
    }
    
    chatHistory.appendChild(msgDiv);
    
    // Auto scroll
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Save to history state
    assistantMessages.push({ role: sender === 'user' ? 'user' : 'model', parts: [{ text: text }] });
    
    // Keep history manageable (last 10 messages)
    if (assistantMessages.length > 20) {
        assistantMessages = assistantMessages.slice(-20);
    }
}

async function aggregateUserContext() {
    const journals = await getJournals();
    const tasks = await getTasks();
    const transactions = await getTransactions();
    const habits = await getHabits();
    const wallets = await getWallets();
    const budgets = await getBudgets();
    const islamicTracks = await getIslamicTracks();

    // Last 14 days grouping
    const dailySnapshot = {};
    const now = new Date();
    for (let i = 0; i < 14; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        dailySnapshot[dateStr] = { mood: null, tasksCompleted: 0, spending: 0, subuh: false };
    }

    // Map Journals (last 14 days)
    journals.forEach(j => {
        const date = j.createdAt.split('T')[0];
        if (dailySnapshot[date]) dailySnapshot[date].mood = j.mood;
    });

    // Map Tasks (completed in last 14 days)
    tasks.filter(t => t.done && t.updatedAt).forEach(t => {
        const date = t.updatedAt.split('T')[0];
        if (dailySnapshot[date]) dailySnapshot[date].tasksCompleted++;
    });

    // Map Transactions (last 14 days)
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const date = t.date;
        if (dailySnapshot[date]) dailySnapshot[date].spending += (t.amount || 0);
    });

    // Map Islamic Track (Subuh only for correlation)
    Object.values(islamicTracks).forEach(t => {
        if (dailySnapshot[t.date]) dailySnapshot[t.date].subuh = t.prayers?.subuh || false;
    });

    const snapshotText = Object.entries(dailySnapshot)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, data]) => `- ${date}: Mood ${data.mood || '?'}, Selesai ${data.tasksCompleted} tugas, Jajan Rp ${data.spending.toLocaleString('id-ID')}, Subuh: ${data.subuh ? 'Ya' : 'Tidak'}`)
        .join('\n');

    const totalBalance = wallets.reduce((s, w) => s + (w.balance || 0), 0);
    const pendingTasksCount = tasks.filter(t => !t.done).length;

    return `
=== KONTEKS ANALITIK (14 HARI TERAKHIR) ===
${snapshotText}

RINGKASAN SAAT INI:
Total Saldo: Rp ${totalBalance.toLocaleString('id-ID')}
Tugas Pending: ${pendingTasksCount} item
===========================================
    `;
}

async function getGlobalAIResponse(userMessage) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API Key Missing');

    const context = await aggregateUserContext();
    
    const systemPrompt = `Kamu adalah "Jurnal AI Assistant - Personal Mentor". Tugasmu membantu pengguna sukses dengan menganalisis korelasi antar data mereka.

DATA KONTEKS (14 HARI TERAKHIR):
${context}

STRATEGI ANALISIS:
1. Cari hubungan antara Mood vs Pengeluaran (Contoh: "Kamu belanja impulsif saat mood Bad").
2. Cari hubungan antara Sholat Subuh vs Produktivitas (Contoh: "Produktivitasmu naik 40% saat Subuh tepat waktu").
3. Cari hubungan antara Saldo vs Mood.

ATURAN KOMUNIKASI:
- Berikan insight yang "Aha!" (mengejutkan dan berguna).
- Gunakan Bahasa Indonesia yang PADAT dan LANGSUNG KE INTI.
- JANGAN berikan saran umum; gunakan angka dari data di atas.
- Pastikan jawaban lengkap (tidak terpotong).`;

    const contents = [{
        role: "user",
        parts: [{ text: systemPrompt + "\n\nPertanyaan: " + userMessage }]
    }];

    const requestBody = {
        contents,
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            topP: 0.95,
            topK: 40
        }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    return data.candidates?.[0]?.content?.[1]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, coba lagi.";
}
