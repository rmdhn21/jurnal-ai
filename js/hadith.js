// ===== DAILY HADITH MODULE =====
// Sumber: Hadits Arbain Nawawi (42 Hadits Pilihan)

const HADITH_ARBAIN = [
    {
        no: 1,
        title: "Niat adalah Ukuran",
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
        text: "Sesungguhnya amalan itu tergantung pada niatnya, dan setiap orang akan mendapatkan apa yang ia niatkan.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 2,
        title: "Iman, Islam, dan Ihsan",
        text: "Islam dibangun di atas lima perkara: bersaksi bahwa tidak ada Ilah yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, mendirikan shalat, menunaikan zakat, haji ke Baitullah, dan puasa Ramadhan.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 3,
        title: "Rukun Islam",
        text: "Islam dibangun di atas lima perkara: Syahadat bahwa tidak ada Tuhan selain Allah dan Muhammad utusan Allah, mendirikan shalat, menunaikan zakat, haji, dan puasa Ramadhan.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 4,
        title: "Takdir Penciptaan Manusia",
        text: "Sesungguhnya salah seorang di antara kalian dikumpulkan penciptaannya di perut ibunya selama empat puluh hari sebagai nuthfah, kemudian menjadi 'alaqah (segumpal darah) selama itu pula, kemudian menjadi mudhgah (segumpal daging) selama itu pula...",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 5,
        title: "Larangan Bid'ah",
        text: "Barangsiapa yang mengada-adakan (sesuatu yang baru) dalam urusan (agama) kami ini yang bukan berasal darinya, maka hal itu tertolak.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 6,
        title: "Halal dan Haram Jelas",
        text: "Sesungguhnya yang halal itu jelas dan yang haram itu jelas, dan di antara keduanya terdapat perkara-perkara syubhat (samar) yang tidak diketahui oleh banyak orang.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 7,
        title: "Agama adalah Nasihat",
        text: "Agama itu adalah nasihat. Kami bertanya: 'Untuk siapa?' Beliau bersabda: 'Untuk Allah, Kitab-Nya, Rasul-Nya, para pemimpin kaum muslimin, dan orang-orang awam mereka.'",
        source: "HR. Muslim"
    },
    {
        no: 8,
        title: "Kehormatan Muslim",
        text: "Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tidak ada Ilah yang berhak disembah selain Allah dan Muhammad adalah Rasulullah, mendirikan shalat, dan menunaikan zakat.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 9,
        title: "Kerjakan Semampunya",
        text: "Apa yang aku larang bagi kalian, maka jauhilah. Dan apa yang aku perintahkan kepada kalian, maka kerjakanlah semampu kalian.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 10,
        title: "Allah Maha Baik",
        text: "Sesungguhnya Allah itu Maha Baik (Thayyib), Dia tidak menerima kecuali yang baik. Dan sesungguhnya Allah memerintahkan kepada orang-orang mukmin seperti apa yang Dia perintahkan kepada para Rasul.",
        source: "HR. Muslim"
    },
    {
        no: 11,
        title: "Tinggalkan Keraguan",
        text: "Tinggalkanlah apa yang meragukanmu kepada apa yang tidak meragukanmu.",
        source: "HR. Tirmidzi & Nasa'i"
    },
    {
        no: 12,
        title: "Meninggalkan yang Tak Berguna",
        text: "Di antara tanda kebaikan Islam seseorang adalah meninggalkan hal-hal yang tidak bermanfaat baginya.",
        source: "HR. Tirmidzi"
    },
    {
        no: 13,
        title: "Mencintai Saudara",
        text: "Tidaklah beriman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 14,
        title: "Darah Muslim",
        text: "Tidak halal darah seorang muslim yang bersaksi bahwa tidak ada Ilah yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, kecuali karena salah satu dari tiga sebab...",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 15,
        title: "Berkata Baik atau Diam",
        text: "Barangsiapa yang beriman kepada Allah dan Hari Akhir, maka hendaklah ia berkata baik atau diam.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 16,
        title: "Jangan Marah",
        text: "Seorang laki-laki berkata kepada Nabi SAW: 'Berilah aku wasiat.' Beliau bersabda: 'Jangan marah.' Orang itu mengulanginya berkali-kali, namun beliau tetap bersabda: 'Jangan marah.'",
        source: "HR. Bukhari"
    },
    {
        no: 17,
        title: "Berbuat Ihsan",
        text: "Sesungguhnya Allah mewajibkan berbuat ihsan (baik) dalam segala hal.",
        source: "HR. Muslim"
    },
    {
        no: 18,
        title: "Takwa di Mana Saja",
        text: "Bertakwalah kepada Allah di mana saja engkau berada, dan iringilah keburukan dengan kebaikan, niscaya kebaikan itu akan menghapusnya. Dan bergaullah dengan manusia dengan akhlak yang mulia.",
        source: "HR. Tirmidzi"
    },
    {
        no: 19,
        title: "Jagalah Allah",
        text: "Jagalah Allah, niscaya Dia akan menjagamu. Jagalah Allah, niscaya engkau akan mendapati-Nya di hadapanmu.",
        source: "HR. Tirmidzi"
    },
    {
        no: 20,
        title: "Sifat Malu",
        text: "Sesungguhnya salah satu perkara yang telah diketahui manusia dari perkataan kenabian terdahulu adalah: 'Jika engkau tidak malu, maka berbuatlah sesukamu.'",
        source: "HR. Bukhari"
    },
    {
        no: 21,
        title: "Istiqamah",
        text: "Katakanlah: 'Aku beriman kepada Allah', kemudian beristiqamahlah.",
        source: "HR. Muslim"
    },
    {
        no: 22,
        title: "Jalan Menuju Surga",
        text: "Apakah pendapatmu jika aku shalat lima waktu, puasa Ramadhan, menghalalkan yang halal, dan mengharamkan yang haram, serta tidak menambah sesuatu pun atas hal itu, apakah aku akan masuk surga? Beliau menjawab: 'Ya'.",
        source: "HR. Muslim"
    },
    {
        no: 23,
        title: "Kesucian adalah Sebagian Iman",
        text: "Kesucian itu adalah setengah dari iman. Alhamdulillah memenuhi timbangan. Subhanallah dan Alhamdulillah memenuhi antara langit dan bumi.",
        source: "HR. Muslim"
    },
    {
        no: 24,
        title: "Larang Dzalim",
        text: "Wahai hamba-Ku, sesungguhnya Aku telah mengharamkan kedzaliman atas diri-Ku dan Aku menjadikannya haram di antara kalian, maka janganlah kalian saling mendzalimi.",
        source: "HR. Muslim"
    },
    {
        no: 25,
        title: "Sedekah yang Luas",
        text: "Setiap tasbih adalah sedekah, setiap takbir adalah sedekah, setiap tahmid adalah sedekah, setiap tahlil adalah sedekah, menyeru kepada kebaikan adalah sedekah...",
        source: "HR. Muslim"
    },
    {
        no: 26,
        title: "Sedekah Setiap Ruas Tulang",
        text: "Setiap ruas tulang manusia wajib disedekahi setiap hari di mana matahari terbit. Engkau mendamaikan antara dua orang adalah sedekah...",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 27,
        title: "Kebaikan adalah Akhlak Mulia",
        text: "Kebaikan itu adalah akhlak yang mulia, sedangkan dosa adalah apa yang menggelisahkan jiwamu dan engkau benci jika manusia mengetahuinya.",
        source: "HR. Muslim"
    },
    {
        no: 28,
        title: "Wasiat Ketaatan",
        text: "Aku wasiatkan kepada kalian untuk bertakwa kepada Allah, mendengar dan taat (kepada pemimpin) walaupun ia seorang budak.",
        source: "HR. Abu Daud & Tirmidzi"
    },
    {
        no: 29,
        title: "Pintu Kebaikan",
        text: "Maukah aku tunjukkan kepadamu pintu-pintu kebaikan? Puasa adalah perisai, sedekah itu memadamkan kesalahan sebagaimana air memadamkan api.",
        source: "HR. Tirmidzi"
    },
    {
        no: 30,
        title: "Melaksanakan Kewajiban Allah",
        text: "Sesungguhnya Allah telah mewajibkan beberapa kewajiban, maka janganlah kalian menyia-nyiakannya. Dan Dia telah menetapkan batasan-batasan, maka janganlah kalian melanggarnya.",
        source: "HR. Daruquthni"
    },
    {
        no: 31,
        title: "Zuhud",
        text: "Zuhudlah terhadap dunia, niscaya Allah akan mencintaimu. Dan zuhudlah terhadap apa yang ada di tangan manusia, niscaya manusia akan mencintaimu.",
        source: "HR. Ibnu Majah"
    },
    {
        no: 32,
        title: "Tidak Boleh Membahayakan",
        text: "Tidak boleh melakukan perbuatan yang memudharatkan (membahayakan) diri sendiri maupun orang lain.",
        source: "HR. Ibnu Majah & Daruquthni"
    },
    {
        no: 33,
        title: "Tuduhan Memerlukan Bukti",
        text: "Seandainya manusia diberi hak berdasarkan dakwaan (tuduhan) mereka semata, niscaya orang-orang akan menuntut harta dan darah suatu kaum. Namun, bukti wajib bagi penuduh, dan sumpah bagi yang mengingkari.",
        source: "HR. Baihaqi"
    },
    {
        no: 34,
        title: "Mencegah Kemungkaran",
        text: "Barangsiapa di antara kalian melihat kemungkaran, maka hendaklah ia mengubahnya dengan tangannya. Jika tidak mampu, maka dengan lisannya. Jika tidak mampu, maka dengan hatinya.",
        source: "HR. Muslim"
    },
    {
        no: 35,
        title: "Persaudaraan Muslim",
        text: "Janganlah kalian saling hasad, saling menipu, saling membenci, saling membelakangi, dan janganlah sebagian kalian menjual di atas penjualan sebagian yang lain.",
        source: "HR. Muslim"
    },
    {
        no: 36,
        title: "Membantu Sesama",
        text: "Barangsiapa yang melapangkan satu kesusahan dunia dari seorang mukmin, maka Allah akan melapangkan darinya satu kesusahan di hari kiamat.",
        source: "HR. Muslim"
    },
    {
        no: 37,
        title: "Pahala Kebaikan",
        text: "Sesungguhnya Allah mencatat kebaikan dan keburukan. Barangsiapa berniat melakukan kebaikan lalu tidak mengerjakannya, maka Allah mencatatnya sebagai satu kebaikan sempurna.",
        source: "HR. Bukhari & Muslim"
    },
    {
        no: 38,
        title: "Wali Allah",
        text: "Sesungguhnya Allah berfirman: 'Barangsiapa yang memusuhi wali-Ku, maka Aku mengumumkan perang terhadapnya.'",
        source: "HR. Bukhari"
    },
    {
        no: 39,
        title: "Dimaafkan Kesalahan",
        text: "Sesungguhnya Allah memaafkan umatku karena (tidak sengaja) salah, lupa, dan apa yang dipaksakan kepada mereka.",
        source: "HR. Ibnu Majah"
    },
    {
        no: 40,
        title: "Jadilah Orang Asing",
        text: "Jadilah engkau di dunia ini seakan-akan orang asing atau seorang pengembara.",
        source: "HR. Bukhari"
    },
    {
        no: 41,
        title: "Mengikuti Hawa Nafsu",
        text: "Tidak beriman salah seorang di antara kalian hingga hawa nafsunya mengikuti apa yang aku bawa.",
        source: "HR. Hakim (Hasan Sahih)"
    },
    {
        no: 42,
        title: "Ampunan Allah",
        text: "Wahai anak Adam, sesungguhnya selama engkau berdoa kepada-Ku dan berharap kepada-Ku, Aku akan mengampuni dosa yang ada padamu, dan Aku tidak peduli.",
        source: "HR. Tirmidzi"
    }
];

function initHadithCard() {
    console.log('✨ Hadith Init Started');
    try {
        const today = new Date().toDateString(); // Format: "Mon Jan 01 2024"
        const savedDate = localStorage.getItem('hadith_date');
        let hadithIndex = localStorage.getItem('hadith_index');

        // Jika tanggal berubah atau belum ada data, pilih hadits baru
        if (savedDate !== today || !hadithIndex) {
            // Pilih secara acak (atau bisa sequential: (lastIndex + 1) % length)
            hadithIndex = Math.floor(Math.random() * HADITH_ARBAIN.length);

            localStorage.setItem('hadith_date', today);
            localStorage.setItem('hadith_index', hadithIndex);
        }

        renderHadith(HADITH_ARBAIN[hadithIndex]);
        console.log('✨ Hadith Init Success');
    } catch (e) {
        console.error('✨ Hadith Init Failed:', e);
    }
}

function renderHadith(hadith) {
    const container = document.getElementById('hadith-content');
    if (!container) return;

    container.innerHTML = `
        <div class="hadith-title">✨ ${hadith.title}</div>
        <div class="hadith-text">"${hadith.text}"</div>
        <div class="hadith-source">— ${hadith.source}</div>
        <div class="hadith-footer">Hadits Arbain No. ${hadith.no}</div>
    `;
}

// Ensure init is called
// initHadithCard(); // Will be called by app-init.js
