/**
 * ISLAMIC PRAYER GUIDE - DZIKIR PAGI & PETANG
 * Contains authentic dhikr from Sunnah and Quran
 */

const DZIKIR_DATA = {
    pagi: [
        {
            title: "Membaca Ayat Kursi",
            arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
            latin: "Allahu la ilaha illa Huwal Hayyul Qayyum, la ta'khudhuhu sinatun wala nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wala yuhituna bishay'im-min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wala ya'uduhu hifzhuhuma, wa Huwal 'Aliyyul 'Azhim.",
            translation: "Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa'at di sisi Allah tanpa izin-Nya? Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.",
            count: 1,
            source: "HR. An-Nasa'i, Al-Hakim (Shahih)"
        },
        {
            title: "Membaca Al-Ikhlas, Al-Falaq, An-Naas",
            arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
            latin: "Membaca Surah Al-Ikhlas, Al-Falaq, dan An-Naas.",
            translation: "Barangsiapa membacanya sebanyak 3 kali ketika pagi dan petang, maka itu sudah cukup baginya dari segala sesuatu.",
            count: 3,
            source: "HR. Abu Daud, Tirmidzi"
        },
        {
            title: "Sayyidul Istighfar (Puncak Istighfar)",
            arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ ، خَلَقْتَنِي وَأَنَا عَبْدُكَ ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي ، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
            latin: "Allahumma Anta Rabbi, la ilaha illa Anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li, fa-innahu la yaghfirudh-dhunuba illa Anta.",
            translation: "Ya Allah, Engkau adalah Rabbku, tidak ada Ilah yang berhak disembah kecuali Engkau. Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku dengan-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku, maka ampunilah aku. Sesungguhnya tiada yang mengampuni dosa kecuali Engkau.",
            count: 1,
            source: "HR. Bukhari"
        },
        {
            title: "Doa Anti Malas & Lemah",
            arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ وَالْجُبْنِ وَالْهَرَمِ وَالْبُخْلِ وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ",
            latin: "Allahumma inni a'udhu bika minal 'ajzi wal kasali, wal jubni wal harami wal bukhli, wa a'udhu bika min 'adhabil qabri, wa min fitnatil mahya wal mamat.",
            translation: "Ya Allah, aku berlindung kepada-Mu dari kelemahan, kemalasan, sifat penakut, pikun, dan sifat kikir. Dan aku berlindung kepada-Mu dari azab kubur dan fitnah kehidupan serta kematian.",
            count: 1,
            source: "HR. Bukhari & Muslim"
        },
        {
            title: "Doa Kelancaran Bicara (Nabi Musa AS)",
            arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِّن لِّسَانِي يَفْقَهُوا قَوْلِي",
            latin: "Rabbish-rahli sadri, wa yassirli amri, wahlul 'uqdatam-min-lisani, yafqahu qawli.",
            translation: "Ya Rabbku, lapangkanlah dadaku, dan mudahkanlah urusanku, dan lepaskanlah kekakuan dari lidahku, supaya mereka mengerti perkataanku.",
            count: 1,
            source: "QS. Ta-Ha: 25-28"
        },
        {
            title: "Perlindungan dari Bahaya",
            arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
            latin: "Bismillahilladhi la yadhurru ma'as-mihi shay'un fil-ardi wala fis-sama'i wa Huwas-Sami'ul 'Alim.",
            translation: "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan berbahaya, Dia-lah Yang Maha Mendengar lagi Maha Mengetahui.",
            count: 3,
            source: "HR. Abu Daud & Tirmidzi"
        }
    ],
    petang: [
        {
            title: "Membaca Ayat Kursi",
            arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
            latin: "Sama seperti dzikir pagi.",
            translation: "Membaca Ayat Kursi di petang hari memberikan perlindungan hingga pagi.",
            count: 1,
            source: "HR. An-Nasa'i"
        },
        {
            title: "Sayyidul Istighfar",
            arabic: "اللَّهُمَّ أَنْتَ رَبِّي...",
            latin: "Sama seperti dzikir pagi.",
            translation: "Membaca di sore hari dengan yakin, lalu meninggal sebelum pagi, maka masuk surga.",
            count: 1,
            source: "HR. Bukhari"
        },
        {
            title: "Perlindungan dari Kalajengking/Bahaya Malam",
            arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
            latin: "A'udhu bikalimatillahit-tammati min sharri ma khalaq.",
            translation: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan apa yang diciptakan-Nya.",
            count: 3,
            source: "HR. Muslim"
        }
    ]
};

let currentDzikirIndex = 0;
let currentDzikirType = 'pagi';
let dzikirRepeatCount = 0;

function initDzikirGuideUI() {
    // Check if modal exists, if not create it
    if (!document.getElementById('dzikir-guide-modal')) {
        const modalHtml = `
            <div id="dzikir-guide-modal" class="modal hidden" style="z-index: 50000;">
                <div class="modal-content dzikir-modal-content">
                    <div class="modal-header">
                        <h2 id="dzikir-modal-title">Panduan Dzikir</h2>
                        <button onclick="closeDzikirGuide()" class="close-btn">&times;</button>
                    </div>
                    <div class="dzikir-progress-bar">
                        <div id="dzikir-progress-fill"></div>
                    </div>
                    <div class="dzikir-body">
                        <h3 id="dzikir-item-title">Item Title</h3>
                        <div class="arabic-text" id="dzikir-arabic">Arabic Text</div>
                        <div class="latin-text" id="dzikir-latin">Latin Text</div>
                        <div class="translation-text" id="dzikir-translation">Translation Text</div>
                        
                        <div class="dzikir-counter-box" id="dzikir-counter-container">
                            <button id="dzikir-step-count-btn" class="dzikir-count-btn">
                                <span id="dzikir-repeat-status">0 / 3</span>
                            </button>
                            <p class="text-xs text-muted mt-xs">Ketuk tombol untuk menghitung</p>
                        </div>
                    </div>
                    <div class="dzikir-footer">
                        <button onclick="prevDzikir()" class="btn btn-secondary">Sebelumnya</button>
                        <span id="dzikir-page-info">1 / 10</span>
                        <button onclick="nextDzikir()" class="btn btn-primary" id="dzikir-next-btn">Selanjutnya</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add event listener for counter button
        document.getElementById('dzikir-step-count-btn').addEventListener('click', handleDzikirCount);
    }
}

function openDzikirGuide(type) {
    currentDzikirType = type;
    currentDzikirIndex = 0;
    dzikirRepeatCount = 0;
    
    initDzikirGuideUI();
    renderDzikirItem();
    
    document.getElementById('dzikir-guide-modal').classList.remove('hidden');
    document.getElementById('dzikir-modal-title').textContent = `Dzikir ${type.charAt(0).toUpperCase() + type.slice(1)}`;
}

function closeDzikirGuide() {
    document.getElementById('dzikir-guide-modal').classList.add('hidden');
}

function renderDzikirItem() {
    const data = DZIKIR_DATA[currentDzikirType];
    const item = data[currentDzikirIndex];
    
    document.getElementById('dzikir-item-title').textContent = item.title;
    document.getElementById('dzikir-arabic').textContent = item.arabic;
    document.getElementById('dzikir-latin').textContent = item.latin;
    document.getElementById('dzikir-translation').textContent = item.translation;
    
    dzikirRepeatCount = 0;
    updateCounterUI(item.count);
    
    // Update progress
    const progress = ((currentDzikirIndex + 1) / data.length) * 100;
    document.getElementById('dzikir-progress-fill').style.width = `${progress}%`;
    document.getElementById('dzikir-page-info').textContent = `${currentDzikirIndex + 1} / ${data.length}`;
    
    // Scroll to top of content
    document.querySelector('.dzikir-body').scrollTop = 0;
}

function handleDzikirCount() {
    const item = DZIKIR_DATA[currentDzikirType][currentDzikirIndex];
    if (dzikirRepeatCount < item.count) {
        dzikirRepeatCount++;
        updateCounterUI(item.count);
        
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(40);
        
        // Auto next if finished and not last
        if (dzikirRepeatCount === item.count) {
            document.getElementById('dzikir-step-count-btn').classList.add('finished');
            setTimeout(() => {
                // If you want auto-advance, uncomment this:
                // nextDzikir();
            }, 500);
        }
    }
}

function updateCounterUI(target) {
    const btn = document.getElementById('dzikir-step-count-btn');
    const status = document.getElementById('dzikir-repeat-status');
    
    status.textContent = `${dzikirRepeatCount} / ${target}`;
    
    if (dzikirRepeatCount >= target) {
        btn.classList.add('finished');
    } else {
        btn.classList.remove('finished');
    }
}

function nextDzikir() {
    const data = DZIKIR_DATA[currentDzikirType];
    if (currentDzikirIndex < data.length - 1) {
        currentDzikirIndex++;
        renderDzikirItem();
    } else {
        // Finished all
        alert(`Alhamdulillah, Anda telah menyelesaikan Dzikir ${currentDzikirType}!`);
        
        // Auto-check the checkbox in Islam Tracker
        const checkboxId = currentDzikirType === 'pagi' ? 'islam-dzikir-pagi' : 'islam-dzikir-petang';
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = true;
            // Trigger change event to save to DB
            checkbox.dispatchEvent(new Event('change'));
        }

        // Award XP
        if (typeof addXP === 'function') addXP(20, `Completed Dzikir ${currentDzikirType}`);
        
        closeDzikirGuide();
    }
}

function prevDzikir() {
    if (currentDzikirIndex > 0) {
        currentDzikirIndex--;
        renderDzikirItem();
    }
}
