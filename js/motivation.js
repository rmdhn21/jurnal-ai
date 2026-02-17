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

function initMotivation() {
    const container = document.getElementById('motivation-card');
    if (!container) return; // Silent fail if element doesn't exist

    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('motivation_date');
    let quoteIndex = parseInt(localStorage.getItem('motivation_index'));

    // Check if we need a new quote (new day or no stored quote)
    if (today !== storedDate || isNaN(quoteIndex)) {
        // Randomly select a new quote
        quoteIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);

        // Save to storage
        localStorage.setItem('motivation_date', today);
        localStorage.setItem('motivation_index', quoteIndex.toString());

        console.log('🔥 New Daily Motivation generated for:', today);
    } else {
        console.log('🔥 Loaded cached Motivation for:', today);
    }

    const quote = MOTIVATION_QUOTES[quoteIndex] || MOTIVATION_QUOTES[0];
    renderMotivation(container, quote);
}

function renderMotivation(container, quote) {
    const icon = quote.category === 'islamic' ? '☪️' : '🔥';

    container.innerHTML = `
        <div class="motivation-content">
            <div class="motivation-icon">${icon}</div>
            <p class="motivation-text">"${quote.text}"</p>
            <p class="motivation-author">— ${quote.author}</p>
        </div>
    `;
}
