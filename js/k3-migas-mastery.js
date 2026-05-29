// ==========================================
// DATABASE LENGKAP K3 MIGAS MASTERY
// ==========================================

const dbCepu = [
  { q: "1. Jelaskan Pengertian Keselamatan dan kesehatan kerja", a: "Upaya untuk mencegah terjadinya kecelakaan, Penyakit Akibat Kerja dan pencemaran Lingkungan." },
  { q: "2. Sebutkan Tujuan Keselamatan dan kesehatan kerja", a: "- Melindungi Pekerja\n- Melindungi Alat dan produksi\n- Melindungi Lingkungan" },
  { q: "3. Jelaskan Pengertian kecelakaan/accident", a: "Kejadian yang tidak terduga dapat menimbulkan korban jiwa, harta benda, serta lingkungan." },
  { q: "4. Sebutkan pengertian insiden", a: "Kejadian yang tidak terduga dapat menimbulkan kerusakan korban jiwa harta benda dan lingkungan (hampir celaka/near miss)." },
  { q: "5. Sebutkan Penyebab kecelakaan dan beri contohnya", a: "- Unsafe Action (Tindakan Tidak Aman)\n- Unsafe Condition (Kondisi Tidak Aman)\n- Takdir" },
  { q: "6. Sebutkan macam2 bahaya", a: "Bahaya Fisika, Bahaya Kimia, Bahaya Biologi, Bahaya psikologi, bahaya ergonomi." },
  { q: "7. Sebutkan langkah langkah pengendalian bahaya", a: "- Eliminasi\n- Substitusi\n- Rekayasa Teknik\n- Administrasi\n- APD" },
  { q: "8. Sebutkan program k3/langkah penanggulangan kecelakaan", a: "1. Peraturan perundang-undangan\n2. Standarisasi\n3. Inspeksi\n4. Penelitian (teknis, psikologi, statistik)\n5. Riset Medis\n6. Asuransi\n7. Pendidikan & Pelatihan" },
  { q: "9. Sebutkan program kerja k3", a: "- Identifikasi\n- Investigasi\n- Induction\n- Pelaporan\n- Inspeksi\n- Safety meeting" },
  { q: "10. Sebutkan segitiga api", a: "Unsur yang bertemu antara Oksigen, Panas dan bahan bakar." },
  { q: "11. Apa perbedaan api dan kebakaran", a: "Api adalah yang masih dapat ditanggulangi (skala kecil). Sedangkan kebakaran yaitu yang tidak dapat ditanggulangi dan butuh tenaga extra menanggulanginya." },
  { q: "12. Sebutkan dan Jelaskan cara memadamkan api (teknik pemadaman)", a: "- Starvation: Menghilangkan bahan bakar\n- Smothering: Mengisolasi oksigen\n- Dilution: Mengurangi konsentrasi O2 dibawah 16%\n- Cooling: Mendinginkan temperatur\n- Break chain reaction: Memutus rantai reaksi kimia" },
  { q: "13. Jelaskan Pengertian klasifikasi kebakaran", a: "Penggolongan Jenis bahan bakar yang terbakar." },
  { q: "14. Sebutkan macam-macam klasifikasi kebakaran", a: "Kelas A: benda padat non logam\nKelas B: gas & cairan mudah terbakar\nKelas C: Listrik\nKelas D: Logam" },
  { q: "15. Sebutkan Keterbatasan APD", a: "- Memiliki batas waktu tertentu\n- Hanya mengurangi paparan resiko\n- Hanya melindungi sebagian tubuh" },
  { q: "16. Apa Pengertian APAR", a: "Alat Pemadam Api Ringan yang dapat digunakan satu orang untuk Kebakaran Awal." },
  { q: "17. Sebutkan macam2 apar", a: "Padat, Cair, Gas." },
  { q: "18. Sebutkan komponen apar", a: "Safety Pin, Tuas, Hose, Pressure Gauge, Nozzle, Handle, Tabung." },
  { q: "19. Sebutkan dan jelaskan Kontruksi apar", a: "- Stored pressure: pendorongnya bercampur pemadam\n- Sistem Cartridge: terpisah dengan media pemadam\n- Swacipta: diciptakan dengan dibalik\n- Swapancar: tidak mengunakan Media Pendorong" },
  { q: "20. Ada berapa macam inspeksi APAR, jelaskan", a: "Inspeksi Jangka pendek: Paling lama 6 bulan sekali.\nInspeksi Jangka Panjang: 1 tahun sekali." },
  { q: "21. Apa pengertian sound level meter", a: "Alat untuk mengukur kebisingan disuatu tempat yang melebihi NAB." },
  { q: "22. Berapa Nilai Ambang batas kebisingan", a: "85 dB" },
  { q: "23. Jelaskan maksud tombol di SLM", a: "On AC: Tekan tombol Power\nOn DC: mengecek baterai\nWeighting CAL: Kalibrasi 94 dB\nWeighting A: Mengukur untuk orang pekerja\nWeighting C: Mengukur alat di suatu tempat\nRespon F: Mengukur tempat terputus-putus\nRespon S: Mengukur sifatnya continue\nMaxhold: Menahan hasil pengukuran" },
  { q: "24. Jika ada 3 hasil pengukuran SLM 72, 74, 73, berapa intensitasnya?", a: "72, 73, 74.\nSelisih 74 & 73 = 1 -> tambah 3 = 74+3 = 77 (Berdasarkan tabel selisih).\n77 & 72 selisih 5 -> tambah 1 = 77+1 = 78 dB." },
  { q: "25. Apa Pengertian gas detector", a: "Untuk mengukur gas beracun yang ada di udara dan di suatu lokasi." },
  { q: "26. Sebutkan macam2 gas detector", a: "Flammable gas detector, Toxic gas detector, Oksigen detector, Multi gas detector." },
  { q: "27. Gambarkan isi layar monitor multi gas detector", a: "Menampilkan: H2S (PPM), CO (PPM), O2 (20.9%), LEL (0%)." },
  { q: "28. Gambar flammable range bahan bakar Gas H2S", a: "LEL 4.3% sampai UEL 46%." },
  { q: "29. Dari gambar flammable range H2S tersebut apabila terbaca 20% LEL berapa ppm nilai sebenarnya", a: "20% dari LEL (4.3%).\n(20/100) x 4.3% = 0.86% = 8600 PPM." },
  { q: "30. Jelaskan prinsip kerja jembatan wheatstone", a: "Gas mudah terbakar masuk ke ruang bakar -> reaksi pembakaran -> Sensor panas -> hambatan naik." },
  { q: "31. Apa prinsip kerja multi gas detector", a: "Arus tidak seimbang menggerakan Galvanometer, dapat mengukur lebih dari 1 jenis gas." },
  { q: "32. Apa prinsip kerja Tube Gas detector", a: "Perubahan warna pada reaksi kimia jika terdapat paparan dan sudah over limit." },
  { q: "33. Apa yang dimaksud TWA, STEL?", a: "TWA: Boleh Bekerja selama 8 Jam/hari.\nSTEL: Boleh bekerja selama 15 menit." },
  { q: "34. Sebutkan ada berapa macam alat bantu pernapasan", a: "Air Purifying respirator, Air Supplying Respirator." },
  { q: "35. Kapan SCBA digunakan", a: "Masuk keruangan terbatas (Confined Space), terdapat potensi terpapar gas beracun." },
  { q: "36. Sebutkan Komponen SCBA", a: "Tabung Silinder, Demand Valve, Papan Penyangga, Masker, Harness, Pressure gauge, Main Valve, Peluit, Selang, Reducer." },
  { q: "37. Apa tujuan pemeriksaan tekanan tinggi dan pemeriksaan tekanan rendah SCBA", a: "Tekanan Tinggi: mengetahui isi tekanan tabung dan kebocoran sistem.\nTekanan rendah: mengetahui kebocoran pada Masker." },
  { q: "38. Jika SCBA diketahui Full pressure 300 Bar, Safety pressure 60 Bar, Volume 6 Liter, Berapa Work duration SCBA", a: "Full duration = (300 x 6)/40 = 45 Menit.\nSafety margin = (60 x 6)/40 = 9 Menit.\nWork duration = 45 - 9 = 36 Menit." },
  { q: "39. Sebutkan dan jelaskan langkah-langkah Resusitasi Jantung Paru", a: "Danger: Posisikan korban di tempat aman\nRespon: Cek Kesadaran korban\nCirculation: Kuasai jalan napas (pijat jantung)\nAirways: Membuka jalan nafas, kepala ditengadahkan\nBreathing: Memberi nafas buatan" },
  { q: "40. Kapan RJP Dihentikan", a: "Tim Medis tiba, Korban Sadar / tidak dapat diselamatkan, Penolong kelelahan." }
];

const dbSoalX = [
  { q: "1. Manakah yang efektif dari beberapa media pemadam di bawah ini, jika digunakan untuk memadamkan kebakaran semburan minyak dari pipa yang bocor:", o: ["Busa kimia", "Busa mekanik", "Tepung kimia (dry chemical)", "Air"], a: 2, e: "Tepung kimia (dry chemical) sangat efektif untuk menyelimuti semburan minyak bertekanan karena sifat serbuknya cepat memutus rantai reaksi pembakaran." },
  { q: "2. Teknik pemadaman dengan cara menyemprotkan gas CO2 disebut :", o: ["Blanketing", "Cooling", "Smothering", "Dilution"], a: 3, e: "Menyemprotkan gas CO2 bertujuan untuk mengurangi/mengencerkan konsentrasi oksigen di udara (Dilution) hingga di bawah batas yang dibutuhkan api." },
  { q: "3. Definisi proses pembakaran (combustion process) adalah:", o: ["Bergabungnya segitiga api", "Suatu reaksi kimia yang berjalan secara berantai dan diikuti oleh evouasi panas dan cahaya", "Satu proses dimulainya api muncul dari bahan bakar", "Suatu reaksi fisika hingga menimbulkan api"], a: 1, e: "Pembakaran pada hakikatnya adalah reaksi kimia eksotermis yang berjalan secara berantai antara bahan bakar dan oksigen, memancarkan panas dan nyala." },
  { q: "4. Alasan diadakanya klasifikasi kebakaran adalah :", o: ["Untuk mengetahui besar kecilnya kebakaran", "Untuk mengetahui rating APAR yang akan digunakan untuk memadamkannya", "Untuk memudahkan dalam memilih media pemadam yang akan digunakan", "Untuk memudahkan mengenali kebakaran yang terjadi"], a: 2, e: "Klasifikasi kebakaran (A, B, C, D) sangat krusial agar kita tidak salah memilih media pemadam yang justru dapat membahayakan (misal menyiram alat listrik dengan air)." },
  { q: "5. Pemasangan water sprinsker yang tepat dibawah ini adalah :", o: ["Langit - langit atau plafon bangunan gedung", "Diruang genset", "Di atap bangunan", "Diatas control panel"], a: 0, e: "Water sprinkler dipasang di langit-langit (plafon) agar saat bulb pecah karena panas, jangkauan pancaran airnya luas menutupi area di bawahnya." },
  { q: "6. Gesekan dua benda akan menimbulkan panas and mengakibatkan kebakaran. Panas gesekan akan terus menumpuk (terakumulasi) jika:", o: ["Terjadinya dalam ruang terbuka", "Kecepatan gesekan semakin tinggi", "Kecepatan timbulnya panas lebih besar dari hilangnya panas", "Kekerasan permukaan dua benda"], a: 2, e: "Panas akan terus terakumulasi dan mencapai titik nyala (ignition point) hanya jika laju pembentukan panasnya tidak bisa diimbangi oleh sirkulasi (pendinginan)." },
  { q: "7. Teknik pemadaman kebakaran dengan cara menghilangkan/mengambil bahan bakar yang terbakar disebut:", o: ["Break Chain Reaction", "Dilution", "Smothering", "Starvation"], a: 3, e: "Starvation secara bahasa berarti kelaparan/mencekik. Dalam K3, ini berarti memutus/menghilangkan suplai bahan bakar dari titik api." },
  { q: "8. Percikan api dapat timbul, kecuali:", o: ["Pemukulan dengan palu tembaga", "Sambungan listrik yang tidak sempurna", "Pemukulan benda keras", "Gesekan permukaan benda keras"], a: 0, e: "Tembaga, kuningan, dan perunggu (brass) termasuk logam lunak yang masuk kategori 'Non-Sparking Tools' (tidak memercikkan api saat dipukul)." },
  { q: "9. Contoh pemadaman dengan cara 'Starvation' adalah:", o: ["Memadamkan dengan menggunakan busa mekanik", "Memadamkan dengan menggunakan CO2", "Memadamkan dengan cara menutup valve pada aliran bahan bakar yang terbakar", "Memadamkan dengan menggunakan dry chemical"], a: 2, e: "Menutup valve (katup) akan memutus aliran bahan bakar gas/minyak, yang merupakan implementasi langsung dari teknik Starvation." },
  { q: "10. Tugas utama 'RESCUE' adalah:", o: ["Melakukan evakuasi", "Menyelamatkan harta benda dari kebakaran", "Menata kembali setelah kebakaran (overhaul)", "Menyelamatkan korban jiwa dari kebakaran"], a: 3, e: "Prioritas mutlak dalam setiap tim keadaan darurat (Rescue) adalah nyawa manusia (korban jiwa), sebelum harta benda atau aset gedung." },
  { q: "11. Dibawah ini, manakah yang termasuk sebagai sumber nyala, kecuali:", o: ["Busur listrik, listrik statis, reaksi kimia", "Compression (kompresi)", "Api terbuka, benturan antara benda keras", "Uap panas"], a: 3, e: "Uap panas umumnya belum mencapai titik auto-ignition (terbakar sendiri) sehingga bukan merupakan sumber nyala (ignition source) langsung seperti api terbuka atau busur listrik." },
  { q: "12. Alat pemadaman Api Ringan (APAR) adalah:", o: ["Alat ringan dapat digunakan untuk memadamkan kebakaran", "Alat ringan yang dilayani satu orang saja untuk memadamkan kebakaran awal", "Alat ringan pengoperasiannya harus dua orang", "Alat ringan yang dilayani satu orang memadamkan semua kebakaran"], a: 1, e: "Definisi standar APAR: Alat pemadam manual yang cukup dioperasikan 1 orang dan fungsinya hanya untuk menanggulangi 'api awal' sebelum membesar." },
  { q: "13. Untuk memadamkan kebakaran instrument listrik yang bertegangan maka media pemadam yang sesuai adalah:", o: ["Air", "Busa (foam)", "CO2", "Tepung kimia (Dry Chemical)"], a: 2, e: "CO2 adalah gas bersih (clean agent), tidak menghantarkan listrik (non-konduktif), dan tidak meninggalkan residu serbuk yang merusak mesin." },
  { q: "14. Pemadaman kebakaran sumur minyak (blowout) selalu diusahakan secara:", o: ["Dilution", "Starvation", "Smothering", "Cooling"], a: 1, e: "Karena semburan dari sumur tak terbendung, cara utamanya adalah menutup katup sumur (memotong bahan bakar/Starvation)." },
  { q: "15. Selang pemadam kebakaran berfungsi untuk:", o: ["Menyalurkan bahan pemadaman CO2", "Menyalurkan bahan pemadaman dry powder", "Menyalurkan bahan pemadam berupa air dari sumber air ke lokasi", "Media penyalur"], a: 2, e: "Selang pemadam (fire hose) yang disambungkan ke pilar hidran khusus dirancang mengalirkan air bertekanan tinggi ke titik api." },
  { q: "16. Batasan dari Alat Pemadam Api Ringan (APAR)", o: ["Dikemas dalam tabung kereta", "Dapat diangkat manusia normal", "Dikemas dalam tabung beroda", "Beratnya berkisar 0,5 - 16 kg"], a: 3, e: "Standard fisik berat maksimal yang masih diklasifikasikan sebagai 'Ringan' (bisa diangkat dengan tangan kosong) adalah rentang 0,5 sampai 16 Kg." },
  { q: "17. Alat Pemadan Api Ringan dapat digolongkan berdasarkan, kecuali:", o: ["Klasifikasi kebakaran", "Besar kecilnya tabung APAR", "Media pemadam yang dimiliki", "Tenaga dorong"], a: 1, e: "Penggolongan APAR berdasarkan kelas api, isi media, dan sistem tekanannya (stored/cartridge), bukan sekadar dimensi atau besar-kecil ukuran tabungnya." },
  { q: "18. Yang dimaksud kebakaran klas 'A' menurut NFPA adalah", o: ["Kebakaran bahan bakar padat pada selain logam", "Kebakaran bahan bakar cair dan gas", "Kebakaran peralatan listrik yang bertegangan", "Kebakaran logam"], a: 0, e: "Kelas A (Ash): Benda padat mudah terbakar yang menyisakan abu (seperti kayu, kertas, karet, dan kain non-logam)." },
  { q: "19. Manakah yang efektif dari beberapa media pemadaman dibawah ini, jika digunakan untuk memadamkan kebakaran genangan minyak yang luas:", o: ["FM 200", "CO2", "Busa Mekanik", "Air"], a: 2, e: "Busa mekanik (Foam) lebih ringan dari massa jenis minyak sehingga bisa mengapung di atas genangan minyak dan membentuk selimut anti-oksigen (smothering)." },
  { q: "20. Kemungkinan besar yang bertindak sebagai sumber nyala bahan bakar padat (kayu/kertas) sehari-hari adalah:", o: ["Reaksi kimia", "Radioaktif", "Bara puntung rokok", "Matahari"], a: 2, e: "Bara puntung rokok sangat sering menjadi sumber penyulut (heat source) pada sampah daun kering atau kertas di tempat umum." },
  { q: "21. Untuk memadamkan kebakaran kelas 'A' media pemadam yang paling cocok adalah:", o: ["Air", "Busa (foam)", "Tepung kimia", "CO2"], a: 0, e: "Api benda padat memiliki panas yang mengakar/membara, air memiliki kemampuan pendinginan (Cooling effect) yang paling unggul meresap ke dalam." },
  { q: "22. Pada selang pemadam kebakaran, kopling berfungsi untuk:", o: ["Membentuk pancaran air", "Mempercepat aliran air", "Menyambung dua ujung selang", "Mengatur aliran air"], a: 2, e: "Kopling (Coupling) adalah pengikat atau konektor berbahan logam di ujung selang untuk menyambungnya dengan selang lain atau sumber air hidran." },
  { q: "23. Air dapat digunakan untuk memadamkan kebakaran, karena kemampuannya dalam hal:", o: ["Menyerap panas yang tinggi (cooling)", "Daya smothering yang tinggi", "Memutus rantai reaksi pembakaran", "Mudah di dapat"], a: 0, e: "Saat air disemprotkan, ia menyerap kalor suhu api (panas laten penguapan tinggi) sehingga suhu turun drastis di bawah titik bakar (cooling)." },
  { q: "24. Setiap campuran gas/uap mudah terbakar dengan udara akan menyala jika terkena:", o: ["Aliran udara", "Benda pijar/bunga api", "Kabel listrik", "Uap Panas"], a: 1, e: "Gas mudah terbakar butuh pemantik agar melewati titik nyalanya. Benda pijar atau bunga api kelistrikan adalah pemicu ideal." },
  { q: "25. Smoke detector kebakaran berfungsi untuk:", o: ["Mendeteksi asap", "Mencegah terjadinya api", "Memadamkan api", "Mengenali adanya api"], a: 0, e: "Fungsi tunggal alat ini sesuai namanya, mendeteksi kumpulan partikel asap yang biasanya muncul sebelum api membesar (deteksi dini)." },
  { q: "26. Kebakaran adalah:", o: ["Api yang spontan terjadi", "Timbulnya api yang besar", "Bertemunya segitiga api", "Timbulnya api yang tidak terkendali"], a: 3, e: "Pengertian harfiah kebakaran (fire accident) adalah nyala api yang muncul tidak pada tempatnya, tidak dikehendaki, dan sulit dikendalikan." },
  { q: "27. Untuk mencegah terjadinya kebakaran instalasi listrik, perlu dilakukan :", o: ["Pemasangan pemutus arus", "Pemasangan ampere meter", "Pemasangan volt meter", "Pemasangan watt meter"], a: 0, e: "Pemutus arus otomatis (seperti MCB/Sekering) sangat penting karena memutus listrik sebelum kabel meleleh akibat hubungan pendek (korsleting)." },
  { q: "28. Smothering dalam teknik pemadaman prinsipnya adalah:", o: ["Merusak rantai reaksi pembakaran", "Memisahkan bahan bakar dari panas", "Melindungi petugas pemadam", "Memisahkan bahan bakar yang terbakar dari udara/oksigen"], a: 3, e: "Smothering berasal dari kata smother (menyelimuti). Prinsip utamanya adalah mencekik api dengan cara menghalangi pasokan udara (Oksigen)." },
  { q: "29. Konsentrasi campuran antara uap bahan bakar dengan oksigen yang dapat terbakar disebut :", o: ["Flammable Range (FR)", "Combustible Limit (CL)", "Lower Flammable Limit (LFL)", "Upper Flammble Limit (UFL)"], a: 0, e: "Flammable range adalah jarak rentang ideal antara ambang batas bawah (LEL) dan batas atas (UEL) di mana gas siap meledak/menyala." },
  { q: "30. Yang paling cocok untuk memadamkan kebakaran logam ialah:", o: ["Busa mekanik", "Dry powder", "Dry chemical", "Air"], a: 1, e: "Logam menyala pada suhu ekstrim yang akan menguraikan air menjadi hidrogen (meledak). Ia wajib dipadamkan dengan bubuk serbuk kering khusus logam (Dry Powder tipe D)." },
  { q: "31. Untuk memadamkan kebakaran minyak dalam tangki, maka media pemadam yang paling tepat adalah:", o: ["CO2", "Busa mekanik", "Air", "N2"], a: 1, e: "Busa mekanik (foam) menutup seluruh permukaan minyak tangki secara rapat (smothering) agar uap panas minyak tidak naik berinteraksi dengan oksigen." },
  { q: "32. Unsur-unsur terjadinya api adalah:", o: ["Adanya bahan bakar, hydrogen, sumber nyala", "Adanya bahan bakar, nitrogen, sumber nyala", "Adanya BBM, oksigen, sumber nyala", "Adanya bahan bakar, oksigen dan sumber nyala"], a: 3, e: "Inilah yang dikenal sebagai Segitiga Api (Fire Triangle): Panas (sumber nyala), Oksigen (O2 di udara), dan Fuel (bahan bakar padat/cair/gas)." },
  { q: "33. Konstruksi APAR jenis Dry Chemical Powder di pasaran adalah :", o: ["Stored pressure dan cartridge system", "Stored pressure dan self generating", "Self expelling dan self generating", "Cartridge system dan self expelling"], a: 0, e: "Terdapat 2 jenis pendorong: Stored Pressure (nitrogen dicampur dengan bubuk di dalam tabung) atau Cartridge System (gas pendorong ada di tabung kecil terpisah)." },
  { q: "34. Klasifikasi kebakaran menurut permenakertrans no. 04 tahun 1980 terdiri dari :", o: ["Empat kelas", "Satu kelas", "Tiga kelas", "Dua kelas"], a: 0, e: "Permenaker RI menetapkan 4 Kelas Kebakaran yaitu Kelas A (Padat), B (Cair/Gas), C (Listrik), dan D (Logam)." },
  { q: "35. Tugas utama 'SALVAGE' adalah:", o: ["Melakukan evakuasi", "Menyelamatkan harta benda dari kebakaran", "Menyelamatkan korban jiwa", "Menata kembali setelah kebakaran"], a: 1, e: "Salvage dalam operasi Fire Fighting adalah upaya perlindungan dan evakuasi harta benda/dokumen penting di area bebas api setelah korban jiwa ditangani." },
  { q: "36. Gas berikut yang tidak dapat terbakar:", o: ["CO", "CO2", "NH3", "H2S"], a: 1, e: "Karbon Dioksida (CO2) adalah gas sisa pembakaran yang inert (mati) dan justru digunakan secara luas untuk mematikan/mengikat Oksigen pada api." },
  { q: "37. Loncatan bunga api listrik dapat menimbulkan kebakaran, untuk sistem kelistrikan di area BBM harus:", o: ["Diisolasi yang tebal", "Ditempatkan pada kotak khusus", "Kedap api", "Kedap gas (Explosion Proof)"], a: 3, e: "Semua instalasi di kilang/BBM wajib 'Explosion Proof' (kedap gas) agar uap bahan bakar tidak merembes masuk ke dalam panel dan tersulut loncatan bunga api listrik internal." },
  { q: "38. Siapakah yang harus menggunakan APAR yang ada di suatu lokasi bila terjadi kebakaran?", o: ["Siapa saja yang melihat dan mampu menggunakannya", "Orang setelah mendapat ijin safety", "Petugas pemadam kebakaran", "Koordinator di lokasi tersebut"], a: 0, e: "Prinsip tanggap darurat APAR adalah untuk dioperasikan oleh saksi mata pertama (first responder) yang telah terlatih, guna mematikan api sewaktu masih kecil." },
  { q: "39. Teknik pemadaman dengan cara memisahkan udara dari bahan bakar yang terbakar, disebut:", o: ["Smothering", "Dilution", "Starvation", "Cooling"], a: 0, e: "Smothering berarti proses menutupi (dengan foam, fire blanket, pasir) agar interaksi udara sekitar dengan titik nyala terputus." },
  { q: "40. Busa mekanik adalah:", o: ["Bahan busanya dibuat secara mekanik", "Penggunaannya digunakan secara mekanik", "Bahan busanya dibuat dengan energy mekanik", "Pembentukannya melalui cara mekanik"], a: 3, e: "Busa mekanik (Mechanical Foam) terbentuk karena turbulensi pancaran mekanik air yang mencampurkan konsentrat busa dan hisapan udara di moncong alat penyemprot." },
  { q: "41. APAR disiagakan hanya efektif untuk kebakaran awal kecuali:", o: ["Lama semprotnya terbatas", "Jarak semprotnya terbatas", "Jumlah media terbatas", "Jenis media pemadamnya terbatas"], a: 3, e: "Keterbatasan utama APAR adalah durasinya yang singkat (hanya beberapa detik), jarak yang dekat, dan volume kecil. Namun APAR memiliki beragam pilihan jenis media yang sangat lengkap, bukan terbatas." },
  { q: "42. Yang dimaksud kebakaran kelas 'C' menurut NFPA adalah:", o: ["Kebakaran peralatan listrik bertegangan", "Kebakaran bahan bakar cair dan gas", "Kebakaran bahan bakar padat selain logam", "Kebakaran logam"], a: 0, e: "C = Current. NFPA menggolongkan kebakaran yang melibatkan rangkaian listrik bertegangan aktif sebagai kelas C yang tidak boleh disiram air." },
  { q: "43. Gas berikut yang masih dapat terbakar adalah:", o: ["H2S", "SO2", "CO2", "N2"], a: 0, e: "Hidrogen Sulfida (H2S), selain sangat beracun (toxic), juga bersifat Highly Flammable jika bereaksi dengan oksigen di suhu penyalaan." },
  { q: "44. Yang dimaksud kebakaran jenis 'D' menurut NFPA adalah:", o: ["Kebakaran logam", "Kebakaran bahan bakar selain logam", "Kebakaran listrik", "Kebakaran cair dan gas"], a: 0, e: "Kelas D dikhususkan untuk bahaya serpihan/bubuk logam reaktif (seperti Magnesium dan Titanium) yang menyala dalam suhu ribuan derajat." },
  { q: "45. Sarung tangan yang digunakan untuk pekerjaan panas terbuat dari:", o: ["Kain", "Kulit", "Timbal", "Karet"], a: 1, e: "Leather gloves (sarung tangan kulit) memiliki insulasi termal alami yang baik untuk menahan percikan las atau logam panas (hot work)." },
  { q: "46. Salah satu keuntungan media pemadam CO2 pada kebakaran panel listrik adalah:", o: ["Bersih", "Murah harganya", "Memutus rantai", "Daya cooling tinggi"], a: 0, e: "Selain tidak menghantarkan listrik, CO2 wujudnya gas yang langsung menguap ke udara, sehingga panel listrik tetap bersih dari bekas debu atau cairan." },
  { q: "47. Apabila terjadi kebakaran LNG (Liquitied Natural Gases), termasuk:", o: ["Kelas D", "Kelas A", "Kelas C", "Kelas B"], a: 3, e: "LNG adalah bentuk cair dari gas alam (Natural Gas). Segala bentuk minyak bumi cair maupun gas yang terbakar tergolong kelas B." },
  { q: "48. Yang dimaksud kebakaran kelas 'B' menurut NFPA adalah:", o: ["Kebakaran logam", "Kebakaran bahan bakar cair dan gas", "Kebakaran padat selain logam", "Kebakaran listrik bertegangan"], a: 1, e: "B (Boil/Barrel). Mewakili kebakaran benda cari yang mudah menguap seperti bensin, alkohol, maupun gas propane." },
  { q: "49. Klasifikasi kebakaran menurut Peraturan Menteri Tenaga Kerja No Per 04/Men/1980 berdasarkan :", o: ["Jenis dari bahan bakar yang terbakar", "Beban kebakaran", "Bentuk kebakaran", "Jumlah bahan bakar"], a: 0, e: "Regulasi K3 Indonesia membedakan jenis api mutlak berdasarkan media sumbernya (Apa bahan/material yang terbakar)." },
  { q: "50. Yang dimaksud dengan klasifikasi kebakaran adalah:", o: ["Berdasarkan besar kecilnya api", "Berdasarkan volume bahan bakar", "Penggolongan berdasarkan jenis bahan bakar yang terbakar", "Berdasarkan panas pembakaran"], a: 2, e: "Inti dari klasifikasi (A, B, C, D) adalah mengidentifikasi benda yang sedang terbakar sehingga penolong tahu strategi/media APAR apa yang paling tepat dipakai." }
];

const dbSoalY = [
  { q: "1. Memadamkan api dengan cara mengisolasi oksigen disebut juga dengan", o: ["Cooling", "Chain Reaction", "Smothering", "Starvation"], a: 2, e: "Istilah Smothering berarti menyelimuti atau 'membekap' area api sehingga sirkulasi oksigen bebas tertahan dan api mati lemas." },
  { q: "2. Yang dimaksud dengan jet effect adalah", o: ["Tekanan air tinggi mengakibatkan effect selang", "Tekanan air tinggi mengakibatkan effect tekanan balik air pada selang", "Tekanan air tinggi mengakibatkan effect suara", "Tekanan air tinggi mengakibatkan effect air"], a: 1, e: "Jet effect adalah dorongan rekoil (tolakan mundur) yang kuat di pangkal selang pemadam (nozzle) karena tingginya semburan tekanan air dari pompa." },
  { q: "3. Tinggi pemasangan tanda APAR menurut standard adalah", o: ["130 cm", "125 cm", "135 cm", "120 cm"], a: 1, e: "Menurut Permenaker No. 04/1980, titik puncak APAR dan tanda diletakkan maksimal 1,25 meter (125 cm) dari lantai agar mudah dilihat dan dicabut." },
  { q: "4. Memisahkan oksigen dengan sumber panas. Media dry chemical, foam, CO2 menggunakan teknik:", o: ["Smothering", "Cooling", "Starvation", "Break Chain Reaction"], a: 0, e: "Foam/busa membentuk film tebal pelindung oksigen, dan gas CO2 mengusir ketersediaan oksigen; keduanya adalah prinsip Smothering." },
  { q: "5. Suhu terendah dimana suatu zat mulai berubah dari fase cair menjadi fase uap:", o: ["Ignition Point", "Boiling Point (titik didih)", "Flash Point", "Fire Point"], a: 1, e: "Titik didih (boiling point) adalah saat tekanan uap cair menyamai tekanan atmosfer sehingga terjadi perubahan wujud cair menjadi gas secara ekstrem." },
  { q: "6. Untuk memadamkan kebakaran kelas 'A' media pemadam yang paling cocok adalah", o: ["Air", "Busa (Foam)", "CO2", "Tepung kimia"], a: 0, e: "Material kayu atau kertas (Kelas A) menyimpan bara api jauh di dalam keroposnya. Sifat air yang meresap dan mendinginkan (cooling) adalah musuh alaminya." },
  { q: "7. Prinsip kerja sensor gas teroksidasi pada elemen katalis & menimbulkan perubahan suhu/tahanan:", o: ["Metal Oxide Sensor", "Katalist Sensor", "Non Dispersive Infrared", "Electro-Chemical Sensor"], a: 1, e: "Pada detektor gas LEL konvensional, gas hidrokarbon bereaksi (teroksidasi) dengan elemen pelikel katalitik (Catalytic Bead) yang merubah tahanan kelistrikannya." },
  { q: "8. Batas konsentrasi mudah terbakar dari bensin adalah", o: ["2,6% dan 12,8%", "1,4% dan 7,6%", "1% dan 10%", "4% dan 75%"], a: 1, e: "Uap bensin (gasoline) memiliki rentang Flammable Range dari LEL sekitar 1.4% hingga UEL 7.6% bercampur di udara." },
  { q: "9. Temperatur terendah dimana bahan menghasilkan uap dan terbakar sekejap jika diberi percikan:", o: ["Flash Point", "Auto Ignition Temperature", "Boil Point", "Fire Point"], a: 0, e: "Titik Nyala (Flash Point) ditandai dengan uap bahan yang langsung menyala sekejap 'flash' bila disulut api pemantik, tetapi tidak terus menyala." },
  { q: "10. Batas konsentrasi terendah uap gas yang dapat menyala jika diberi percikan api:", o: ["Flammable Limits", "Combustible Limits", "Lower Flammable Limits", "Upper Flammable Limits"], a: 2, e: "Lower Flammable Limit (LFL/LEL) adalah titik ambang batas paling bawah (paling miskin uap) yang dapat bereaksi memicu ledakan bila tersulut." },
  { q: "11. Kelas kebakaran menurut peraturan pemerintah Indonesia adalah", o: ["Kelas C peralatan listrik", "Kelas A logam", "Kelas B bahan peledak", "Kelas D bahan kimia"], a: 0, e: "Dalam regulasi Depnaker Indonesia, pengelompokan yang paling relevan dicantumkan pada opsi ini hanyalah Kelas C yaitu instalasi listrik aktif." },
  { q: "12. Explosimeter adalah", o: ["Alat mengukur bahan mudah meledak", "Alat mengukur bahan yang mudah terbakar", "Alat mengukur bahan tidak mudah meledak", "Alat mengukur bahan tidak mudah terbakar"], a: 1, e: "Explosimeter adalah alat instrumen deteksi gas lapangan yang fungsinya mengukur persentase gas berbahaya mudah terbakar (Combustible Gas)." },
  { q: "13. Friction loss selang dipengaruhi oleh, kecuali", o: ["Jenis selang", "Tebal selang", "Diameter selang", "Banyaknya tekukan"], a: 1, e: "Kehilangan tekanan aliran (Friction loss) dipengaruhi kekasaran jenis dalam selang, panjang, diameter, dan belokan. 'Tebal' kulit luar tidak berpengaruh signifikan pada aliran dalam." },
  { q: "14. Dibawah ini teknik menggunakan APAR yang benar adalah", o: ["ASSP", "SAPS", "PASS (Pull, Aim, Squeeze, Sweep)", "PSAS"], a: 2, e: "SOP Internasional pemakaian APAR adalah PASS: Pull (Cabut pin), Aim (Arahkan pangkal), Squeeze (Tekan tuas), Sweep (Sapu kiri-kanan)." },
  { q: "15. Pada selang pemadam kebakaran kopling berfungsi untuk", o: ["Mempercapat aliran air", "Mengatur aliran air", "Menyambung dua ujung selang", "Membentuk panacaran air"], a: 2, e: "Kopling sistem (seperti Machino atau Storz) digunakan untuk mengaitkan koneksi antar 2 buah selang (hose) dengan hidran secara cepat dan anti-bocor." },
  { q: "16. Angka yang ditunjuk oleh jarum pada skala explosimeter merupakan", o: ["Angka langsung jumlah gas", "Presentase gas didalam flammable range", "Angka langsung didalam flammable range", "Presentase dari LEL suatu gas disuatu tempat"], a: 3, e: "Layar Explosimeter modern umumnya menampilkan skala persentase: 0 hingga 100% dari LEL (Lower Explosive Limit) gas yang dideteksi." },
  { q: "17. Untuk pemadam jenis serbuk (powder) menggunakan bahan", o: ["NaSO3", "Natrium bikarbonat", "Nacl", "Natrium metafamat"], a: 1, e: "Dry chemical paling populer tipe standar menggunakan senyawa kimia dasar Sodium/Natrium Bikarbonat atau Potassium Bikarbonat (Purple-K)." },
  { q: "18. Yang berpredikat OSC (on scene commander) adalah", o: ["General manager", "Fire officer", "General maintenance", "Section head"], a: 3, e: "OSC bertugas langsung memimpin di garis depan saat darurat. Biasanya diemban oleh kepala regu (Section Head / Koordinator Area) di lokasi terdampak." },
  { q: "19. Upper flammable limit (UFL) adalah", o: ["Batas bisa terbakar tengah", "Batas bisa terbakar atas", "Batas bahan mudah terbakar", "Batas bisa terbakar bawah"], a: 1, e: "UFL adalah batas konsentrasi gas tertinggi/teratas. Di atas angka persentase UFL, gas disebut terlalu 'kaya/pekat' dan kekurangan oksigen sehingga tidak bisa terbakar." },
  { q: "20. Flammable range adalah", o: ["Batas zat terlarut", "Batas tertinggi terbakar", "Batas terendah terbakar", "Batas dimana zat dalam konsentrasi tertentu dapat terbakar"], a: 3, e: "Jarak cakupan (Range) di antara LEL dan UEL. Jika campuran gas + udara berada di dalam Range ini, itu menjadi zona kritis mematikan bila ada api." },
  { q: "21. Kondisi nyala api menyeberang ke daerah gas yang belum terbakar disebut", o: ["Flame over", "Slop over", "Flash over", "Back draft"], a: 2, e: "Flash Over adalah peristiwa mengerikan saat asap radiasi panas di plafon ruangan memanaskan seluruh properti, sehingga mendadak semuanya meledak terbakar serentak." },
  { q: "22. APAR media air ada 3 macam cara kerja operasinya:", o: ["Stored pressure, Pump tank, inverting", "Stored pressure, Sump tank, inverting", "Stored pressure, Pump tank, Part tank", "Stored pressure, Pump tank, involving"], a: 0, e: "Tiga cara sistem dorongan air: Gas ditekan langsung (Stored), pompa tangan manual pada bak penampung (Pump Tank), dan membalik tabung kimia (Inverting)." },
  { q: "23. Pada daerah bisa terbakar pada range dari 02 adalah", o: ["1% s/d 10%", "21% s/d 50%", "50% s/d 100%", "16% s/d 21%"], a: 3, e: "Kadar oksigen normal udara adalah 20.9%. Pembakaran akan terjadi jika pasokan oksigen berada pada level kritis yakni minimal 16% hingga normal 21%." },
  { q: "24. Yang berpredikat ERC (emergency response commander)", o: ["Fire officer", "Section head", "General manager", "General maintenance"], a: 2, e: "ERC adalah komando tertinggi untuk skala krisis plant. Posisi ini umumnya wajib diambil alih oleh Manajer Tertinggi (General Manager/Plant Manager)." },
  { q: "25. Suhu terendah dimana suatu zat dapat terbakar dengan sendirinya tanpa dinyalakan", o: ["Fire point", "Flash point", "Auto ignition temperature", "Boiling point"], a: 2, e: "Auto-Ignition (Suhu Penyalaan Sendiri) tidak membutuhkan pemicu korek/busur. Hanya suhu udara dan material yang cukup panas membuatnya bereaksi terbakar mendadak." },
  { q: "26. Jika APAR tertera kode 20 B maksudnya adalah", o: ["Dapat memadamkan kelas B seluas 20 ft (40% pemula)", "Dapat memadamkan kelas B seluas 20 ft (50% pemula)", "Dapat memadamkan kelas B seluas 20 ft (60% pemula)", "Dapat memadamkan kelas B seluas 20 ft (70% pemula)"], a: 0, e: "Kode rating APAR 20-B menurut UL menandakan efisiensi media yang dapat mengendalikan 20 square feet genangan api kelas B oleh operator biasa (non-profesional/pemula 40%)." },
  { q: "27. Peralatan pemadaman inline induction berfungsi untuk", o: ["Menyalurkan foam tanpa injeksi", "Menyalurkan air tanpa injeksi", "Menyalurkan foam kedalam selang dengan diinjeksi pompa", "Menyalurkan air dengan diinjeksi pompa"], a: 2, e: "Inline Inductor adalah sebuah katup injeksi (prinsip venturi) yang menghisap konsentrat Busa ke dalam jalur selang yang diinjeksi air oleh pompa pemadam utama." },
  { q: "28. Jarak antara APAR dengan lantai tidak boleh kurang dari :", o: ["25 cm", "20 cm", "15 cm", "10 cm"], a: 2, e: "Selain titik maksimum 125cm, bagian dasar tabung APAR diatur minimal 15 cm di atas lantai. Hal ini mencegah korosi tabung dasar akibat kelembaban lantai atau saat dipel." },
  { q: "29. Gas tester adalah", o: ["Pekerja yang bersertifikat gas test dan terdaftar", "Petugas lab diminta ahli", "Petugas ditunjuk atasan", "Pekerja ditunjuk berjaga"], a: 0, e: "Pengujian gas beracun/explosive (Gas Testing) wajib dilakukan secara legal oleh orang kompeten (Authorised Gas Tester) bersertifikat BNSP, bukan sembarang pekerja." },
  { q: "30. Fungsi flashback arrestor adalah", o: ["Menghindari arus gas botol ke tabung", "Menghindari arus balik ke cutting torch", "Menghindari arus dari botol", "Menghindari arus balik gas & api balik dari ujung las ke tabung gas"], a: 3, e: "Dalam pekerjaan hot work pengelasan asitelin, arrestor bertugas memadamkan dan menahan api dari nosel agar tidak merambat balik masuk meledakkan tabung/silinder gas." },
  { q: "31. Upper flammable limit adalah", o: ["Batas terlarut", "Batas konsentrasi tertinggi zat dalam udara yang dapat terbakar", "Batas terendah", "Batas konsentrasi tertentu"], a: 1, e: "UFL / UEL membatasi proporsi campuran uap tertinggi di udara. Jika melampauinya, maka campuran uap hidrokarbon mendominasi dan kekurangan O2." },
  { q: "32. Fungsi explosimeter adalah untuk", o: ["Mengukur tekanan gas meledak", "Mengukur konsentrasi gas hydrocarbon didalam udara dibawah LEL", "Mengukur gas beracun", "Mengukur beracun dibawah LEL"], a: 1, e: "Digunakan khusus untuk mengawasi level persentase batas bawah keamanan ledakan (0-100% LEL) dari gas hidrokarbon sebelum melakukan Izin Kerja Panas." },
  { q: "33. Suhu terendah zat cair mempunyai uap menyala terus menerus apabila dikenakan sumber api", o: ["Flash point", "Fire point (titik api)", "Boiling point", "Ignition point"], a: 1, e: "Fire Point sedikit lebih panas di atas Flash Point. Pada saat mencapai Fire Point, uap yang terbakar pemantik tidak padam lagi, tapi terus menyala stabil." },
  { q: "34. Flammable range batas minimum & maksimum terbakar. Mana bahan bakar yg mudah terbakar & bahaya", o: ["Acetylene LFL 2,5% - UFL 81%", "Bensin 1% - 10%", "Propane 2,2% - 9,6%", "Hydrogen 4,1% - 7,5%"], a: 0, e: "Asetilen memiliki range ledakan yang sangat ekstrem dan lebar (2.5% hingga 81%). Makin besar range-nya (jarak), makin sangat berbahaya gas tersebut." },
  { q: "35. Yang diukur oleh petugas gas test adalah", o: ["Daerah jenuh uap", "Daerah miskin uap", "Daerah bisa terbakar", "Daerah kaya uap"], a: 2, e: "Tujuan pengujian adalah memastikan apakah kondisi udara sedang steril, atau berisiko masuk dalam persentase ambang 'daerah Flammable Range' (bisa terbakar)." },
  { q: "36. Jika keadaan emergency, pekerja menuju tempat ditentukan, kecuali", o: ["Area berkumpul aman", "Area evakuasi", "Area parkir kendaraaan", "Area assemble point"], a: 2, e: "Muster Point/Muster Station (Area evakuasi & assembly) didesain aman. Berlari menuju area parkir dan mengendarai mobil justru mengganggu arus masuk Firetruck." },
  { q: "37. Kebakaran adalah", o: ["Api besar", "Api kerugian besar", "Api yang tidak diinginkan dan menyebabkan kerugian", "Api sangat besar"], a: 2, e: "Api di kompor gas tidak disebut kebakaran karena diinginkan. Kebakaran (Fire) mutlak berarti api tersebut lepas kendali dan menyebabkan kerugian manusia/aset." },
  { q: "38. Cara mengetahui respon korban kecelakaan, kecuali", o: ["Tepuk bahu", "Cubit lengan", "Dengarkan nafas", "Beri nafas buatan"], a: 3, e: "Mengetahui respons kesadaran cukup dengan teknik Touch & Talk (Panggil & Tepuk kuat). Memberi nafas adalah langkah penanganan, bukan cek respons kesadaran awal." },
  { q: "39. Kompresi dada dengan kedua pangkal tangan, tekan kedalaman 3-5 cm kearah tulang belakang utk:", o: ["Bayi", "Korban dewasa", "Anak-anak", "Tubuh gemuk"], a: 1, e: "Standar CPR: Kedalaman kompresi jantung 5-6 cm menggunakan telapak 2 tangan terkait, ditujukan untuk memompa jantung korban dengan anatomi dewasa." },
  { q: "40. Menurut AHA 2015 kompresi jantung 1 orang harus melakukan", o: ["30 kompresi diikuti 2 nafas buatan", "15 kompresi : 4 nafas", "5 kompresi : 1 nafas", "5 kompresi : 2 nafas"], a: 0, e: "Standar Emas Resusitasi Jantung Paru AHA (American Heart Association) mewajibkan rasio 30 kali Pijat Jantung (Kompresi) ditutup dengan 2 tiupan nafas buatan." },
  { q: "41. Menurut AHA 2015 kompresi jantung 2 orang harus melakukan", o: ["15 : 2 nafas", "15 : 4 nafas", "5 : 1 nafas", "30 kompresi diikuti 2 nafas buatan"], a: 3, e: "Baik untuk 1 penolong maupun 2 penolong, rasio standar RJP orang dewasa (AHA Guideline) tetaplah sama: 30 kompresi berbanding 2 nafas buatan." },
  { q: "42. Bantuan hidup dasar 'Buka batas nafas (Air Way)'", o: ["Tengadahkan kepala angkat dagu", "Pijat jantung", "Penyangga leher", "Nafas buatan"], a: 0, e: "Teknik membebaskan jalan udara leher (Airway) yang tertutup lidah adalah prosedur 'Head-Tilt Chin-Lift' (Dorong dahi, tengadahkan dagu)." },
  { q: "43. Bagaimana tanda-tanda korban henti nafas", o: ["Tidak sadar, dada tak gerak, suara nafas ada", "Tidak sadar, dada tak gerak, suara keluar masuk paru tidak terdengar/terasa", "Tidak sadar, dada terlihat", "Tidak sadar, dada tidak terlihat"], a: 1, e: "Cek metode LDR (Look, Listen, Feel). Henti nafas artinya dada hening tanpa kembang kempis, dan tak terasa sirkulasi hembusan udara di hidung korban." },
  { q: "44. Nafas buatan mouth to mouth yaitu", o: ["Bantu pernafasan dari mulut ke mulut korban", "Lipat tangan korban", "Angkat kaki", "Angkat pundak"], a: 0, e: "Sesuai terjemahannya, metode ini adalah meniupkan oksigen langsung ke paru-paru korban melalui mulut penolong (dengan hidung korban dijepit)." },
  { q: "45. Upaya menghidupkan kembali fungsi jantung & paru disebut:", o: ["Rehabilitas Jantung", "Resusitasi Jantung Paru", "Semua benar", "Reproduksi Jantung Paru"], a: 1, e: "Dikenal dengan RJP (Resusitasi Jantung Paru) atau CPR (Cardiopulmonary Resuscitation), tindakan mekanis pertolongan pertama memicu pemompaan jantung statis." },
  { q: "46. Prinsip dalam pemberian nafas buatan adalah", o: ["Semua benar", "Tergantung penolong", "Secepat mungkin", "Kecepatan disesuaikan dengan kecepatan nafas normal"], a: 3, e: "Pemberian nafas buatan tidak boleh ditiup sembarangan terlalu cepat/keras. Volume dan ritmenya disimulasikan seperti irama nafas orang sehat (sekitar 1 detik tiap nafas)." },
  { q: "47. Pemijatan jantung dilakukan dengan", o: ["Kecepatan 60-80 kali permenit", "Siku dibengkok", "Tempat lunak", "Kedua tangan terpisah"], a: 0, e: "Ritme pacu jantung (kompresi) harus konsisten, sekitar 100-120 kali per menit, dan lengan diposisikan lurus, tidak ditekuk." },
  { q: "48. Yang perlu diperhatikan saat pijat jantung adalah", o: ["Semua benar", "Kasur lunak", "Duduk", "Baringkan korban pada tempat yang keras dan datar"], a: 3, e: "Jantung dijepit di antara tulang dada (sternum) dan tulang belakang. Agar tekanan efektif turun menekan jantung, korban wajib dibaringkan di alas padat/datar." },
  { q: "49. Yang dimaksud Airway adalah", o: ["Pemberian nafas", "Kuasai posisi jalan nafas", "Pemberian obat", "Sirkulasi"], a: 1, e: "Sesuai sistem CAB (Circulation - Airway - Breathing), Airway murni merupakan tindakan fisiologis untuk melegakan posisi pangkal jalan udara paru (tenggorokan)." },
  { q: "50. Bantuan Hidup Dasar dihentikan apabila", o: ["Semua benar (Tanda pulih, medis tiba, dll)", "Penolong kepayahan", "Tidak bisa diselamatkan", "Darah & pernafasan pulih"], a: 0, e: "RJP dihentikan jika korban tersadar mandiri, tenaga medis profesional mengambil alih, atau penolong benar-benar kelelahan secara fisik dan membahayakan nyawanya sendiri." }
];

const dbSoalZ = [
  { q: "1. UU No.1 tahun 1970, sebagai pengganti dari:", o: ["MPR tahun 1930", "UU. Uap tahun 1930", "UU. No 11 tahun 1930", "Veiligheidreglement tahun1910"], a: 3, e: "Peraturan perlindungan pekerja di Hindia Belanda (VR 1910) sudah usang dan diganti payung hukum resmi K3 Nasional melalui Undang-Undang No. 1 Tahun 1970." },
  { q: "2. Tata usaha dan pengawasan keselamatan kerja pemurnian migas wewenangnya di tangan:", o: ["Kepala Inspeksi Tambang", "Menteri Energi dan Sumber Daya Mineral", "Inspektur Tambang", "Direktur Jenderal Migas"], a: 1, e: "Berdasarkan regulasi struktural pertambangan dan Migas nasional, Kementerian ESDM memiliki hierarki dan wewenang final menaungi keselamatan eksplorasi/eksplotasi." },
  { q: "3. Safety helmet yang sudah retak sebaiknya:", o: ["Bergantian pinjam teman", "Digunakan sementara", "Direkatkan lem", "Segera minta ganti ke bagian KKK"], a: 3, e: "Cangkang helem (shell) yang mengalami crack/retak sudah kehilangan integritas mekanis (daya redam impact). Jangan dilem atau diperbaiki, wajib ditukar baru." },
  { q: "4. Alat untuk mengukur dan memonitor ada tidaknya gas beracun adalah", o: ["Oxygen analyser", "Toxic gas detector", "Explosimeter", "Tachometer"], a: 1, e: "Toxic Detector Sensor didesain sensitif khusus untuk paparan Parts Per Million (PPM) dari gas racun (seperti H2S dan CO)." },
  { q: "5. Yang bertanggung jawab ditaatinya PP 11 tahun 1979 adalah", o: ["Dirjen Migas", "Inspektur Tambang", "Kepala Inspeksi Tambang Minyak dan Gas Bumi", "Inspektur Migas"], a: 2, e: "Peraturan Pemerintah No 11 Tahun 1979 khusus mengatur K3 instalasi Migas, dan pelaksana teknis pengawasannya secara de-jure dilakukan oleh Kepala Pelaksana Inspeksi Tambang (Migas)." },
  { q: "6. Tujuan identifikasi bahaya pada saat akan bekerja adalah", o: ["Untuk mengenali potensi bahaya dan cara pengendaliannya", "Agar pekerja selalu tenang", "Terbebas bahaya", "Bahaya dihilangkan"], a: 0, e: "Konsep utama JSA/HIRA (Identifikasi Bahaya) adalah preventif. Pekerja mengaudit secara sadar 'potensi' insiden lalu menata prosedur pengendalian/mitigasinya." },
  { q: "7. Yang dimaksud dengan open circuit adalah", o: ["Udara bebas, dilepas keluar", "Udara tabung, kembali ke sistem", "Udara tabung, dilepas ke sistem", "Menggunakan udara dari tabung, udara yang dihembuskan dilepas keluar sistem"], a: 3, e: "Pada sistem SCBA Open Circuit, udara oksigen yang selesai dihirup paru-paru pekerja akan diekspirasi dan langsung dibuang keluar atmosfir melalui masker (Exhalation Valve)." },
  { q: "8. Sound Level meter adalah", o: ["Alat ukur temperature", "Alat ukur radiasi", "Alat bantu pengukur kebisingan", "Alat ukur cahaya"], a: 2, e: "SLM (Sound Level Meter) mengukur kekuatan akustik (intensitas paparan bunyi/kebisingan suara turbin mekanis alat berat) dengan satuan Desibel (dB)." },
  { q: "9. Berikut yang tidak termasuk dalam 4 komponen penting SCBA open sircuit:", o: ["Air supply & hardness", "Reducer & regulator", "Absorber", "Pressure gauge & warning wistle"], a: 2, e: "Absorber tabung CO2 (Carbon Dioxide Scrubbing) hanya digunakan untuk tipe SCBA 'Close Circuit' (Oksigen didaur ulang untuk dipakai berulang-ulang, udara tidak dibuang)." },
  { q: "10. Ruang lingkup berlakunya UU No 1 tahun 1970 ditentukan oleh", o: ["Tempat kerja", "Tenaga kerja", "Bahaya kerja", "Jawaban a, b dan c benar"], a: 3, e: "Syarat mutlak K3 ditegakkan (Pasal 2 Ayat 1): Adanya Tempat aktivitas kerja, di mana terdapat Tenaga kerja, dan melekat Sumber Bahaya di sana (Tiga kriteria wajib)." },
  { q: "11. Yang tidak termasuk dalam kategori PPE (Alat Pelindung Diri):", o: ["Safety helmet", "Breathing apparatus", "Fire detector", "Gloves"], a: 2, e: "Fire Detector (Detektor Kebakaran) masuk dalam mitigasi pencegahan engineering system pasif ruang gedung, bukan peralatan fisik yang melekat dan dipakai di tubuh (PPE)." },
  { q: "12. Syarat mental pengguna SCBA sebaiknya harus", o: ["Tidak fobia gelap", "Disiplin dan berpengetahuan", "Tidak paranoid", "Tidak fobia terbang"], a: 1, e: "Memakai SCBA harus penuh ketenangan mengontrol irama ritme pernapasan tabung udara, memiliki disiplin tinggi membaca durasi waktu tekanan dan sadar akan potensi racun." },
  { q: "13. Yang dimaksud 'Pengusaha' pada UU No 1 tahun 1970 adalah:", o: ["Orang yang memiliki perusahaan", "Orang atau badan hukum yang menjalankan usaha milik sendiri", "Orang atau pengurus saja", "Direktur utama"], a: 1, e: "Undang-Undang No. 1 Tahun 1970 mendefinisikan Pengusaha sebagai orang/badan hukum/persekutuan yang mengoperasikan unit bisnis miliknya sendiri atau milik pihak lain." },
  { q: "14. Apabila terpapar bahan kimia yang dapat mengakibatkan kelainan kesehatan disebut", o: ["Local effect", "Hazard", "Toksisitas", "First aid"], a: 0, e: "Efek Lokal (Local Effect) adalah kelainan/iritasi peradangan jaringan tubuh yang terjadi tepat di area kontak permukaan paparan kimia (seperti terbakar kena asam sulfat)." },
  { q: "15. Kemampuan bahan kimia menimbulkan dampak penyakit ketika mencapai konsentrasi cukup:", o: ["First aid", "Hazard", "Local effect", "Toksisitas"], a: 3, e: "Sifat racun (Toksisitas) mengukur seberapa mampu substansi asing merusak organ metabolisme/biologis sel saat terhirup atau masuk ke pembuluh peredaran darah." },
  { q: "16. PPE yang harus digunakan menangani bahan kimia, kecuali:", o: ["Alat bantu pernafasan, pelindung muka, sarung tangan, sepatu", "Gloves, apron, safety boot", "Fire extinguisher, detector dan pelindung telinga", "Baju kimia, sarung tangan, pelindung muka"], a: 2, e: "APAR (Fire Extinguisher) bukanlah peralatan APD badan, melainkan piranti tanggap darurat alat pemadam." },
  { q: "17. Alat bantu pernafasan prinsip pemurnian udara luar yg terkontaminasi disebut", o: ["Air demand", "Air supplying", "Air purifying respirator", "Air respirator"], a: 2, e: "Air Purifying (Penyaring Udara) mengandalkan Catridge/Filter Kanister (misal karbon aktif) untuk mencuci udara ruangan kotor luar sebelum dihisap masuk." },
  { q: "18. Pembersihan tangki, bahaya yang mengganggu pernafasan adalah", o: ["Kelembaban", "Suhu tinggi", "Gas beracun", "Kebisingan"], a: 2, e: "Vessel/Tangki yang sedang dicuci bekas BBM (Confined Space) sangat rentan akumulasi gas pengap beracun mematikan, atau Oksigen merosot sangat rendah (Asfiksia)." },
  { q: "19. Izin kerja panas adalah", o: ["Izin pekerjaan menimbulkan api & dipastikan tidak ada gas", "Daerah panas", "Pekerjaan tanpa api", "Dilakukan kontraktor"], a: 0, e: "Hot Work Permit khusus diurus apabila aktivitas kerja memicu bunga api terbuka, panas membara, gerinda potong, atau pengelasan (wajib zero LEL sebelum eksekusi)." },
  { q: "20. Yang dimaksud 'Pengurus' dalam UU 1/1970 adalah", o: ["Ditunjuk direksi", "Orang yang mempunyai tugas memimpin langsung sesuatu tempat kerja/bagiannya", "Memiliki asset", "Ditunjuk menteri"], a: 1, e: "Manajer Pabrik / Site Manager di lapangan adalah 'Pengurus', yang diberikan kewajiban hukum mutlak memimpin dan bertanggung jawab nyata operasional harian kerja K3." },
  { q: "21. Konsentrasi terekspose terus menerus tanpa efek membahayakan disebut", o: ["TLV: Threshold Limit Value", "Thershold", "Thereshol", "Tresholde"], a: 0, e: "Nilai Ambang Batas (NAB / TLV). Konsentrasi rata-rata racun kontaminasi di udara area kerja agar pekerja tidak terancam Penyakit Akibat Kerja jangka panjang." },
  { q: "22. Sebelum menggunakan SCBA yang pertama diperhatikan adalah", o: ["Kondisi fisik", "Berat", "Isi/ tekanan tabung", "Kebersihan"], a: 2, e: "Cek tekanan bar/PSI pada instrumen Manometer silinder (Full Cylinder Check). Alat akan fatal tak berguna bila tabung dipakai ternyata sudah bocor/kosong isinya." },
  { q: "23. Yang bertanggung jawab atas PP 11 tahun 1979 & tempat pemurnian migas:", o: ["Kepala teknik", "Pengusaha", "Kepala inspeksi tambang", "Pelaksana inspeksi"], a: 1, e: "PP No. 11 Thn 1979 menekankan pihak 'Pengusaha' entitas Kontraktor Migas (KKKS) yang memegang beban operasional investasi K3 dan fasilitas safety terpadunya." },
  { q: "24. Bahan cylinder composite di tes hydrostatic setiap:", o: ["4 tahun", "3 tahun", "2 tahun", "5 tahun"], a: 3, e: "Silinder Composite/Carbon Fiber jauh lebih ringan namun terbatasi umur letih material (Fatigue). Wajib dilakukan uji muai tekanan hidrolik (Hydrostatic Test) tiap interval 5 tahunan." },
  { q: "25. Ada 4 teknik penanggulangan kebakaran :", o: ["Cooling, Smothering, Silenting, Breaking Chain", "Cooling, Smoothering, Starvation, Breaking Chain", "Cooling, Smothering, Starvation, Breaking Chain Reaction", "Cooling, Invation, Breaking Chain"], a: 2, e: "Pilar pemadaman moderen: Cooling (Air), Smothering (Foam/CO2), Starvation (Tutup Keran BBM), Break Chain/Memutus Reaksi (Dry Powder/Halon)." },
  { q: "26. Saat pengisian SCBA dengan kompresor yg diperhatikan:", o: ["Working pressure tabung", "Working duration", "Safety margin", "Full duration"], a: 0, e: "Tekanan kerja aman maksimum silinder komposit (misal 300 Bar/4500 PSI) wajib diawasi. Tekanan takaran pengisian (Working Pressure) kompresor tidak boleh melampauinya untuk cegah tabung pecah." },
  { q: "27. Dalam pembinaan, pengurus wajib menjelaskan kepada tenaga kerja baru tentang:", o: ["Upah", "Hak kewajiban", "Cuti", "Kondisi dan bahaya-bahaya yang timbul di tempat kerja"], a: 3, e: "Mandat UU No. 1 1970: Tenaga baru berhak mendapat 'Safety Induction' (Orientasi Keselamatan). Wajib ditunjukkan bahaya-bahaya alat berat dan APD yang harus dipakai." },
  { q: "28. Kecelakaan kerja wajib dilaporkan oleh:", o: ["Anggota P2K3", "Pengurus", "Ahli K3", "Pengusaha"], a: 1, e: "Sesuai undang-undang, yang memimpin operasional (Pengurus) diberi delegasi wewenang hukum untuk melaporkan kejadian insiden tak dikehendaki (Kecelakaan max 2x24 Jam)." },
  { q: "29. Dokumen tertulis mengendalikan masuk ruang terbatas adalah:", o: ["LOTO", "IKP", "IKD", "Entry Permit"], a: 3, e: "Masuk ke Tangki/Bejana (Ruang Terbatas) sangat tinggi risiko terperangkap, maka syarat prosedurnya menggunakan form 'Confined Space Entry Permit' (Izin Masuk Ruang)." },
  { q: "30. TLV untuk kerja 8 jam/hari 40 jam/minggu disebut:", o: ["TLV-STEL", "TLV-Cenzing", "TLV-TWA (Time Weight Average)", "TLV-C"], a: 2, e: "Time Weighted Average (TWA) mengukur akumulasi rata-rata paparan ambang batas gas kimia ringan yang wajar ditoleransi tubuh pekerja selama total jam shift reguler 8 jam." },
  { q: "31. Close circuit adalah:", o: ["Udara bebas", "Menggunakan oksigen tabung, dihembuskan diikat CO2, sisa oksigen kembali masuk", "Oksigen tabung, udara keluar", "Udara tabung keluar"], a: 1, e: "Dalam tipe CCBA (Close Circuit), tabung udara di punggung pendaur ulang CO2 (diikat ke media bahan kimia scrubber) sehingga sisa Oksigen bersih diputar terus menerus (Sirkulasi Tertutup)." },
  { q: "32. Udara di confined space dapat beresiko kematian jika kondisi berikut, KECUALI:", o: ["Melampaui NAB", "Oksigen < 19,5%", "Suhu > 50 C", "Gas uap < 5% LFL (LEL)"], a: 3, e: "Batas zona aman ideal uap gas eksplosif adalah 0% LEL. Batas syarat izin kerjanya < 5% LEL masih diizinkan bekerja. Ini BUKAN zona fatal maut, karena batas ledakan mematikan ada di 100% LEL." },
  { q: "33. Pelindung pernafasan udara bersih dari compressor disebut:", o: ["Air Demand", "Air Respirator", "Air Purifying", "Air supliying Respirator"], a: 3, e: "Supplied Air Respirator/Airline Apparatus: Tipe instrumen suplai udara bertekanan positif secara kontinyu menggunakan selang panjang sejauh puluhan meter ditiup dari titik aman Kompresor." },
  { q: "34. Dalam keadaan normal oksigen di udara adalah:", o: ["79%", "10%", "100%", "21%"], a: 3, e: "Komposisi atmosfer udara bersih segar adalah 78% gas inert Nitrogen dan sekitar 20,9% hingga 21% Oksigen aktif. Tubuh akan mati lemas mendadak bila di bawah level 19,5%." },
  { q: "35. Zat yang mengganggu gas test KECUALI:", o: ["Oksigen", "Debu organic", "Zat silicon", "Sodium Halogen"], a: 0, e: "Kandungan Oksigen berlimpah di sekeliling tidak merusak sensor pengujian gas metana. Justru sebaliknya, kelembapan parah dan debu ekstrim uap silikon akan merusak sensitif elemen katalitik LEL." },
  { q: "36. Tidak termasuk langkah cek tekanan tinggi SCBA:", o: ["Cek manometer 12atm", "Buka valve utama", "Buka bypass peluit 40-50atm", "Cek manometer < 5/6 dari kerja tidak boleh digunakan"], a: 3, e: "Berdasarkan SOP SCBA standar dunia: Buka penuh katup silinder (valve), perhatikan jarum tekanan gauge tabung, tekan tombol Bypass periksa peluit berbunyi (low warning). Klausa <5/6 adalah format uji kuno salah." },
  { q: "37. Metode penggunaan SCBA:", o: ["Over-the-head", "Over-the-head-method dan crossed-arms coat method", "Crossed-arms", "Over-the-arm"], a: 1, e: "Donning (Cara pakai rompi). Dapat dilemparkan tali pengikat ke pundak atas kepala (Over the Head) dan memposisikan lengan di samping silang menaikkan tabung beban (Coat Method)." },
  { q: "38. SCBA singkatan dari:", o: ["Squence Contained", "Self contained breathimh", "self contained breathing apparatus", "self contain breathing"], a: 2, e: "Self Contained Breathing Apparatus. Secara harfiah: Peralatan sistem silinder independen yang menyediakan pasokan oksigen yang berdiri sendiri dibawa di punggung." },
  { q: "39. Melakukan pengawasan pelaksanaan UU 1/1970:", o: ["Pengusaha", "Pengurus", "Direktur", "Direktur pengusaha pengurus"], a: 2, e: "Dalam struktur hukum Depnaker, Pejabat Direktur fungsional Kemenaker adalah aparatur pelaksana wewenang mengontrol dan inspeksi perwakilan negara langsung thd Pengusaha." },
  { q: "40. Menghitung lama habis botol (full duration) SCBA:", o: ["Kapasitas x Konsumsi", "Kapasitas + Konsumsi", "Kapasitas - Konsumsi", "Lama = Kapasitas botol : Konsumsi udara"], a: 3, e: "Rumus matematis Full Duration: (Volume udara Bar silinder x Liter volume wadah) dibagi estimasi rerata tarikan napas tenaga berat (40 liter per menit)." },
  { q: "41. 'Ahli Keselamatan Kerja' UU 1/1970 adalah:", o: ["Ahli kompetensi", "Ahli dilingkungan depnaker", "Ahli teknis berkeahlian dari luar depnaker ditunjuk menteri", "Ahli teknis depnaker"], a: 2, e: "AK3 Umum (Ahli K3) adalah pejabat atau swasta dari instansi luar lingkungan Kemnaker, namun memiliki lisensi kompetensi khusus K3 dan legalitas Surat Keputusan (SK) dari Menteri." },
  { q: "42. Fungsi P2K3 UU 1/1970:", o: ["Kerjasama pengurus dan naker", "Mengembangkan kerja sama pengusaha/pengurus dan tenaga kerja utk tugas K3", "Kerjasama pengusaha", "Semua salah"], a: 1, e: "P2K3 (Panitia Pembina Keselamatan & Kesehatan Kerja) menjadi wadah forum rutin resmi gabungan diskusi para pekerja operasional bersama manajemen pengusaha K3 bulanan." },
  { q: "43. Prosedur exsplosimeter, KECUALI:", o: ["Alat tidak berfungsi di lokasi ada oksigennya", "Steam mengaburkan", "Filament putus gas 100%", "Jangan gas test diatas angin"], a: 0, e: "Pernyataan ini jelas keliru fatal. Detektor Gas (Explosimeter) justu mewajibkan kondisi ruang dengan oksigen karena sifat pembakaran di LEL sensornya mengandalkan oksigen atmosfer." },
  { q: "44. Yang dimaksud Breath pada BHD:", o: ["Kuasai nafas", "Obat", "Sirkulasi", "Pemberian nafas buatan"], a: 3, e: "Dalam tata laksana resusitasi ABC / CAB (Breathing), 'B' berarti langkah memompa cadangan udara (melalui ditiupkan mulut penolong) ke ventilasi relung paru-paru korban pingsan." },
  { q: "45. Menggunakan SCBA bocor H2S Demand Regulator diatur:", o: ["Tekanan positif", "Tekanan negative", "Semua benar", "Normal"], a: 0, e: "Demand Valve di mode 'Positive Pressure' artinya masker sedikit membengkak padat terus menghembuskan udara walau tidak dihirup, jadi gas racun dari pinggir wajah tertahan dorongan luar." },
  { q: "46. Kebocoran gas akumulasi di tempat rendah disebabkan:", o: ["Reaksi udara", "Berat jenis gas lebih berat dibanding udara", "Angin", "Benar semua"], a: 1, e: "Sifat mutlak gas berat hidrokarbon murni (Propana, Butana) dan racun (H2S), memiliki koefisien Spesific Gravity lebih dari Udara (1.0). Sehingga secara alami jatuh dan bergulung di gorong-gorong dan parit rendah." },
  { q: "47. Mengatasi shock dengan:", o: ["Baringkan lutut tinggi", "Air hangat", "Semua cara diatas", "Selimuti"], a: 2, e: "Posisi Tungkai lutut kaki diagkat tinggi (Shock Position 30cm) merangsang sirkulasi balik pasokan pompa darah vital dari tubuh ke rongga jantung & otak. Tambahan diselimuti mencegah hypothermia keringat dingin." },
  { q: "48. Penangan korban pingsan:", o: ["Minyak kayu putih", "Teh hangat", "RJP", "Kuasai posisi jalan nafas"], a: 3, e: "Prioritas mutlak paramedis saat menemukan pingsan (Unconscious) di lapangan adalah memastikan saluran tenggorokan pasien terbuka, karena lidah orang pingsan akan jatuh memblokir jalannya udara." },
  { q: "49. Jika ada korban luka gores/pendarahan di tangan:", o: ["Posisi tangan diatas jantung", "Diberi alcohol", "Diikat", "Alcohol"], a: 0, e: "Teknik Elevasi: Mengangkat lengan anggota tubuh yang berdarah ke atas posisinya melampaui jantung. Hal ini melambatkan hukum gravitasi aliran arteri darah memancar yang mensuplai pergelangan." },
  { q: "50. Alat ukur gas beracun yang system kerjanya berubah warna:", o: ["Tube detector", "Multi gas detector", "Explosivemeter", "Oksigen analyizer"], a: 0, e: "Colorimetric Gas Detector (Tabung Detektor Kimia Dräger/Gastec) adalah detektor gas unik kaca bening kuno yang menampung bahan reaktan. Bahan tersebut akan mengganti warnanya bila menghisap gas spesifik." }
];

// ==========================================
// STATE MANAGEMENT & RUNTIME logic
// ==========================================

let k3MasteryState = {
    view: 'home', // 'home', 'cepu', 'soalX', 'soalY', 'soalZ'
    index: 0,
    showAnswer: false,
    answers: [], // Array of selected options (indices)
    currentDb: null,
    currentTitle: ''
};

function initK3MigasMastery() {
    k3MasteryState.view = 'home';
    k3MasteryState.index = 0;
    k3MasteryState.showAnswer = false;
    k3MasteryState.answers = [];
    k3MasteryState.currentDb = null;
    k3MasteryState.currentTitle = '';
    renderK3Mastery();
}

function renderK3Mastery() {
    const container = document.getElementById('k3-migas-mastery-content');
    if (!container) return;

    if (k3MasteryState.view === 'home') {
        container.innerHTML = renderK3Home();
    } else if (k3MasteryState.view === 'cepu') {
        container.innerHTML = renderK3Flashcard();
    } else {
        container.innerHTML = renderK3Quiz();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function selectK3View(viewName) {
    k3MasteryState.view = viewName;
    k3MasteryState.index = 0;
    k3MasteryState.showAnswer = false;

    if (viewName === 'cepu') {
        k3MasteryState.currentDb = dbCepu;
        k3MasteryState.currentTitle = 'Tanya Jawab Cepu (Essay)';
    } else {
        if (viewName === 'soalX') {
            k3MasteryState.currentDb = dbSoalX;
            k3MasteryState.currentTitle = 'Simulasi Ujian Tipe X';
        } else if (viewName === 'soalY') {
            k3MasteryState.currentDb = dbSoalY;
            k3MasteryState.currentTitle = 'Simulasi Ujian Tipe Y';
        } else if (viewName === 'soalZ') {
            k3MasteryState.currentDb = dbSoalZ;
            k3MasteryState.currentTitle = 'Simulasi Ujian Tipe Z';
        }
        k3MasteryState.answers = new Array(k3MasteryState.currentDb.length).fill(null);
    }
    renderK3Mastery();
}

// ==========================================
// RENDER VIEWS (TEMPLATE COMPILING)
// ==========================================

function renderK3Home() {
    return `
    <div style="max-width: 900px; margin: 0 auto; padding: 10px 0 30px;" class="animate-in fade-in duration-300">
        <div style="text-align: center; margin-bottom: 35px; margin-top: 10px;">
            <h1 style="font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, #fbbf24, #f59e0b); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">🔥 K3 Migas Full Mastery</h1>
            <p class="text-muted" style="margin-top: 8px; font-size: 0.95rem;">Modul belajar interaktif Cepu Essay dan bank soal ujian pilihan ganda lengkap dengan pembahasan detail.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; max-width: 800px; margin: 0 auto;" class="k3-menu-grid">
            
            <!-- Tanya Jawab Cepu -->
            <div class="card clickable-card" onclick="selectK3View('cepu')" style="border-left: 5px solid #3b82f6; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; padding: 20px; display: flex; align-items: center; gap: 20px; background: var(--surface);">
                <div style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">📖</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px;">
                        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-color);">Tanya Jawab Cepu</h3>
                        <span style="font-size: 0.75rem; background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 3px 8px; border-radius: 20px; font-weight: bold;">40 Soal Essay</span>
                    </div>
                    <p class="text-muted" style="margin: 6px 0 0 0; font-size: 0.82rem; line-height: 1.4;">Mode hafalan kartu pintar untuk teori api, segitiga api, konstruksi APAR, gas detector, dan SCBA.</p>
                </div>
                <div style="font-size: 1.2rem; color: var(--text-muted);">→</div>
            </div>

            <!-- Ujian Tipe X -->
            <div class="card clickable-card" onclick="selectK3View('soalX')" style="border-left: 5px solid #fbbf24; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; padding: 20px; display: flex; align-items: center; gap: 20px; background: var(--surface);">
                <div style="background: rgba(251, 191, 36, 0.1); color: #fbbf24; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">🎯</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px;">
                        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-color);">Simulasi Ujian Tipe X</h3>
                        <span style="font-size: 0.75rem; background: rgba(251, 191, 36, 0.15); color: #fbbf24; padding: 3px 8px; border-radius: 20px; font-weight: bold;">50 Pilihan Ganda</span>
                    </div>
                    <p class="text-muted" style="margin: 6px 0 0 0; font-size: 0.82rem; line-height: 1.4;">Soal ujian fokus pada APAR, teknik pemadaman kebakaran, klasifikasi kebakaran NFPA, and media pemadam.</p>
                </div>
                <div style="font-size: 1.2rem; color: var(--text-muted);">→</div>
            </div>

            <!-- Ujian Tipe Y -->
            <div class="card clickable-card" onclick="selectK3View('soalY')" style="border-left: 5px solid #ef4444; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; padding: 20px; display: flex; align-items: center; gap: 20px; background: var(--surface);">
                <div style="background: rgba(239, 68, 68, 0.1); color: #ef4444; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">⚡</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px;">
                        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-color);">Simulasi Ujian Tipe Y</h3>
                        <span style="font-size: 0.75rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; padding: 3px 8px; border-radius: 20px; font-weight: bold;">50 Pilihan Ganda</span>
                    </div>
                    <p class="text-muted" style="margin: 6px 0 0 0; font-size: 0.82rem; line-height: 1.4;">Soal ujian fokus pada LEL/UEL, flammable range, detektor gas, jembatan Wheatstone, dan bantuan hidup dasar (RJP/CPR).</p>
                </div>
                <div style="font-size: 1.2rem; color: var(--text-muted);">→</div>
            </div>

            <!-- Ujian Tipe Z -->
            <div class="card clickable-card" onclick="selectK3View('soalZ')" style="border-left: 5px solid #10b981; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; padding: 20px; display: flex; align-items: center; gap: 20px; background: var(--surface);">
                <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0;">🛡️</div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px;">
                        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: var(--text-color);">Simulasi Ujian Tipe Z</h3>
                        <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: #a7f3d0; padding: 3px 8px; border-radius: 20px; font-weight: bold;">50 Pilihan Ganda</span>
                    </div>
                    <p class="text-muted" style="margin: 6px 0 0 0; font-size: 0.82rem; line-height: 1.4;">Soal ujian fokus pada regulasi K3 (UU No 1/1970), PP 11/1979, confined space entry, SCBA, and gas testing.</p>
                </div>
                <div style="font-size: 1.2rem; color: var(--text-muted);">→</div>
            </div>

        </div>
    </div>
    `;
}

function renderK3Flashcard() {
    const total = k3MasteryState.currentDb.length;
    const index = k3MasteryState.index;
    const item = k3MasteryState.currentDb[index];
    const progress = ((index + 1) / total) * 100;

    // Check for drawing injections
    let questionDrawingHtml = '';
    let answerDrawingHtml = '';

    if (index === 9) { // Q10: Segitiga Api
        answerDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
            <img src="img/hse-rig/k3_fire_triangle.png" alt="Segitiga Api" style="max-height: 200px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Diagram Segitiga Api: Kombinasi Oksigen, Panas, dan Bahan Bakar.</div>
        </div>`;
    } else if (index === 17) { // Q18: Komponen APAR
        answerDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
            <img src="img/hse-rig/k3_apar_components.png" alt="Komponen APAR" style="max-height: 200px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Komponen APAR: Safety Pin, Tuas, Hose, Pressure Gauge, Nozzle, Handle, dan Tabung.</div>
        </div>`;
    } else if (index === 26) { // Q27: Gambarkan monitor gas detector
        answerDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
            <img src="img/hse-rig/k3_gas_detector_screen.png" alt="Monitor Gas Detector" style="max-height: 200px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Layar Monitor Gas Detector: H2S (PPM), CO (PPM), O2 (%), LEL (%).</div>
        </div>`;
    } else if (index === 27 || index === 28) { // Q28, Q29: Flammable range diagram
        questionDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 380px;">
            <img src="img/hse-rig/k3_flammable_range_h2s.png" alt="Flammable Range Gas H2S" style="max-height: 180px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Diagram Flammable Range H2S: Batas LEL 4.3% sampai UEL 46%.</div>
        </div>`;
    } else if (index === 31) { // Q32: Tube Gas Detector
        answerDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
            <img src="img/hse-rig/k3_gas_detector_tubes.png" alt="Tube Gas Detector" style="max-height: 200px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Tube Gas Detector (Colorimetric Tube) mendeteksi gas melalui perubahan warna reaktan kimia.</div>
        </div>`;
    } else if (index === 35) { // Q36: SCBA Components
        answerDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
            <img src="img/hse-rig/k3_scba_components.png" alt="Komponen SCBA" style="max-height: 200px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Komponen Utama SCBA: Cylinder, Demand Valve, Harness, Masker, Regulator/Reducer.</div>
        </div>`;
    } else if (index === 38) { // Q39: CPR Steps
        answerDrawingHtml = `
        <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
            <img src="img/hse-rig/k3_cpr_steps.png" alt="Langkah RJP/CPR" style="max-height: 200px; max-width: 100%; border-radius: 12px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: block; margin: 0 auto 8px;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Langkah Resusitasi Jantung Paru (RJP): Danger, Response, Circulation, Airway, Breathing.</div>
        </div>`;
    }

    return `
    <div style="max-width: 700px; margin: 0 auto;" class="animate-in fade-in duration-300">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-weight: bold; font-size: 0.85rem;">
            <span style="color: #3b82f6;">${k3MasteryState.currentTitle}</span>
            <span style="background: var(--surface-hover); color: var(--text); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border);">Soal ${index + 1} / ${total}</span>
        </div>

        <div style="width: 100%; background: var(--surface-hover); height: 8px; border-radius: 10px; overflow: hidden; margin-bottom: 25px; border: 1px solid var(--border);">
            <div style="width: ${progress}%; background: #3b82f6; height: 100%; transition: width 0.3s ease;"></div>
        </div>

        <!-- Flashcard Body -->
        <div class="card" style="min-height: 330px; display: flex; flex-direction: column; justify-content: space-between; padding: 25px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            
            <!-- Question Box -->
            <div style="display: flex; flex-direction: column; justify-content: center; flex: 1; min-height: 120px; text-align: center;">
                <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 15px;">Pertanyaan</span>
                <h3 style="margin: 0; font-size: 1.35rem; font-weight: 700; color: var(--text-color); line-height: 1.5; padding: 0 10px;">
                    ${item.q.replace(/^\d+\.\s*/, '')}
                </h3>
                ${questionDrawingHtml}
            </div>

            <!-- Answer Box (conditional) -->
            ${k3MasteryState.showAnswer ? `
                <div style="background: rgba(59, 130, 246, 0.04); border-top: 1px solid var(--border); padding: 20px 15px 10px; margin-top: 20px;">
                    <span style="color: #3b82f6; font-size: 0.72rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; display: block; text-align: center; margin-bottom: 12px;">Jawaban</span>
                    <div style="font-size: 1.05rem; font-weight: 600; line-height: 1.6; color: var(--text-color); text-align: left; max-width: 580px; margin: 0 auto;">
                        ${item.a.split('\n').map(line => `<p style="margin: 0 0 8px 0;">${line}</p>`).join('')}
                    </div>
                    ${answerDrawingHtml}
                </div>
            ` : `
                <div style="border-top: 1px solid var(--border); padding: 20px 0 10px; text-align: center; margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="toggleK3EssayAnswer()" style="padding: 10px 24px; font-weight: bold; border-radius: 30px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px;">
                        <span>👁️</span> Lihat Jawaban
                    </button>
                </div>
            `}
        </div>

        <!-- Navigation buttons -->
        <div style="display: flex; gap: 15px; margin-top: 20px;">
            <button class="btn btn-secondary" onclick="k3PrevQuestion()" ${index === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="flex: 1; padding: 12px 10px; font-weight: bold; border-radius: 12px;">
                ← Sebelumnya
            </button>
            <button class="btn btn-primary" onclick="k3NextQuestion()" style="flex: 1; padding: 12px 10px; font-weight: bold; border-radius: 12px;">
                ${index === total - 1 ? 'Selesai' : 'Berikutnya →'}
            </button>
        </div>
    </div>
    `;
}

function renderK3Quiz() {
    const total = k3MasteryState.currentDb.length;
    const index = k3MasteryState.index;
    const question = k3MasteryState.currentDb[index];
    const answeredCount = k3MasteryState.answers.filter(a => a !== null).length;
    const hasAnsweredCurrent = k3MasteryState.answers[index] !== null;

    // Check for drawing injections (Soal X, Y, Z)
    let drawingHtml = '';
    
    if (k3MasteryState.currentDb === dbSoalX) {
        if (index === 11 || index === 15 || index === 16) { // Q12, Q16, Q17: APAR
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_apar_components.png" alt="Komponen APAR" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Komponen APAR: Safety Pin, Tuas, Hose, Pressure Gauge, Nozzle, Handle, dan Tabung.</div>
            </div>`;
        } else if (index === 31) { // Q32: Segitiga Api
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_fire_triangle.png" alt="Segitiga Api" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Diagram Segitiga Api: Oksigen (O2), Panas (Heat), dan Bahan Bakar (Fuel).</div>
            </div>`;
        }
    } else if (k3MasteryState.currentDb === dbSoalY) {
        if (index === 13) { // Q14: APAR PASS
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_apar_components.png" alt="Komponen APAR" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Metode PASS: Pull pin, Aim nozzle, Squeeze lever, Sweep side-to-side.</div>
            </div>`;
        } else if (index === 16 || index === 32) { // Q17, Q33: Explosimeter/Gas Detector
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_gas_detector_screen.png" alt="Gas Detector HUD" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Layar Monitor Gas Detector menampilkan konsentrasi H2S, CO, O2, dan LEL.</div>
            </div>`;
        } else if (index === 19 || index === 33) { // Q20, Q34: Flammable Range
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 380px;">
                <img src="img/hse-rig/k3_flammable_range_h2s.png" alt="Flammable Range H2S" style="max-height: 160px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Diagram Flammable Range: Batas LEL dan UEL tempat gas dapat terbakar/meledak.</div>
            </div>`;
        } else if (index === 39 || index === 40 || index === 44) { // Q40, Q41, Q45: CPR/RJP
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_cpr_steps.png" alt="CPR Steps" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Resusitasi Jantung Paru (RJP) dilakukan dengan rasio 30 kompresi dada banding 2 napas buatan.</div>
            </div>`;
        } else if (index === 49) { // Q50: Gas tubes
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_gas_detector_tubes.png" alt="Gas Detector Tubes" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Tube Detector (Colorimetric Tube) mendeteksi konsentrasi gas secara visual dengan perubahan warna reaktan kimia.</div>
            </div>`;
        }
    } else if (k3MasteryState.currentDb === dbSoalZ) {
        if (index === 3) { // Q4: Toxic Gas monitor
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_gas_detector_screen.png" alt="Gas Detector HUD" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Alat ukur gas (Multi Gas Detector) memonitor gas berbahaya dalam unit PPM (toxic) and % LEL (flammable).</div>
            </div>`;
        } else if (index === 6 || index === 8) { // Q7, Q9: SCBA
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_scba_components.png" alt="SCBA Components" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Komponen SCBA Open Circuit: Tabung, reducer, demand valve, masker, harness.</div>
            </div>`;
        } else if (index === 49) { // Q50: Gas tubes
            drawingHtml = `
            <div style="margin: 15px auto 0; text-align: center; max-width: 320px;">
                <img src="img/hse-rig/k3_gas_detector_tubes.png" alt="Gas Detector Tubes" style="max-height: 180px; max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); border: 1px solid var(--border); display: block; margin: 0 auto 8px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 500; line-height: 1.4;">Gas detector tube (Draeger/Gastec) mendeteksi gas spesifik dengan mengukur batas perubahan warna (colorimetric).</div>
            </div>`;
        }
    }

    // Grid numbers HTML
    let numbersHtml = '';
    k3MasteryState.currentDb.forEach((_, i) => {
        const isCurrent = index === i;
        const hasAns = k3MasteryState.answers[i] !== null;
        const isCorrect = hasAns && k3MasteryState.answers[i] === k3MasteryState.currentDb[i].a;
        
        let gridStyle = "width:42px; height:42px; border-radius:8px; font-weight:700; font-size:0.85rem; display:flex; align-items:center; justify-content:center; cursor:pointer; border: 1px solid var(--border); transition: all 0.2s; ";
        if (isCurrent) gridStyle += "outline: 3px solid #3b82f6; border-color: #3b82f6; scale: 1.05; ";
        if (hasAns) {
            gridStyle += isCorrect ? "background:#10b981; color:white; border-color:#10b981;" : "background:#ef4444; color:white; border-color:#ef4444;";
        } else {
            gridStyle += "background:var(--surface-hover); color:var(--text);";
        }
        
        numbersHtml += `<button onclick="jumpToK3QuizQuestion(${i})" style="${gridStyle}">${i + 1}</button>`;
    });

    return `
    <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-direction: row; gap: 25px;" class="animate-in fade-in duration-300 k3-quiz-layout">
        
        <!-- Left Column: Quiz panel -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
            
            <!-- Quiz Header -->
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px;">
                <div>
                    <h2 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-color);">${k3MasteryState.currentTitle}</h2>
                    <p class="text-muted" style="margin: 3px 0 0 0; font-size: 0.8rem; font-weight: 500;">Progres: ${answeredCount} / ${total} Soal Terjawab</p>
                </div>
                <button class="btn btn-secondary hide-on-desktop" onclick="toggleK3MobileGrid()" style="padding: 8px 12px; font-weight: bold; font-size: 0.78rem; border-radius: 8px; display: none;">
                    📋 Daftar Soal
                </button>
            </div>

            <!-- Quiz Main Card -->
            <div class="card" style="padding: 25px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; min-height: 420px; display: flex; flex-direction: column;">
                
                <!-- Question Title -->
                <h3 style="margin: 0 0 25px 0; font-size: 1.22rem; font-weight: 700; color: var(--text-color); line-height: 1.5;">
                    <span style="color: #3b82f6; margin-right: 6px;">Q${index + 1}.</span>
                    ${question.q.replace(/^\d+\.\s*/, '')}
                </h3>

                <!-- Options -->
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
                    ${question.o.map((opt, i) => {
                        const isCorrectOption = i === question.a;
                        const isUserChoice = k3MasteryState.answers[index] === i;
                        
                        let btnStyle = "width: 100%; text-align: left; padding: 15px 20px; border-radius: 12px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; border: 2px solid; ";
                        let badgeStyle = "width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; flex-shrink: 0; border: 2px solid; ";
                        
                        if (!hasAnsweredCurrent) {
                            btnStyle += "background: var(--surface); color: var(--text-color); border-color: var(--border);";
                            badgeStyle += "background: var(--surface-hover); color: var(--text-muted); border-color: var(--border);";
                        } else {
                            if (isCorrectOption) {
                                btnStyle += "background: rgba(16, 185, 129, 0.08); color: #065f46; border-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);";
                                badgeStyle += "background: #10b981; color: white; border-color: #10b981;";
                            } else if (isUserChoice) {
                                btnStyle += "background: rgba(239, 68, 68, 0.08); color: #991b1b; border-color: #ef4444;";
                                badgeStyle += "background: #ef4444; color: white; border-color: #ef4444;";
                            } else {
                                btnStyle += "background: var(--surface-hover); color: var(--text-muted); border-color: var(--border); opacity: 0.6; cursor: not-allowed;";
                                badgeStyle += "background: var(--surface); color: var(--text-muted); border-color: var(--border);";
                            }
                        }

                        return `
                        <button onclick="selectK3QuizOption(${i})" ${hasAnsweredCurrent ? 'disabled' : ''} style="${btnStyle}">
                            <div style="${badgeStyle}">${String.fromCharCode(65 + i)}</div>
                            <span style="flex: 1;">${opt}</span>
                        </button>
                        `;
                    }).join('')}
                </div>

                <!-- Explanation Panel (after answer) -->
                ${hasAnsweredCurrent ? `
                    <div class="animate-in fade-in duration-300" style="margin-bottom: 25px; border-radius: 12px; border: 1px solid; padding: 18px; ${k3MasteryState.answers[index] === question.a ? 'background: rgba(16, 185, 129, 0.04); border-color: rgba(16, 185, 129, 0.2);' : 'background: rgba(239, 68, 68, 0.04); border-color: rgba(239, 68, 68, 0.2);'}">
                        <div style="display: flex; gap: 15px; align-items: flex-start;">
                            <div style="font-size: 2.2rem; line-height: 1; ${k3MasteryState.answers[index] === question.a ? 'color: #10b981;' : 'color: #ef4444;'}">
                                ${k3MasteryState.answers[index] === question.a ? '✅' : '❌'}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; font-size: 1.1rem; font-weight: 800; ${k3MasteryState.answers[index] === question.a ? 'color: #065f46;' : 'color: #991b1b;'}">
                                    ${k3MasteryState.answers[index] === question.a ? 'Jawaban Anda Benar!' : 'Jawaban Anda Kurang Tepat!'}
                                </h4>
                                <p style="margin: 6px 0 12px 0; font-size: 0.88rem; font-weight: 500; color: var(--text-color);">
                                    Kunci Jawaban: <strong style="background: var(--surface); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--text-color);">${String.fromCharCode(65 + question.a)}. ${question.o[question.a]}</strong>
                                </p>

                                <div style="background: rgba(251, 191, 36, 0.05); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 8px; padding: 12px 14px;">
                                    <span style="font-weight: bold; color: #b45309; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                        💡 Detail Pembahasan:
                                    </span>
                                    <p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-color); font-weight: 500;">
                                        ${question.e}
                                    </p>
                                </div>
                            </div>
                        </div>
                        ${drawingHtml}
                    </div>
                ` : ''}

                <!-- Prev/Next Control Row -->
                <div style="margin-top: auto; border-top: 1px solid var(--border); padding-top: 20px; display: flex; justify-content: space-between;">
                    <button class="btn btn-secondary" onclick="k3PrevQuestion()" ${index === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''} style="padding: 10px 20px; font-weight: bold; border-radius: 10px; font-size: 0.85rem;">
                        ← Prev
                    </button>
                    <button class="btn btn-primary" onclick="k3NextQuestion()" style="padding: 10px 20px; font-weight: bold; border-radius: 10px; font-size: 0.85rem;">
                        ${index === total - 1 ? 'Tutup Ujian' : 'Selanjutnya →'}
                    </button>
                </div>

            </div>

        </div>

        <!-- Right Column: Navigation Grid Panel -->
        <div class="k3-grid-panel" style="width: 280px; flex-shrink: 0;">
            <div class="card" style="padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; position: sticky; top: 85px; max-height: calc(100vh - 120px); display: flex; flex-direction: column;">
                <h3 style="margin: 0 0 15px 0; font-size: 1rem; font-weight: 700; color: var(--text-color);">Daftar Nomor</h3>
                
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; overflow-y: auto; max-height: 380px; padding-bottom: 10px;" class="no-scrollbar">
                    ${numbersHtml}
                </div>

                <!-- Legend -->
                <div style="border-top: 1px solid var(--border); margin-top: 20px; padding-top: 15px; display: flex; flex-direction: column; gap: 8px; font-size: 0.78rem; font-weight: bold; color: var(--text-muted);">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:14px; height:14px; background:#10b981; border-radius:4px;"></div> Benar</div>
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:14px; height:14px; background:#ef4444; border-radius:4px;"></div> Salah</div>
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:14px; height:14px; background:var(--surface-hover); border: 1px solid var(--border); border-radius:4px;"></div> Belum Dijawab</div>
                </div>
            </div>
        </div>

    </div>

    <!-- Mobile Grid Overlay Modal -->
    <div id="k3-mobile-grid-modal" class="hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 50000; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div class="card animate-in zoom-in-95 duration-200" style="background: var(--surface); max-width: 320px; width: 100%; padding: 20px; border-radius: 16px; border: 1px solid var(--border); display: flex; flex-direction: column;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 1rem; font-weight: 700; color: var(--text-color);">Daftar Nomor</h3>
                <button onclick="toggleK3MobileGrid()" style="background: none; border: none; font-size: 1.3rem; color: var(--text-muted); cursor: pointer; padding: 5px;">&times;</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; overflow-y: auto; max-height: 280px; padding-bottom: 10px;" class="no-scrollbar">
                ${numbersHtml}
            </div>
            <div style="border-top: 1px solid var(--border); margin-top: 15px; padding-top: 15px; display: flex; flex-direction: column; gap: 8px; font-size: 0.72rem; font-weight: bold; color: var(--text-muted);">
                <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#10b981; border-radius:3px;"></div> Benar</div>
                <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#ef4444; border-radius:3px;"></div> Salah</div>
                <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:var(--surface-hover); border: 1px solid var(--border); border-radius:3px;"></div> Belum Dijawab</div>
            </div>
        </div>
    </div>
    `;
}

// ==========================================
// INTERACTIVE EVENT HANDLERS
// ==========================================

function toggleK3EssayAnswer() {
    k3MasteryState.showAnswer = true;
    renderK3Mastery();
}

function selectK3QuizOption(optIndex) {
    if (k3MasteryState.answers[k3MasteryState.index] !== null) return;
    k3MasteryState.answers[k3MasteryState.index] = optIndex;
    renderK3Mastery();
}

function k3NextQuestion() {
    const total = k3MasteryState.currentDb.length;
    if (k3MasteryState.index < total - 1) {
        k3MasteryState.index++;
        k3MasteryState.showAnswer = false;
        renderK3Mastery();
    } else {
        initK3MigasMastery(); // Tutup & kembali ke menu home K3
    }
}

function k3PrevQuestion() {
    if (k3MasteryState.index > 0) {
        k3MasteryState.index--;
        k3MasteryState.showAnswer = false;
        renderK3Mastery();
    }
}

function jumpToK3QuizQuestion(index) {
    k3MasteryState.index = index;
    k3MasteryState.showAnswer = false;
    
    // Close mobile grid if open
    const mobGrid = document.getElementById('k3-mobile-grid-modal');
    if (mobGrid) mobGrid.classList.add('hidden');
    
    renderK3Mastery();
}

function toggleK3MobileGrid() {
    const mobGrid = document.getElementById('k3-mobile-grid-modal');
    if (mobGrid) {
        mobGrid.classList.toggle('hidden');
    }
}

// Expose functions globally for HTML inline onclicks
window.selectK3View = selectK3View;
window.toggleK3EssayAnswer = toggleK3EssayAnswer;
window.selectK3QuizOption = selectK3QuizOption;
window.k3NextQuestion = k3NextQuestion;
window.k3PrevQuestion = k3PrevQuestion;
window.jumpToK3QuizQuestion = jumpToK3QuizQuestion;
window.toggleK3MobileGrid = toggleK3MobileGrid;
window.initK3MigasMastery = initK3MigasMastery;
