// ===== BRAIN BOOST MODULE =====
// Fitur: Fakta Unik, English, Math, Logic
// Gamification: +XP untuk setiap aktivitas
// V2: 2 Items per day, Sequential Order, Extensive Data
// V3: Infinite Story Math Generator

const BRAIN_DATA = {
    facts: [
        "Madu adalah satu-satunya makanan yang tidak pernah basi.",
        "Otak manusia menghasilkan listrik yang cukup untuk menyalakan lampu kecil.",
        "Jantung udang terletak di kepalanya.",
        "Sapi memiliki sahabat dan bisa stres jika dipisahkan.",
        "Air panas membeku lebih cepat daripada air dingin (Efek Mpemba).",
        "Lidah jerapah berwarna hitam kebiruan untuk mencegah terbakar sinar matahari.",
        "Kecoa bisa hidup beberapa minggu tanpa kepala.",
        "Terdapat lebih banyak bintang di alam semesta daripada butiran pasir di bumi.",
        "Gajah adalah satu-satunya mamalia yang tidak bisa melompat.",
        "Sidik lidah manusia itu unik, sama seperti sidik jari.",
        "Kupu-kupu merasakan rasa dengan kakinya.",
        "Mata burung unta lebih besar dari otaknya.",
        "Bumi adalah satu-satunya planet yang tidak dinamai berdasarkan dewa.",
        "Kelelawar selalu belok kiri saat keluar dari gua.",
        "Semut tidak pernah tidur dan tidak punya paru-paru.",
        "Cokelat bisa mematikan bagi anjing karena mengandung theobromine.",
        "Satu sendok teh madu adalah hasil kerja 12 lebah seumur hidup.",
        "Pisang memiliki DNA yang 50% mirip dengan manusia.",
        "Gurita memiliki tiga jantung.",
        "Kuda laut jantan yang melahirkan anak.",
        "Siput bisa tidur selama 3 tahun.",
        "Burung hantu tidak bisa menggerakkan bola matanya.",
        "Kucing menghabiskan 70% hidupnya untuk tidur.",
        "Air mata manusia memiliki struktur berbeda tergantung emosinya.",
        "Rata-rata manusia berjalan setara dengan 5 kali keliling bumi seumur hidup.",
        "Tulang paha manusia lebih kuat dari beton.",
        "Hidung manusia bisa mengingat 50.000 aroma berbeda.",
        "Tertawa 15 menit membakar kalori setara tidur 2 jam.",
        "Menulis dengan tangan meningkatkan memori lebih baik daripada mengetik.",
        "Otak manusia lebih aktif saat tidur daripada saat menonton TV.",
        "Bintang laut tidak memiliki otak.",
        "Ubur-ubur sudah ada sebelum dinosaurus.",
        "Gajah bisa mengenali dirinya di cermin.",
        "Lumba-lumba tidur dengan satu mata terbuka.",
        "Burung kolibri adalah satu-satunya burung yang bisa terbang mundur.",
        "Kura-kura bisa bernapas lewat pantatnya (kloaka).",
        "Buaya tidak bisa menjulurkan lidahnya.",
        "Jantung paus biru seukuran mobil kecil.",
        "Kanguru tidak bisa berjalan mundur.",
        "Kuda nil keringatnya berwarna merah muda.",
        "Platypus tidak memiliki lambung.",
        "Koala punya sidik jari yang mirip manusia.",
        "Burung flamingo makan dengan kepala terbalik.",
        "Babi tidak bisa menengadah ke langit.",
        "Kelelawar adalah satu-satunya mamalia yang bisa terbang.",
        "Beruang kutub sebenarnya berkulit hitam, bulunya transparan.",
        "Harimau memiliki kulit yang belang, bukan hanya bulunya.",
        "Kucing tidak bisa merasakan rasa manis.",
        "Anjing dalmatian lahir tanpa bintik-bintik.",
        "Gigi kelinci terus tumbuh seumur hidup.",
        "Tupai menanam ribuan pohon setiap tahun karena lupa menyimpan bijinya.",
        "Panda menghabiskan 12 jam sehari hanya untuk makan.",
        "Bunglon berubah warna sesuai mood, bukan hanya lingkungan.",
        "Gorilla bisa tertular flu manusia.",
        "Ikan mas koki punya ingatan lebih dari 3 detik.",
        "Burung unta bisa berlari lebih cepat dari kuda.",
        "Katak tidak minum air, mereka menyerapnya lewat kulit.",
        "Laba-laba tidak punya tulang.",
        "Kalajengking bisa menahan napas selama 6 hari.",
        "Rayap bekerja 24 jam sehari tanpa tidur.",
        "Lebah madu bisa mengenali wajah manusia.",
        "Nyamuk lebih suka menggigit orang bergolongan darah O.",
        "Lalat rumah mendengung di kunci F.",
        "Kutu bisa melompat 200 kali tinggi tubuhnya.",
        "Belalang mendengar dengan kakinya.",
        "Ulat memiliki lebih banyak otot daripada manusia.",
        "Cacing tanah punya 5 jantung.",
        "Siput punya 4 hidung.",
        "Bintang laut bisa menumbuhkan lengan baru.",
        "Kepiting punya gigi di perutnya.",
        "Hiu tidak punya tulang, hanya tulang rawan.",
        "Paus pembunuh sebenarnya adalah lumba-lumba.",
        "Kuda laut setia pada pasangannya seumur hidup.",
        "Ubur-ubur abadi (Turritopsis dohrnii) bisa hidup selamanya.",
        "Spons laut tidak punya otak, jantung, atau mata.",
        "Terumbu karang adalah hewan, bukan tumbuhan.",
        "Tiram bisa mengubah jenis kelaminnya.",
        "Mutiara terbentuk dari iritasi di dalam tiram.",
        "Lobster kencing lewat wajahnya.",
        "Udang mantis punya pukulan secepat peluru.",
        "Ikan badut semua lahir jantan.",
        "Belut listrik bisa menghasilkan listrik 600 volt.",
        "Piranha menggonggong saat ditangkap.",
        "Ikan terbang bisa meluncur di udara sejauh 200 meter.",
        "Ikan batu adalah ikan paling beracun di dunia.",
        "Gigi hiu terus tumbuh dan berganti.",
        "Paus sperma punya otak terbesar di dunia.",
        "Lumba-lumba punya nama panggilan unik untuk sesamanya.",
        "Anjing laut bisa menahan napas selama 2 jam.",
        "Pinguin melamar pasangannya dengan kerikil.",
        "Burung albatros bisa tidur sambil terbang.",
        "Elang bisa melihat kelinci dari jarak 3 km.",
        "Burung beo bisa hidup sampai 80 tahun.",
        "Burung kakak tua bisa memahami konsep angka nol.",
        "Ayam adalah keturunan terdekat T-Rex.",
        "Telur burung unta setara dengan 24 telur ayam.",
        "Burung merak jantan yang punya ekor indah.",
        "Burung hantu tidak punya gigi.",
        "Kelelawar vampir berbagi darah dengan temannya yang lapar.",
        "Komodo punya air liur beracun mematikan."
    ],
    vocab: [
        { word: "Serendipity", type: "Noun", meaning: "Keberuntungan menemukan sesuatu indah tak sengaja.", example: "Finding this cafe was serendipity." },
        { word: "Petrichor", type: "Noun", meaning: "Aroma tanah basah setelah hujan.", example: "I love the petrichor smell." },
        { word: "Ephemeral", type: "Adjective", meaning: "Berlangsung singkat; sementara.", example: "Fashion is ephemeral." },
        { word: "Resilient", type: "Adjective", meaning: "Tangguh; mampu bangkit.", example: "Humans are resilient." },
        { word: "Eloquent", type: "Adjective", meaning: "Fasih berbicara.", example: "She gave an eloquent speech." },
        { word: "Mellifluous", type: "Adjective", meaning: "Suara manis didengar.", example: "A mellifluous voice." },
        { word: "Ineffable", type: "Adjective", meaning: "Tak terlukiskan indahnya.", example: "Ineffable beauty." },
        { word: "Limerence", type: "Noun", meaning: "Obsesi romantis.", example: "It was just limerence." },
        { word: "Sonder", type: "Noun", meaning: "Sadar hidup orang lain sekompleks kita.", example: "A sense of sonder." },
        { word: "Ethereal", type: "Adjective", meaning: "Sangat halus; seperti surga.", example: "Ethereal beauty." },
        { word: "Pluviophile", type: "Noun", meaning: "Pencinta hujan.", example: "I am a pluviophile." },
        { word: "Solitude", type: "Noun", meaning: "Kesendirian yang damai.", example: "Enjoying the solitude." },
        { word: "Euphoria", type: "Noun", meaning: "Kebahagiaan intens.", example: "Pure euphoria." },
        { word: "Aurora", type: "Noun", meaning: "Cahaya fajar.", example: "Beautiful aurora." },
        { word: "Halcyon", type: "Adjective", meaning: "Tenang dan bahagia.", example: "Halcyon days." },
        { word: "Luminous", type: "Adjective", meaning: "Bercahaya.", example: "Luminous moon." },
        { word: "Vestige", type: "Noun", meaning: "Sisa-sisa jejak.", example: "Vestige of the past." },
        { word: "Zenith", type: "Noun", meaning: "Puncak kejayaan.", example: "Zenith of career." },
        { word: "Nostalgia", type: "Noun", meaning: "Rindu masa lalu.", example: "Deep nostalgia." },
        { word: "Epiphany", type: "Noun", meaning: "Pencerahan tiba-tiba.", example: "I had an epiphany." },
        { word: "Rendezvous", type: "Noun", meaning: "Pertemuan rahasia.", example: "Secret rendezvous." },
        { word: "Silhouette", type: "Noun", meaning: "Bayangan hitam.", example: "Dark silhouette." },
        { word: "Vibrant", type: "Adjective", meaning: "Penuh semangat/warna.", example: "Vibrant colors." },
        { word: "Whimsical", type: "Adjective", meaning: "Unik dan jenaka.", example: "Whimsical idea." },
        { word: "Zeal", type: "Noun", meaning: "Semangat membara.", example: "Work with zeal." },
        { word: "Alacrity", type: "Noun", meaning: "Kesiapsiagaan penuh semangat.", example: "Accepted with alacrity." },
        { word: "Benevolent", type: "Adjective", meaning: "Baik hati.", example: "Benevolent leader." },
        { word: "Cacophony", type: "Noun", meaning: "Campuran suara bising.", example: "Cacophony of horns." },
        { word: "Debacle", type: "Noun", meaning: "Kegagalan besar.", example: "Total debacle." },
        { word: "Enigma", type: "Noun", meaning: "Misteri/Teka-teki.", example: "He is an enigma." },
        { word: "Fastidious", type: "Adjective", meaning: "Sangat teliti/pemilih.", example: "Fastidious cleaner." },
        { word: "Gregarious", type: "Adjective", meaning: "Suka berteman/sosial.", example: "Gregarious person." },
        { word: "Harangue", type: "Noun", meaning: "Pidato galak/panjang.", example: "Long harangue." },
        { word: "Idyllic", type: "Adjective", meaning: "Sangat indah dan damai.", example: "Idyllic village." },
        { word: "Juxtapose", type: "Verb", meaning: "Menandingkan dua hal.", example: "Juxtapose old and new." },
        { word: "Kaleidoscope", type: "Noun", meaning: "Pola yang terus berubah.", example: "Kaleidoscope of colors." },
        { word: "Labyrinth", type: "Noun", meaning: "Labirin rumit.", example: "Lost in labyrinth." },
        { word: "Maverick", type: "Noun", meaning: "Orang yang berpikiran bebas.", example: "He is a maverick." },
        { word: "Nebulous", type: "Adjective", meaning: "Samar/kabur.", example: "Nebulous concept." },
        { word: "Obfuscate", type: "Verb", meaning: "Membingungkan/mengaburkan.", example: "Don't obfuscate the truth." },
        { word: "Panacea", type: "Noun", meaning: "Obat segala penyakit.", example: "No panacea for this." },
        { word: "Quixotic", type: "Adjective", meaning: "Idealis tapi tidak realistis.", example: "Quixotic dream." },
        { word: "Reverie", type: "Noun", meaning: "Lamunan indah.", example: "Lost in reverie." },
        { word: "Scintillating", type: "Adjective", meaning: "Berkilauan/sangat cerdas.", example: "Scintillating conversation." },
        { word: "Taciturn", type: "Adjective", meaning: "Pendiam.", example: "Taciturn man." },
        { word: "Ubiquitous", type: "Adjective", meaning: "Ada di mana-mana.", example: "Smartphones are ubiquitous." },
        { word: "Vacillate", type: "Verb", meaning: "Ragu-ragu.", example: "Vacillate between choices." },
        { word: "Wanderlust", type: "Noun", meaning: "Hasrat bepergian.", example: "Full of wanderlust." },
        { word: "Xenophobia", type: "Noun", meaning: "Takut pada orang asing.", example: "Combat xenophobia." },
        { word: "Yearn", type: "Verb", meaning: "Sangat mendambakan.", example: "Yearn for home." },
        { word: "Zephyr", type: "Noun", meaning: "Angin sepoi-sepoi barat.", example: "Gentle zephyr." },
        { word: "Aesthete", type: "Noun", meaning: "Penikmat keindahan.", example: "A true aesthete." },
        { word: "Bucolic", type: "Adjective", meaning: "Berkaitan dengan pedesaan.", example: "Bucolic scenery." },
        { word: "Clandestine", type: "Adjective", meaning: "Rahasia/sembunyi-sembunyi.", example: "Clandestine meeting." },
        { word: "Dalliances", type: "Noun", meaning: "Hubungan asmara singkat.", example: "Brief dalliances." },
        { word: "Effervescent", type: "Adjective", meaning: "Berbuis/bersemangat.", example: "Effervescent personality." },
        { word: "Felicity", type: "Noun", meaning: "Kebahagiaan besar.", example: "Domestic felicity." },
        { word: "Glamour", type: "Noun", meaning: "Pesona memikat.", example: "Hollywood glamour." },
        { word: "Hearth", type: "Noun", meaning: "Lantai perapian; rumah.", example: "Hearth and home." },
        { word: "Incandescent", type: "Adjective", meaning: "Pijar/bersinar terang.", example: "Incandescent bulb." },
        { word: "Jubilation", type: "Noun", meaning: "Sorak kegembiraan.", example: "Cries of jubilation." },
        { word: "Kismet", type: "Noun", meaning: "Takdir/nasib.", example: "It was kismet." },
        { word: "Lullaby", type: "Noun", meaning: "Lagu pengantar tidur.", example: "Sing a lullaby." },
        { word: "Murmur", type: "Verb", meaning: "Bergumam pelan.", example: "Murmur of the stream." },
        { word: "Nemesis", type: "Noun", meaning: "Musuh bebuyutan.", example: "Arch nemesis." },
        { word: "Opulent", type: "Adjective", meaning: "Mewah/kaya.", example: "Opulent lifestyle." },
        { word: "Paradigm", type: "Noun", meaning: "Model/pola pikir.", example: "Shift the paradigm." },
        { word: "Quintessential", type: "Adjective", meaning: "Contoh paling sempurna.", example: "Quintessential gentleman." },
        { word: "Resplendent", type: "Adjective", meaning: "Gemilang/cemerlang.", example: "Resplendent in gold." },
        { word: "Surreal", type: "Adjective", meaning: "Seperti mimpi/aneh.", example: "Surreal experience." },
        { word: "Tranquility", type: "Noun", meaning: "Ketenangan.", example: "Peace and tranquility." },
        { word: "Utopia", type: "Noun", meaning: "Tempat khayalan sempurna.", example: "Dream of utopia." },
        { word: "Vivacious", type: "Adjective", meaning: "Lincah/hidup.", example: "Vivacious girl." },
        { word: "Wistful", type: "Adjective", meaning: "Sedih/rindu.", example: "Wistful smile." },
        { word: "Xanadu", type: "Noun", meaning: "Tempat indah.", example: "My personal Xanadu." },
        { word: "Yonder", type: "Adverb", meaning: "Di sana (jauh).", example: "Over yonder." },
        { word: "Zen", type: "Adjective", meaning: "Tenang/meditatif.", example: "Zen state of mind." }
    ],
    // Logic: Qualitative riddles (Hard to generate procedurally, using static list)
    logic: [
        { q: "Ayah Mary punya 5 anak: 1. Nana, 2. Nene, 3. Nini, 4. Nono. Anak ke-5?", a: "Mary", hint: "Baca soal lagi." },
        { q: "Apa yang naik tapi tak pernah turun?", a: "Umur", hint: "Tiap tahun nambah." },
        { q: "Makin banyak diambil, makin besar.", a: "Lubang", hint: "Di tanah." },
        { q: "Punya leher tanpa kepala.", a: "Baju", hint: "Pakaian." },
        { q: "Harus pecah sebelum dipakai.", a: "Telur", hint: "Masak." },
        { q: "Bulan dengan 28 hari?", a: "Semua", hint: "Jan-Des." },
        { q: "Penuh lubang tapi nampung air.", a: "Spons", hint: "Cuci piring." },
        { q: "Selalu datang tak pernah tiba.", a: "Besok", hint: "Waktu." },
        { q: "Bisa ditangkap tak bisa dilempar.", a: "Flu", hint: "Sakit." },
        { q: "Salip posisi ke-2, kamu posisi?", a: "Dua", hint: "Bukan satu." },
        { q: "Punya 1 mata tak bisa lihat.", a: "Jarum", hint: "Benang." },
        { q: "Turun tak pernah naik.", a: "Hujan", hint: "Air." },
        { q: "Makin dibiarkan makin basah.", a: "Es Batu", hint: "Meleleh." },
        { q: "Punya kaki tak bisa jalan.", a: "Meja", hint: "Perabot." },
        { q: "Ringan tapi tak kuat ditahan lama.", a: "Napas", hint: "Udara." },
        { q: "Milikmu tapi orang lain sering pakai.", a: "Nama", hint: "Panggilan." },
        { q: "Punya kota, gunung, air, tapi tak ada kehidupan.", a: "Peta", hint: "Gambar." },
        { q: "Hanya satu warna, tapi banyak ukuran, nempel terus saat panas.", a: "Bayangan", hint: "Cahaya." },
        { q: "Bisa dipegang tangan kanan, tapi tidak tangan kiri.", a: "Siku kiri", hint: "Tubuh." },
        { q: "Punya banyak gigi tapi tak bisa gigit.", a: "Sisir", hint: "Rambut." },
        { q: "Apa yang bisa keliling dunia tapi tetap di pojok?", a: "Prangko", hint: "Surat." },
        { q: "Punya 13 jantung tapi tak hidup.", a: "Kartu remi", hint: "Permainan." },
        { q: "Masuk satu lubang, keluar dua lubang.", a: "Celana", hint: "Pakaian." },
        { q: "Kalau disebut, dia hilang.", a: "Diam", hint: "Suara." },
        { q: "Punya bank tapi tak ada uang.", a: "Darah", hint: "Bank Darah." },
        { q: "Bisa memotong tanpa pisau.", a: "Angin", hint: "Tajam." },
        { q: "Punya kasur tapi tak pernah tidur.", a: "Sungai", hint: "Aliran." },
        { q: "Bisa menyatukan dua orang tapi hanya menyentuh satu.", a: "Cincin kawin", hint: "Jari." },
        { q: "Apa yang punya kepala dan ekor tapi tidak punya tubuh?", a: "Koin", hint: "Uang." },
        { q: "Apa yang bisa patah tanpa disentuh?", a: "Janji", hint: "Ucapan." },
        { q: "Apa yang punya 88 kunci tapi tidak bisa membuka pintu?", a: "Piano", hint: "Musik." },
        { q: "Apa yang punya banyak cincin tapi tidak punya jari?", a: "Telepon", hint: "Kring." },
        { q: "Apa yang punya jempol dan jari tapi tidak hidup?", a: "Sarung tangan", hint: "Pakaian." },
        { q: "Apa yang basah saat mengeringkan?", a: "Handuk", hint: "Mandi." },
        { q: "Apa yang punya mata tapi tidak bisa menangis?", a: "Badai", hint: "Mata badai." },
        { q: "Apa yang punya kaki di kepala?", a: "Kutu", hint: "Rambut." },
        { q: "Apa yang punya tulang belakang tapi tidak punya tulang?", a: "Buku", hint: "Bacaan." },
        { q: "Apa yang lari tapi tidak punya kaki?", a: "Air", hint: "Sungai." },
        { q: "Apa yang terbang tanpa sayap?", a: "Waktu", hint: "Cepat berlalu." },
        { q: "Apa yang punya kulit tapi tidak punya daging?", a: "Drum", hint: "Musik." },
        { q: "Apa yang punya wajah dan dua tangan tapi tidak punya lengan dan kaki?", a: "Jam", hint: "Waktu." },
        { q: "Apa yang bisa diisi tapi tidak bisa penuh?", a: "Otak", hint: "Ilmu." },
        { q: "Apa yang punya banyak lubang tapi kuat?", a: "Jaring", hint: "Ikan." },
        { q: "Apa yang bisa dimakan tapi tidak bisa ditelan?", a: "Piring", hint: "Alat makan." },
        { q: "Apa yang punya banyak mata tapi tidak bisa melihat?", a: "Nanas", hint: "Buah." },
        { q: "Apa yang punya banyak daun tapi tidak punya batang?", a: "Buku", hint: "Halaman." },
        { q: "Apa yang punya banyak gigi tapi tidak pernah sakit gigi?", a: "Ritsleting", hint: "Celana." },
        { q: "Apa yang punya banyak kunci tapi tidak bisa membuka kunci?", a: "Kunci jawaban", hint: "Ujian." },
        { q: "Apa yang punya banyak air tapi tidak pernah basah?", a: "Peta", hint: "Laut." },
        { q: "Apa yang punya banyak cerita tapi tidak bisa bicara?", a: "Buku sejarah", hint: "Masa lalu." }
    ]
};

// Math data is now generated procedurally

let currentBrainState = {
    counters: {
        fact: 0,
        vocab: 0,
        logic: 0
    },
    activeMathQuestion: null, // Stores current generated math question
    mathCounter: 0,  // Counts total math solved
    dailyProgress: {
        fact: 0,
        vocab: 0,
        math: 0,
        logic: 0
    },
    today: ''
};

function initBrainBoost() {
    console.log('🧠 Brain Boost Init Started');
    try {
        loadBrainState();
        renderBrainBoostCard();
        console.log('🧠 Brain Boost Init Success');
    } catch (e) {
        console.error('🧠 Brain Boost Init Failed:', e);
        const container = document.getElementById('brain-content');
        if (container) container.innerHTML = '<p class="text-danger">Gagal memuat data. Silakan refresh.</p>';
    }
}

function loadBrainState() {
    const today = new Date().toDateString();
    const savedState = JSON.parse(localStorage.getItem('brain_state_v3'));

    if (!savedState) {
        currentBrainState.today = today;
        saveBrainState();
    } else {
        currentBrainState = savedState;

        if (currentBrainState.today !== today) {
            // New day reset
            currentBrainState.dailyProgress = { fact: 0, vocab: 0, math: 0, logic: 0 };
            currentBrainState.today = today;
            // Note: activeMathQuestion is KEPT to prevent rerolling by waiting a day.
            // Or maybe we should clear it? Let's keep it.
            saveBrainState();
        }
    }
}

function saveBrainState() {
    localStorage.setItem('brain_state_v3', JSON.stringify(currentBrainState));
}

// ===== INFINITE MATH GENERATOR =====
function generateMathProblem() {
    // Types: 0=Shopping, 1=Age, 2=Series, 3=Time/Speed, 4=Combination
    const type = Math.floor(Math.random() * 5);
    let q, a;

    if (type === 0) { // Shopping Logic
        const items = ['apel', 'buku', 'pensil', 'roti', 'jeruk'];
        const item = items[Math.floor(Math.random() * items.length)];
        const price = (Math.floor(Math.random() * 5) + 2) * 1000; // 2000 - 6000
        const qty = Math.floor(Math.random() * 5) + 3; // 3 - 7
        const pay = Math.ceil((price * qty) / 10000) * 10000; // Next 10k

        // Scenario 1: Total Cost
        if (Math.random() > 0.5) {
            q = `Budi membeli ${qty} ${item} dengan harga Rp${price}/buah. Berapa total yang harus dibayar? (Tulis angka saja)`;
            a = price * qty;
        } else {
            // Scenario 2: Change
            if (pay === price * qty) pay += 10000; // Ensure logic for change
            q = `Siti membeli ${qty} ${item} seharga Rp${price}/buah. Ia membayar dengan Rp${pay}. Berapa kembaliannya?`;
            a = pay - (price * qty);
        }

    } else if (type === 1) { // Age Logic
        const diff = Math.floor(Math.random() * 20) + 20; // 20 - 40
        const ratio = Math.floor(Math.random() * 3) + 2; // 2x, 3x, 4x
        // Father = Son * ratio
        // Father - Son = diff
        // (Son * ratio) - Son = diff
        // Son * (ratio - 1) = diff
        // Son = diff / (ratio - 1) -> must be integer
        // Let's reverse: Generate Son age first
        const son = Math.floor(Math.random() * 10) + 5; // 5 - 15
        const father = son * ratio;
        const yearsAgo = Math.floor(Math.random() * 3) + 1;

        if (Math.random() > 0.5) {
            q = `Umur Ayah adalah ${ratio} kali umur Budi. Jika umur Budi ${son} tahun, berapa umur Ayah?`;
            a = father;
        } else {
            q = `Umur Ibu ${ratio} kali umur Ani. Jika umur Ani ${son} tahun, berapa umur Ibu ${yearsAgo} tahun yang lalu?`;
            a = (son * ratio) - yearsAgo;
        }

    } else if (type === 2) { // Number Series
        const start = Math.floor(Math.random() * 10) + 1;
        const jump = Math.floor(Math.random() * 5) + 2;
        const seriesType = Math.random(); // 0-0.3: +jump, 0.3-0.6: *jump, 0.6-1: +incrementing

        let seq = [];
        let val = start;
        let answer = 0;

        if (seriesType < 0.4) { // Arithmetic
            for (let i = 0; i < 4; i++) { seq.push(val); val += jump; }
            answer = val;
        } else if (seriesType < 0.7) { // Geometric (small jump)
            let mJump = Math.floor(Math.random() * 2) + 2; // 2 or 3
            val = Math.floor(Math.random() * 5) + 2;
            for (let i = 0; i < 4; i++) { seq.push(val); val *= mJump; }
            answer = val;
        } else { // Fibonacci-ish or Incrementing jump (1, 3, 6, 10...)
            let inc = 1;
            val = start;
            for (let i = 0; i < 4; i++) { seq.push(val); val += inc; inc++; }
            answer = val;
        }

        q = `Lanjutkan pola berikut: ${seq.join(', ')}, ... ?`;
        a = answer;

    } else if (type === 3) { // Time/Speed/Distance
        const speed = (Math.floor(Math.random() * 6) + 4) * 10; // 40 - 90 km/h
        const time = Math.floor(Math.random() * 4) + 2; // 2 - 5 hours

        if (Math.random() > 0.5) {
            q = `Sebuah mobil melaju dengan kecepatan ${speed} km/jam selama ${time} jam. Berapa jarak yang ditempuh (km)?`;
            a = speed * time;
        } else {
            const distance = speed * time;
            q = `Untuk menempuh jarak ${distance} km, kereta membutuhkan waktu ${time} jam. Berapa kecepatan rata-ratanya (km/jam)?`;
            a = speed;
        }

    } else { // Combination (Simple Clothes)
        const shirts = Math.floor(Math.random() * 5) + 3;
        const pants = Math.floor(Math.random() * 4) + 2;
        const shoes = Math.floor(Math.random() * 2) + 1;

        q = `Budi memiliki ${shirts} kemeja, ${pants} celana, dan ${shoes} pasang sepatu. Berapa banyak kombinasi pakaian yang bisa ia pakai?`;
        a = shirts * pants * shoes;
    }

    return { q, a };
}

function renderBrainBoostCard() {
    const container = document.getElementById('brain-content');
    if (!container) {
        console.error('🧠 Brain Boost Error: Container #brain-content not found!');
        return;
    }

    const activeTab = document.querySelector('.brain-tab.active')?.id.replace('tab-', '') || 'fact';
    console.log('🧠 Brain Boost Rendering Tab:', activeTab);
    switchTab(activeTab);
}

function switchTab(tab) {
    const contentDiv = document.getElementById('brain-content');
    const dailyCount = currentBrainState.dailyProgress[tab];

    // Update Tab UI
    document.querySelectorAll('.brain-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${tab}`)?.classList.add('active');

    // Check Daily Limit
    if (dailyCount >= 2) {
        contentDiv.innerHTML = `
            <div class="brain-item fade-in">
                <div class="brain-icon">🎉</div>
                <p class="brain-text">Hebat! Kamu sudah menyelesaikan 2 tantangan ${tab} hari ini.</p>
                <div class="text-muted"><small>Kembali lagi besok!</small></div>
            </div>
        `;
        return;
    }

    const progressText = dailyCount === 0 ? "Tantangan 1/2" : "Tantangan 2/2";

    if (tab === 'math') {
        // Check if we need a new question
        if (!currentBrainState.activeMathQuestion) {
            currentBrainState.activeMathQuestion = generateMathProblem();
            saveBrainState();
        }

        const item = currentBrainState.activeMathQuestion;

        contentDiv.innerHTML = `
            <div class="brain-item fade-in">
                <div class="mb-sm"><span class="badge-ai">${progressText}</span></div>
                <div class="brain-question">${item.q}</div>
                <div class="input-group mt-sm">
                    <input type="number" id="math-answer" class="form-input" placeholder="Jawab (Angka)...">
                    <button id="math-submit-btn" class="btn btn-primary" onclick="checkMathAnswer()">Jawab</button>
                </div>
                <div id="math-feedback" class="mt-sm"></div>
            </div>
        `;
    } else {
        // Logic for others remains same (Sequential)
        const globalCount = currentBrainState.counters[tab];

        // Fix: Map 'fact' to 'facts' (plural in data source)
        const dataKey = tab === 'fact' ? 'facts' : tab;
        const dataList = BRAIN_DATA[dataKey];

        if (!dataList) {
            console.error(`🧠 Brain Boost Error: Data for '${tab}' (key: ${dataKey}) not found!`);
            contentDiv.innerHTML = '<p class="text-danger">Data error. Silakan refresh.</p>';
            return;
        }

        const currentIndex = (globalCount) % dataList.length;
        const item = dataList[currentIndex];

        if (tab === 'fact') {
            contentDiv.innerHTML = `
                <div class="brain-item fade-in">
                    <div class="mb-sm"><span class="badge-ai">${progressText}</span></div>
                    <div class="brain-icon">💡</div>
                    <p class="brain-text">"${item}"</p>
                    <button id="fact-btn" class="btn btn-primary mt-sm" onclick="markRead('fact')">
                        Saya Jadi Lebih Pintar (+5 XP)
                    </button>
                </div>
            `;
        } else if (tab === 'vocab') {
            contentDiv.innerHTML = `
                <div class="brain-item fade-in">
                    <div class="mb-sm"><span class="badge-ai">${progressText}</span></div>
                    <div class="brain-header">
                        <span class="vocab-word">${item.word}</span>
                        <span class="vocab-type">${item.type}</span>
                    </div>
                    <p class="vocab-meaning">${item.meaning}</p>
                    <p class="vocab-example">"${item.example}"</p>
                    <button id="vocab-btn" class="btn btn-primary mt-sm" onclick="markRead('vocab')">
                        Mengerti (+5 XP)
                    </button>
                </div>
            `;
        } else if (tab === 'logic') {
            contentDiv.innerHTML = `
                <div class="brain-item fade-in">
                    <div class="mb-sm"><span class="badge-ai">${progressText}</span></div>
                    <p class="brain-text small">${item.q}</p>
                    <div class="input-group mt-sm">
                        <input type="text" id="logic-answer" class="form-input" placeholder="Jawab...">
                        <button id="logic-submit-btn" class="btn btn-primary" onclick="checkLogicAnswer()">Jawab</button>
                    </div>
                    <div class="mt-xs"><small class="text-muted">Hint: ${item.hint}</small></div>
                    <div id="logic-feedback" class="mt-sm"></div>
                </div>
            `;
        }
    }
}

function markRead(type) {
    if (typeof addXP === 'function') addXP(5, `Brain Boost: ${type} read`);
    advanceState(type);
}

function checkMathAnswer() {
    const input = parseFloat(document.getElementById('math-answer').value);
    const problem = currentBrainState.activeMathQuestion;

    if (input === problem.a) {
        if (typeof addXP === 'function') addXP(15, `Brain Boost: Math solved`);
        document.getElementById('math-feedback').innerHTML = '<span class="text-success">✨ Benar! (+15 XP)</span>';
        currentBrainState.activeMathQuestion = null; // Clear question for next time
        currentBrainState.mathCounter++;
        saveBrainState();
        setTimeout(() => advanceDaily('math'), 1000);
    } else {
        document.getElementById('math-feedback').innerHTML = '<span class="text-danger">❌ Coba lagi!</span>';
        shakeElement(document.getElementById('math-answer'));
    }
}

function checkLogicAnswer() {
    const input = document.getElementById('logic-answer').value;
    const globalCount = currentBrainState.counters.logic;
    const puzzle = BRAIN_DATA.logic[globalCount % BRAIN_DATA.logic.length];

    if (input.toLowerCase().includes(puzzle.a.toLowerCase())) {
        if (typeof addXP === 'function') addXP(15, `Brain Boost: Logic solved`);
        document.getElementById('logic-feedback').innerHTML = '<span class="text-success">✨ Benar! (+15 XP)</span>';
        setTimeout(() => advanceState('logic'), 1000);
    } else {
        document.getElementById('logic-feedback').innerHTML = '<span class="text-danger">❌ Coba lagi!</span>';
        shakeElement(document.getElementById('logic-answer'));
    }
}

// For Fact, Vocab, Logic
function advanceState(type) {
    currentBrainState.counters[type]++;
    advanceDaily(type);
}

// Common Daily Advance
function advanceDaily(type) {
    currentBrainState.dailyProgress[type]++;
    saveBrainState();
    switchTab(type);
}

function shakeElement(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 400);
}
