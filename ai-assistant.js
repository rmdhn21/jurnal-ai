// ===== GLOBAL AI ASSISTANT MODULE =====
let assistantMessages = [];

async function initAIAssistant() {
    const fab = document.getElementById('ai-assistant-btn');
    const drawer = document.getElementById('ai-assistant-drawer');
    const closeBtn = document.getElementById('close-ai-assistant');
    const sendBtn = document.getElementById('send-ai-assistant-btn');
    const input = document.getElementById('ai-assistant-input');

    if (!fab || !drawer) return;

    // Initialize Draggable state
    initDraggableFAB(fab);

    fab.addEventListener('click', (e) => {
        // Only toggle if not dragged
        if (fab.dataset.dragged === 'true') {
            fab.dataset.dragged = 'false';
            return;
        }
        
        const isHidden = drawer.classList.contains('hidden');
        if (isHidden) {
            drawer.classList.remove('hidden');
            positionAIDrawer();
            input.focus();
            
            // Hide FAB on mobile when drawer is open to save space
            if (window.innerWidth <= 480) {
                fab.style.opacity = '0';
                fab.style.pointerEvents = 'none';
            }
        } else {
            drawer.classList.add('hidden');
        }
    });

    closeBtn.addEventListener('click', () => {
        drawer.classList.add('hidden');
        // Restore FAB
        fab.style.opacity = '1';
        fab.style.pointerEvents = 'auto';
    });

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
                input.value = query;
                handleAssistantSend();
            }
        });
    }
}

function initDraggableFAB(fab) {
    let isDragging = false;
    let startX, startY, initialX, initialY;
    let dragThreshold = 5; // px to consider it a drag vs a click
    
    // Load persisted position
    const savedPos = JSON.parse(localStorage.getItem('jurnal_ai_fab_pos') || '{}');
    if (savedPos.left !== undefined) {
        fab.style.left = savedPos.left + 'px';
        fab.style.top = savedPos.top + 'px';
        fab.style.bottom = 'auto';
        fab.style.right = 'auto';
    }

    const onStart = (e) => {
        isDragging = false;
        fab.dataset.dragged = 'false';
        
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
        
        startX = clientX;
        startY = clientY;
        
        const rect = fab.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        
        fab.classList.remove('snapping');
        
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    };

    const onMove = (e) => {
        const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
        
        const dx = clientX - startX;
        const dy = clientY - startY;
        
        // Slightly higher threshold for mobile to avoid accidental drags
        const threshold = e.type.startsWith('touch') ? 8 : dragThreshold;

        if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
            if (!isDragging) {
                isDragging = true;
                fab.dataset.dragged = 'true';
            }
            
            // Boundary constraints
            let newX = initialX + dx;
            let newY = initialY + dy;
            
            // Account for button size (50 or 60)
            const fabSize = window.innerWidth <= 480 ? 50 : 60;
            newX = Math.max(10, Math.min(newX, window.innerWidth - fabSize - 10));
            newY = Math.max(10, Math.min(newY, window.innerHeight - fabSize - 10));
            
            fab.style.left = newX + 'px';
            fab.style.top = newY + 'px';
            fab.style.bottom = 'auto';
            fab.style.right = 'auto';
            
            if (e.cancelable) e.preventDefault();
        }
    };

    const onEnd = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        
        if (isDragging) {
            snapToEdge(fab);
        }
    };

    fab.addEventListener('mousedown', onStart);
    fab.addEventListener('touchstart', onStart, { passive: true });
}

function snapToEdge(fab) {
    fab.classList.add('snapping');
    const rect = fab.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const thresh = window.innerWidth / 2;
    
    let finalX = centerX < thresh ? 20 : window.innerWidth - rect.width - 20;
    
    // Boundary check for Y
    let finalY = Math.max(20, Math.min(rect.top, window.innerHeight - rect.height - 20));
    
    fab.style.left = finalX + 'px';
    fab.style.top = finalY + 'px';
    
    // Save position
    localStorage.setItem('jurnal_ai_fab_pos', JSON.stringify({ left: finalX, top: finalY }));
    
    // Update drawer if open
    if (!document.getElementById('ai-assistant-drawer').classList.contains('hidden')) {
        positionAIDrawer();
    }
}

function positionAIDrawer() {
    const fab = document.getElementById('ai-assistant-btn');
    const drawer = document.getElementById('ai-assistant-drawer');
    const rect = fab.getBoundingClientRect();
    
    const isLeft = (rect.left + rect.width / 2) < (window.innerWidth / 2);
    
    if (window.innerWidth <= 480) {
        // Mobile: centered bottom
        drawer.style.left = '15px';
        drawer.style.right = '15px';
        drawer.style.bottom = '90px';
        drawer.style.top = 'auto';
    } else {
        // Desktop: Near FAB
        if (isLeft) {
            drawer.style.left = (rect.left) + 'px';
            drawer.style.right = 'auto';
        } else {
            drawer.style.right = (window.innerWidth - rect.right) + 'px';
            drawer.style.left = 'auto';
        }
        
        // Vertical pos
        if (rect.top < 600) {
            // If FAB is at top, drawer goes below
            drawer.style.top = (rect.bottom + 15) + 'px';
            drawer.style.bottom = 'auto';
        } else {
            // Else drawer goes above
            drawer.style.bottom = (window.innerHeight - rect.top + 15) + 'px';
            drawer.style.top = 'auto';
        }
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

function setJarvisNeuralStatus(text, active = true) {
    const statusContainer = document.getElementById('jarvis-neural-status');
    const statusText = document.getElementById('neural-text');
    if (!statusContainer || !statusText) return;

    if (active) {
        statusContainer.classList.add('active');
        statusText.textContent = text;
    } else {
        statusContainer.classList.remove('active');
    }
}

async function renderStreamingAssistantMessage(text, sender) {
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    if (!chatHistory) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `${sender}-message`;
    chatHistory.appendChild(msgDiv);

    if (sender === 'bot') {
        // Convert markdown-ish to HTML first, but render char by char
        let htmlContent = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/^- (.*)/gm, '• $1');

        // Typing simulation
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        msgDiv.appendChild(cursor);

        // Simple way: textContent then replace with HTML at the end, 
        // OR better: temporary element to parse HTML and then append nodes.
        // For simplicity and speed, we'll reveal the HTML content gradually.
        
        let i = 0;
        const speed = 20; // ms per char (Medium-Fast)
        
        return new Promise(resolve => {
            const timer = setInterval(() => {
                if (i < text.length) {
                    // We render based on characters but we want the HTML to be parsed correctly.
                    // This is a bit tricky with raw HTML. 
                    // Let's use a simpler approach: set textContent per char until end, then swap to innerHTML.
                    msgDiv.innerHTML = text.substring(0, i) + '<span class="typing-cursor"></span>';
                    i++;
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                } else {
                    clearInterval(timer);
                    msgDiv.innerHTML = htmlContent;
                    chatHistory.scrollTop = chatHistory.scrollHeight;
                    resolve();
                }
            }, speed);
        });
    } else {
        msgDiv.textContent = text;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Save to history state
    assistantMessages.push({ role: sender === 'user' ? 'user' : 'model', parts: [{ text: text }] });
    if (assistantMessages.length > 20) assistantMessages = assistantMessages.slice(-20);
}

// Keeping original for backward compatibility or simple usage
function renderAssistantMessage(text, sender) {
    renderStreamingAssistantMessage(text, sender);
}

async function aggregateUserContext() {
    const journals = await getJournals();
    const tasks = await getTasks();
    const transactions = await getTransactions();
    const habits = await getHabits();
    const wallets = await getWallets();
    const budgets = await getBudgets();
    const islamicTracks = await getIslamicTracks();
    const routines = await getRoutines();

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

    // Map Transactions (last 14 days) and aggregate categories
    const categoryTotals = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
        const date = t.date;
        if (dailySnapshot[date]) dailySnapshot[date].spending += (t.amount || 0);
        
        // Aggregate categories
        const cat = t.category || 'Lain-lain';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + (t.amount || 0);
    });

    const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cat, amt]) => `${cat}: Rp ${amt.toLocaleString('id-ID')}`)
        .join(', ');

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
    
    // Routine context
    const routineSummary = (routines || []).map(r => `${r.time}: ${r.title}`).join(', ') || 'Belum ada rutinitas';

    return `
=== KONTEKS ANALITIK (14 HARI TERAKHIR) ===
${snapshotText}

=== RINGKASAN DATA ===
Total Saldo: Rp ${totalBalance.toLocaleString('id-ID')}
Top Pengeluaran: ${topCategories}
Tugas Pending: ${pendingTasksCount} item
Rutinitas Harian: ${routineSummary}
===========================================
    `;
}

async function getGlobalAIResponse(userMessage) {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('API Key Missing');

    setJarvisNeuralStatus('📦 Sinkronisasi Memori...', true);
    const context = await aggregateUserContext();
    setJarvisNeuralStatus('🧠 Menganalisis Pola Hidup...', true);
    
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

    setJarvisNeuralStatus('✨ Merumuskan Insight Neural...', true);

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    setJarvisNeuralStatus('', false); 
    return data.candidates?.[0]?.content?.[1]?.text || data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, coba lagi.";
}
