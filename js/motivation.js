// ===== DAILY DISCIPLINE MOTIVATION =====

const MOTIVATION_QUOTES = [
    // Islamic Quotes
    {
        text: "Ilmu itu didapat dengan lidah yang gemar bertanya dan akal yang suka berpikir.",
        author: "Abdullah bin Abbas",
        category: "islamic"
    },
    {
        text: "Orang yang paling rugi adalah orang yang mampu melakukan kebaikan namun meninggalkannya.",
        author: "Ali bin Abi Thalib",
        category: "islamic"
    },
    {
        text: "Jika kamu tidak sanggup menahan lelahnya belajar, maka kamu harus sanggup menahan perihnya kebodohan.",
        author: "Imam Syafi'i",
        category: "islamic"
    },
    {
        text: "Waktu itu ibarat pedang, jika kau tidak menebasnya maka ialah yang akan menebasmu.",
        author: "Imam Syafi'i",
        category: "islamic"
    },
    {
        text: "Jangan menunda-nunda kebaikan, karena kematian tidak pernah menunda kedatangannya.",
        author: "Nasihat Ulama",
        category: "islamic"
    },

    // General Discipline & Productivity
    {
        text: "Motivasi adalah apa yang membuatmu memulai. Kebiasaan adalah sesuatu yang membuatmu terus maju.",
        author: "Jim Ryun",
        category: "general"
    },
    {
        text: "Disiplin adalah melakukan apa yang harus dilakukan, ketika harus dilakukan, meskipun kamu tidak ingin melakukannya.",
        author: "Anonim",
        category: "general"
    },
    {
        text: "Jangan menunggu mood yang baik. Kerjakan saja, mood akan mengikuti tindakanmu.",
        author: "Aturan 5 Menit",
        category: "general"
    },
    {
        text: "Sukses adalah jumlah dari usaha-usaha kecil yang diulang hari demi hari.",
        author: "Robert Collier",
        category: "general"
    },
    {
        text: "Fokuslah pada menjadi produktif, bukan sekadar sibuk.",
        author: "Tim Ferriss",
        category: "general"
    },
    {
        text: "Anda tidak bisa mengubah masa depan Anda, tetapi Anda bisa mengubah kebiasaan Anda. Dan pastinya kebiasaan Anda akan mengubah masa depan Anda.",
        author: "A.P.J. Abdul Kalam",
        category: "general"
    },
    {
        text: "Cara terbaik untuk menyelesaikan pekerjaan adalah dengan memulainya.",
        author: "Anonim",
        category: "general"
    }
];

async function initMotivation() {
    const container = document.getElementById('motivation-card');
    if (!container) return; // Silent fail if element doesn't exist

    // 1. Loading State (Animasi Saat Realtime Fetch)
    container.innerHTML = `
        <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">💡</div>
        <div style="position: relative; z-index: 1; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;"><span>💡</span> Motivasi Harian</h3>
            <span style="font-size: 0.65rem; font-weight: 800; color: #f59e0b; background: rgba(245, 158, 11, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3); text-transform: uppercase;">MINDSET</span>
        </div>
        <div class="motivation-content" style="position: relative; z-index: 1; text-align: center; padding: 15px;">
            <div class="loading-spinner" style="display: inline-block; margin-bottom: 15px;"></div>
            <p class="text-muted" style="margin: 0; font-size: 0.9em; animation: pulse 1.5s infinite;">Mencari kutipan penuh makna...</p>
        </div>
    `;

    try {
        // 2. Fetch data (Menggunakan API Quotes yang sudah CORS- friendly bawaan)
        // DummyJSON Random Quote API cukup konsisten dan cepat tanpa perlu blokir perantara AllOrigins
        const response = await fetch('https://dummyjson.com/quotes/random');

        if (!response.ok) throw new Error('Gagal menghubungi server kutipan.');

        const data = await response.json();

        if (data && data.quote) {
            renderMotivation(container, {
                text: data.quote,           // String kutipannya
                author: data.author,        // Penulisnya
                category: 'general'         // Agar icon jadi api (🔥)
            });
            return;
        } else {
            throw new Error('Struktur data balasan kosong.');
        }

    } catch (error) {
        console.error('🔥 ZenQuotes API gagal, memuat kutipan Offline/Fallback:', error);

        // 3. Graceful Fallback (Jika internet mati, acak daftar lokal bawaan)
        const fallbackIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
        const fallbackQuote = MOTIVATION_QUOTES[fallbackIndex];

        renderMotivation(container, fallbackQuote);
    }
}

function renderMotivation(container, quote) {
    const icon = quote.category === 'islamic' ? '☪️' : '🔥';

    container.innerHTML = `
        <div style="position: absolute; top: -10px; right: -10px; opacity: 0.03; font-size: 6rem; pointer-events: none;">${icon}</div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; position: relative; z-index: 1;">
            <h3 style="margin: 0; display: flex; align-items: center; gap: 8px;">
                <span>${icon}</span> Motivasi Harian
            </h3>
            <span style="font-size: 0.65rem; font-weight: 800; color: #f59e0b; background: rgba(245, 158, 11, 0.15); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(245, 158, 11, 0.3); text-transform: uppercase;">MINDSET</span>
        </div>
        <div class="motivation-content" style="position: relative; z-index: 1;">
            <p class="motivation-text" style="font-style: italic; margin-bottom: 8px;">"${quote.text}"</p>
            <p class="motivation-author" style="font-weight: bold; color: var(--primary);">— ${quote.author}</p>
        </div>
    `;
}
