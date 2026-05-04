// ===== FINANCE OCR (RECEIPT SCANNER) =====

document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-receipt-btn');
    const uploadInput = document.getElementById('receipt-upload');

    if (scanBtn && uploadInput) {
        scanBtn.addEventListener('click', () => {
            uploadInput.click();
        });

        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processReceiptImage(file);
            }
        });
    }
});

async function processReceiptImage(file) {
    const ocrLoading = document.getElementById('ocr-loading');
    const statusText = document.getElementById('ocr-status-text');
    const amountInput = document.getElementById('transaction-amount');
    const descInput = document.getElementById('transaction-desc');
    const ocrResultContainer = document.getElementById('ocr-result-container');
    const ocrResultText = document.getElementById('ocr-result-text');

    if (!ocrLoading || !statusText || !amountInput) return;

    // Show loading
    ocrLoading.classList.remove('hidden');
    if(ocrResultContainer) ocrResultContainer.classList.add('hidden');
    statusText.textContent = 'Menyiapkan AI OCR...';

    try {
        // Ensure Tesseract is loaded
        if (typeof Tesseract === 'undefined') {
            throw new Error("Library Tesseract.js belum dimuat. Periksa koneksi internet Anda.");
        }

        statusText.textContent = 'Membaca teks dari gambar... (Bisa memakan waktu beberapa detik)';
        
        // Run OCR
        const result = await Tesseract.recognize(
            file,
            'ind+eng', // Indonesian and English for better number & total recognition
            { logger: m => {
                if(m.status === 'recognizing text') {
                    statusText.textContent = `Membaca teks: ${Math.round(m.progress * 100)}%`;
                }
            }}
        );

        const text = result.data.text;
        console.log("OCR Result:", text);
        
        // Tampilkan teks asli OCR
        if (ocrResultContainer && ocrResultText) {
            ocrResultText.textContent = text;
            ocrResultContainer.classList.remove('hidden');
        }
        
        statusText.textContent = 'Menganalisis nominal total...';

        // Extract Total Amount
        const amount = extractTotalFromText(text);

        if (amount > 0) {
            amountInput.value = amount;
            if (descInput && !descInput.value) {
                descInput.value = 'Scan Struk';
                // Trigger smart category
                if(typeof handleSmartCategory === 'function') {
                    descInput.dispatchEvent(new Event('input'));
                }
            }
            alert(`✅ Berhasil menemukan nominal: ${typeof formatCurrency === 'function' ? formatCurrency(amount) : amount}`);
        } else {
            alert('⚠️ Gagal menemukan nominal "Total" di struk ini. Pastikan foto jelas dan terang.');
        }

    } catch (error) {
        console.error("OCR Error:", error);
        alert('❌ Terjadi kesalahan saat membaca struk: ' + error.message);
    } finally {
        ocrLoading.classList.add('hidden');
        // Reset file input so same file can be selected again
        document.getElementById('receipt-upload').value = '';
    }
}

function extractTotalFromText(text) {
    // 1. Look for lines containing "total", "amount", "jumlah", "ttl", "subtotal"
    const lines = text.split('\n');
    let possibleAmounts = [];

    const amountRegex = /(?:rp|idr)?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi;

    for (const line of lines) {
        const lowerLine = line.toLowerCase();
        // If line has a keyword indicating a total
        if (lowerLine.includes('total') || lowerLine.includes('jml') || lowerLine.includes('jumlah') || lowerLine.includes('amount') || lowerLine.includes('bayar')) {
            // Find numbers in this line
            const matches = [...line.matchAll(amountRegex)];
            for (const match of matches) {
                // Clean the number string
                let numStr = match[1].replace(/[^0-9]/g, '');
                let num = parseInt(numStr, 10);
                if (!isNaN(num) && num > 0) {
                    possibleAmounts.push(num);
                }
            }
        }
    }

    if (possibleAmounts.length > 0) {
        // Return the largest number found on lines with 'total'
        // This helps avoid picking up 'subtotal' if it's smaller, or tax.
        return Math.max(...possibleAmounts);
    }

    // 2. Fallback: if no keyword matched, just find the largest currency-like number
    // We assume the total is usually the largest number on the receipt
    const allMatches = [...text.matchAll(amountRegex)];
    for (const match of allMatches) {
        let numStr = match[1].replace(/[^0-9]/g, '');
        let num = parseInt(numStr, 10);
        if (!isNaN(num) && num > 0) {
            possibleAmounts.push(num);
        }
    }

    if (possibleAmounts.length > 0) {
        // Return the largest number overall
        return Math.max(...possibleAmounts);
    }

    return 0;
}
