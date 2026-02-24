// ===== NEWS API MODULE (REALTIME KRYPTO & SAHAM) =====

const NEWS_SOURCES = {
    crypto: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    etf: 'https://finance.yahoo.com/news/rssindex', // Yahoo Finance Top News
    ai: 'https://flipboard.com/topic/artificialintelligence.rss'
};

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Lama cache disimpan (1 Jam dalam millisecond)
const CACHE_EXPIRY_MS = 60 * 60 * 1000;

async function fetchNewsData(category = 'crypto') {
    const cached = getCachedNews(category);
    const now = new Date().getTime();

    // 1. Cek Offline Cache (Tampilkan versi tersimpan jika masih segar < 1 Jam, atau jika tidak ada koneksi)
    if (cached && cached.data && cached.timestamp) {
        if (now - cached.timestamp < CACHE_EXPIRY_MS || !navigator.onLine) {
            console.log(`[News] Menggunakan data cache untuk kategori: ${category}`);
            return cached.data;
        }
    }

    // 2. Jika Fetch diperlukan (online & cache expire)
    if (!navigator.onLine) {
        console.warn("[News] Offline mode, namun tidak ada cache yang tersisa.");
        return [];
    }

    try {
        console.log(`[News] Mengunduh berita terbaru dari internet (${category})...`);
        const targetRssUrl = encodeURIComponent(NEWS_SOURCES[category]);
        const response = await fetch(RSS2JSON_API + targetRssUrl);

        if (!response.ok) throw new Error('Gagal menghubungi server RSS2JSON');

        const data = await response.json();
        const articles = data.items || [];

        // 3. Simpan ke Cache
        saveCachedNews(category, articles, now);
        return articles;
    } catch (error) {
        console.error("[News API Error]", error);
        // Fallback ke cache meski sudah kadaluarsa (Graceful Fallback)
        if (cached && cached.data) {
            console.warn(`[News] Fallback ke cache usang untuk ${category} karena error jaringan.`);
            return cached.data;
        }
        return [];
    }
}

// ==== UI RENDERER ====
async function renderNewsTab(category = 'crypto') {
    const container = document.getElementById('news-content-list');
    const spinner = document.getElementById('news-loading-spinner');

    if (!container) return;

    // Bersihkan layar & Munculkan loading
    container.innerHTML = '';
    if (spinner) spinner.style.display = 'block';

    const articles = await fetchNewsData(category);

    // Matikan loading
    if (spinner) spinner.style.display = 'none';

    if (!articles || articles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>⚠️ Tidak dapat memuat berita saat ini. Periksa koneksi internet Anda atau coba lagi nanti.</p>
            </div>
        `;
        return;
    }

    articles.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        card.onclick = () => window.open(item.link, '_blank'); // Buka link di tab baru

        const pubDate = new Date(item.pubDate).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Ekstrak gambar (Kadang RSS2JSON menaruh gambar di thumbnail atau enclosure)
        let imgHtml = '';
        const imgUrl = item.thumbnail || (item.enclosure && item.enclosure.link);
        if (imgUrl) {
            imgHtml = `<div class="news-img" style="background-image: url('${imgUrl}');"></div>`;
        }

        card.innerHTML = `
            ${imgHtml}
            <div class="news-body">
                <h4 class="news-title">${item.title}</h4>
                <p class="news-meta">Masa Publikasi: ${pubDate} | Sumber Asli</p>
                <p class="news-desc">${item.description.replace(/<[^>]+>/g, '').substring(0, 100)}...</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==== INITIALIZATION ====
let isNewsInitialized = false;

function initNewsUI() {
    // Only fetch automatically the first time the tab is opened in a session
    if (!isNewsInitialized) {
        renderNewsTab('crypto');
        isNewsInitialized = true;
    }

    const btnCrypto = document.getElementById('btn-news-crypto');
    const btnEtf = document.getElementById('btn-news-etf');
    const btnAi = document.getElementById('btn-news-ai'); // AI Button

    if (btnCrypto && btnEtf && btnAi) {
        // Prevent duplicate listeners
        btnCrypto.replaceWith(btnCrypto.cloneNode(true));
        btnEtf.replaceWith(btnEtf.cloneNode(true));
        btnAi.replaceWith(btnAi.cloneNode(true));

        const newBtnCrypto = document.getElementById('btn-news-crypto');
        const newBtnEtf = document.getElementById('btn-news-etf');
        const newBtnAi = document.getElementById('btn-news-ai');

        const resetTabClasses = () => {
            newBtnCrypto.className = 'btn btn-secondary';
            newBtnEtf.className = 'btn btn-secondary';
            newBtnAi.className = 'btn btn-secondary';
        };

        newBtnCrypto.addEventListener('click', () => {
            resetTabClasses();
            newBtnCrypto.className = 'btn btn-primary';
            renderNewsTab('crypto');
        });

        newBtnEtf.addEventListener('click', () => {
            resetTabClasses();
            newBtnEtf.className = 'btn btn-primary';
            renderNewsTab('etf');
        });

        newBtnAi.addEventListener('click', () => {
            resetTabClasses();
            newBtnAi.className = 'btn btn-primary';
            renderNewsTab('ai');
        });
    }
}
