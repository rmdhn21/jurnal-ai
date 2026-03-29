// ===== AI SMART FINANCE MODULE =====
let pendingTransaction = null;

async function processVoiceTransaction(transcript) {
    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API Key belum diatur!');
        return;
    }

    // Get wallets to provide context to AI
    const wallets = await getWallets();
    const walletContext = wallets.map(w => `- ${w.name} (ID: ${w.id})`).join('\n');

    const prompt = `Kamu adalah asisten pengelola keuangan cerdas. 
Tugasmu: Ekstrak data transaksi dari kalimat berikut: "${transcript}"

KONTEKS DOMPET YANG TERSEDIA:
${walletContext}

ATURAN EKSTRAKSI:
1. "amount": Angka nominal (hilangkan titik/koma desimal, pastikan integer).
2. "type": Harus "expense" (pengeluaran) atau "income" (pemasukan).
3. "category": Kategori singkat (misal: Makan, Transport, Gaji, Belanja).
4. "description": Deskripsi singkat transaksi.
5. "walletId": Pilih ID dompet yang paling cocok dari daftar di atas. Jika tidak disebutkan "tunai" atau "cash", asumsikan "wallet_default".

Gunakan Bahasa Indonesia.
KEMBALIKAN HANYA JSON DENGAN STRUKTUR:
{
  "amount": number,
  "type": "expense" | "income",
  "category": "string",
  "description": "string",
  "walletId": "string"
}`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2, // Low temperature for extraction accuracy
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) throw new Error('Gagal memproses suara ke data finansial');

        const result = await response.json();
        const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        const data = JSON.parse(jsonText);
        
        showTransactionConfirmCard(data);

    } catch (error) {
        console.error('Voice Finance Error:', error);
        renderAssistantMessage('Maaf, saya gagal memahami data transaksi tersebut. Bisa ulangi dengan lebih jelas? (Misal: "Beli bakso 15 ribu")', 'bot');
    }
}

function showTransactionConfirmCard(data) {
    const chatHistory = document.getElementById('ai-assistant-chat-history');
    if (!chatHistory) return;

    pendingTransaction = data;

    const typeLabel = data.type === 'expense' ? 'Pengeluaran' : 'Pemasukan';
    const typeClass = data.type === 'expense' ? 'text-danger' : 'text-success';
    
    // Find wallet name for display
    getWallets().then(wallets => {
        const wallet = wallets.find(w => w.id === data.walletId) || { name: 'Utama' };
        
        const cardHtml = `
            <div class="transaction-confirm-card bot-message">
                <div class="confirm-header">📝 Konfirmasi Catatan</div>
                <div class="confirm-body">
                    <div class="confirm-row">
                        <span>💰 Nominal:</span>
                        <strong class="${typeClass}">${formatCurrency(data.amount)}</strong>
                    </div>
                    <div class="confirm-row">
                        <span>🏷️ Kategori:</span>
                        <strong>${data.category}</strong>
                    </div>
                    <div class="confirm-row">
                        <span>💳 Dompet:</span>
                        <strong>${wallet.name}</strong>
                    </div>
                    <div class="confirm-row">
                        <span>ℹ️ Info:</span>
                        <strong>${data.description}</strong>
                    </div>
                </div>
                <div class="confirm-actions mt-sm">
                    <button class="btn btn-primary btn-sm" onclick="executePendingTransaction()">✅ Simpan</button>
                    <button class="btn btn-secondary btn-sm" onclick="cancelPendingTransaction()">✕ Batal</button>
                </div>
            </div>
        `;
        
        const div = document.createElement('div');
        div.innerHTML = cardHtml;
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
}

async function executePendingTransaction() {
    if (!pendingTransaction) return;

    try {
        const tx = {
            ...pendingTransaction,
            date: getTodayString(),
            createdAt: new Date().toISOString()
        };

        await saveTransaction(tx);
        await updateWalletBalance(tx.walletId, tx.amount, tx.type);
        
        // UI Cleanup
        renderAssistantMessage(`✅ Berhasil mencatat ${tx.category} sebesar ${formatCurrency(tx.amount)} ke dompet Anda.`, 'bot');
        
        // Remove confirm card from view
        const cards = document.querySelectorAll('.transaction-confirm-card');
        cards.forEach(c => c.remove());

        pendingTransaction = null;
        
        // Update Finance UI if it's the active screen
        if (typeof updateGlobalBudgetUI === 'function') updateGlobalBudgetUI();
        if (typeof renderWalletList === 'function') renderWalletList();

    } catch (error) {
        console.error('Save Tx Error:', error);
        alert('Gagal menyimpan transaksi');
    }
}

function cancelPendingTransaction() {
    const cards = document.querySelectorAll('.transaction-confirm-card');
    cards.forEach(c => c.remove());
    renderAssistantMessage('Transaksi dibatalkan.', 'bot');
    pendingTransaction = null;
}
