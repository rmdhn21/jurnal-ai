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
    ]
};

function initHseRig() {
    renderRigModules('rig-intro-modules', hseRigData.introduction);
    renderRigModules('rig-hazards-modules', hseRigData.hazards, true);
    renderRigModules('rig-ppe-modules', hseRigData.ppe);
    renderRigModules('rig-routine-modules', hseRigData.routine);
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
