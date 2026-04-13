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

ATURAN EKSTRAKSI (WAJIB):
1. "amount": Angka nominal (integer).
2. "type": "expense" (pengeluaran) atau "income" (pemasukan).
3. "category": WAJIB pilih salah satu dari daftar ini:
   - Pemasukan: "Gaji", "Profit Trading/Investasi", "Pemasukan Lainnya".
   - Pengeluaran: "Makan & Minum", "Kebutuhan Harian/Bulanan", "Transportasi", "Tagihan & Utilitas", "Tempat Tinggal", "Tabungan Nikah", "Edukasi & Pengembangan", "Hiburan & Nongkrong", "Sosial & Sedekah", "Lain-lain / Tak Terduga".
4. "description": Jika pengguna menyebut item spesifik (misal: "beli telur", "jajan bakso"), tulis item tersebut di sini. Jangan gunakan "Tanpa Nama".
5. "walletId": Pilih ID dompet yang paling cocok. Jika tidak disebutkan, gunakan "wallet_default".

PENTING: Jika pengguna bilang "beli telur", maka description="Beli telur" dan category="Makan & Minum" atau "Kebutuhan Harian/Bulanan".

KEMBALIKAN HANYA JSON:
{
  "amount": number,
  "type": "expense" | "income",
  "category": "string",
  "description": "string",
  "walletId": "string"
}`;

    try {
        const apiUrl = window.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        const response = await fetch(`${apiUrl}?key=${apiKey}`, {
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
        const parsedAmount = parseFloat(pendingTransaction.amount) || 0;
        if (parsedAmount <= 0) {
            alert('Nominal transaksi tidak valid!');
            return;
        }

        // Resolve walletId: AI often sends wallet NAME instead of ID
        let resolvedWalletId = pendingTransaction.walletId || 'wallet_default';
        const walletByIdCheck = await idbGet('wallets', resolvedWalletId);
        if (!walletByIdCheck) {
            const allWallets = await getWallets();
            const matchedWallet = allWallets.find(w => 
                w.name && w.name.toLowerCase().trim() === resolvedWalletId.toLowerCase().trim()
            );
            if (matchedWallet) {
                console.log(`🔍 Resolved wallet name '${resolvedWalletId}' → ID: ${matchedWallet.id}`);
                resolvedWalletId = matchedWallet.id;
            } else {
                resolvedWalletId = 'wallet_default';
            }
        }

        const tx = {
            id: generateId(),
            amount: parsedAmount,
            type: pendingTransaction.type || 'expense',
            category: pendingTransaction.category || 'Lain-lain',
            description: pendingTransaction.description || '',
            walletId: resolvedWalletId,
            date: getTodayString(),
            createdAt: new Date().toISOString()
        };

        console.log('💰 Saving pending transaction:', tx);

        await saveTransaction(tx);
        await updateWalletBalance(tx.walletId, tx.amount, tx.type);
        
        // UI Cleanup
        renderAssistantMessage(`✅ Berhasil mencatat ${tx.category} sebesar ${formatCurrency(tx.amount)} ke dompet Anda.`, 'bot');
        
        // Remove confirm card from view
        const cards = document.querySelectorAll('.transaction-confirm-card');
        cards.forEach(c => c.remove());

        pendingTransaction = null;
        
        // Update Finance UI
        if (typeof renderTransactionList === 'function') await renderTransactionList();
        if (typeof updateFinanceSummary === 'function') await updateFinanceSummary();
        if (typeof renderWalletListSummary === 'function') await renderWalletListSummary();
        if (typeof updateWalletSelectOptions === 'function') await updateWalletSelectOptions();
        if (typeof updateGlobalBudgetUI === 'function') await updateGlobalBudgetUI();

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
