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
            desc: "<b>Fungsi utama:</b> Sumber kehidupan listrik mandiri di tengah antah berantah untuk menggerakkan seluruh mesin rig di atas.<br><br><b>📌 Komponen Pada Gambar:</b><br>• <b>Gensets:</b> Generator diesel raksasa penghasil listrik megawatt.<br>• <b>SCR / VFD Room:</b> Pusat distribusi listrik ke motor-motor alat rig.<br>• <b>Main Power Cables:</b> Kabel transmisi listrik tebal.<br><br><span style='color: #e53e3e;'><b>⚠️ Potensi Bahaya:</b> Kebisingan ekstrem, sengatan listrik tegangan tinggi (LOTO wajib), dan risiko ledakan bahan bakar diesel.</span>",
            icon: "⚡",
            image: "img/hse-rig/sys_power.png"
        }
    ],
    wellLifecycle: [
        {
            title: "Siklus Hidup Sumur Migas",
            desc: "Memahami perjalanan sebuah sumur dari awal hingga akhir:<br><br>1. <b>Eksplorasi:</b> Pencarian cadangan minyak baru melalui survei seismik dan pengeboran sumur liar (Wildcat).<br>2. <b>Penilaian (Appraisal):</b> Mengukur potensi cadangan dan nilai komersial melalui Well Testing.<br>3. <b>Pengembangan:</b> Pengeboran sumur produksi secara massal dan pemasangan fasilitas permukaan.<br>4. <b>Komplesi:</b> Mempersiapkan sumur agar siap mengalirkan minyak/gas secara aman.<br>5. <b>Produksi:</b> Tahap mengalirkan fluida bumi ke tangki pengumpul.<br>6. <b>Intervensi:</b> Perbaikan atau optimalisasi sumur (Well Workover/Snobbing).<br>7. <b>Penutupan (P&A):</b> Permanently Plug and Abandon (P&A) sumur yang sudah tidak ekonomis agar aman bagi lingkungan.",
            icon: "🔄",
            image: "img/hse-rig/well_lifecycle.png"
        }
    ],
    rigSequence: [
        {
            title: "Alur Operasional Rig",
            desc: "Urutan kerja mekanis dan logistik rig:<br><br>• <b>Mobilisasi:</b> Perpindahan peralatan rig dari gudang ke lokasi sumur menggunakan truk berat.<br>• <b>Rig Up:</b> Proses pendirian menara (mast) dan perakitan seluruh 5 sistem utama rig.<br>• <b>Drilling Ops:</b> Proses pengeboran lubang sumur secara aktif.<br>• <b>Well Completion:</b> Pemasangan pipa produksi (tubing) dan Wellhead.<br>• <b>Rig Down:</b> Pembongkaran menara dan mesin setelah pekerjaan selesai.<br>• <b>Demobilisasi:</b> Pemindahan rig keluar dari lokasi sumur.",
            icon: "⚙️",
            image: "img/hse-rig/rig_sequence.png"
        }
    ],
    criticalParameters: [
        {
            title: "Parameter Kritis Sumur",
            desc: "Data teknis yang wajib dipantau HSE dan Driller:<br><br>• <b>Trajektori:</b> Arah lubang sumur (Vertikal, Berarah, atau Horizontal).<br>• <b>Mud Weight (MW):</b> Berat jenis lumpur penyeimbang tekanan formasi (Prime barrier).<br>• <b>Litologi:</b> Jenis batuan yang ditembus (Shale, Sandstone) - waspada zona rekah.<br>• <b>Casing Shoe:</b> Kedalaman kritis ujung pipa pelindung terakhir.<br>• <b>BHT (Bottom Hole Temperature):</b> Suhu dasar sumur yang mempengaruhi alat bor.<br>• <b>Well History:</b> Riwayat sumur sekitar (Offset Wells) untuk antisipasi bahaya serupa.<br>• <b>SIMOPS:</b> Pengawasan pekerjaan yang berlangsung bersamaan (Simultaneous Operations).",
            icon: "📊",
            image: "img/hse-rig/well_parameters.png"
        }
    ],
    hsseOversight: [
        {
            title: "Tanggung Jawab Pengawasan HSSE",
            desc: "Fokus utama Supervisor HSE di lapangan Rig:<br><br>• <b>Lantai Bor (Drill Floor):</b> Mengawasi area paling berbahaya (Red Zone/Pinch Point).<br>• <b>JSA / PTW:</b> Memastikan izin kerja selaras dengan identitas bahaya aktual.<br>• <b>Chemical & Waste:</b> Pengawasan penanganan bahan kimia berbahaya dan limbah lumpur.<br>• <b>Well Control:</b> Memonitor indikasi dini semburan liar (Kick) dan memandu tanggap darurat.<br>• <b>Emergency Response:</b> Memastikan seluruh kru paham tugas dalam Muster Point dan pemakaian peralatan darurat.",
            icon: "🛡️",
            image: "img/hse-rig/hsse_oversight_rig.png"
        }
    ],
    hazards: [

        {
            title: "1. Gerakan (Motion)",
            desc: "Bahaya dari suatu benda atau alat yang bergerak (berputar, mengayun, meluncur) yang dapat menabrak atau membentur pekerja.",
            action: "Jaga jarak dari area pergerakan benda (Line of Fire), pastikan barikade terpasang, dan jangan menggunakan pakaian longgar di dekat mesin berputar.",
            icon: "🔄",
            image: "img/hse-rig/sys_hazard_1_gerakan.png"
        },
        {
            title: "2. Elektrikal (Listrik)",
            desc: "Bahaya tersengat arus listrik dari kabel terkelupas, genangan air di dekat panel, atau kegagalan sistem arde (grounding).",
            action: "Terapkan isolasi energi LOTO (Lock Out Tag Out) sebelum perbaikan panel, gunakan sarung tangan dielektrik, dan jauhi area bertegangan tinggi tanpa izin kompeten.",
            icon: "⚡",
            image: "img/hse-rig/sys_hazard_2_elektrikal.png"
        },
        {
            title: "3. Biologi",
            desc: "Bahaya yang berasal dari makhluk hidup di lapangan operasi liar, seperti patogen/virus, serangga berbisa (tawon), ular berbisa, atau hewan liar di area rawa rig.",
            action: "Lakukan fogging/inspeksi hewan berbisa rutin, kenakan coverall menutupi seluruh kulit, dan sediakan obat anti-venom dalam kotak P3K darurat klinik rig.",
            icon: "🦠",
            image: "img/hse-rig/sys_hazard_3_biologi.png"
        },
        {
            title: "4. Radiasi",
            desc: "Paparan partikel radiasi mengion dari alat uji tanpa-merusak (NDT / Radiography Testing pelat baja pipa) atau lumpur NORM (Naturally Occurring Radioactive Material).",
            action: "Patuhi peringatan barikade radiasi kuning-hitam berradius jauh, gunakan personal dosimeter (TLD), dan HENTIKAN seluruh pekerjaan lain di luar radius pada saat uji tembak NDT.",
            icon: "☢️",
            image: "img/hse-rig/sys_hazard_4_radiasi.png"
        },
        {
            title: "5. Suara (Kebisingan)",
            desc: "Tingkat tekanan sumber suara di atas 85 desibel (misalnya dari raungan Genset atau Mud Pump raksasa) yang dapat menghancurkan saraf telinga permanen (NIHL).",
            action: "Wajib memakai Pelindung Telinga mutlak ganda (Ear Plug + Ear Muff) di zona batas merah, kurangi jam paparan pekerja (rotasi dinas shift).",
            icon: "🔊",
            image: "img/hse-rig/sys_hazard_5_suara.png"
        },
        {
            title: "6. Temperatur (Suhu Ekstrem)",
            desc: "Bahaya paparan radiasi uap pipa sangat panas (Heat Stress, dehidrasi parah) di area Boiler, atau cedera suhu gigil luar biasa dingin (Cold Stress).",
            action: "Sediakan banyak stasiun Air Minum dekat rig floor (Mandatory Water Break), kenakan sarung tangan kulit tahan panas tebal untuk menyentuh instalasi panas, dan pantau siklus istirahat thermal.",
            icon: "🌡️",
            image: "img/hse-rig/sys_hazard_6_temperatur.png"
        },
        {
            title: "7. Zat Kimia (Chemical)",
            desc: "Paparan serbukan/cairan kimia tambang berbahaya, beracun, mudah meledak/terbakar, atau korosif ekstrim (misal: caustic soda pelebur daging, gas H2S pembunuh senyap).",
            action: "Pahami identitas Material Safety Data Sheet (MSDS), dan gunakan respirator pernapasan serta kacamata chemical goggles rapat khusus dekat tangki racik Mud Pit.",
            icon: "🧪",
            image: "img/hse-rig/sys_hazard_7_kimia.png"
        },
        {
            title: "8. Mekanikal (Titik Jepit/Mesin)",
            desc: "Bahaya terpotong, robek, terperangkap, dan terjepit (Pinch Point) yang diremukkan oleh roda gigi katrol, sabuk kompresor mekanis tali, atau engsel traktor berat.",
            action: "Patuhi Hands-Free Policy (dilarang menyentuh beban gantung secara langsung, pakai push-pull stick), pastikan seluruh jeruji penutup mesin (machine safety guard) terkunci.",
            icon: "⚙️",
            image: "img/hse-rig/sys_hazard_8_mekanikal.png"
        },
        {
            title: "9. Tekanan (Pressure)",
            desc: "Pelepasan hebat secara kejam dari tabung bertekanan gigantis (misalnya sumur blowout, pecahan katup ledak pressure tinggi, tabung gas terputus).",
            action: "Ikat erat sambungan silang selang udara peluru menggunakan sling baja whip-check, selalu pastikan status Bleed-off (kosong tanpa tekanan) sebelum baut kompresor flange pipa dilepaskan secara menyilang.",
            icon: "💥",
            image: "img/hse-rig/sys_hazard_9_tekanan.png"
        },
        {
            title: "10. Gaya Berat (Gravity)",
            desc: "Tragedi fatal efek gaya tarik bumi akibat terjatuh terempas bebas dari tingkat atas tiang (Working at Height) maupun kepala yang dilumpuhkan oleh jatuhnya sebuah kunci inggris dari lantai atap derrick (Dropped Object).",
            action: "Wajib kenakan 100% Tie-off Full Body Harness berperedam hentakan tubuh ketika naik 1,8 meter. Terapkan ikatan pencegah barang jatuh (Tool Lanyard), dan patuhi Red Zone Drop Barricade larangan masuk mutlak.",
            icon: "🏗️",
            image: "img/hse-rig/sys_hazard_10_gravitasi.png"
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
    ],
    gasFire: [
        {
            title: "Batas Nyala & Ledak Gas (LEL / UEL)",
            desc: "Gas bahan bakar butuh campuran oksigen yang pas untuk bisa meledak. Jika campuran tidak pas, api tidak akan menyala.<br><br>• <b>LFL / LEL (Lower Flammable/Explosion Limit):</b> Batas bawah. Di bawah titik ini, campuran gas tergolong <i>Too Lean</i> (terlalu sedikit bahan bakar). Tidak akan terbakar/meledak.<br>• <b>UFL / UEL (Upper Flammable/Explosion Limit):</b> Batas atas. Di atas titik ini, campuran gas tergolong <i>Too Rich</i> (terlalu kaya bahan bakar, tapi kekurangan oksigen). Tidak akan terbakar.<br>• <b style='color: #e53e3e;'>Explosion Range (Rentang Lebak):</b> Adalah zona merah di antara LEL dan UEL. Jika konsentrasi gas berada di rentang ini, SATU percikan kecil saja (seperti ponsel jatuh, HT, statik alat las) akan memicu LEDAKAN BESAR seketika.",
            action: "Pekerjaan Panas (Hot Work) WAJIB DIBATALKAN apabila pembacaan Gas Detector mendeteksi nilai LEL terukur di atas 0% (atau 5% tergantung prosedur standar ketat perusahaan bersangkutan), serta konsentrasi Oksigen berada di luar angka normal (19.5% - 23.5%).",
            icon: "🔥",
            image: "img/hse-rig/sys_gas_lel_uel.png"
        }
    ],
    inspection: [
        {
            category: "B.1. KONDISI LOKASI UMUM",
            image: "img/hse-rig/sys_inspect_location.png",
            items: [
                "1. Tersedia lay out yang sesuai dan memenuhi jarak aman atau dokumen MOC",
                "2.a. Papan informasi nama rig dan nama sumur",
                "2.b. Tanda peringatan penggunaan APD",
                "2.c. Tanda peringatan benda bertekanan",
                "2.d. Tanda peringatan benda berputar",
                "2.e. Tanda peringatan bahaya listrik",
                "2.f. Tanda peringatan bahaya jatuh",
                "2.g. Tanda peringatan bahaya bising",
                "2.h. Tanda larangan merokok",
                "2.i. Tanda larangan masuk tanpa ijin/tidak berkepentingan",
                "2.j. Tanda larangan membuat api",
                "3.a. Akses jalan untuk kondisi darurat harus rata, bebas hambatan/tidak terhalang",
                "3.b. Tersedia pagar keliling lokasi, pos jaga dan portal",
                "4. Tersedia tempat berkumpul dalam keadaan darurat/muster point",
                "5. Tersedia Wind Sock tidak robek, dapat berputar, warna cerah",
                "6. Tersedia Tempat Ibadah, Air bersih dan MCK layak digunakan",
                "7.a. Semua informasi fungsi tombol otomatis/manual (LOTO)",
                "7.b. Status marking (operasi, standby, rusak)",
                "7.c. Penomoran alat (pompa, accumulator, agitator, MGS)",
                "11. Sertifikat Operator Pesawat Angkat Migas (SIO Crane, forklift), Sertifikat Rigger",
                "12. Dokumen hasil pemeriksaan Tubular Good",
                "13. Tersedia dokumen kendaraan di lokasi sumur (STNK, KIR) dan operator",
                "14. Tersedia dokumen pengujian Engine, Brake System, Crown O Matic, dll"
            ]
        },
        {
            category: "B.2. CIRCULATING SYSTEM",
            image: "img/hse-rig/sys_circulating.png",
            items: [
                "1.a. Shearpin terpasang sesuai dengan setting pressure",
                "1.b. Tersedia stock shearpin lengkap dengan certificate",
                "1.c. Tersedia jalur pembuangan (outlet PSV) ke tanki",
                "1.d. Tersedia bukti pengujian minimal 6 bulan sekali",
                "2. Pulsation Dumpener tersedia",
                "3. Emergency Shutdown untuk pompa lumpur",
                "4.a. Piping System: working pressure min sama dengan BOP",
                "4.b. Piping System: harus di anchor",
                "4.c. Piping System: kondisi fisik sambungan kuat, tidak berbahan rubber",
                "4.d. Piping System: pressure test minimal sama dengan BOP",
                "5. Semua saluran lumpur bertekanan tidak bocor dan terpasang safety chain",
                "6. Shale Shaker terpasang dan berfungsi",
                "7. Bak/tangki penampung kondisi baik, tidak korosi/bocor, memiliki toeboard/handrail",
                "8. Semua valve tanki, solid control, mud pump dan hopper berfungsi",
                "9. Semua agitator harus bekerja baik",
                "10.a. Mud gas separator (MGS): spesifikasi manufacture sesuai kebutuhan",
                "10.b. MGS: Pemeriksaan terakhir (COI) valid",
                "10.c. MGS: Keadaan baik, terhubung sempurna dengan flare",
                "10.d. MGS: Skid & wire rope labrang terpasang",
                "10.e. Tersedia pengaman (concrete/patok) pipa ke flare",
                "11.a. Rotary hose: function dan pressure test",
                "11.b. Rotary hose: kondisi valves berfungsi baik",
                "11.c. Rotary hose: kelengkapan baut flens",
                "11.d. Rotary hose: kondisi sambungan las fisik utuh",
                "11.e. Rotary hose: tersedia Tagging valve (NO/NC)",
                "11.f. Rotary hose: pressure test min sama dengan BOP",
                "12.a. Accumulator: Volume botol min 1,5x",
                "12.b. Accumulator: Mampu menutup BOP <30 detik",
                "12.c. Accumulator: Memiliki dua power source berlainan",
                "12.d. Accumulator: Pompa udara bekerja di 75 psig",
                "12.e. Accumulator: Hidrolik line dilengkapi safety chain",
                "13. Mud pit diberi pengaman (pagar), bundwall, dan pelindung HD/PE"
            ]
        },
        {
            category: "B.3. WELL CONTROL",
            image: "img/hse-rig/sys_bop.png",
            items: [
                "1.a. BOP harus sesuai antara COC dan Actual Name Plate serta PLO",
                "1.b. Tersedia peralatan pengujian BOP (Stump, Recorder, dll)",
                "1.c. Telah dilakukan function dan pressure test BOP (berita acara)",
                "2.a. Killing line valve: Kesesuaian Pressure rating dengan BOP",
                "2.b. Killing line valve: Kondisi/baut flens utuh, tidak rusak",
                "2.e. Killing line valve: Tersedia Tagging valve (NO/NC)",
                "3.a. Choke Line Valve: Kesesuaian Pressure rating dengan BOP",
                "3.p. Choke Line Valve: Tersedia Tagging valve (NO/NC)",
                "4. Remote Control terpasang di accumulator dan Rig floor",
                "5. Pengujian accumulator setiap pergantian sumur",
                "6.a. Kompressor Angin: pemeriksaan visual, fungsi, dan tekanan kerja",
                "6.b. Sistem saluran udara (hose & Connection) dalam kondisi baik"
            ]
        },
        {
            category: "B.4. SUBSTRUCTURE DAN MAST",
            image: "img/hse-rig/sys_inspect_mast.png",
            items: [
                "1. Pondasi stabil, tidak goyang, tidak turun, rata",
                "2.a. Substructure berdiri tegak di landasan datar",
                "2.b. Semua sambungan pin working platform terpasang (safety pin)",
                "2.c. Working floor tidak licin, berpagar, toeboard bukan temporary",
                "2.e. Kaki substructure & bracing tak bengkok / cacat las",
                "2.g. Pad eye dan Pin dalam kondisi baik",
                "2.i. Tangga kuat, anti slip, ber-hand rail",
                "3.a. Driller Console: Indikator operasi terbaca dengan jelas",
                "3.b. Tombol pengatur memiliki marking penamaan (standar)",
                "3.c. Pengaman tambahan (double safety) pada brake lever, throttle",
                "3.d. Handle rotary table memiliki proteksi putar tak sengaja",
                "3.e. Remote Control accumulator terpasang di Driller Console",
                "3.f. Indikator transmisi Drawwork berfungsi baik",
                "4.a. Monkeyboard terpasang dengan baik (tali pengaman ganda)",
                "5.a. Guy lines: Wire rope ukuran standar, pretension sesuai",
                "5.f. Dilengkapi turn buckle & clamp terpasang benar",
                "5.h. Kelebihan panjang tali labrang dililit rapi & dikawal safety line",
                "6. Pipe rack lengkap dengan stopper besi (2 pcs/rack)",
                "7. Anchor mampu menahan gaya tarik (sudut toleransi max 10°)"
            ]
        },
        {
            category: "B.5. HOISTING TOOLS",
            image: "img/hse-rig/sys_hoisting.png",
            items: [
                "1.a. Travelling block & Hook: Safety latch pada hook",
                "1.b. Safety pin pada poros pulley traveling block",
                "1.c. Tongue/latch masih dapat mengunci dengan benar",
                "1.f. Secara visual pelumasan pada traveling block",
                "2.a. Crown block Sheaves: Kondisi bearing dan keausan grooves",
                "3.a. Sand Line: Tidak berserabut, kawat putus batas aman",
                "4.a. Drilling Line: Tidak bird cage, sisa main drum min 9 lilitan",
                "5.a. Dead Line: Terikat baik sesuai jumlah clamp (API RP9B)",
                "6.a. Power Swivel: Berita acara test, selang (hose) pakai safety chain",
                "7.a. Elevator: Visual shoulder/hinge bebas cacat (Cat III)",
                "8.a. Spider / pipe slip: Periksa kondisi grips bebas tumpul",
                "9. Kelly cock tersedia dan berfungsi baik",
                "10. Rotary table tidak miring, sedia pelindung rantai/sprocket",
                "11.a. Elevator link: Bebas cacat, ada marking Manufacture & SWL",
                "12.a. Rotary / power tong: Body tong bebas indikasi crack",
                "12.e. Back up safety line tong dipasang benar (jangan ditali tiang mast)",
                "13.a. Mesin Pengangkat / Drawwork: Rem dan Kopling function test baik",
                "14.a. Lifting Equipment: Webbing sling / tag line lulus inspeksi"
            ]
        },
        {
            category: "B.6. PRIME MOVER / PENGGERAK, PENERANGAN & SISTEM PENTANAHAN",
            image: "img/hse-rig/sys_power.png",
            items: [
                "1.a. Engine memiliki emergency shutdown & flame-arrestor knalpot",
                "1.b. Pelindung rantai-rantai roda, tdk bocor bahan bakar/oli",
                "1.d. Memiliki pembungkus asbes pembendung exhaust pipe",
                "2.a. Motor listrik / Generator Div 1 / Zone 1 sesuai area",
                "2.j. Penempatan generator minimum 30 meter dari sumur",
                "2.k. Semua elektrik motor/genset/camp di-grounding min 5 ohm",
                "2.n. Instalasi listrik kabel double isolasi, dalam tray, pakai twist lock",
                "3.a. Lampu Sorot Minimum 200 Lux (Kepmenkes 1405)",
                "3.c. Kondisi explosion proof seal utuh, kabel pada tray",
                "4.a. Sistem Grounding terukur < 1 ohm (14 hari operasi berkala)"
            ]
        },
        {
            category: "B.7. ALAT KESELAMATAN",
            image: "img/hse-rig/sys_ppe_fullbody.png",
            items: [
                "1. Tali lari / Escape line (7/16\"), akses bebas, kursi baik (Test 75 kg)",
                "2. Tempat pendaratan (gundukan pasir / sekam) di tiang penambat",
                "3. Climbing belt / full body harness min 3 unit teruji",
                "4. Topi keselamatan (helm) maks 5 tahun difungsikan chin strap",
                "5. Sepatu keselamatan wajib, minimal mata kaki tertutup utuh",
                "6. Sarung tangan: kulit, karet, katun & high impact tersedia",
                "7. Gas mask (monkey board), cannister, & SCBA min 3 ea sedia",
                "12. Fixed gas detector (LEL / H2S) terkoneksi 110 dB alarm",
                "13. Kacamata las, safety glass, pelindung telinga wajib sedia",
                "14. Tandu, Apron, pakaian kerja cover all flame retardant, fire blanket",
                "19. Water spray V-Door / deluge wellhead",
                "20. Tersedia 3 Eye wash (Rig Floor, Tangki, Hopper) & emg shower"
            ]
        },
        {
            category: "B.8. PERALATAN PENANGGULANGAN KEADAAN DARURAT",
            image: "img/hse-rig/sys_inspect_emergency.png",
            items: [
                "1. APAR (9 kg Dry Powder / CO2) area Floor, Genset, Tangki, Dapur dll",
                "1.i. APAB (APAR Beroda) 75 kg dry chemical di well head / tanki BBM",
                "2. Fire pump diesel test running maksimal 6 bulan",
                "3. Terdapat 2 unit blower explosion proof di floor & tangki lumpur",
                "4. Slang kanvas pemadam & Y-piece nozzle utuh sedia 2 tim",
                "6. Air/hydrant min 60 menit untuk pemboran (atau sesuai WS)",
                "7. Minimal 5 orang per shift tim inti Fire Fighting tangguh",
                "8. Obat-obatan kotak P3K sesuai PER.15/MEN/VIII/2008 & buku catat"
            ]
        },
        {
            category: "B.9 / C / D. PERTUKANGAN, MATERIAL & UMUM",
            image: "img/hse-rig/sys_inspect_tools.png",
            items: [
                "1. Palu Tembaga / Kuningan (Non-Sparking) ukuran 3 & 5 kg",
                "2. Kunci trimo uk 18-48, kunci ring-pas utuh gigi tdk bengkok",
                "3. Ketersediaan Lumpur, Kimia, Semen sumur memenuhi AFE",
                "4. Keadaan Lokasi: tanah kompak, rata",
                "5. Kebersihan / 5R area Camp",
                "6. Area Mesin bebas ceceran pelumas/solar (sabuk di-cover)",
                "7. Waste pit berlapis HDPE & berpagar paten tegar ukur tebal",
                "8. Gudang/Doghouse alat rapi, tabung gas ditegakkan & diikat",
                "9. Bengkel Las di jarak zona minimal 50 m",
                "10. Sistem Komunikasi (HT, Radio, Telpon) tes fungsi normal jernih"
            ]
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
    renderRigModules('rig-gas-modules', hseRigData.gasFire, true);
    renderRigModules('rig-lifecycle-modules', hseRigData.wellLifecycle);
    renderRigModules('rig-sequence-modules', hseRigData.rigSequence);
    renderRigModules('rig-parameters-modules', hseRigData.criticalParameters);
    renderRigModules('rig-oversight-modules', hseRigData.hsseOversight);
    if (typeof renderInspectionChecklist === 'function' && hseRigData.inspection) {

        renderInspectionChecklist('rig-inspection-modules', hseRigData.inspection);
    }
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

function renderInspectionChecklist(containerId, dataArray) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = dataArray.map((cat, catIndex) => `
        <div class="inspection-category" style="background: var(--bg-color); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin-bottom: 10px;">
            <div class="category-header" style="background: var(--surface-hover); padding: 12px 15px; cursor: pointer; font-weight: 600; display: flex; justify-content: space-between; align-items: center;" onclick="this.nextElementSibling.classList.toggle('hidden'); this.querySelector('.chevron').textContent = this.nextElementSibling.classList.contains('hidden') ? '▼' : '▲'">
                <span style="color: var(--text-primary);">${cat.category}</span>
                <span class="chevron" style="color: var(--text-muted); margin-left: 10px; font-size: 0.8rem;">▼</span>
            </div>
            <div class="category-items hidden" style="padding: 10px 15px; background: var(--bg-color);">
                ${cat.image ? `<img src="${cat.image}" alt="${cat.category}" style="width: 100%; height: auto; border-radius: 6px; margin-bottom: 15px; border: 1px solid var(--border);">` : ''}
                ${cat.items.map((item, itemIndex) => {
                    const cbId = `chk-${catIndex}-${itemIndex}`;
                    return `
                    <div class="inspection-item-wrapper" style="margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
                        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
                            <label style="display: flex; align-items: flex-start; gap: 12px; cursor: pointer; line-height: 1.4; font-size: 0.9rem; flex: 1;">
                                <input type="checkbox" id="${cbId}" class="inspection-checkbox" style="margin-top: 3px; min-width: 18px; min-height: 18px; accent-color: #38b2ac; cursor: pointer;" onchange="saveInspectionState()">
                                <span style="color: var(--text-color);">${item}</span>
                            </label>
                            <button class="inspection-memo-btn" id="btn-memo-${cbId}" onclick="toggleRigMemo('${cbId}')">
                                📝 Memo
                            </button>
                        </div>
                        
                        <!-- Memo Container (Hidden by default) -->
                        <div id="memo-container-${cbId}" class="inspection-memo-container hidden">
                            <textarea id="memo-text-${cbId}" class="inspection-memo-textarea" 
                                placeholder="Tambahkan pengertian atau catatan pribadi agar cepat hafal..."
                                oninput="this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px'"></textarea>
                            
                            <div id="memo-photo-area-${cbId}">
                                <div id="memo-photo-grid-${cbId}" class="inspection-photo-grid">
                                    <!-- Photos will be injected here -->
                                </div>
                                <div class="inspection-memo-actions" style="margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap;">
                                    <label class="btn btn-secondary btn-small" style="cursor:pointer; font-size: 0.75rem; flex: 1; min-width: 120px; text-align: center;">
                                        📷 Tambah Foto
                                        <input type="file" accept="image/*" multiple style="display:none;" onchange="handleRigPhotos(event, '${cbId}')">
                                    </label>
                                    <button class="btn btn-primary btn-small" onclick="saveRigMemo('${cbId}')" style="font-size: 0.75rem; flex: 1; min-width: 80px;">💾 Simpan</button>
                                    <button class="btn btn-danger btn-small" onclick="clearRigMemo('${cbId}')" style="font-size: 0.75rem; padding: 5px 10px;">🗑️</button>
                                </div>
                            </div>
                            <div id="memo-status-${cbId}" class="memo-saved-indicator hidden">✅ Tersimpan</div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');

    // Load saved state
    loadInspectionState();
}

async function saveInspectionState() {
    const checkboxes = document.querySelectorAll('.inspection-checkbox');
    const items = [];
    checkboxes.forEach(cb => {
        if(cb.checked) items.push({ id: cb.id });
    });
    
    try {
        // Clear old state and put new state
        await db.rig_inspection_state.clear();
        if (items.length > 0) {
            await idbBulkSave('rig_inspection_state', items);
        }
    } catch(e) {
        console.error("Error saving inspection state:", e);
    }
    
    updateInspectionProgress();
}

function updateInspectionProgress() {
    const total = document.querySelectorAll('.inspection-checkbox').length;
    const checked = document.querySelectorAll('.inspection-checkbox:checked').length;
    const progressEl = document.getElementById('inspection-overall-progress');
    if (progressEl) {
        progressEl.textContent = `Progress: ${checked} / ${total} Poin Centang (${Math.round(checked/total*100)}%)`;
    }
}

async function migrateRigToIDB() {
    const MIGRATED_KEY = 'rig_data_migrated_v3';
    if (localStorage.getItem(MIGRATED_KEY)) return;

    console.log("🚚 Migrating Rig Inspection data to IndexedDB...");

    // 1. Migrate Checkbox States
    const savedState = localStorage.getItem('rigInspectionState');
    if (savedState) {
        try {
            const stateObj = JSON.parse(savedState);
            const items = Object.keys(stateObj).filter(id => stateObj[id]).map(id => ({ id }));
            if (items.length > 0) {
                await idbBulkSave('rig_inspection_state', items);
            }
        } catch(e) {}
    }

    // 2. Migrate Memos
    const savedMemos = localStorage.getItem('rigInspectionMemos');
    if (savedMemos) {
        try {
            const memos = JSON.parse(savedMemos);
            const memoEntries = Object.keys(memos).map(id => ({
                id,
                ...memos[id]
            }));
            if (memoEntries.length > 0) {
                await idbBulkSave('rig_memos', memoEntries);
            }
        } catch(e) {}
    }

    localStorage.setItem(MIGRATED_KEY, 'true');
    console.log("✅ Rig Inspection data migration complete.");
}

async function loadInspectionState() {
    // Run migration if needed
    await migrateRigToIDB();

    // Load Checkboxes
    try {
        const stateItems = await idbGetAll('rig_inspection_state');
        stateItems.forEach(item => {
            const cb = document.getElementById(item.id);
            if (cb) cb.checked = true;
        });
        updateInspectionProgress();
    } catch(e) { console.error("Error loading inspection state:", e); }
    
    // Load Memos
    try {
        const memos = await idbGetAll('rig_memos');
        memos.forEach(memo => {
            const id = memo.id;
            const textEl = document.getElementById(`memo-text-${id}`);
            const btnMemo = document.getElementById(`btn-memo-${id}`);
            
            if (textEl && memo.note) {
                textEl.value = memo.note;
                if (btnMemo) btnMemo.classList.add('has-content');
                // Resize textarea
                const doResize = () => {
                    textEl.style.height = 'auto';
                    textEl.style.height = textEl.scrollHeight + 'px';
                };
                setTimeout(doResize, 100);
                setTimeout(doResize, 500);
            }
            
            if (memo.photos || memo.photo) {
                const photos = memo.photos || (memo.photo ? [memo.photo] : []);
                renderRigPhotoGrid(id, photos);
                if (photos.length > 0 && btnMemo) btnMemo.classList.add('has-content');
            }
        });
    } catch(e) { console.error("Error loading memos:", e); }
}

function renderRigPhotoGrid(cbId, photos) {
    const grid = document.getElementById(`memo-photo-grid-${cbId}`);
    if (!grid) return;
    
    grid.innerHTML = photos.map((src, index) => `
        <div class="inspection-photo-item" id="photo-${cbId}-${index}">
            <img src="${src}" alt="Photo ${index + 1}" onclick="viewRigPhotoFull('${src}')" style="cursor: zoom-in;">
            <button class="delete-photo" onclick="removeRigPhoto('${cbId}', ${index})" title="Hapus Foto">✕</button>
        </div>
    `).join('');
    
    // Store temporarily in a data attribute if needed, but we usually just read from grid or store separately
    grid.dataset.photos = JSON.stringify(photos);
}

function viewRigPhotoFull(src) {
    const modal = document.getElementById('rig-photo-modal');
    const img = document.getElementById('rig-photo-full'); // match index.html
    const closeBtn = document.getElementById('close-rig-photo-modal');
    
    if (modal && img) {
        img.src = src;
        modal.classList.remove('hidden');
        
        // Close on X
        if (closeBtn) {
            closeBtn.onclick = () => modal.classList.add('hidden');
        }
        
        // Close on background click
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        };
    }
}

function removeRigPhoto(cbId, index) {
    const grid = document.getElementById(`memo-photo-grid-${cbId}`);
    if (!grid || !grid.dataset.photos) return;
    
    let photos = JSON.parse(grid.dataset.photos);
    photos.splice(index, 1);
    renderRigPhotoGrid(cbId, photos);
}

// ===== MEMO MANAGEMENT =====

function toggleRigMemo(cbId) {
    const container = document.getElementById(`memo-container-${cbId}`);
    if (container) {
        container.classList.toggle('hidden');
        if (!container.classList.contains('hidden')) {
            // Resize textarea when it becomes visible
            const textEl = document.getElementById(`memo-text-${cbId}`);
            if (textEl) {
                textEl.style.height = 'auto'; // Reset height
                textEl.style.height = textEl.scrollHeight + 'px';
            }
        }
    }
}

// Helper function to compress and resize images to save localStorage space
async function compressRigImage(base64Str, maxWidth = 800) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compress to JPEG 70%
        };
    });
}

async function handleRigPhotos(event, cbId) {
    const files = Array.from(event.target.files);
    if (!files || files.length === 0) return;

    const grid = document.getElementById(`memo-photo-grid-${cbId}`);
    const existingPhotos = grid && grid.dataset.photos ? JSON.parse(grid.dataset.photos) : [];
    
    const newPhotos = [];
    
    for (const file of files) {
        const photoData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
        
        // Compress image before adding to the list
        const compressedData = await compressRigImage(photoData);
        newPhotos.push(compressedData);
    }
    
    const allPhotos = [...existingPhotos, ...newPhotos];
    renderRigPhotoGrid(cbId, allPhotos);
    
    // Reset input value so the same file can be uploaded again if needed
    event.target.value = '';
}

async function saveRigMemo(cbId) {
    try {
        const note = document.getElementById(`memo-text-${cbId}`).value;
        const grid = document.getElementById(`memo-photo-grid-${cbId}`);
        const photos = grid && grid.dataset.photos ? JSON.parse(grid.dataset.photos) : [];
        
        await idbSave('rig_memos', {
            id: cbId,
            note: note,
            photos: photos,
            updatedAt: new Date().toISOString()
        });
        
        // UI Feedback
        const status = document.getElementById(`memo-status-${cbId}`);
        const btnMemo = document.getElementById(`btn-memo-${cbId}`);
        
        if (status) {
            status.classList.remove('hidden');
            setTimeout(() => status.classList.add('hidden'), 2000);
        }
        
        if (btnMemo) {
            if (note || (photos && photos.length > 0)) {
                btnMemo.classList.add('has-content');
            } else {
                btnMemo.classList.remove('has-content');
            }
        }
    } catch (e) {
        console.error("Storage Error:", e);
        alert("Gagal menyimpan! Masalah pada database browser.");
    }
}

async function clearRigMemo(cbId) {
    if (!confirm('Hapus memo dan semua foto untuk item ini?')) return;
    
    const textEl = document.getElementById(`memo-text-${cbId}`);
    const grid = document.getElementById(`memo-photo-grid-${cbId}`);
    const btnMemo = document.getElementById(`btn-memo-${cbId}`);
    
    if (textEl) {
        textEl.value = '';
        textEl.style.height = 'auto';
    }
    if (grid) {
        grid.innerHTML = '';
        grid.dataset.photos = '[]';
    }
    if (btnMemo) btnMemo.classList.remove('has-content');
    
    try {
        await idbDelete('rig_memos', cbId);
    } catch(e) { console.error("Error clearing memo:", e); }
    
    toggleRigMemo(cbId);
}

async function generateInspectionPDF() {
    const inspectorName = prompt("Siapa nama Inspektur yang bertugas hari ini?");
    if (!inspectorName) return;
    const rigName = prompt("Nama fasilitas Rig atau Lokasi Sumur:");
    if (!rigName) return;

    // Load state
    const stateItems = await idbGetAll('rig_inspection_state');
    const state = {};
    stateItems.forEach(item => state[item.id] = true);
    
    // Load Memos
    const memoItems = await idbGetAll('rig_memos');
    const memos = {};
    memoItems.forEach(item => memos[item.id] = item);

    // Generate HTML for PDF
    const printDiv = document.createElement('div');
    printDiv.style.padding = '30px';
    printDiv.style.fontFamily = 'Arial, sans-serif';
    printDiv.style.color = '#333';
    printDiv.style.width = '800px';
    
    let html = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ccc; padding-bottom: 10px;">
            <h2 style="margin: 0; color: #1e3a8a;">LAPORAN INSPEKSI KESELAMATAN RIG</h2>
            <p style="margin: 5px 0 0 0; color: #4a5568;">${rigName} | Tanggal: ${new Date().toLocaleDateString('id-ID')} | Pukul: ${new Date().toLocaleTimeString('id-ID')}</p>
        </div>
        <div style="margin-bottom: 20px; font-size: 14px;">
            <strong>Nama Inspektur:</strong> ${inspectorName}<br>
            <strong>Total Poin Terinspeksi:</strong> ${Object.keys(state).length} Poin Centang
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
                <tr style="background: #edf2f7;">
                    <th style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; width: 6%;">No</th>
                    <th style="border: 1px solid #cbd5e0; padding: 8px; text-align: left; width: 74%;">Poin Inspeksi & Penjelasan Detail</th>
                    <th style="border: 1px solid #cbd5e0; padding: 8px; text-align: center; width: 20%;">Status Kelayakan</th>
                </tr>
            </thead>
            <tbody>
    `;

    hseRigData.inspection.forEach((cat, catIndex) => {
        html += `
            <tr style="background: #e2e8f0; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #cbd5e0; padding: 8px; text-align: left; font-size: 12px;">${cat.category}</td>
            </tr>
        `;
        
        cat.items.forEach((item, itemIndex) => {
            const cbId = `chk-${catIndex}-${itemIndex}`;
            const isChecked = state[cbId];
            const statusHtml = isChecked 
                ? '<span style="color: #047857; font-weight: bold;">✅ Lengkap / Baik</span>' 
                : '<span style="color: #c53030; font-weight: bold;">❌ Belum / Kurang</span>';
                
            let itemText = item;
            let number = '-';
            const match = item.match(/^([0-9]+(?:\.[a-z]+)*)[\.\s]*(.*)/);
            if (match) {
                number = match[1];
                itemText = match[2].trim();
            }

            const memo = memos[cbId];
            let memoHtml = '';
            if (memo) {
                if (memo.note) {
                    memoHtml += `<div style="margin-top: 4px; color: #555; background: #fdf2f2; padding: 4px; border-radius: 4px; border-left: 2px solid #e53e3e; font-style: italic;">Memo: ${memo.note}</div>`;
                }
                
                const photos = memo.photos || (memo.photo ? [memo.photo] : []);
                if (photos && photos.length > 0) {
                    memoHtml += `<div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">`;
                    photos.forEach(src => {
                        memoHtml += `<img src="${src}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd;">`;
                    });
                    memoHtml += `</div>`;
                }
            }

            html += `
                <tr>
                    <td style="border: 1px solid #cbd5e0; padding: 6px; text-align: center; vertical-align: top;">${number}</td>
                    <td style="border: 1px solid #cbd5e0; padding: 6px; vertical-align: top; line-height: 1.4;">
                        ${itemText}
                        ${memoHtml}
                    </td>
                    <td style="border: 1px solid #cbd5e0; padding: 6px; text-align: center; vertical-align: middle;">${statusHtml}</td>
                </tr>
            `;
        });
    });

    html += `
            </tbody>
        </table>
        
        <div style="margin-top: 40px; display: flex; justify-content: flex-end;">
            <div style="text-align: center; width: 250px;">
                <p style="margin-bottom: 70px; font-size: 13px;">Disetujui & Diinspeksi Oleh,</p>
                <p style="border-top: 1px solid #333; padding-top: 5px; margin: 0; font-weight: bold;">${inspectorName}</p>
                <p style="margin: 0; font-size: 0.85rem; color: #718096;">Inspektur HSE Lapangan</p>
            </div>
        </div>
    `;

    printDiv.innerHTML = html;
    
    // Temporarily append to body to render
    printDiv.style.position = 'absolute';
    printDiv.style.left = '-9999px';
    document.body.appendChild(printDiv);
    
    // Generate PDF config
    const opt = {
        margin:       10,
        filename:     `Laporan_Inspeksi_Rig_${rigName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(printDiv).save();
    } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Gagal membuat PDF. Pastikan module html2pdf berjalan.");
    } finally {
        document.body.removeChild(printDiv);
    }
}

// Tambahkan inisialisasi ketika DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    // Akan dipanggil oleh navigasi jika user klik tab HSE Rig,
    // atau inisialisasi di awal agar siap
    initHseRig();
});


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

const PJSM_SYSTEM_PROMPT = `Kamu adalah Senior HSSE Officer di Rig Pengeboran Pertamina. Tugasmu menyusun naskah lisan PJSM yang REALISTIK dan PROFESIONAL.

PENTING: Gunakan bahasa SOPAN dan TEGAS. Ikuti struktur persis di bawah ini.

===== DATABASE KESELAMATAN (REFERENSI WAJIB) =====
10 POTENSI BAHAYA: 1. GERAKAN, 2. ELEKTRIKAL, 3. BIOLOGI, 4. RADIASI, 5. SUARA, 6. TEMPERATUR, 7. ZAT KIMIA, 8. MEKANIKAL, 9. TEKANAN, 10. GAYA BERAT.
10 ELEMEN CLSR: 01. Tools, 02. Line of Fire, 03. Hot Work, 04. Confined Space, 05. Powered System, 06. Lifting, 07. Working at Height, 08. Ground Disturbance, 09. Water-Based, 10. Land Transport.
9 PERILAKU WAJIB: 1. PIP, 2. Kompeten, 3. Fit to Work, 4. APD Sesuai, 5. LMRA, 6. Lapor Anomali, 7. Permit SIKA, 8. Housekeeping, 9. Patuh CLSR.

STRUKTUR NASKAH (WAJIB):
1. PEMBUKAAN & APRESIASI:
"Assalamualaikum Warahmatullahi Wabarakatuh dan selamat [pagi/sore] bapak-bapak sekalian.
Pertama-tama, mari kita panjatkan puji syukur kehadirat Allah SWT, Tuhan Yang Maha Esa, karena atas rahmat-Nya kita senantiasa diberikan kelancaran dan keselamatan dalam pekerjaan kita sehari hari.
Tak lupa ucapan terima kasih kepada bapak-bapak semua untuk 12 jam sebelumnya sudah bekerja dengan aman, sudah bekerja dengan selamat, dan insyaallah akan terus terlanjut sampai 12 jam ke depan."

2. TRANSISI & HANDOVER:
"Selanjutnya mohon kesediannya kepada Pak Darmadi selaku PA untuk menyampaikan apabila ada handover atau serah terima dari kru sebelumnya atau shift pagi/malam, dan juga kepada Pak Faruq selaku AA atau area authority untuk penyampaian program kerja kita selama 12 jam ke depan. Kepada Pak Darmadi atau Pak Faruq saya persilakan."

3. TERIMA KASIH & PROGRAM KERJA:
"Terima kasih atas penyampaian dari Pak Faruq dan masukan dari bapak-bapak sekalian. Izin bapak-bapak, program kerja kita hari ini adalah [SEBUTKAN DAFTAR PEKERJAAN]."
- Tekankan kembali agar SIKA (Surat Izin Kerja Aman) sudah ditandatangani dan divalidasi sesuai 9 Perilaku Wajib poin ke-7.

4. ANALISIS BAHAYA & PESAN KUSTOM:
- Identifikasi bahaya pekerjaan dari 10 POTENSI BAHAYA.
- Hubungkan mitigasi dengan elemen CLSR yang relevan.
- SISIPKAN "Pesan Tambahan Kustom" jika ada. Gunaan Highlight (==teks==) untuk bagian ini agar menonjol.
- Gunakan instruksi: **PASTIKAN!**, **CEK!**, **JAUHI!**.

5. PESAN/SLOGAN SAFETY DYNAMIS:
"Rekan-rekan sekalian, mari kita selalu terapkan [PILIH SALAH SATU SETIAP GENERATE: HSSE Golden Rules (Patuh, Intervensi, Peduli), Slogan 3T3M (Tahu Pekerjaan, Bahaya, Mitigasi & Mengetahui, Memahami, Melaksanakan), atau Prinsip TEMAN KARIB (Teman Kita Ingatkan Risiko)]."
- Jelaskan singkat makna slogan tersebut dalam konteks pekerjaan hari ini.
- Ingat poin 9 Perilaku Wajib: Patuh pada aturan.

6. PENUTUP & DOA (Wajib Seperti Ini):
"Sebelum kita mulai pekerjaan kita hari ini ada baiknya, kita berdoa menurut agama dan kepercayaan masing-masing agar pekerjaan hari ini berjalan lancar, selamat, dan berkah. Berdoa dipersilahkan.

(Berdoa)

Berdoa selesai. Wabillahi taufik walhidayah wassalamualaikum warahmatullahi wabarakatuh."

ATURAN OUTPUT:
- Gunakan Bold (**) untuk poin penting.
- Gunakan Highlight (==teks==) untuk poin-poin kunci yang perlu DIHAFAL atau DIBACA DENGAN PENEKANAN agar bapak lebih mudah menghafalnya.
- JANGAN gunakan heading (#).
- Naskah harus mengalir alami secara lisan.`;

function formatPJSMContent(text) {
    if (!text) return '';
    
    // 1. Basic Markdown Bold: **text** -> <strong>text</strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #e53e3e;">$1</strong>');
    
    // 2. Highlight text for memorization: ==text== -> <mark>text</mark>
    // We use a specific vivid yellow with dark text for high visibility
    formatted = formatted.replace(/==(.*?)==/g, '<mark style="background-color: #fef08a; color: #1a202c; padding: 2px 4px; border-radius: 4px; font-weight: bold;">$1</mark>');
    
    // 3. Preserve newlines by turning them into double <br> for breathing space
    formatted = formatted.replace(/\n\n/g, '<br><br><div style="height:10px;"></div>');
    formatted = formatted.replace(/\n/g, '<br><br>');
    
    return formatted;
}


let pjsmSpeechUtterance = null;

async function generatePJSM(workDescOverride = null) {
    if (workDescOverride instanceof Event) workDescOverride = null;
    const input = document.getElementById('pjsm-work-input');
    const loading = document.getElementById('pjsm-loading');
    const resultArea = document.getElementById('pjsm-result-area');
    const content = document.getElementById('pjsm-content');
    const btn = document.getElementById('generate-pjsm-btn');

    const workList = workDescOverride || input?.value?.trim();
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
        const aaName = document.getElementById('pjsm-aa-input')?.value || 'Pak Faruq';
        const paName = document.getElementById('pjsm-pa-input')?.value || 'Pak Darmadi';
        const customMsg = document.getElementById('pjsm-custom-msg')?.value?.trim() || '';
        const shiftInput = document.querySelector('input[name="pjsm-shift-input"]:checked');
        const shiftName = shiftInput ? shiftInput.value : 'Siang';

        const payload = {
            systemInstruction: { parts: [{ text: PJSM_SYSTEM_PROMPT }] },
            contents: [{
                role: "user",
                parts: [{
                    text: `DATA INPUT:
- DAFTAR PEKERJAAN: ${workList}
- NAMA AA: ${aaName}
- NAMA PA: ${paName}
- SHIFT KERJA: ${shiftName}
- PESAN TAMBAHAN KUSTOM: ${customMsg}

Buatkan naskah PJSM lengkap untuk shift ${shiftName}. Wajib masukkan nama ${aaName} dan ${paName}. 
Jika ada PESAN TAMBAHAN KUSTOM, sisipkan di bagian Analisis Bahaya dengan format highlight ==teks==.`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048
            }
        };

        let text = await unifiedGeminiCall(payload);

        if (!text) throw new Error('Respon AI kosong');

        // Markdown Cleanup
        text = text.replace(/```[a-z]*\n/g, '').replace(/```/g, '');

        console.log('PJSM Result length:', text.length);
        content.innerHTML = formatPJSMContent(text);
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
    if (!content || !content.innerText) return;

    navigator.clipboard.writeText(content.innerText).then(() => {
        const btn = document.getElementById('copy-pjsm-btn');
        const original = btn.textContent;
        btn.textContent = '✅ Tersalin!';
        setTimeout(() => btn.textContent = original, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = content.innerText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Naskah PJSM berhasil dicopy!');
    });
}

function speakPJSM() {
    const content = document.getElementById('pjsm-content');
    if (!content || !content.innerText) return;

    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    pjsmSpeechUtterance = new SpeechSynthesisUtterance(content.innerText);
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

function exportPJSMToPDF() {
    const content = document.getElementById('pjsm-content');
    if (!content || !content.innerText) {
        alert('Naskah PJSM belum digenerate.');
        return;
    }

    const workInput = document.getElementById('pjsm-work-input')?.value || 'Daily Operation';
    const firstLine = workInput.split('\n')[0].substring(0, 40);
    const title = `PJSM: ${firstLine}`;
    
    const printWindow = window.open('', '_blank', 'height=900,width=1100');
    if (!printWindow) {
        alert('Pop-up terblokir! Silakan izinkan pop-up.');
        return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    printWindow.document.write(`
        <html>
        <head>
            <title>${title}</title>
            <style>
                @page { size: A4 portrait; margin: 15mm; }
                body {
                    font-family: 'Times New Roman', Times, serif;
                    color: #000;
                    background: #fff;
                    margin: 0; padding: 0;
                    line-height: 1.6;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .document-wrapper { max-width: 100%; margin: 0 auto; }
                .header {
                    background: #fff;
                    padding: 20px 0;
                    text-align: center;
                    margin-bottom: 25px;
                    border-bottom: 3px solid #000;
                    color: #000;
                }
                .header h2 { font-size: 20pt; font-weight: 700; text-transform: uppercase; margin: 0; letter-spacing: 1px; }
                .header h3 { font-size: 12pt; font-weight: 400; color: #000; margin: 5px 0 0 0; opacity: 1; }
                
                .meta-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                    border: 1.2px solid #000;
                    background: #fff;
                }
                .meta-table td { padding: 8px 15px; border: 1.2px solid #000; vertical-align: top; }
                .meta-label { font-size: 8pt; color: #444; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
                .meta-value { font-size: 10.5pt; font-weight: 700; color: #000; }
                
                .content-body { font-size: 11pt; color: #000; padding: 0 10px; }
                .content-body strong { color: #000; text-decoration: underline; font-weight: 700; }
                
                .footer-table {
                    width: 100%;
                    text-align: center;
                    font-size: 10.5pt;
                    margin-top: 70px;
                    border-collapse: collapse;
                    page-break-inside: avoid;
                }
                .footer-table td { border: 1px solid #000; padding: 20px 10px; }
                
                .watermark {
                    margin-top: 70px; text-align: center; font-size: 8.5pt; color: #000; 
                    font-weight: 600;
                    border-top: 2px solid #000; padding-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="document-wrapper">
                <div class="header">
                    <h2>HSE DEPARTMENT</h2>
                    <h3>PRE-JOB SAFETY MEETING (PJSM) / TOOLBOX TALK</h3>
                </div>

                <table class="meta-table">
                    <tr>
                        <td style="width: 60%;">
                            <div class="meta-label">Topic / Work Description</div>
                            <div class="meta-value">${workInput}</div>
                        </td>
                        <td style="width: 40%;">
                            <div class="meta-label">Date & Time</div>
                            <div class="meta-value">${dateStr}, ${timeStr} WITA</div>
                        </td>
                    </tr>
                </table>

                <div class="content-body">
                    ${content.innerHTML}
                </div>

                <table class="footer-table">
                    <tr>
                        <td style="width: 50%;">
                            <p>Disiapkan Oleh,</p>
                            <div style="height: 100px;"></div>
                            <p><strong>(..................................)</strong></p>
                            <p>HSSE Officer / Supervisor</p>
                        </td>
                        <td style="width: 50%;">
                            <p>Diketahui Oleh,</p>
                            <div style="height: 100px;"></div>
                            <p><strong>(..................................)</strong></p>
                            <p>Company Man / Rig Manager</p>
                        </td>
                    </tr>
                </table>

                <div class="watermark">
                    Generated via Jurnal AI - Professional Field Systems<br>
                    Official HSE Professional Documentation - Certified System.
                </div>
            </div>
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 800);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

async function savePJSMToLibrary() {
    const content = document.getElementById('pjsm-content');
    const input = document.getElementById('pjsm-work-input');
    const workList = input?.value?.trim() || 'Daily Operation';

    if (!content || !content.innerText || content.innerText.length < 10) {
        alert('Tidak ada naskah yang bisa disimpan.');
        return;
    }

    const firstLine = workList.split('\n')[0].substring(0, 30);
    const title = `PJSM: ${firstLine}${workList.length > 30 ? '...' : ''}`;
    
    const item = {
        title: title,
        content: content.innerHTML,
        category: 'HSE',
        type: 'pjsm',
        timestamp: new Date().toISOString()
    };

    if (typeof saveGeneration === 'function') {
        const btn = document.getElementById('save-pjsm-btn');
        const original = btn.innerHTML;
        
        try {
            await saveGeneration(item);
            btn.innerHTML = '✅ Disimpan';
            btn.style.background = 'var(--success)';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = 'var(--secondary)';
                btn.disabled = false;
            }, 3000);
            
            // Trigger refresh in library if the module exists
            if (window.refreshLibraryUI) window.refreshLibraryUI();
        } catch (error) {
            alert('Gagal menyimpan ke perpustakaan: ' + error.message);
        }
    } else {
        alert('Fungsi simpan belum tersedia.');
    }
}

// Initialize PJSM event listeners
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-pjsm-btn');
    const copyBtn = document.getElementById('copy-pjsm-btn');
    const speakBtn = document.getElementById('speak-pjsm-btn');
    const stopBtn = document.getElementById('stop-speak-pjsm-btn');
    const exportPdfBtn = document.getElementById('export-pjsm-pdf-btn');
    const saveBtn = document.getElementById('save-pjsm-btn');

    if (generateBtn) generateBtn.addEventListener('click', generatePJSM);
    if (copyBtn) copyBtn.addEventListener('click', copyPJSM);
    if (speakBtn) speakBtn.addEventListener('click', speakPJSM);
    if (stopBtn) stopBtn.addEventListener('click', stopSpeakPJSM);
    if (exportPdfBtn) exportPdfBtn.addEventListener('click', exportPJSMToPDF);
    if (saveBtn) saveBtn.addEventListener('click', savePJSMToLibrary);

    // Rig Checklist
    const generateCbBtn = document.getElementById('generate-checklist-btn');
    if (generateCbBtn) generateCbBtn.addEventListener('click', generateRigChecklist);
    
    const copyCbBtn = document.getElementById('copy-checklist-btn');
    if (copyCbBtn) copyCbBtn.addEventListener('click', copyRigChecklist);
    
    const exportCbBtn = document.getElementById('export-checklist-pdf-btn');
    if (exportCbBtn) exportCbBtn.addEventListener('click', exportRigChecklistPDF);
});

// ===== RIG SAFETY CHECKLIST GENERATOR (V4 - SMART TEMPLATE) =====

const RIG_TEMPLATES = {
    'Hoist H-25': {
        items: [
            { type: 'bop', label: 'Function Test BOP (Open-Close)', bopType: 'Pipe Ram', time: '3' },
            { type: 'acc', label: 'Pressure Test Accumulator', psi: '3000', hold: '13' },
            { type: 'simple', label: 'Function Test Crown O Matic' },
            { type: 'surface', label: 'Pressure Test Surface Line & BPM', psi: '1100', hold: '10' },
            { type: 'grounding', label: 'Pengukuran Grounding', hoist: '0.15', equip: '0.94', genset: '0.24', porta: '1.0' },
            { type: 'simple', label: 'Instrument Driller Console' },
            { type: 'simple', label: 'Function Test Fire Pump' },
            { type: 'simple', label: 'Grating Mud Tank' }
        ],
        notes: [
             { type: 'aa', label: 'AA SG Tersedia', sg: '1.01', vol: '200', loc: 'mud tank' }
        ]
    },
    'Hoist L-350': {
        items: [
            { type: 'bop', label: 'Function Double ram BOP (Open-Close)', bopType: 'Double Ram', time: '3' },
            { type: 'acc', label: 'Pressure Test Accumulator', psi: '3000', hold: '9' },
            { type: 'simple', label: 'Function Test Crown O Matic' },
            { type: 'simple', label: 'Instrumen Driller Console' },
            { type: 'surface', label: 'Pressure Test Surface Line', psi: '1000', hold: '5' },
            { type: 'grounding', label: 'Pengukuran Grounding', hoist: '0.26', equip: '0.37', genset: '0.44', porta: '0.46' },
            { type: 'simple', label: 'Terpasang Pagar di Area Working Floor' },
            { type: 'simple', label: 'Grating Mud tank' },
            { type: 'simple', label: 'Tersedia Fix Gas Detector' },
            { type: 'simple', label: 'Tersedia Fire Truck' }
        ],
        notes: [
            { type: 'aa', label: 'AA SG Tersedia', sg: '1.01', vol: '120', loc: 'mud tank' },
            { type: 'tb', label: 'Travelling Block Check', dist: '2' }
        ]
    }
};

let checklistRawResult = ''; 
let rigChecklistPhotos = {}; // itemKey -> [base64]

// Dynamic Badge & UI logic
document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('hse-rig-checklist-screen');
    if (!screen) return;

    const rigSelect = document.getElementById('checklist-rig-name');
    const saveLibBtn = document.getElementById('save-rig-lib-btn');

    if (rigSelect) {
        rigSelect.addEventListener('change', () => {
            rigChecklistPhotos = {}; // Reset photos when rig changes
            renderRigChecklistItems(rigSelect.value);
        });
        // Initial render
        renderRigChecklistItems(rigSelect.value);
    }

    if (saveLibBtn) saveLibBtn.addEventListener('click', saveRigChecklistToLibrary);

    // Set default date to today
    const dateInput = document.getElementById('checklist-date');
    if (dateInput) dateInput.value = getTodayString();
});

function renderRigChecklistItems(rigName) {
    const container = document.getElementById('rig-checklist-items-container');
    const notesContainer = document.getElementById('rig-notes-section-container');
    if (!container || !notesContainer) return;

    const template = RIG_TEMPLATES[rigName] || RIG_TEMPLATES['Hoist L-350'];
    
    // 1. Render Main Items
    let itemsHtml = '';
    template.items.forEach((item, idx) => {
        itemsHtml += `
            <div class="rig-check-item" data-type="${item.type}" data-key="main-${idx}">
                <div class="rig-check-header">
                    <label class="rig-check-label">
                        <input type="checkbox" class="rig-cb" data-idx="${idx}" checked> 
                        <strong>${idx+1}.</strong> ${item.label}
                    </label>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="rig-photo-btn" onclick="triggerRigPhotoUpload('main-${idx}')">📷</button>
                        <span class="rig-badge rig-badge-ok" id="badge-${idx}">✅ Baik</span>
                    </div>
                </div>
                ${renderItemInputs(item, idx)}
                <div id="preview-main-${idx}" class="rig-photo-preview"></div>
                <input type="file" id="input-main-${idx}" class="hidden" accept="image/*" onchange="handleRigPhotoUpload(this, 'main-${idx}')">
            </div>
        `;
    });
    container.innerHTML = itemsHtml;

    // 2. Render Notes Section
    let notesHtml = '<div class="card" style="border-left: 4px solid #10b981;"><h4 style="margin: 0 0 12px 0; font-size: 0.95rem;">📝 Notes / Catatan Standar</h4>';
    template.notes.forEach((note, idx) => {
        notesHtml += renderNoteInputs(note, idx);
    });
    notesHtml += '</div>';
    notesContainer.innerHTML = notesHtml;

    // Attach listeners to new checkboxes
    container.querySelectorAll('.rig-cb').forEach(cb => {
        cb.addEventListener('change', () => {
            const idx = cb.dataset.idx;
            const badge = document.getElementById(`badge-${idx}`);
            if (badge) {
                if (cb.checked) {
                    badge.textContent = '✅ Baik';
                    badge.className = 'rig-badge rig-badge-ok';
                } else {
                    badge.textContent = '⚠️ Temuan';
                    badge.className = 'rig-badge rig-badge-fail';
                }
            }
        });
    });
}

function renderItemInputs(item, idx) {
    if (item.type === 'bop') {
        return `
            <div class="rig-check-inputs">
                <select class="input input-sm rsc-bop-type">
                    <option value="Pipe Ram" ${item.bopType === 'Pipe Ram' ? 'selected' : ''}>Pipe Ram</option>
                    <option value="Double Ram" ${item.bopType === 'Double Ram' ? 'selected' : ''}>Double Ram</option>
                </select>
                <input type="text" class="input input-sm rsc-bop-time" value="${item.time}" style="width:60px;"> <span class="input-unit">detik</span>
            </div>
        `;
    }
    if (item.type === 'acc') {
        return `
            <div class="rig-check-inputs">
                <input type="text" class="input input-sm rsc-acc-psi" value="${item.psi}" style="width:70px;"> <span class="input-unit">psi /</span>
                <input type="text" class="input input-sm rsc-acc-hold" value="${item.hold}" style="width:50px;"> <span class="input-unit">menit</span>
            </div>
        `;
    }
    if (item.type === 'surface') {
        return `
            <div class="rig-check-inputs">
                <input type="text" class="input input-sm rsc-surface-psi" value="${item.psi}" style="width:70px;"> <span class="input-unit">psig /</span>
                <input type="text" class="input input-sm rsc-surface-hold" value="${item.hold}" style="width:50px;"> <span class="input-unit">menit</span>
            </div>
        `;
    }
    if (item.type === 'grounding') {
        return `
            <div class="rig-check-inputs" style="flex-wrap: wrap;">
                <span class="input-unit">Hoist</span> <input type="text" class="input input-sm rsc-gnd-hoist" value="${item.hoist}" style="width:55px;"> <span class="input-unit">Ω</span>
                <span class="input-unit" style="margin-left:5px;">Equip</span> <input type="text" class="input input-sm rsc-gnd-equip" value="${item.equip}" style="width:55px;"> <span class="input-unit">Ω</span>
            </div>
            <div class="rig-check-inputs" style="margin-top: 4px; flex-wrap: wrap;">
                <span class="input-unit">Genset</span> <input type="text" class="input input-sm rsc-gnd-genset" value="${item.genset}" style="width:55px;"> <span class="input-unit">Ω</span>
                <span class="input-unit" style="margin-left:5px;">Portacamp</span> <input type="text" class="input input-sm rsc-gnd-porta" value="${item.porta}" style="width:55px;"> <span class="input-unit">Ω</span>
            </div>
        `;
    }
    return ''; 
}

function renderNoteInputs(note, idx) {
    const key = `note-${idx}`;
    if (note.type === 'aa') {
        return `
            <div class="rig-check-item" data-key="${key}">
                <div class="rig-check-header">
                    <label class="rig-check-label"><input type="checkbox" class="rsc-aa-toggle" checked> ${note.label}</label>
                    <button class="rig-photo-btn" onclick="triggerRigPhotoUpload('${key}')">📷</button>
                </div>
                <div class="rig-check-inputs">
                    <select class="input input-sm rsc-aa-type" style="width: 80px;">
                        <option value="1.01" ${note.sg === '1.01' ? 'selected' : ''}>SG 1.01</option>
                        <option value="1.05" ${note.sg === '1.05' ? 'selected' : ''}>SG 1.05</option>
                        <option value="1.10" ${note.sg === '1.10' ? 'selected' : ''}>SG 1.10</option>
                    </select>
                    <input type="text" class="input input-sm rsc-aa-vol" value="${note.vol}" style="width:60px;"> <span class="input-unit">bbls</span>
                    <span class="input-unit" style="margin-left:5px;">di</span>
                    <input type="text" class="input input-sm rsc-aa-loc" value="${note.loc}" style="width:90px;">
                </div>
                <div id="preview-${key}" class="rig-photo-preview"></div>
                <input type="file" id="input-${key}" class="hidden" accept="image/*" onchange="handleRigPhotoUpload(this, '${key}')">
            </div>
        `;
    }
    if (note.type === 'tb') {
        return `
            <div class="rig-check-item" data-key="${key}">
                <div class="rig-check-header">
                    <label class="rig-check-label"><input type="checkbox" class="rsc-tb-toggle" checked> ${note.label}</label>
                    <button class="rig-photo-btn" onclick="triggerRigPhotoUpload('${key}')">📷</button>
                </div>
                <div class="rig-check-inputs">
                    <span class="input-unit">Berhenti</span>
                    <input type="text" class="input input-sm rsc-tb-dist" value="${note.dist}" style="width:50px;"> <span class="input-unit">meter di bawah crown block</span>
                </div>
                <div id="preview-${key}" class="rig-photo-preview"></div>
                <input type="file" id="input-${key}" class="hidden" accept="image/*" onchange="handleRigPhotoUpload(this, '${key}')">
            </div>
        `;
    }
    return '';
}

// Photo Handlers
function triggerRigPhotoUpload(key) {
    document.getElementById(`input-${key}`).click();
}

function handleRigPhotoUpload(input, key) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!rigChecklistPhotos[key]) rigChecklistPhotos[key] = [];
            rigChecklistPhotos[key].push(e.target.result);
            renderRigPhotoPreviews(key);
            input.value = ''; // Reset input
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function renderRigPhotoPreviews(key) {
    const list = rigChecklistPhotos[key] || [];
    const container = document.getElementById(`preview-${key}`);
    if (!container) return;

    container.innerHTML = list.map((src, idx) => `
        <div class="rig-thumb-container">
            <img src="${src}">
            <div class="rig-thumb-remove" onclick="removeRigPhoto('${key}', ${idx})">✕</div>
        </div>
    `).join('');
}

function removeRigPhoto(key, idx) {
    if (rigChecklistPhotos[key]) {
        rigChecklistPhotos[key].splice(idx, 1);
        renderRigPhotoPreviews(key);
    }
}

async function generateRigChecklist() {
    const rigName = document.getElementById('checklist-rig-name')?.value || 'Hoist L-350';
    const location = document.getElementById('checklist-location')?.value || 'ST-223';
    const dateVal = document.getElementById('checklist-date')?.value || getTodayString();
    const timeStr = document.getElementById('checklist-time')?.value || '20.00 s/d 23.00 WITA';
    const program = document.getElementById('checklist-program')?.value || 'Daily Activity';
    
    let dateStr = dateVal;
    try {
        const d = new Date(dateVal);
        dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch(e) {}

    const resultArea = document.getElementById('checklist-result-area');
    const content = document.getElementById('checklist-content');
    const btn = document.getElementById('generate-checklist-btn');

    const reports = [];
    const items = document.querySelectorAll('#rig-checklist-items-container .rig-check-item');
    
    items.forEach((itemEl, idx) => {
        const cb = itemEl.querySelector('.rig-cb');
        if (cb && cb.checked) {
            const type = itemEl.dataset.type;
            const key = itemEl.dataset.key;
            const label = cb.parentElement.textContent.replace(/^\s*\d+\.\s*/, '').trim();
            const hasPhoto = rigChecklistPhotos[key] && rigChecklistPhotos[key].length > 0;
            const photoIndicator = hasPhoto ? " [Terlampir Foto]" : "";

            if (type === 'bop') {
                const bopType = itemEl.querySelector('.rsc-bop-type')?.value;
                const time = itemEl.querySelector('.rsc-bop-time')?.value;
                reports.push(`${label} (${bopType}) ${time} Detik, Hasil Baik${photoIndicator}`);
            } else if (type === 'acc') {
                const psi = itemEl.querySelector('.rsc-acc-psi')?.value;
                const hold = itemEl.querySelector('.rsc-acc-hold')?.value;
                reports.push(`${label} ${psi} psi/${hold} menit, hasil baik${photoIndicator}`);
            } else if (type === 'surface') {
                const psi = itemEl.querySelector('.rsc-surface-psi')?.value;
                const hold = itemEl.querySelector('.rsc-surface-hold')?.value;
                reports.push(`${label} ${psi} psig/${hold} menit, hasil baik${photoIndicator}`);
            } else if (type === 'grounding') {
                const h = itemEl.querySelector('.rsc-gnd-hoist')?.value;
                const e = itemEl.querySelector('.rsc-gnd-equip')?.value;
                const g = itemEl.querySelector('.rsc-gnd-genset')?.value;
                const p = itemEl.querySelector('.rsc-gnd-porta')?.value;
                reports.push(`${label} hoist ${h} ohm, Equipment ${e} ohm, Genset ${g} ohm & Portacamp ${p} ohm, Hasil Baik${photoIndicator}`);
            } else {
                reports.push(`${label}, hasil baik${photoIndicator}`);
            }
        }
    });

    const notes = [];
    const aaToggle = document.querySelector('.rsc-aa-toggle');
    if (aaToggle && aaToggle.checked) {
        const parent = aaToggle.closest('.rig-check-item');
        const key = parent.dataset.key;
        const type = parent.querySelector('.rsc-aa-type')?.value;
        const vol = parent.querySelector('.rsc-aa-vol')?.value;
        const loc = parent.querySelector('.rsc-aa-loc')?.value;
        const hasPhoto = rigChecklistPhotos[key] && rigChecklistPhotos[key].length > 0;
        notes.push(`- Tersedia AA SG ${type} di ${loc} : ${vol} bbls${hasPhoto ? " (Dok. Foto Ada)" : ""}`);
    }

    const tbToggle = document.querySelector('.rsc-tb-toggle');
    if (tbToggle && tbToggle.checked) {
        const parent = tbToggle.closest('.rig-check-item');
        const key = parent.dataset.key;
        const dist = parent.querySelector('.rsc-tb-dist')?.value;
        const hasPhoto = rigChecklistPhotos[key] && rigChecklistPhotos[key].length > 0;
        notes.push(`- Travelling block berhenti ${dist} meter di bawah crown block${hasPhoto ? " (Dok. Foto Ada)" : ""}`);
    }

    const extraFindings = document.getElementById('checklist-findings-input')?.value?.trim();
    if (extraFindings) {
        notes.push(extraFindings);
    }

    const greeting = getGreetingTime();
    let reportText = `Selamat ${greeting},
Dengan Hormat,

Berikut disampaikan hasil temuan dari Rig Safety Checklist ${rigName} di lokasi sumur ${location} pada tanggal ${dateStr} pukul ${timeStr}, untuk program ${program} sebagai berikut:

`;

    reports.forEach((line, i) => {
        reportText += `${i+1}. ${line}\n`;
    });

    if (notes.length > 0) {
        reportText += `\nNotes:\n${notes.join('\n')}\n`;
    }

    reportText += `\nDemikian disampaikan, atas perhatiannya diucapkan, Terima Kasih.
Salam,
Team Operational Rig Safety Checklist`;

    checklistRawResult = reportText;

    content.innerHTML = reportText.replace(/\n/g, '<br>').replace(/Baik/g, '<strong style="color: #10b981;">Baik</strong>');
    resultArea.classList.remove('hidden');
    resultArea.scrollIntoView({ behavior: 'smooth' });
}

function getGreetingTime() {
    const hour = new Date().getHours();
    if (hour < 11) return 'Pagi';
    if (hour < 15) return 'Siang';
    if (hour < 19) return 'Sore';
    return 'Malam';
}

async function saveRigChecklistToLibrary() {
    if (!checklistRawResult) {
        alert('Silakan generate checklist terlebih dahulu!');
        return;
    }

    const rigName = document.getElementById('checklist-rig-name')?.value || 'Rig';
    const location = document.getElementById('checklist-location')?.value || 'Loc';
    const timestamp = new Date().toISOString();
    
    const item = {
        id: 'rsc_' + Date.now(),
        title: `Rig Safety Checklist: ${rigName} - ${location}`,
        content: checklistRawResult,
        category: 'HSE',
        type: 'text',
        timestamp: timestamp
    };

    try {
        await saveGeneration(item);
        const btn = document.getElementById('save-rig-lib-btn');
        btn.innerHTML = '✅ Tersimpan!';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = '💾 Simpan ke Perpustakaan';
            btn.disabled = false;
        }, 3000);
        
        if (typeof refreshLibraryUI === 'function') refreshLibraryUI();
    } catch (err) {
        console.error(err);
        alert('Gagal menyimpan ke perpustakaan.');
    }
}

function copyRigChecklist() {
    if (!checklistRawResult) return;
    navigator.clipboard.writeText(checklistRawResult).then(() => {
        const btn = document.getElementById('copy-checklist-btn');
        const original = btn.innerHTML;
        btn.innerHTML = '✅ Tersalin!';
        setTimeout(() => btn.innerHTML = original, 2000);
    }).catch(() => {
        alert('Gagal menyalin teks. Silakan blok dan copy langsung.');
    });
}

function exportRigChecklistPDF() {
    if (!checklistRawResult) {
        alert('Laporan belum dibuat. Silakan klik Generate terlebih dahulu.');
        return;
    }

    const rigName = document.getElementById('checklist-rig-name')?.value || 'Hoist L-350';
    const wellLoc = document.getElementById('checklist-location')?.value || 'ST-223';
    const prog = document.getElementById('checklist-program')?.value || 'Operational';
    
    // 1. Prepare Main Findings Content
    const findingsLines = checklistRawResult.split('\n');
    let findingsHtml = '';
    findingsLines.forEach(line => {
        if (!line.trim()) return;
        const colorStyle = line.includes('Hasil Baik') ? 'color: #15803d;' : '';
        findingsHtml += `<p style="margin: 0 0 8pt 0; ${colorStyle}">${line}</p>`;
    });

    // 2. Prepare Photo Annex Content
    let photosHtml = '';
    const photoKeys = Object.keys(rigChecklistPhotos).filter(k => rigChecklistPhotos[k] && rigChecklistPhotos[k].length > 0);
    if (photoKeys.length > 0) {
        photosHtml += `
            <div style="page-break-before: always; padding-top: 20px; border-top: 2px solid #3182ce; margin-top: 40px;">
                <h3 style="color: #3182ce; text-transform: uppercase; margin-bottom: 20px;">Attachment: Visual Documentation</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        `;

        photoKeys.forEach(key => {
            const list = rigChecklistPhotos[key];
            let label = "";
            if (key.startsWith('main-')) {
                const idx = parseInt(key.split('-')[1]);
                const itemEl = document.querySelector(`.rig-check-item[data-key="${key}"]`);
                label = itemEl ? itemEl.querySelector('strong').nextSibling.textContent.trim() : `Item ${idx+1}`;
            } else {
                label = key === 'note-0' ? 'AA SG Status' : 'Travelling Block Status';
            }

            list.forEach((src, sIdx) => {
                photosHtml += `
                    <div style="border: 1px solid #ddd; padding: 10px; text-align: center; page-break-inside: avoid;">
                        <div style="height: 250px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; background: #fefefe;">
                            <img src="${src}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                        </div>
                        <div style="font-size: 9pt; font-weight: bold; color: #444;">${label} (Img ${sIdx+1})</div>
                    </div>
                `;
            });
        });
        photosHtml += `</div></div>`;
    }

    // 3. Open Print Window
    const printWindow = window.open('', '_blank', 'height=900,width=1100');
    if (!printWindow) {
        alert('Pop-up terblokir! Silakan izinkan pop-up untuk mencetak PDF.');
        return;
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>RSC Report - ${rigName}</title>
            <style>
                @page {
                    size: A4 portrait;
                    margin: 15mm;
                }
                body {
                    font-family: 'Times New Roman', Times, serif;
                    color: #000;
                    background: #fff;
                    margin: 0;
                    padding: 0;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .document-wrapper {
                    max-width: 100%;
                    margin: 0 auto;
                }
                .gacor-header {
                    background: #fff;
                    padding: 15px 0;
                    text-align: center;
                    margin-bottom: 25px;
                    border-bottom: 3px solid #000;
                }
                .gacor-header h2 {
                    font-size: 20pt;
                    font-weight: 700;
                    color: #000;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin: 0 0 5px 0;
                }
                .gacor-header h3 {
                    font-size: 13pt;
                    font-weight: 400;
                    color: #000;
                    margin: 0;
                    letter-spacing: 0.5px;
                }
                .meta-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                    border: 1.2px solid #000;
                }
                .meta-table td {
                    padding: 8px 15px;
                    border: 1.2px solid #000;
                    vertical-align: top;
                }
                .meta-label {
                    font-size: 8pt;
                    color: #444;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }
                .meta-value {
                    font-size: 10pt;
                    font-weight: 700;
                    color: #000;
                }
                .content-body {
                    font-size: 10.5pt;
                    line-height: 1.5;
                    margin-bottom: 35px;
                    padding: 0 5px;
                    color: #000;
                }
                .content-body p {
                    margin: 0 0 10pt 0;
                    padding-left: 12px;
                    border-left: 1.5px solid #000;
                }
                .footer-table {
                    width: 100%;
                    text-align: center;
                    font-size: 10.5pt;
                    border-collapse: collapse;
                    margin-top: 60px;
                    page-break-inside: avoid;
                }
                .footer-table td {
                    border: 1px solid #000;
                    padding: 15px 5px;
                }
                .signature-box {
                    height: 100px;
                }
                .photo-annex-header {
                    page-break-before: always; 
                    padding-top: 30px; 
                    border-top: 5px solid #000; 
                    margin-top: 50px;
                }
                .photo-annex-header h3 {
                    color: #000; 
                    font-size: 18pt;
                    font-weight: 900;
                    text-transform: uppercase; 
                    margin-bottom: 30px;
                    letter-spacing: 2px;
                }
                .photo-card {
                    border: 2px solid #000; 
                    padding: 15px; 
                    text-align: center; 
                    page-break-inside: avoid;
                    background: #fff;
                    margin-bottom: 10px;
                }
                .photo-container {
                    height: 280px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin-bottom: 15px; 
                    background: #fff;
                    overflow: hidden;
                    border: 1px solid #eee;
                }
                .photo-label {
                    font-size: 10pt; 
                    font-weight: 800; 
                    color: #000;
                    text-transform: uppercase;
                }
                .watermark-footer {
                    margin-top: 70px; 
                    text-align: center; 
                    font-size: 8.5pt; 
                    color: #000; 
                    font-weight: 600;
                    border-top: 2px solid #000; 
                    padding-top: 20px;
                    letter-spacing: 0.5px;
                }
            </style>
        </head>
        <body>
            <div class="document-wrapper">
                <div class="gacor-header">
                    <h2>HSE DEPARTMENT</h2>
                    <h3>RIG SAFETY CHECKLIST REPORT</h3>
                </div>

                <table class="meta-table">
                    <tr>
                        <td style="width: 50%; background: #fff;">
                            <div class="meta-label">Well Location / Rig</div>
                            <div class="meta-value">${wellLoc} / ${rigName}</div>
                        </td>
                        <td style="width: 50%; background: #fff;">
                            <div class="meta-label">Reporting Date</div>
                            <div class="meta-value">${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="meta-label">Activity Program</div>
                            <div class="meta-value">${prog}</div>
                        </td>
                        <td>
                            <div class="meta-label">Report Status</div>
                            <div class="meta-value" style="color: #000; font-weight: 900; text-decoration: underline;">VALIDATED & COMPLETED</div>
                        </td>
                    </tr>
                </table>

                <div class="content-body">
                    ${findingsHtml}
                </div>

                ${photosHtml.replace(/class="photo-card"/g, 'class="photo-card"').replace(/class="photo-container"/g, 'class="photo-container"').replace(/class="photo-label"/g, 'class="photo-label"').replace(/class="photo-annex-header"/g, 'class="photo-annex-header"')}

                <table class="footer-table">
                    <tr>
                        <td style="width: 33%;">Disiapkan Oleh,</td>
                        <td style="width: 33%;">Diperiksa Oleh,</td>
                        <td style="width: 33%;">Disetujui Oleh,</td>
                    </tr>
                    <tr class="signature-box">
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold;">HSE Representative</td>
                        <td style="font-weight: bold;">Rig Superintendent</td>
                        <td style="font-weight: bold;">Company Man</td>
                    </tr>
                </table>

                <div class="watermark-footer">
                    Generated via Jurnal AI - HSE PERFORMANCE CENTER HUB<br>
                    Official HSE Professional Documentation - Certified System.
                </div>
            </div>
            <script>
                window.onload = () => {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 1000);
                };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}


