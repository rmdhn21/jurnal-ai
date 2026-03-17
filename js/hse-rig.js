// ===== HSE RIG LEARNING MODULES =====

const hseRigData = {
    introduction: [
        {
            title: "1. Hoisting System (Sistem Pengangkatan)",
            desc: "<b>Fungsi utama:</b> Mengangkat dan menurunkan beban pipa baja raturan ton ke dalam sumur.<br><br><b>📌 Komponen Pada Gambar:</b><br>• <b>Derrick / Mast:</b> Menara baja raksasa yang menanggung beban seluruh alat bor. Derrick dirakit stasioner, sedangkan Mast bisa didirikan/direbahkan.<br>• <b>Drawworks:</b> Mesin derek utama (berisi motor pembawa drum gulungan kabel baja tebal/drilling line) yang menarik beban ke atas.<br>• <b>Crown Block:</b> Kumpulan katrol statis di ujung paling atas/puncak menara derrick.<br>• <b>Traveling Block:</b> Katrol besar warna kuning/merah yang bergerak naik turun membawa kaitan pengangkat (hook).<br>• <b>Drilling Line:</b> Kabel baja sling tebal bertegangan tinggi yang menghubungkan drawworks, crown block, dan traveling block.<br>• <b>Brake System:</b> Rem mekanik/hidrolik (sering terlihat di samping drawworks) untuk menghentikan luncuran traveling block.<br>• <b>Motor:</b> Penggerak utama dari drawworks.<br>• <b>Swivel & Kelly:</b> Penghubung ujung putar antara traveling block dan pipa di bawahnya (sistem lama/bantu).<br>• <b>Drill String:</b> Rangkaian utuh pipa-pipa bor yang masuk menembus tanah.<br><br><span style='color: #e53e3e;'><b>⚠️ Bahaya utama:</b> Benda jatuh dari lintasan atas (Dropped Objects), jari/tangan tergilas kabel seling, dan kegagalan struktur jika kelebihan beban berat.</span>",
            icon: "🏗️",
            image: "img/hse-rig/sys_hoisting.png"
        },
        {
            title: "2. Rotary System (Sistem Pemutar)",
            desc: "<b>Fungsi utama:</b> Memutar mata bor (bit) di dasar bumi layaknya bor dinding raksasa.<br><br><b>📌 Komponen Pada Gambar:</b><br>• <b>Top Drive:</b> Motor listrik raksasa modern (warna kuning/biru melayang) yang dipasang di menara, memutar seluruh pipa langsung dari posisinya di atas lantai.<br>• <b>Rotary Table:</b> Meja putar konvensional berwarna kuning di dasar lantai rig (Drill Floor).<br>• <b>Drill Pipe / Drill String:</b> Pipa baja panjang silinder yang menyambung tenaga putar ke mata bor.<br>• <b>Guide Tracks:</b> Rel besi vertikal (menempel di Derrick) tempat Top Drive meluncur naik-turun agar stabil.<br>• <b>Drill Floor:</b> Area lantai kerja utama berpijaknya alat-alat dan kru kasar (Roughneck).<br>• <b>Subbase (Substructure):</b> Fondasi/panggung baja tinggi yang menopang lantai bor (Drill Floor) dan memberi ruang di bawah lantai (untuk letak BOP).<br><br><span style='color: #e53e3e;'><b>⚠️ Bahaya utama:</b> Anggota tubuh atau pakaian terlilit oleh mesin/pipa yang berputar sangat kencang (Caught in between). Wajib pakai sarung tangan khusus dan baju tidak menjuntai.</span>",
            icon: "⚙️",
            image: "img/hse-rig/sys_rotary.png"
        },
        {
            title: "3. Circulating System (Sistem Sirkulasi)",
            desc: "<b>Fungsi utama:</b> Mengalirkan 'darah' rig (lumpur pengeboran) untuk mendinginkan mata bor dan mengangkut serpihan batu keluar dari sumur.<br><br><b>📌 Komponen Pada Gambar:</b><br>• <b>Mud Pits:</b> Tangki penampungan kotak/persegi besar untuk menampung dan tempat meracik bahan kimia lumpur.<br>• <b>Mud Pumps:</b> 'Jantung' rig; pompa baja raksasa berkekuatan tinggi (sangat berisik) yang mendesak lumpur turun melewati pipa.<br>• <b>Shale Shaker:</b> Ayakan getar raksasa yang memisahkan lumpur kotor cair dari serpihan batu padat (cutting).<br>• <b>Suction Line:</b> Pipa hisap lumpur dari tangki (Mud Pits) menuju ke pompa (Mud Pump).<br>• <b>Discharge Line:</b> Pipa buang rilis lumpur bertekanan tinggi dari Mud Pump menuju ke sumur.<br>• <b>Return Line:</b> Pipa kembalinya aliran lumpur kotor (bercampur batu) dari dalam sumur menuju Shale Shaker.<br>• <b>Agitator:</b> Baling-baling pemutar/pengaduk (seperti kipas di atas mud pits) agar lumpur tidak mengendap.<br><br><span style='color: #e53e3e;'><b>⚠️ Bahaya utama:</b> Paparan bahan kimia beracun, semburan pipa tekanan sangat tinggi, bising, dan lantai plat baja yang sangat licin tertumpah lumpur.</span>",
            icon: "🌊",
            image: "img/hse-rig/sys_circulating.png"
        },
        {
            title: "4. Blowout Preventer (BOP) System",
            desc: "<b>Fungsi utama:</b> 'Rem darurat' katup raksasa pelindung nyawa. Dipakai untuk menutup lubang sumur seketika jika ada ledakan tekanan gas bumi yang lepas kendali (Kick / Blowout).<br><br><b>📌 Komponen Pada Gambar:</b><br>• <b>Annular Preventer:</b> Katup karet paling atas berbentuk mangkuk/kubik melingkar, berfungsi mencekik/menutup pipa ukuran apapun.<br>• <b>Ram Preventers:</b> Kumpulan katup blok padat bersusun di bawah Annular. Bisa berupa <b>Pipe Ram</b> (mengunci bagian pipa tertentu) atau <b>Blind/Shear Ram</b> (memotong pipa sampai putus dan menutup sumur total).<br>• <b>Choke & Kill Line:</b> Saluran pipa menyamping bertekanan super tinggi untuk membunuh tekanan ('Kill') dengan mompa lumpur berat atau membuang tekanan perlahan ('Choke').<br>• <b>Accumulator (Koomey) <i>(Jika Ada)</i>:</b> Tabung botol-botol merah bertekanan tenaga hidrolik penyelamat jarak jauh (remote power) yang menjamin BOP bisa tertutup meski rig blackout listrik total.<br><br><span style='color: #e53e3e;'><b>⚠️ Catatan HSE:</b> Area paling kritis! Pastikan Anda tahu di mana letak BOP dan hapal titik kumpul evakuasi (Muster Point) melawan arah angin.</span>",
            icon: "🗜️",
            image: "img/hse-rig/sys_bop.png"
        },
        {
            title: "5. Power System (Sistem Tenaga)",
            desc: "<b>Fungsi utama:</b> Sumber kehidupan listrik mandiri di tengah antah berantah untuk menggerakkan seluruh mesin rig di atas.<br><br><b>📌 Komponen Pada Gambar:</b><br>• <b>Gensets (Generator Sets / Mesin Diesel):</b> Generator diesel raksasa (biasanya ada 3-4 unit bekerja paralel) berbentuk blok kontainer tangguh penghasil listrik tegangan besar setingkat megawatt.<br>• <b>SCR / VFD Room (Control House):</b> Ruang kontrol kelistrikan (biasanya kontainer putih ber-AC) pusat konversi dan distribusi listrik ke motor-motor alat rig.<br>• <b>Main Power Cables:</b> Kabel transmisi listrik tebal layaknya ular yang menyalurkan listrik dari Genset ke SCR, dan dari SCR ke Drawworks/Mud Pump.<br>• <b>Exhaust / Muffler:</b> Knalpot pembuangan asap panas dan peredam suara pada atas unit Gensets.<br><br><span style='color: #e53e3e;'><b>⚠️ Bahaya utama:</b> Tingkat kebisingan ekstrem (tuli jika menolak pakai pelindung telinga), risiko tinggi tersengat listrik (wajib ketat aturan LOTO), dan bahaya ledakan bahan bakar tangki diesel/solar.</span>",
            icon: "⚡",
            image: "img/hse-rig/sys_power.png"
        }
    ],
    hazards: [
        {
            title: "H2S (Hidrogen Sulfida)",
            desc: "Gas beracun mematikan, tidak berwarna, berbau seperti telur busuk pada konsentrasi rendah, namun melumpuhkan saraf penciuman pada konsentrasi tinggi.",
            action: "Gunakan personal H2S gas detector selalu. Jika alarm bunyi merah, hentikan kerja, tahan napas, dan lari mengevakuasi diri berlawanan arah angin menuju Muster Point.",
            icon: "☠️",
            image: "img/hse-rig/sys_hazard_h2s.png"
        },
        {
            title: "Dropped Objects (Benda Jatuh)",
            desc: "Risiko cedera fatal (atau kematian) dari tertimpa struktur jatuh atau alat berat yang lepas dari ketinggian crane/derrick.",
            action: "Selalu gunakan Hard Hat dengan benar. Jaga jarak dan Dilarang Keras melintas/bekerja tepat di bawah beban yang menggantung (suspended load). Terapkan program inspeksi DROPS rutin.",
            icon: "🏗️",
            image: "img/hse-rig/sys_hazard_drops.png"
        },
        {
            title: "High Pressure (Tekanan Tinggi)",
            desc: "Pipa, valve, dan selang bertekanan luar biasa besar dapat pecah kapan saja dan menimbulkan cambukan mematikan atau semburan bertekanan maut.",
            action: "Dilarang keras berdiri memotong lintasan / garis tembakan (line of fire) tekanan tersebut. Pastikan area terpasang LOTO (Lock Out Tag Out) merah sebelum aktivitas perbaikan pipanisasi.",
            icon: "💥",
            image: "img/hse-rig/sys_hazard_pressure.png"
        },
        {
            title: "Slips, Trips, and Falls (Terpeleset/Jatuh)",
            desc: "Lumpur hidrokarbon basah, ceceran oli, dan air di pijakan area rig membuat baja bergerigi menjadi super licin. Area tangga rig sangat curam.",
            action: "Pertahankan prinsip '3-points of contact' (memegang handrail dengan minimal 1 tangan dan 2 kaki menapak) saat menaiki tangga. Praktikkan Good Housekeeping (segera bersihkan sekecil apapun tumpahan oli).",
            icon: "💦",
            image: "img/hse-rig/sys_hazard_slips.png"
        }
    ],
    ppe: [
        {
            title: "Full Body PPE Requirement",
            desc: "Perlindungan Standar Minumum yang <b>wajib menempel di tubuh</b> saat menginjak area operasi rig:<br><br>• <b>Hard Hat (Helm Safety):</b> Penyelamat nyawa dari benturan atau Dropped Objects ringan. Warnanya membedakan jabatan kru.<br>• <b>Safety Glasses (Kacamata):</b> Tameng mata dari proyektil pasir, percikan bahan kimia, atau gram/serpihan las.<br>• <b>Hearing Protection (Pelindung Telinga):</b> Wajib (earplug/earmuff) jika memasuki radius merah di Noise Hazard Area (zona bising >85 dB).<br>• <b>FRC (Flame Resistant Clothing):</b> Wearpack coverall anti api. Memiliki stiker pemantul cahaya (reflective) agar visual terlihat meski darurat dalam kegelapan malam.<br>• <b>Hand Gloves (Sarung Tangan):</b> Jenis impact/Kevlar tebal untuk melindung tangan dari lecet kabel seling dan panas besi mesin.<br>• <b>Steel-Toe Boots:</b> Sepatu beralaskan safety baja yang mencegah patah tulang ibu jari kaki dari hantaman benda jatuh berat dan bersol anti-slip tinggi.",
            icon: "🛡️",
            image: "img/hse-rig/sys_ppe_fullbody.png"
        }
    ],
    routine: [
        {
            title: "Pre-job & PTW Management (Pagi Hari)",
            desc: "Mengawasi / Memfasilitasi <b>Toolbox Talk (TBT)</b> pagi di luar ruangan bersama tim sebelum bekerja. HSE Officer akan memverifikasi perizinan <b>Permit to Work (PTW)</b> dan <b>Job Safety Analysis (JSA)</b>. Khusus pekerjaan risiko tinggi (Confined Space, Hot Work, Lifting), HSE Officer wajib mengecek keabsahan kunci isolasi panel gembok merah <b>LOTO (Lock Out Tag Out)</b> di area kelistrikan dan melakukan validasi Gas Testing sebelum mengeluarkan Gas Free Certificate.",
            icon: "📢",
            image: "img/hse-rig/sys_routine_tbt.png"
        },
        {
            title: "PTW / LOTO Physical Cross-Check",
            desc: "HSE Officer secara fisik mendatangi lokasi kerja untuk membandingkan perizinan kertas PTW dengan kondisi fisik penerapan gembok merah LOTO. Hal ini guna memastikan pekerja di lapangan benar-benar melindungi nyawanya sesuai janji dokumen.",
            icon: "🔏",
            image: "img/hse-rig/sys_routine_ptw.png"
        },
        {
            title: "Site Inspection & Walkthrough",
            desc: "Melakukan patroli inspeksi fisik terjadwal keliling fasilitas rig (Site Walkthrough). Memeriksa langsung validitas/kalibrasi APAR (Fire Extinguisher), kelayakan papan izin <b>Scaffolding (Scaftag merah/hijau)</b>, memastikan Eye Wash area berfungsi nyala, dan menegur secara proaktif jika ditemukan <b>Unsafe Condition</b>/<b>Unsafe Act</b>.",
            icon: "🔍",
            image: "img/hse-rig/sys_routine_inspection.png"
        },
        {
            title: "Observation Cards & Safety Culture",
            desc: "Mendesak seluruh lapisan pekerja bersikap peduli terhadap budaya keselamatan dengan aktif mengisi kertas <b>STOP Cards / SOC (Safety Observation Cards)</b> dan memasukkannya ke dalam drop box keselamatan harian. Mengevaluasi poin-poin yang ditulis oleh pekerja.",
            icon: "📝",
            image: "img/hse-rig/sys_routine_stop.png"
        },
        {
            title: "Emergency / Incident Drills",
            desc: "Dipimpin langsung oleh Anda (HSE) secara sporadis atau terjadwal. Menekan alarm darurat rig palsu untuk melatih evakuasi para pekerja dengan sigap berlari mendatangi tenda titik evakuasi <b>Muster Point</b> hijau yang telah ditetapkan.",
            icon: "🚨",
            image: "img/hse-rig/sys_routine_drill.png"
        }
    ],
    clsr: [
        {
            title: "01. TOOLS & EQUIPMENT",
            desc: "Gunakan alat dan peralatan kerja secara aman.",
            icon: "🛠️",
            image: "img/hse-rig/clsr_1_tools.png"
        },
        {
            title: "02. LINE OF FIRE",
            desc: "Berada di posisi atau kondisi berbahaya. Posisikan diri agar tidak berada di Line of Fire (posisi/kondisi berbahaya).",
            icon: "🚷",
            image: "img/hse-rig/clsr_2_line_of_fire.png"
        },
        {
            title: "03. HOT WORK",
            desc: "Kendalikan sumber api dan bahan mudah terbakar pada pelaksanaan Pekerjaan Panas (Hot Work) di Hazardous Area.",
            icon: "🔥",
            image: "img/hse-rig/clsr_3_hot_work.png"
        },
        {
            title: "04. CONFINED SPACE",
            desc: "Hanya Personel berwenang yang diizinkan masuk ke dalam ruang terbatas (Confined Space).",
            icon: "🕳️",
            image: "img/hse-rig/clsr_4_confined_space.png"
        },
        {
            title: "05. POWERED SYSTEM",
            desc: "Amankan pemasangan, perbaikan dan pembongkaran peralatan listrik, mekanis & hydraulic dari sumber energi berbahaya.",
            icon: "⚡",
            image: "img/hse-rig/clsr_5_powered_system.png"
        },
        {
            title: "06. LIFTING OPERATION",
            desc: "Patuhi persyaratan dan instruksi lifting plan pada kegiatan pengangkatan.",
            icon: "🏗️",
            image: "img/hse-rig/clsr_6_lifting.png"
        },
        {
            title: "07. WORKING AT HEIGHT",
            desc: "Gunakan peralatan pelindung jatuh saat bekerja di lokasi dengan beda tinggi.",
            icon: "🧗",
            image: "img/hse-rig/clsr_7_height.png"
        },
        {
            title: "08. GROUND-DISTURBANCE WORK",
            desc: "Lindungi stabilitas tanah & infrastruktur yang ada di bawah tanah dari bahaya pekerjaan gangguan tanah (penggalian, pemasangan pipa/kabel dalam tanah, dsb.).",
            icon: "🚜",
            image: "img/hse-rig/clsr_8_ground.png"
        },
        {
            title: "09. WATER-BASED WORK ACTIVITIES",
            desc: "Lindungi diri dari risiko tenggelam pada pekerjaan di permukaan/atas air dan kekurangan supply oksigen pada pekerjaan di dalam air.",
            icon: "🦺",
            image: "img/hse-rig/clsr_9_water.png"
        },
        {
            title: "10. LAND TRANSPORTATION",
            desc: "Patuhi peraturan keselamatan ketika berkendara.",
            icon: "🚗",
            image: "img/hse-rig/clsr_10_transport.png"
        }
    ],
    perilaku: [
        {
            title: "01",
            desc: "Saya menerapkan HSSE Golden Rules (Patuh-Intervensi-Peduli).",
            icon: "🥇"
        },
        {
            title: "02",
            desc: "Saya kompeten dan berwenang untuk melaksanakan pekerjaan.",
            icon: "🎓"
        },
        {
            title: "03",
            desc: "Saya dalam kondisi sehat untuk bekerja (Fit to Work berdasarkan hasil MCU & DCU yang berlaku) dan sehat secara mental.",
            icon: "🩺"
        },
        {
            title: "04",
            desc: "Saya menggunakan APD (Alat Pelindung Diri) yang sesuai.",
            icon: "👷"
        },
        {
            title: "05",
            desc: "Saya telah mengidentifikasi bahaya dan risiko sebelum pekerjaan dilaksanakan (Last Minute Risk Assessment).",
            icon: "🔍"
        },
        {
            title: "06",
            desc: "Saya melaporkan setiap kondisi abnormal/anomali yang berbahaya kepada atasan untuk ditanggulangi.",
            icon: "⚠️"
        },
        {
            title: "07",
            desc: "Saya memastikan Permit to Work yang sesuai telah tersedia dan dilaksanakan.",
            icon: "📝"
        },
        {
            title: "08",
            desc: "Saya menjaga kebersihan dan kerapihan lokasi kerja.",
            icon: "🧹"
        },
        {
            title: "09",
            desc: "Saya melaksanakan perilaku kunci yang disyaratkan dalam 10 elemen CLSR.",
            icon: "🔑"
        }
    ]
};

function initHseRig() {
    renderRigModules('rig-intro-modules', hseRigData.introduction);
    renderRigModules('rig-hazards-modules', hseRigData.hazards, true);
    renderRigModules('rig-ppe-modules', hseRigData.ppe);
    renderRigModules('rig-routine-modules', hseRigData.routine);
    renderInteractiveFlashcards('rig-clsr-modules', hseRigData.clsr);
    renderInteractiveFlashcards('rig-perilaku-modules', hseRigData.perilaku);
}

function renderRigModules(containerId, dataArray, isHazard = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = dataArray.map((item, index) => `
        <div class="rig-card" style="background: var(--bg-color); border: 1px solid var(--border); border-radius: 8px; padding: 12px; transition: transform 0.2s; cursor: pointer;" onclick="this.classList.toggle('expanded')">
            <div style="display: flex; align-items: flex-start; gap: 10px;">
                <div style="font-size: 1.5rem; margin-top: 2px;">${item.icon}</div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-size: 1rem; color: var(--text-primary);">${item.title}</h4>
                    <p class="text-muted" style="margin: 4px 0 0 0; font-size: 0.85rem; line-height: 1.4;">${item.desc}</p>
                    ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: auto; border-radius: 6px; margin-top: 10px; border: 1px solid var(--border);">` : ''}
                </div>
            </div>
            ${isHazard && item.action ? `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border); font-size: 0.85rem;">
                <strong>💡 Kontrol / Mitigasi:</strong> <span style="color: var(--text-color);">${item.action}</span>
            </div>
            ` : ''}
        </div>
    `).join('');
}

// Tambahkan inisialisasi ketika DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Akan dipanggil oleh navigasi jika user klik tab HSE Rig,
    // atau inisialisasi di awal agar siap
    initHseRig();
});

function switchRigChapter(chapterId, buttonElement) {
    // 1. Hide all chapters
    const chapters = document.querySelectorAll('.rig-chapter');
    chapters.forEach(ch => {
        ch.classList.add('hidden');
    });

    // 2. Show the selected chapter
    const activeChapter = document.getElementById(`rig-chapter-${chapterId}`);
    if (activeChapter) {
        activeChapter.classList.remove('hidden');
    }

    // 3. Update tab active state
    if (buttonElement) {
        const tabs = document.querySelectorAll('.rig-tab');
        tabs.forEach(t => t.classList.remove('active'));
        buttonElement.classList.add('active');
        
        // Scroll horizontal tab container to make button visible if it's overflowing
        buttonElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function renderInteractiveFlashcards(containerId, dataArray) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Tambahkan style flipcard sekali saja
    if (!document.getElementById('flashcard-style')) {
        const style = document.createElement('style');
        style.id = 'flashcard-style';
        style.innerHTML = `
            .flashcard-container { perspective: 1000px; cursor: pointer; display: block; }
            .flashcard { width: 100%; position: relative; transition: transform 0.6s; transform-style: preserve-3d; min-height: 220px; }
            .flashcard.flipped { transform: rotateY(180deg); }
            .flashcard-front, .flashcard-back { width: 100%; height: 100%; position: absolute; top: 0; left: 0; backface-visibility: hidden; border-radius: 12px; padding: 20px; box-sizing: border-box; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .flashcard-front { background: var(--bg-color); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 2px solid var(--border); }
            .flashcard-back { background: var(--primary, #3b82f6); color: white; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow-y: auto; }
            .flashcard-front img { width: 100%; max-height: 120px; object-fit: contain; border-radius: 8px; margin-bottom: 15px; }
            .flashcard-front h4 { margin: 0; color: var(--text-primary); font-size: 1.1rem; }
            .flashcard-back h4 { margin: 0 0 10px 0; font-size: 1.1rem; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 10px; width: 100%; }
            .flashcard-back p { font-size: 0.95rem; margin: 0; line-height: 1.5; color: rgba(255,255,255,0.95); }
            
            /* Responsive Grid Override */
            @media(max-width: 600px) {
                .flashcard { min-height: 200px; }
                .flashcard-front img { max-height: 100px; }
            }
        `;
        document.head.appendChild(style);
    }

    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    container.style.gap = '20px';

    container.innerHTML = dataArray.map((item, index) => `
        <div class="flashcard-container" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
            <div class="flashcard">
                <div class="flashcard-front">
                    ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `<div style="font-size: 3rem; margin-bottom: 10px;">${item.icon}</div>`}
                    <h4>${item.title}</h4>
                    <span style="font-size: 0.75rem; color: var(--text-muted); margin-top: 8px;">(Tap untuk membalik 🔄)</span>
                </div>
                <div class="flashcard-back">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== PJSM (PRE-JOB SAFETY MEETING) GENERATOR =====

const PJSM_SYSTEM_PROMPT = `Kamu adalah Senior HSSE Officer di Rig Pengeboran Pertamina yang tegas, asik, dan berpengalaman lapangan. Tugasmu adalah merespons setiap "Daftar Pekerjaan Hari Ini" yang diberikan dengan menyusun naskah lisan Pre-Job Safety Meeting (PJSM) atau Toolbox Talk.

GAYA BAHASA WAJIB:
Gunakan bahasa lisan lapangan yang natural, santai tapi berwibawa, dan tidak kaku. Ikuti persis gaya bincang-bincang lisan (oral) seperti contoh naskah yang diberikan. Fokus pada kejelasan informasi tanpa perlu bertele-tele.

===== DATABASE KESELAMATAN PERTAMINA (WAJIB DIJADIKAN REFERENSI UTAMA) =====

[10 POTENSI BAHAYA] - Identifikasi SEMUA yang relevan dari daftar pekerjaan:
1. GERAKAN - Tergelincir, tersandung, terjatuh (Slips/Trips/Falls).
2. ELEKTRIKAL - Sengatan/tegangan listrik.
3. BIOLOGI - Paparan organisme berbahaya.
4. RADIASI - Paparan radiasi ionisasi/non-ionisasi.
5. SUARA (KEBISINGAN) - Paparan bising >85 dB.
6. TEMPERATUR - Panas/dingin ekstrem.
7. ZAT KIMIA - Paparan bahan kimia berbahaya.
8. MEKANIKAL - Terjepit, terpukul, tergilas mesin bergerak.
9. TEKANAN - Hubungan dengan sistem bertekanan tinggi.
10. GAYA BERAT (GRAVITY) - Benda jatuh dari ketinggian atau pekerja jatuh.

[10 ELEMEN CLSR] - Referensi: Buku Saku CLSR Pertamina.
01. TOOLS & EQUIPMENT, 02. LINE OF FIRE, 03. HOT WORK, 04. CONFINED SPACE, 05. POWERED SYSTEM / LOTO, 06. LIFTING OPERATION, 07. WORKING AT HEIGHT, 08. GROUND-DISTURBANCE WORK, 09. WATER-BASED WORK, 10. LAND TRANSPORTATION.

[9 PERILAKU WAJIB]:
1. Terapkan HSSE Golden Rules, 2. Kompeten, 3. Kondisi sehat Fit to Work (MCU/DCU), 4. Gunakan APD sesuai, 5. Identifikasi bahaya via LMRA, 6. Laporkan kondisi abnormal, 7. Pastikan Permit to Work (PTW/SIKA) tersedia, 8. Jaga kebersihan lokasi (Housekeeping), 9. Laksanakan perilaku kunci 10 CLSR.

STRUKTUR NASKAH WAJIB (IKUTI TEMPLATE INI):

assalamualaikum warahmatullahi wabarakatuh dan selamat pagi rekan rekan semua Izin menyita waktunya sebentar sebelum kita mulai pekerjaan. Seperti biasa, saya mau pastikan semua yang ada di sini sudah lolos DCU. rekan rekan, kalau pagi ini ada yang badannya kurang fit, atau merasa kurang sehat, tolong lapor ke medis.

Fokus perkerjaan kita hari ini yaitu [sebutkan daftar pekerjaan dengan lisan yang mengalir]

bahaya utama kita hari ini berdasarkan 10 bahaya di area kerja yaitu pertama [bahaya 1], kedua [bahaya 2], dst. dan ini bersinggungan dengan 10 pedoman clsr nomor [nomor clsr] yaitu [nama clsr], nomor [nomor clsr] yaitu [nama clsr], dst. [Jelaskan kaitannya secara singkat].

Zero Tolerance hari ini, Pak: Mohon pengertiannya, jika [tentukan 1 hal kritis yang tidak ditoleransi hari ini terkait pekerjaan tersebut]

dan jangan lupa terapkan 3T (Tahu Pekerjaan, Bahaya, Mitigasi) dan 3M (Mulai dari diri sendiri, hal kecil, saat ini). Serta satu hal yang mau saya garis bawahi dari 9 Perilaku Wajib adalah [pilih 1 poin dari 9 Perilaku Wajib yang paling relevan dan jelaskan singkat].

mungkin itu saja dari saya, waktu dan tempat saya kembalikan kepada mandor.

baiklah rekan rekan sekalian sebelum kita memulai pekerjaan hari ini ada baiknya kita berdoa menurut agama dan kepercayaan masing masing, berdoa dipersilahkan.

ATURAN OUTPUT:
- Berikan naskah LANGSUNG dalam format teks mengalir (plain text).
- JANGAN gunakan numbering 1-6 atau formatting markdown seperti bold/italic/heading.
- Pastikan naskah terasa seperti naskah lisan yang siap dibacakan tanpa terpotong.
- Isi bagian [ ] dengan analisis yang cerdas berdasarkan database keselamatan di atas.`;

let pjsmSpeechUtterance = null;

async function generatePJSM() {
    const input = document.getElementById('pjsm-work-input');
    const loading = document.getElementById('pjsm-loading');
    const resultArea = document.getElementById('pjsm-result-area');
    const content = document.getElementById('pjsm-content');
    const btn = document.getElementById('generate-pjsm-btn');

    const workList = input?.value?.trim();
    if (!workList) {
        alert('Masukkan daftar pekerjaan hari ini terlebih dahulu!');
        return;
    }

    const apiKey = getApiKey();
    if (!apiKey) {
        alert('API Key Gemini belum diatur! Buka Settings dan masukkan API Key.');
        return;
    }

    // Show loading
    loading.classList.remove('hidden');
    resultArea.classList.add('hidden');
    btn.disabled = true;
    btn.textContent = '⏳ Generating...';

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: `${PJSM_SYSTEM_PROMPT}\n\n--- DAFTAR PEKERJAAN HARI INI ---\n${workList}\n\nBuatkan naskah PJSM lengkap sesuai struktur 6 bagian di atas.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 10240
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error details:', errorData);
            throw new Error(errorData.error?.message || `Gagal menghubungi Gemini (Status: ${response.status})`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        let text = candidate?.content?.parts?.[0]?.text;

        if (candidate?.finishReason === 'MAX_TOKENS') {
            console.warn('PJSM Truncated: Reached max tokens limit.');
            text += '\n\n... (Terpotong karena naskah terlalu panjang, silakan generate ulang atau hubungi admin) ...';
        }

        if (!text) throw new Error('Respon AI kosong');

        // Markdown Cleanup
        text = text.replace(/```[a-z]*\n/g, '').replace(/```/g, '');

        console.log('PJSM Result length:', text.length);
        content.textContent = text;
        // Ensure scroll to bottom with some padding
        content.style.paddingBottom = "100px";
        resultArea.classList.remove('hidden');

    } catch (error) {
        console.error('PJSM Error:', error);
        alert('Gagal generate PJSM: ' + error.message);
    } finally {
        loading.classList.add('hidden');
        btn.disabled = false;
        btn.textContent = '📢 Generate Naskah PJSM ⚡';
    }
}

function copyPJSM() {
    const content = document.getElementById('pjsm-content');
    if (!content || !content.textContent) return;

    navigator.clipboard.writeText(content.textContent).then(() => {
        const btn = document.getElementById('copy-pjsm-btn');
        const original = btn.textContent;
        btn.textContent = '✅ Tersalin!';
        setTimeout(() => btn.textContent = original, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = content.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Naskah PJSM berhasil dicopy!');
    });
}

function speakPJSM() {
    const content = document.getElementById('pjsm-content');
    if (!content || !content.textContent) return;

    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    pjsmSpeechUtterance = new SpeechSynthesisUtterance(content.textContent);
    pjsmSpeechUtterance.lang = 'id-ID';
    pjsmSpeechUtterance.rate = 0.95;
    pjsmSpeechUtterance.pitch = 1.0;

    // Try to find Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.startsWith('id')) || voices.find(v => v.lang.startsWith('ms'));
    if (idVoice) pjsmSpeechUtterance.voice = idVoice;

    // Show/hide buttons
    document.getElementById('speak-pjsm-btn').classList.add('hidden');
    document.getElementById('stop-speak-pjsm-btn').classList.remove('hidden');

    pjsmSpeechUtterance.onend = () => {
        document.getElementById('speak-pjsm-btn').classList.remove('hidden');
        document.getElementById('stop-speak-pjsm-btn').classList.add('hidden');
    };

    pjsmSpeechUtterance.onerror = () => {
        document.getElementById('speak-pjsm-btn').classList.remove('hidden');
        document.getElementById('stop-speak-pjsm-btn').classList.add('hidden');
    };

    window.speechSynthesis.speak(pjsmSpeechUtterance);
}

function stopSpeakPJSM() {
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    document.getElementById('speak-pjsm-btn').classList.remove('hidden');
    document.getElementById('stop-speak-pjsm-btn').classList.add('hidden');
}

// Initialize PJSM event listeners
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-pjsm-btn');
    const copyBtn = document.getElementById('copy-pjsm-btn');
    const speakBtn = document.getElementById('speak-pjsm-btn');
    const stopBtn = document.getElementById('stop-speak-pjsm-btn');

    if (generateBtn) generateBtn.addEventListener('click', generatePJSM);
    if (copyBtn) copyBtn.addEventListener('click', copyPJSM);
    if (speakBtn) speakBtn.addEventListener('click', speakPJSM);
    if (stopBtn) stopBtn.addEventListener('click', stopSpeakPJSM);

    // Preload voices for TTS
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
    }
});

