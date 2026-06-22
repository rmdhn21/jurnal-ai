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
  { q: "1. Untuk memadamkan kebakaran instrument listrik yang bertegangan maka media pemadam yang sesuai adalah:", o: ["Air","Busa (foam)","CO2","Tepung kimia (Dry Chemical)"], a: 2, e: "CO2 adalah gas bersih (clean agent), tidak menghantarkan listrik (non-konduktif), dan tidak meninggalkan residu serbuk yang merusak mesin." },
  { q: "2. Teknik pemadaman dengan cara menyemprotkan gas CO2 disebut :", o: ["Blanketing","Cooling","Smothering","Dilution"], a: 3, e: "Menyemprotkan gas CO2 bertujuan untuk mengurangi/mengencerkan konsentrasi oksigen di udara (Dilution) hingga di bawah batas yang dibutuhkan api." },
  { q: "3. Definisi proses pembakaran (combustion process ) adalah : Bergabungnya segitiga api", o: ["Suatu reaksi kimia yang berjalan secara berantai dan diikuti oleh evouasi panas","dan cahaya","Satu proses dimulainya api muncul dari bahan bakar","Suatu reaksi fisika hingga menimbulkan api"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "4. Klasifikasi kebakaran menurut Peraturan Menteri Tenaga Kerja dan Transmigrasi Nomor Per 04/Men/1980 mengklasifikasikan kebakaran berdasarkan :", o: ["Penggolongan kebakaran berdasarkan besar kecilnya api","Penggolongan kebakaran berdasarkan atas volume bahan bakar yang terbakar","Penggolongan kebakaran berdasarkan atas jenis bahan bakar yang terbakar","Penggolongan kebakaran berdasarkan pada panas pembakaran"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "5. Alasan diadakanya klasifikasi kebakaran adalah : * Untuk mengetahui besar kecilnya kebakaran", o: ["Untuk mengetahui rating APAR yang akan digunakan untuk memadamkannya","Untuk memudahkan dalam memilih media pemadam yang akan digunakan","untuk memadamkannya","Untuk memudahkan mengenali kebakaran yang terjadi"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "6. Contoh pemadaman dengan cara “Starvation” adalah: Memadamkan kebakaran dengan menggunakan busa mekanik", o: ["Memadamkan kebakaran dengan menggunakan CO2","Memadamkan kebakaran dengan cara menutup valve pada aliran bahan bakar","yang terbakar","Memadamkan kebakaran dengan menggunakan dry chemical"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "7. Tugas utama “RESCUE” adalah:", o: ["Melakukan evakuasi","Menyelamatkan harta benda dari kebakaran","Menata kembali setelah kebakaran (overhaul)","Menyelamatkan korban jiwa dari kebakaran"], a: 3, e: "Prioritas mutlak dalam setiap tim keadaan darurat (Rescue) adalah nyawa manusia (korban jiwa), sebelum harta benda atau aset gedung." },
  { q: "8. Jam kerja aman (Manhour) perusahaan dipengaruhi oleh", o: ["Incident","First aid case (FAC)","Medical treatment Case (MTC)","Lost time injury (LTI)"], a: 3, e: "Lost Time Injury (LTI) adalah jenis kecelakaan kerja yang menyebabkan hilangnya jam kerja aman (Manhour) karena pekerja tidak dapat kembali bekerja pada hari berikutnya." },
  { q: "9. berapakah kadar oksigen normal di udara", o: ["0,1","1","0,21","0,79"], a: 2, e: "Kadar oksigen normal di udara adalah sekitar 20,9% atau dibulatkan menjadi 21% (0,21). Batas aman untuk bekerja adalah 19,5% - 23,5%." },
  { q: "10. Di sebuah instalasi pabrik, terdapat pipa yang mengalami kebocoran* bahan kimia berbahaya. Untuk mencegah paparan kepada pekerja, perusahaan melakukan tindakan mengganti pipa lama dengan sistem pipa baru yang tahan korosi. Langkah pengendalian tersebut termasuk dalam:", o: ["Eliminasi","B. Substitusi","C. Rekayasa (Engineering Control)","Administrasi"], a: 1, e: "Tindakan mengganti material pipa yang korosif dengan pipa tahan korosi adalah bagian dari eliminasi/substitusi (dalam hal ini mengganti pipa lama/substitusi dengan yang lebih aman) untuk menghilangkan potensi bahaya kebocoran." },
  { q: "11. area sekitar yard tank dalam zoba bahaya termasuk dalam zona", o: ["zona 0","zona 1","zona 2","zona 3"], a: 1, e: "Area sekitar yard tank yang berada dalam kondisi normal tetapi dapat terjadi atmosfer gas mudah terbakar sesekali tergolong Zona 1." },
  { q: "12. Yang dimaksud kebakaran klas “A” menurut NFPA adalah", o: ["Kebakaran bahan bakar padat pada selain logam","Kebakaran bahan bakar cair dan gas","Kebakaran peralatan listrik yang bertegangan","Kebakaran logam"], a: 0, e: "Kelas A (Ash): Benda padat mudah terbakar yang menyisakan abu (seperti kayu, kertas, karet, dan kain non-logam)." },
  { q: "13. Untuk memadamkan kebakaran kelas “A” media pemadam yang paling cocok adalah:", o: ["Air","Busa (foam)","Tepung kimia (Dry Chemical)","CO2"], a: 0, e: "Api benda padat memiliki panas yang mengakar/membara, air memiliki kemampuan pendinginan (Cooling effect) yang paling unggul meresap ke dalam." },
  { q: "14. Manakah yang efektif dari beberapa media pemadaman dibawah ini, jika digunakan untuk memadamkan kebakaran genangan minyak yang luas:", o: ["FM 200","Busa Mekanik","CO2","Air"], a: 1, e: "Busa mekanik (Foam) lebih ringan dari massa jenis minyak sehingga bisa mengapung di atas genangan minyak dan membentuk selimut anti-oksigen (smothering)." },
  { q: "15. Apa tujuan dari LOTO (Log out Tag out)", o: ["Menghilangkan bahaya","Menghilangkan komponen alat","Mengendalikan sumber energy","Menghilangkan sumber kecelakaan"], a: 2, e: "Tujuan utama LOTO (Lockout/Tagout) adalah mengendalikan energi berbahaya agar peralatan tidak dioperasikan secara tidak sengaja saat pemeliharaan." },
  { q: "16. Setiap campuran gas/uap yang mudah terbakar dengan udara akan menyala jika terkena:", o: ["Aliran udara","Kabel listrik","Benda pijar/ bunga api","Uap Panas"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "17. Smoke detector kebakaran berfungsi untuk:", o: ["Mendeteksi asap","Memadamkan api","Mencegah terjadinya api","Mengenali adanya api"], a: 0, e: "Fungsi tunggal alat ini sesuai namanya, mendeteksi kumpulan partikel asap yang biasanya muncul sebelum api membesar (deteksi dini)." },
  { q: "18. Yang dimaksud Kebakaran adalah :", o: ["Api yang spontan terjadi","Bertemunya segitiga api","Timbulnya api yang besar","Timbulnya api yang tidak terkendali"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "19. Untuk mencegah terjadinya kebakaran instalasi listrik, perlu dilakukan :", o: ["Pemasangan pemutus arus","Pemasangan volt meter","Pemasangan ampere meter","Pemasangan watt meter"], a: 0, e: "Pemutus arus otomatis (seperti MCB/Sekering) sangat penting karena memutus listrik sebelum kabel meleleh akibat hubungan pendek (korsleting)." },
  { q: "20. Konsentrasi campuran antara uap bahan bakar dengan oksigen yang dapat terbakar disebut :", o: ["Flammable Range (FR)","Combustible Limit","Lower Flammable Limit (LFL) (CL)","Upper Flammble Limit (UFL)"], a: 0, e: "Flammable range adalah jarak rentang ideal antara ambang batas bawah (LEL) dan batas atas (UEL) di mana gas siap meledak/menyala." },
  { q: "21. Unsur-unsur terjadinya api adalah :", o: ["Adanya bahan bakar, hydrogen dan sumber nyala","Adanya bahan bakar, nitrogen dan sumber nyala","Adanya BBM, oksigen dan sumber nyala","Adanya bahan bakar, oksigen dan sumber nyala"], a: 3, e: "Inilah yang dikenal sebagai Segitiga Api (Fire Triangle): Panas (sumber nyala), Oksigen (O2 di udara), dan Fuel (bahan bakar padat/cair/gas)." },
  { q: "22. Instrumen apa yang mempengaruhi severity rate", o: ["First aid case (FAC)","Medical treatment Case (MTC)","Restricted work case (RWC)","Lost time injury (LTI)"], a: 3, e: "Severity Rate mengukur tingkat keparahan kecelakaan kerja berdasarkan jumlah hari kerja yang hilang per satu juta jam kerja orang." },
  { q: "23. Tugas utama “SALVAGE” adalah :", o: ["Melakukan evakuasi","Menyelamatkan harta benda dan kebakaran","Menyelamatkan korban jiwa dari kebakaran","Menata kembali setelah kebakaran (overhaul)"], a: 1, e: "Salvage dalam operasi Fire Fighting adalah upaya perlindungan dan evakuasi harta benda/dokumen penting di area bebas api setelah korban jiwa ditangani." },
  { q: "24. Loncatan bunga api listrik dapat menimbulkan kebakaran, untuk itu sistem kelistrikan yang ada di unit operasi migas tempat penimbunan dan penyaluran BBM harus:", o: ["Diisolasi yang tebal","Tempat pembagian arus ditempatkan pada kotak khusus","Kedap api","Kedap gas (Explosion Proof)"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "25. Siapakah yang harus menggunakan APAR yang ada di suatu lokasi bila terjadi kebakaran? Siapa saja yang dilokasi yang melihat adanya kebakaran dan yang", o: ["bersangkutan mampu menggunakannya","Orang yang ada dilokasi tersebut setelah mendapat ijin dari bagian fire & safety","Petugas pemadam kebakaran","Koordinator di lokasi tersebut"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "26. Di dalam teknik pemadaman kebakaran, dimana prinsip pemadamnya dilakukan dengan cara memisahkan udara dari bahan bakar yang terbakar, disebut:", o: ["Smothering","Starvation","Dilution","Cooling"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "27. Apa pertimbangan perubahan pedoman pertolongan pertama AHA* 2010(DRABC) ke AHA 2015 (DRCAB) a. memakan waktu yang cukup lama", o: ["karena sekarang sudah ada alat yaitu AED","karena kompressi dada telah terbukti efektif dalam meningkatkan kelangsungan","hidup daripada pernafasan buatan saja","jawaban semua benar"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "28. Sarung tangan yang digunakan untuk pekerjaan panas terbuat dari :", o: ["Kain","Kulit","Timbal","Karet"], a: 1, e: "Leather gloves (sarung tangan kulit) memiliki insulasi termal alami yang baik untuk menahan percikan las atau logam panas (hot work)." },
  { q: "29. Salah satu keuntungan dari media pemadam CO2 pada kebakaran panel listrik adalah :", o: ["Bersih","Murah harganya","Dapat memutus rantai reaksi pembakaran","Mempunyai daya cooling yang tinggi"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "30. Yang dimaksud kebakaran kelas “ B “ menurut NFPA adalah :", o: ["Kebakaran logam","Kebakaran bahan bakar cair dan gas","Kebakaran bahan bakar padat selain logam","Kebakaran peralatan listrik yang bertegangan"], a: 1, e: "B (Boil/Barrel). Mewakili kebakaran benda cari yang mudah menguap seperti bensin, alkohol, maupun gas propane." },
  { q: "31. Apa fungsi utama dari Job Safety Analysis (JSA) dalam penerapan* Keselamatan dan Kesehatan Kerja (K3)?", o: ["Untuk mempercepat waktu penyelesaian pekerjaan","B. Untuk memastikan alat-alat tersedia di lokasi kerja","C. Untuk mengidentifikasi potensi bahaya dan menganalisis risiko pekerjaan","Untuk membagi tugas secara merata antar pekerja"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "32. siapa yang bertanggung jawab untuk melakukan Verifikasi terhadap* (SIKA) surat ijin kerja aman sebelum pekerjaan dimulai?", o: ["Pekerja lapangan","Safety Officer atau pengawas K3","Kepala Teknik","Pengurus"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "33. Suhu terendah dimana suatu zat mulai berubah dari fase cair menjadi fase uap :", o: ["Ignition Point (titik bakar)","Boiling Point (titik didih)","Flash Point ( titik nyala)","Fire Point (titik api)"], a: 1, e: "Titik didih (boiling point) adalah saat tekanan uap cair menyamai tekanan atmosfer sehingga terjadi perubahan wujud cair menjadi gas secara ekstrem." },
  { q: "34. Apa yang diukur oleh Frequency Rate (FR) dalam Keselamatan dan* Kesehatan Kerja", o: ["Jumlah hari kerja yang hilang karena kecelakaan","B. Jumlah kecelakaan kerja per sejuta jam kerja","C. Biaya kerugian akibat kecelakaan","Jumlah pekerja yang cuti"], a: 1, e: "Frequency Rate mengukur kekerapan/frekuensi kecelakaan kerja per satu juta jam kerja orang." },
  { q: "35. Prinsip kerja sensor gas yang akan diukur teroksidasi pada elemen katalis dan menimbulkan perubahan suhu dan sekligus akan merubah nilai tahanan pada elemen katalis merupakan prinsip kerja dari sensor", o: ["Metal Oxide Sensor","Katalist Sensor","Non Dispersive Infrared","Electro-Chemical Sensor"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "36. Batas konsentrasi mudah terbakar dari bensin adalah", o: ["2,6% dan 12,8%","1,4% dan 7,6%","1% dan 10%","4% dan 75%"], a: 1, e: "Uap bensin (gasoline) memiliki rentang Flammable Range dari LEL sekitar 1.4% hingga UEL 7.6% bercampur di udara." },
  { q: "37. Temperatur terendah dimana bahan , baik itu padat atau cairan dapat menghasilkan uap yang cukup dipermukaannya dan apabila diberi percikan nyala api akan terbakar sekejap disebut :", o: ["Flash Point","Auto Ignition Temperature","Boil Point","Fire Point"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "38. Batas konsentrasi terendah uap atau gas bahan bakar diudara yang dapat menyala dan terbakar apabila diberi percikan api, yang biasa dinyatakan dalam persen volume uap bahan diudara disebut :", o: ["Flammable Limits","Combustible Limits","Lower Flammable Limits","Upper Flammable Limits"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "39. Berikut yang bukan termasuk pengertian Severity Rate (SR) dalam* Keselamatan dan Kesehatan Kerja adalah", o: ["Mengukur besarnya kerugian waktu kerja akibat kecelakaan.","B. jumlah hari kerja yang hilang per satu juta jam kerja.","C. Tingkat keparahan kecelakaan berdasarkan hari kerja yang hilang","Total biaya kerugian akibat kecelakaan kerja"], a: 3, e: "Severity Rate mengukur tingkat keparahan kecelakaan kerja berdasarkan jumlah hari kerja yang hilang per satu juta jam kerja orang." },
  { q: "40. Tujuan diterbitkannya Surat Ijin Kerja Aman (Safety Permit) adalah : Untuk menepati aturan yang telah ditetapkan oleh manajemen", o: ["Untuk memenuhi persyaratan adminstrasi","Untuk membantu para pengawas/pimpinan dalam melaksanakan tugas","pengawasa/control","Untuk memenuhi standard ISO/OHSAS"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "41. Pada pekerjaan cleaning tank, surat izin aman (safety permit) yang diperlukan adalah :", o: ["Hot work permit","Safety permit","Cold work permit","Entry permit"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "42. Dibawah ini yang merupakan teknik menggunakan APAR yang benar adalah", o: ["ASSP (Aim, Sweep, Squeeze, Pull)","SAPS (Sweep, Aim, Pull, Squeeze)","PASS (Pull, Aim, Squeeze, Sweep)","PSAS (Pull, Sweep, Aim, Squeeze)"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "43. Angka yang ditunjuk oleh jarum pada skala explosimeter merupakan", o: ["Angka langsung jumlah gas mudah terbakar yang ada di udara","Presentase gas mudah terbakar didalam flammable range","Angka langsung jumlah gas mudah terbakar didalam flammable range","Presentase dari LEL suatu gas disuatu tempat yang di tes"], a: 3, e: "Layar Explosimeter modern umumnya menampilkan skala persentase: 0 hingga 100% dari LEL (Lower Explosive Limit) gas yang dideteksi." },
  { q: "44. Sisterm kerja aman (Safety Permit) diperlukan untuk : * Setiap pekerjaan yang ada di perusahaan yang beresiko", o: ["Setiap pekerjaan yang menimbulkan api","Setiap pekerjaan yang membahayakan","Setiap pekerjaan yang sifatnya non rutine yang beresiko menimbulkan","kecelakaan"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "45. Yang berpredikat OSC ( on scene commander) adalah", o: ["General manager","Fire officer","General maintenance","Section head"], a: 3, e: "OSC bertugas langsung memimpin di garis depan saat darurat. Biasanya diemban oleh kepala regu (Section Head / Koordinator Area) di lokasi terdampak." },
  { q: "46. Flammable range adalah", o: ["Batas dimana zat dapat terlarut","Batas konsentrasi tertinggi zat dalam udara yang dapat terbakar","Batas konsentrasi terendah zat dalam udara yang dapat terbakar","Batas dimana zat dalam konsentrasi tertentu dapat terbakar"], a: 3, e: "Jarak cakupan (Range) di antara LEL dan UEL. Jika campuran gas + udara berada di dalam Range ini, itu menjadi zona kritis mematikan bila ada api." },
  { q: "47. Kondisi dimana nyala api berpindah atau menyebarang ke daerah yang mengandung gas-gas yang belum terbakar selama kebakaran terjadi disebut", o: ["Flame over","Flash over","Slop over","Back draft"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "48. sound level meter untuk area kebisingan terputus putus, tombol apa* yang harus ditekan", o: ["fast","slow","maxholt","range"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "49. Pada daerah bisa terbakar pada range dari O2 adalah", o: ["1% s/d 10%","50% s/d 100%","21% s/d 50%","16% s/d 21%"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "50. Yang berpredikat ERC ( emergency response commander)", o: ["Fire officer","Section head","General manager","General maintenance"], a: 2, e: "ERC adalah komando tertinggi untuk skala krisis plant. Posisi ini umumnya wajib diambil alih oleh Manajer Tertinggi (General Manager/Plant Manager)." },
  { q: "51. Suhu terendah dimana suatu zat dapat terbakar dengan sendirinya tanpa dinyalakan", o: ["Fire point ( titik api)","Auto ignition temperature","Flash point ( titik nyala)","Boiling point"], a: 1, e: "Auto-Ignition (Suhu Penyalaan Sendiri) tidak membutuhkan pemicu korek/busur. Hanya suhu udara dan material yang cukup panas membuatnya bereaksi terbakar mendadak." },
  { q: "52. sound level meter untuk area kebisingan continue, tombol apa yang harus ditekan", o: ["fast","slow","maxholt","range"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "53. Bagaimana cara agar kebijakan penggunaan APD (Alat Pelindung* Diri) dapat terlaksana dengan baik?", o: ["Memberikan sanksi tanpa arahan","B. Membebaskan pekerja memilih menggunakan APD atau tidak","C. Sosialisasi, komunikasi, dan penerapan kebijakan secara konsisten","Menyediakan APD tanpa pengawasan"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "54. Gas tester adalah", o: ["Pekerja yang telah mempunyai sertifikat gas test dan terdaftar dalam otorisasi","Petugas laboratorium yang diminta oleh ahli teknik (pelaksana pekerjaan) untuk melakukan gas test pada suatu lokasi kerja","Petugas yang ditunjuk oleh atasannya, untuk berjaga-jaga pada suatu lokasi kerja dan melaksanakan gas test","Pekerja yang ditunjuk oleh atasannya, untuk berjaga-jaga pada suatu lokasi kerja dan melaksanakan gas test"], a: 0, e: "Pengujian gas beracun/explosive (Gas Testing) wajib dilakukan secara legal oleh orang kompeten (Authorised Gas Tester) bersertifikat BNSP, bukan sembarang pekerja." },
  { q: "55. Upper flammable limit adalah", o: ["Batas dimana zat dapat terlarut","Batas konsentrasi tertinggi zat dalam udara yang dapat terbakar","Batas konsentrasi terendah zat dalam udara yang dapat terbakar","Batas dimana zat dalam konsentrasi tertentu dapat terbakar"], a: 1, e: "UFL / UEL membatasi proporsi campuran uap tertinggi di udara. Jika melampauinya, maka campuran uap hidrokarbon mendominasi dan kekurangan O2." },
  { q: "56. Fungsi explosimeter adalah untuk Mengukur tekanan gas hydrocarbon yang mudah meledak di daerah kerja Mengukur konsentrasi gas hydrocarbon didalam udara dibawah lower explosimeter", o: ["limit (LEL)","Mengukur konsentrasi gas beracun di lingkungan kerja","Mengukur konsentrasi gas beraun didalam udara dibawah lower explosimeter limit","(LEL)"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "57. Suhu terendah dimana suatu zat cair mempunyai uap dalam jumlah yang cukup pada pemukaannya untuk menyala terus menerus apabila dikenakan sumber api", o: ["Flash point ( titik nyala)","Fire point (titik api)","Boiling point (titik didih)","Ignition point (titik bakar)"], a: 1, e: "Zona 0 adalah daerah di mana atmosfer gas mudah terbakar ada secara terus-menerus atau dalam waktu lama." },
  { q: "58. Yang diukur oleh petugas gas test adalah", o: ["Daerah jenuh uap bahan bakar","Daerah kurus atau miskin uap bahan bakar","Daerah bisa terbakar","Daerah kaya uap bahan bakar"], a: 1, e: "Tujuan pengujian adalah memastikan apakah kondisi udara sedang steril, atau berisiko masuk dalam persentase ambang 'daerah Flammable Range' (bisa terbakar)." },
  { q: "59. Jika terjadi suatu keadaan emergency, seluruh pekerja menuju ke tempat yang ditentukan, kecuali", o: ["Area berkumpul dengan aman","Area parkir kendaraaan","Area tempat evakuasi","Area assemble point"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "60. alat untuk mengukur kadar oksigen di udara adalah", o: ["flammable gas detector","Combustible Gas Detector","Oxygen Analizer","Tube Gas Detector"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." }
];

const dbSoalY = [
  { q: "61. Usaha/upaya untuk menghidupkan kembali fungsi jantung dan paru yang gagal melakukan fungsinya akibat henti nafas/henti jantung disebut :", o: ["Rehabilitas Jantung Paru","Resusitasi Jantung Paru","Jawaban a,b, dan c semua benar","Reproduksi Jantung Paru"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "62. Berikut ini merupakan cara mengetahui respon korban kecelakaan, kecuali", o: ["Tepuk bahu","Cubit lengan/badan","Dengarkan suara/nafas dari mulut atau hidung","Beri nafas buatan"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "63. Melakukan kompresi jantung dengan kedua pangkal telpak tangan disatukan lalu tekan tulang dada korban ± 2 jari diatas tulang dada sedalam 5 cm kearah tulang belakang dengan kecepatan ± 100 kali/menit dilakukan untuk", o: ["Korban bayi","Korban dewasa","Korban anak-anak","Korban dengan tubuh gemuk"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "64. Menurut AHA 2015 kompresi jantung korban dilakukan", o: ["Setiap 30 kali kompresi jantung luar diikuti 2 kali nafas buatan","Setiap 15 kali kompresi jantung luar diikuti 4 kali nafas buatan","Setiap 5 kali kompresi jantung luar diikuti 1 kali nafas buatan, disini kompresi jantung luar tidak terputus","Setiap 5 kali kompresi jantung luar diikuti 2 kali nafas buatan, disini kompresi jantung luar tidak terputus"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "65. Berikut ini yang merupakan salah satu cara memberi bantuan hidup dasar “ Buka batas nafas (Air Way)”", o: ["Tengadahkan kepala angkat dagu tekan dahi","Melakukan pijat jantung luar","Memasang penyangga leher","Memberi nafas buatan"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "66. Bagaimana tanda-tanda korban henti nafas Korban tidak sadar, gerakan dada tidak telihat, suara keluar masuk udara paru-paru korban terdengar atau terasa Korban tidak sadar, suara keluar masuk udara paru-paru korban tidak terdengar", o: ["atau terasa","Korban tidak sadar, gerakan dada terlihat, suara keluar masuk udara paru-paru","Korban tidak sadar, gerakan dada tidak terlihat, suara keluar masuk udara paru-","paru"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "67. Nafas buatan mouth to mouth yaitu dengan melakukan", o: ["Bantu pernafasan dari mulut ke mulut korban","Bantu pernafasan dengan melipatkan tangan korban di wajah korban dengan memalingkan wajah korbanke kanan","Bantu pernafasan dengan mengangkat kaki korban","Bantu pernafasan dengan mengangkat pundak korban"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "68. Prinsip dalam pemberian nafas buatan adalah", o: ["Jawaban a,b dan c semua benar","Kecepatan peniupan tak ada batasan tergantung kemampuan penolong","Kecepatan peniupan secepat mungkin apabila korban cukup parah","Kecepatan peniupan disesuaikan dengan kecepatan nafas normal"], a: 3, e: "Pemberian nafas buatan tidak boleh ditiup sembarangan terlalu cepat/keras. Volume dan ritmenya disimulasikan seperti irama nafas orang sehat (sekitar 1 detik tiap nafas)." },
  { q: "69. Pemijatan jantung dilakukan dengan", o: ["Kecepatan 80-100 x kali permenit","Posisi siku dibengkokkan untukmenambah beban tubuh","Ditempat yang lurus dan alas yang lunak","Kedua tangan saling terpisah"], a: 0, e: "Ritme pacu jantung (kompresi) harus konsisten, sekitar 100-120 kali per menit, dan lengan diposisikan lurus, tidak ditekuk." },
  { q: "70. Yang perlu diperhatikan pada saat memberikan pertolongan pada korban, dengan melakukan pijat jantung adalah Jawaban semua benar", o: ["Baringkan diatas kasur atau tempat yang lunak sehingga korban tidak sakit saat","dipijat","Korban dalam posisi duduk diperbolehkan asal penolong mampu melakukannya","Baringkan korban pada tempat yang keras dan datar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "71. Yang dimaksud Airway, pada tahapan Bantuan Hidup Dasar adalah", o: ["Pemberian nafas buatan","Kuasai posisi jalan nafas","Pemberian obat","Sirkulasi"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "72. Bantuan Hidup Dasar (BHD) harus segera dihentikan apabila", o: ["Jawaban semua benar","Penolong kepayahan","Tidak ada tanda-tanda diselamatkan, setelah 1( satu) jam","Alirah darah dan pernafasan telah pulih kembali"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "73. UU No.1 tahun 1970, sebagai pengganti dari :", o: ["MPR tahun 1930","UU. Uap tahun 1930","UU. No 11 tahun 1930","Veiligheidreglement tahun1910"], a: 3, e: "Peraturan perlindungan pekerja di Hindia Belanda (VR 1910) sudah usang dan diganti payung hukum resmi K3 Nasional melalui Undang-Undang No. 1 Tahun 1970." },
  { q: "74. Tata usaha dan pengawasan keselamatan kerja atas pekerjaan- pekerjaan serta pelaksanaan pemurnian dan pengolahan minyak dan gas bumi, wewenang berada ditangan :", o: ["Kepala Inspeksi Tambang Minyak dan Gas Bumi","Menteri Energi dan Sumber Daya Mineral","Inspektur Tambang minyak dan Gas Bumi","Direktur Jenderal Minyak dan Gas Bumi"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "75. Safety helmet yang sudah retak sebaiknya :", o: ["Bergantian pinjam teman","Digunakan sementara sambil menunggu yang baru","Sementara direkatkan dengan lem yang kuat","Segera minta ganti ke bagian K3"], a: 3, e: "Cangkang helem (shell) yang mengalami crack/retak sudah kehilangan integritas mekanis (daya redam impact). Jangan dilem atau diperbaiki, wajib ditukar baru." },
  { q: "76. Alat untuk mengukur dan memonitor ada tidaknya gas beracun adalah", o: ["Oxygen analyser","Toxic gas detector","Explosimeter","Tachometer"], a: 1, e: "Toxic Detector Sensor didesain sensitif khusus untuk paparan Parts Per Million (PPM) dari gas racun (seperti H2S dan CO)." },
  { q: "77. Yang bertanggung jawaab mengenai pengawasan ditaaatinya ketentuan-ketentuan dalam PP 11 tahun 1979 adalah", o: ["Direktur jenderal Minyak dan Gas Bumi","Inspektur Tambang Minyak dan Gas Bumi","Kepala Inspeksi Tambang Minyak dan Gas Bumi","Inspektur Minyak dan Gas Bumi"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "78. Tujuan identifikasi bahaya pada saat akan bekerja adalah Untuk mengenali potensi bahaya dan akibat serta tahu cara pengendalian", o: ["bahaya dan penanggulangannya","Agar pekerja selalu tenang dalam bekerja","Agar pekerja selalu terbebas dari bahaya selama bekerja","Agar bahaya dapat dihilangkan di tempat kerja"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "79. Yang dimaksud dengan open circuit adalah Mengguanakan udara dari udara bebas, udara yang dihembuskan dilepas keluar sistem Mengguanakan udara dari tabung, udara yang dihembuskan dilepas kembali lagi ke", o: ["sistem","Mengguanakan udara dari tabung, udara yang dihembuskan dilepas kedalam","sistem","Mengguanakan udara dari tabung, udara yang dihembuskan dilepas keluar sistem."], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "80. Sound Level meter adalah", o: ["Alat bantu pengukur temperature","Alat bantu pengukur radiasi","Alat bantu pengukur kebisingan","Alat bantu pengukur cahaya"], a: 2, e: "SLM (Sound Level Meter) mengukur kekuatan akustik (intensitas paparan bunyi/kebisingan suara turbin mekanis alat berat) dengan satuan Desibel (dB)." },
  { q: "81. Ruang lingkup bagi berlakunya UU No 1 tahu 1970 ditentukan oleh", o: ["Tempat dimana dilakukan pekerjaan bagi suatu usaha","Adanya tenaga kerja yang bekerja","Adanya bahaya kerja ditempat kerja","Jawaban a, b dan c benar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "82. Yang tidak termasuk dalam kategori PPE/Alat pelindung diri :", o: ["Safety helmet","Fire detector","Breathing apparatus","Gloves"], a: 1, e: "Fire Detector (Detektor Kebakaran) masuk dalam mitigasi pencegahan engineering system pasif ruang gedung, bukan peralatan fisik yang melekat dan dipakai di tubuh (PPE)." },
  { q: "83. Syarat mental pengguna SCBA sebaiknya harus", o: ["Tidak fobia kegelapan","Tidak paranoid","Disiplin dan berpengetahuan","Tidak fobia terbang"], a: 2, e: "Memakai SCBA harus penuh ketenangan mengontrol irama ritme pernapasan tabung udara, memiliki disiplin tinggi membaca durasi waktu tekanan dan sadar akan potensi racun." },
  { q: "84. Yang dimaksud “Pengusaha” pada Undang-undang No 1 tahun 1970 Orang atau badan hukum yang menjalankan suatu usaha bukan miliknya dan untuk itu mempergunakan tempat kerja Orang atau badan hukum yang menjalankan sesuatu usaha milik sendiri dan untuk", o: ["itu mempergunakan tempat kerja","Orang atau badan hukum yang di Indonesia mewakili orang atau badan hukum","termasuk pada (a) dan (b), jikalau yang diwakili berkedudukan di luar Indonesia","Jawaban a, b dan c benar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "85. Apabila terpapar bahan kimia dalam jumlah dan kondisi tertentu yang mungkin dapat mengakibatkan kelainan kesehatan manusia disebut", o: ["Local effect","Hazard","Toksisitas","First aid"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "86. Kemampuan bahan kimia untuk menimbulkan dampak yang tidak dikehendaki ketika bahan tersebut mencapai konsentrasi yang cukup pada bagian tubuh manusia disebut", o: ["First aid","Hazard","Local effect","Toksisitas"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "87. Alat bantu pernafasan dengan prinsip pemurnian udara dari luar yang terkontaminasi zat-zat beracun tertentu disebut", o: ["Air demand respirator","Air supplying respirator","Air purifying respirator","Air respirator"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "88. Pada kegiatan pembersihan tangki bahaya yang dapat menyebabkan gangguan bagi pernafasan adalah", o: ["Kelembaban","Suhu tinggi","Gas beracun","Kebisingan"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "89. Yang dimaksud dengan izin kerja panas adalah Suatu izin kerja yang digunakan jika pekerjaan tersebut menimbulkan api dan", o: ["dipastikan tidak ada gas pada area kerja tersebut","Pekerjaan panas yang berlangsung pada daerah panas","Pekerjaan yang tidak boleh ada api","Pekerjaan yang boleh dilakukan oleh pihak kontraktor"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "90. Yang dimaksud “Pengurus” dalam Undang-undang No 1 tahun 1970 ialah Orang yang ditunjuk oleh direksi / ketua yayasan untuk memimpin dalam suatu unit kerja", o: ["Orang yang mempunyai tugas memimpin langsung sesuatu tempat kerja atau","bagiannya yang berdiri sendiri","Orang yang memiliki asset perusahaan","Orang yang ditunjuk oleh Menteri Tenaga Kerja dan Transmigrasi"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "91. Konsentrasi kandungan zat atau materi diudara dimana apabila karyawan terekspose/terpapar terus menerus tidak menimbulkan efek yang membahayakan disebut", o: ["TLV : Threshold Limit Value","TLV : Thershold Limit Value","TLV : Thereshol Limit Value","TLV : Tresholde Limit Value"], a: 0, e: "Zona 0 adalah daerah di mana atmosfer gas mudah terbakar ada secara terus-menerus atau dalam waktu lama." },
  { q: "92. Sebelum menggunakan SCBA yang pertama diperhatikan adalah", o: ["Kondisi fisik tabung","Isi/ tekanan tabung","Berat tabung","Kebersihan tabung"], a: 1, e: "Cek tekanan bar/PSI pada instrumen Manometer silinder (Full Cylinder Check). Alat akan fatal tak berguna bila tabung dipakai ternyata sudah bocor/kosong isinya." },
  { q: "93. Yang bertanggung jawab penuh atas ditaatinya ketentuan-ketentuan dalam PP 11 tahun 1979 dan kebiasaan yang baik dalam tempat pemurnian dan pengolahan minyak dan gas bumi :", o: ["Kepala teknik pemurnian dan pengolahan","Pengusaha","Kepala inspeksi tambang minyak dan gas bumi","Pelaksana inspeksi tambang minyak dan gas bumi"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "94. Untuk bahan cylinder dari bahan campuran (composite ) harus di tes hydrostatic setiap :", o: ["4 tahun","2 tahun","3 tahun","5 tahun"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "95. Pada saat pengisian tabung SCBA dengan kompresor yang harus diperhatikan adalah :", o: ["Working pressure tabung","Safety margin pressure","Working duration","Full duration"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "96. Di dalam upaya pembinaan, pengurus diwajibkan menjelaskan kepada setiap tenaga kerja baru tentang:", o: ["Upah dan kesejahteraan yang menjadi haknya","Hak dan kewajiban serta peraturan yang berlaku","Cuti yang menjadi haknya","Kondisi-kondisi dan bahaya-bahaya yang dapat timbul dalan tempat kerja"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "97. Dalam UU. No.1 tahun 1970 dikatakan bahwa setiap kecelakaan yang terjadi dalam tempat kerja wajib dilaporkan kepada pejabat yang ditunjuk oleh Menteri Tenaga Kerja. Yang dimaksud diwajibkan melaporkan kejadian kecelakaan tersebut adalah :", o: ["Anggota P2K3","Pengurus","Ahli K3","Pengusaha"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "98. Dokumen tertulis untuk mengendalikan masuk kedalam ruang terbatas yang berisi informasi-informasi yang terkait dengan perlindungan keselamatan bagi para pekerja adalah :", o: ["Lag Out Tag Out","Surat Ijin Kerja Panas ( IKP )","Surat Ijin Kerja Dingin (IKD)","Entry Permit"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "99. Konsentarasi kandungan zat atau materi di udara dimana apabila bekerja 8 jam/hari dan 40 jam/minggu secara terus menerus serta berulang-ulang pekerja tidak mengalami efek yang tidak baik disebut:", o: ["TLV-STEL (Threshold Limit Value - Short Term Exsposure Limit)","TLV (Threshold Limit Value - Cenzing)","TLV-TWA (Threshold Limit Value - Time Weight Average)","TLV-C (Threshold Limit Value - Celling)"], a: 2, e: "Zona 0 adalah daerah di mana atmosfer gas mudah terbakar ada secara terus-menerus atau dalam waktu lama." },
  { q: "100. Yang dimaksud dengan close circuit adalah: Menggunakan udara dari udara bebas, udara yang dihembuskan dilepas keluar system Menggunakan oksigen dari tabung, udara yang dihembuskan diikat CO2 nya,", o: ["oksigen sisa kembali masuk kedalam system","Menggunakan oksigen dari tabung, udara yang dihembuskan dilepas kembali lagi","ke system","Menggunakan udara dari tabung, udara yang dihembuskan dilepas keluar system"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "101. Suatu udara atsmosfir yang dapat memapar pada pekerja yang dapat beresiko kematian, melemahnya/hilangnya kemampuan untuk menyelamatkan diri, cedera, atau penyakit akut disebabkan oleh beberapa sebab, kecuali: Konsentrasi atsmosfir dari bahan-bahan lainnya yang melampui batas dosis atau", o: ["NAB nya","Konsentrasi oksigen kurang dari 19,5%","Suhu Radiasi panas di dalam compartement 50 ?C","Gas, uap 5 % LEL"], a: 3, e: "Fatality adalah klasifikasi kecelakaan kerja yang mengakibatkan hilangnya nyawa pekerja (kematian)." },
  { q: "102. Alat pelindung pernafasan dari cylinder atau udara bersih dari compressor disebut:", o: ["Air Demand Respirator","Air Purifying Respirator","Air Respirator","Air supliying Respirator"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "103. Dalam keadaan normal oksigen yang terkandung di udara adalah:", o: ["79%","100 %","10%","21 %"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "104. Zat-zat yang mengganggu gas test kecuali:", o: ["Oksigen","Zat yang mengandung silicon","Debu organic/serbuk karbon","Sodium, Protasium, Halogeneted, hydrocarbon"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "105. Berikut ini yang tidak termasuk langkah pemeriksaan tekanan tinggi SCBA adalah: Perhatikan manometer,bila tekanan turun 12 atm permenit, berarti ada kebocoran pada system saluran, perlu di periksa kembal Buka valve utama, periksa manometer (tekanan &gt; 5/6 dari tekanan kerja tidak boleh digunakan) Buka bypass pelan-pelan pada deman regurator dan perhatikan suling (warning", o: ["wishtle) akan berbunyi pada tekanan antara 40-50 atm.","buka valve utama, cek manometer (Tekanan &lt; 5/6 dari tekanan kerja, SCBA tidak","boleh digunakan) Periksa jarum manometer, jika sudah menunjukan angka","maksimum tutup kembali valve utama."], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "106. Metode penggunaan SCBA yaitu;", o: ["Over-the-head-method","Over-the-head-method dan crossed-arms coat method","Crossed-arms coat method","Over-the-arm-method dan crossed-the-head method"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "107. APD untuk penanggulangan kebakaran salah satunya adalah SCBA singkatan dari:", o: ["Squence Contained breathing apparatu","Self contained breathimh apparatus.","self contained breathing apparatus.","self contain breathing apparatus."], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "108. Yang melakukan pengawasan pelaksanaan umum terhadap undang- udang No 1 tahun 1970:", o: ["Pengusaha","Direktur","Pengurus","Direktur,Pengusaha dan Pengurus"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "109. Menghitung lama habis botol (full duration) SCBA adalah :", o: ["Lama habis botol = Kapasitas botol x Konsumsi udara","Lama habis botol = Kapasitas botol + Konsumsi udara","Lama habis botol = Kapasitas botol – Konsumsi udara","Lama habis botol = Kapasitas botol : Konsumsi udara"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "110. Yang di maksud “Ahli Keselamatan Kerja” pada Undang-undang No 1 tahun 1970 adalah : Ahli teknis yang memiliki kompetensi kerja keselamatan dan kesehatan yang bertugas untuk mengawasi undang-undang ini Ahli teknis yang berkeahlian khusus dilingkungan departemen tenaga kerja yang di", o: ["tunjukan oleh menteri tenaga kerja untuk mengawasi undang-undang in","Ahli teknis yang berkeahlian khusus dari luar departemen tenaga kerja yang di","tunjuk oleh menteri tenaga kerja untuk mengawasi undang-undang ini.","Ahli teknis dari departemen tenaga kerja."], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "111. Fungsi dari Panitia Pembina Keselamatan dan Kesehatan Kerja menurut undang-undang No.1 tahun 1970, adalah: Mengembangkan kerja sama, saling pengertian dan partisipasi efektif dari pengurus dan tenaga kerja dalam tempat-tempat kerja untuk melaksanakan tugas kewajiban bersama di bidang keselamatan dan kesehatan kerja, dalam rangka meningkatkan produksi Mengembangkan kerja sama, saling pengertian dan partisipasi efektif dari pengusaha atau pengurus dan tenaga kerja dalam tempat-tempat kerja untuk melaksanakan tugas kewajiban bersama di bidang keselamatan dan kesehatan kerja, dalam rangka meningkatkan produksi Mengembangkan kerja sama, saling pengertian dan partisipasi efektif dari pengusaha, pengurus dan tenaga kerja dalam tempat-tempat kerja untuk melaksanakan tugas", o: ["Mengembangkan kerja sama, saling pengertian dan partisipasi efektif dari","pengusaha dan pengurus dan tenaga kerja dalam tempat-tempat kerja untuk","melaksanakan tugas kewajiban bersama di bidang keselamatan dan kesehatan","kerja, dalam rangka meningkatkan produksi"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "112. Prosedur yang perlu diperhatikan saat pengukuran gas dengan exsplosimeter seperti dibawah kecuali: Alat tidak akan berfungsi dengan baik apabila digunakan dilokasi yang ada", o: ["oksigennya","Steam dapat mengaburkan hasil pemeriksaan","Filament detector akan putus/error jika mengisap gas 100% atau uap air","Jangan lakukan gas test diatas angin"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "113. Yang dimaksud Breath, pada tahapan Bantuan Hidup Dasar adalah", o: ["Kuasai posisi jalan nafas","Pemberian obat","Sirkulasi","Pemberian nafas buatan"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "114. Pada saat kita menggunakan SCBA dalam menghadapi bocoran gas H2S maka Demand Regulator kita atur pada", o: ["Tekanan positif","Tekanan negative","Jawaban semua benar","Tekanan normal"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "115. Pada kejadian kebocoran gas cenderung terjadi akumulasi di tempat tempat yang lebih rendah, hal tersebut disebabkan oleh :", o: ["Terjadi reaksi kimia dengan udara","Berat jenis gas lebih berat dibanding udara","Pengenceran oleh angin","Jawaban semua benar"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "116. Yang paling tepat untuk mengatasi keadaan shock adalah dengan :", o: ["Baringan tubuh korban dengan kedua lututnya lebih tinggi","Berikan minum air hangat perlahanlahan","Selimuti tubuhnya dengan selimut hangat","Semua cara diatas dapat dilakukan"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "117. setelah dievakuasi Bagaimana pertolongan pertama pada korban pingsan", o: ["Oleskan minyak kayu putih seluruh tubuh","Memberikan minum teh manis perlahan","Resusitasi Jantung paru","Letakkan korban dengan posisi kepala lebih rendah"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "118. Apa yang harus dilakukan apabila ada korban luka gores dan pendarahan ditangan", o: ["luka ditekan dengan kain dan Posisi tangan diatas jantung","Diberi alcohol kemudian diikat","Diikat agar darah tidak mengalir","Diberi alcohol"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "119. Alat ukur gas beracun yang system kerjanya berubah warna", o: ["Tube detector","Multi gas detector","Explosivemeter","Oksigen analyizer"], a: 0, e: "Colorimetric Gas Detector (Tabung Detektor Kimia Dräger/Gastec) adalah detektor gas unik kaca bening kuno yang menampung bahan reaktan. Bahan tersebut akan mengganti warnanya bila menghisap gas spesifik." },
  { q: "120. Di bawah ini adalah mempengaruhi reaksi racun masuk ke dalam* tubuh, kecuali", o: ["Konsentrasi bahan kimia","Intensitas paparan bahan kimia","Cara masuk paparan","Durasi paparan bahan kimia"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." }
];

const dbSoalZ = [
  { q: "121. Bekerja di ketinggian lebih dari 1.8 meter maka APD yang wajib* digunakan adalah.", o: ["Life jacket","Full Body Harness","Full arestor","Thickness Body harness"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "122. Konsentarasi kandungan zat atau materi di udara dimana apabila hanya boleh bekerja bekerja 15 menit istirahat 1 jam disebut", o: ["TLV - STEL (Threshold Limit Value - Short Term Exsposure Limit)","TLV (Threshold Limit Value - Cenzing)","TLV - TWA (Thresh old Limit Value - Time Weight Average)","TLV - C (Threshold Limit Value - Celling)"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "123. Batas konsentrasi mudah terbakar dari H2S adalah", o: ["2,6% dan 12,8%","1,4% dan 7,6%","1% dan 10%","4.3% dan 44%"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "124. Bila diketahui tekanan cylinder SCBA = 300 Bar maka tekanan* minimal yang boleh untuk disiagakan adalah", o: ["200 Bar","150 Bar","175 Bar","250 Bar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "125. SCBA jenis Open Circuit Berisi", o: ["Carbon Aktif","oksigen Murni","Jawaban Semua Benar","Udara segar / Fresh air"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "126. Ditinjau dari prinsip kerjanya Toxic Gas Detector dibagi* menjadi", o: ["Plate Sensor dan Chemical Sensor","Jawaban semua salah","Electrochemical Sensor dan Chemical Sensor","Electrical Sensor dan Chemical Sensor"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "127. Pemberian pertolongan pada korban keracunan gas seharusnya :", o: ["Dilakukan pada tempat udara segar","Jawaban semua benar","Dilakukan sesegera mungkin ditempat kejadian","Boleh dilakukan siapa saja meskipun tidak tahu cara mengingat kondisi korban yang parah"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "128. Berapa kedalaman saat melakukan pijat jantung", o: ["3 cm - 5 cm","3,8 cm - 5 cm","3,6 cm - 4.5 cm","4.8 cm - 5 cm"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "129. Bahan kimia dapat masuk tubuh kita melalui :", o: ["Pencernaan","Pernafasan","Kulit","Jawaban semua benar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "130. Gas detector yang digunakan untuk mendeteksi gas H2S* termasuk jenis :", o: ["Jawaban semua benar","Toxic Gas Detector","Combustible Gas Detector","Explosive Gas Detector"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "131. Apabila anda melakukan pekerjaan dalam area yang mengandung* paparan gas H2S dimana konsentrasi oksigen di lokasi tersebut <19.5% maka alat pelindung pernafasan yang anda perlukan adalah :", o: ["Respirator dengan filter carbon aktif","Dust Masker","Gas Masker","SCBA (Self Contained breathing apparatus)"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "132. Low alarm multi gas detector pada oksigen adalah", o: ["23.5%","19.5%","19.5 ppm","23.5 ppm"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "133. Apa yang anda lakukan apabila menemukan ada korban yang* mengalami pendarahan di tangan", o: ["segera meminta bantuan ke team medis","Segera memindahkan korban","mengikat tangan korban agar darah tidak mengalir","menekan luka korban dan memposisikan lebih tinggi dari jantung"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "134. Dampak dari bahaya kebisingan, kecuali:", o: ["Gangguan penglihatan","B. Gangguan pendengaran","C. Stres dan kelelahan","Gangguan komunikasi"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "135. Sebutkan urutan dalam pemberian pertolongan RJP", o: ["Danger -Respon -Airways- Breathing -Circulation","Danger -Respon - Circulation Airways- Breathing","Danger -Respon - Breathing Airways- Circulation","Danger -Respon - Circulation - Breathing - Airways"], a: 1, e: "Golden time untuk RJP/CPR adalah 5 menit pertama untuk mencegah kerusakan otak permanen akibat henti napas/henti jantung." },
  { q: "136. bagaimana cara menghitung kapasitas tabung SCBA", o: ["Kapasitas : Tekanan penuh tabung x Volume","Kapasitas : Tekanan penuh tabung : Volume","Kapasitas : Tekanan penuh tabung + Volume","Kapasitas : Tekanan penuh tabung - Volume"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "137. APD apakah yang digunakan untuk melakukan pekerjaan yang* berhubungan dengan bahan kimia", o: ["Sarung tangan kain","Sarung tangan asbes","Sarung tangan pvc","Sarung tangan karet"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "138. Pada saat melakukan pekerjaan pengelasan di dalam vessel, ijin* kerja yang digunakan adalah. . .", o: ["Hot work permit dan entry permit","Cold work permit dan entry permit","Entry permit dan digging permit","Digging permit dan cold work permit"], a: 0, e: "Pekerjaan masuk ruang terbatas (Cleaning Tank/Vessel) memerlukan SIKA khusus yaitu Confined Space Entry Permit (Izin Masuk Ruang Terbatas)." },
  { q: "139. Pada klasifikasi kebakaran, APAR jenis chemical foam dapat* memadamkan kebakaran kelas…", o: ["A dan B","B dan C","C dan D","A dan D"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "140. Bahaya-bahaya yang dapat menyebabkan gangguan terhadap* saluran pernafasan adalah", o: ["Asap","Gas beracun","Suhu tinggi","a dan b benar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "141. Di dalam upaya pembianaan pengurus diwajibkan menjelaskan* kepada setiap tenaga kerja baru tentang.", o: ["Upah dan kesejahteraan yang menjadi haknya","Cuti yang menjadi haknya","Kondisi-kondisi dan bahaya-bahaya yang dapat timbul dalam tempat kerja","Jawaban a,b,c benar"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "142. Yang dimaksud dengan Pemurnian dalam PP. 11 tahun 1979, adalah :", o: ["Perusahaan yang melakukan usaha pengolahan minyak dan gas bumi","Tempat penyelenggaraan pengolahan minyak dan gas bumi","Usaha memproses minyak dan gas bumi didaratan atau dilepas pantai secara proses fisika dan kimia guna memperoleh dan mempertinggi mutu hasil-hasil minyak dan gas bumi yang didapat","Usaha memproses minyak dan gas bumi didaratan atau dilepas pantai dengan mempergunakan proses fisika dan kimia guna memperoleh produk-produk baru seperti premium, solar, kerosin dan produk lain yang bermafaat."], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "143. Yang dimaksud dengan Tempat Pemurnian dan Pengolahan dalam* PP. 11 tahun 1979, adalah : a. Perusahaan yang melakukan usaha pemurnian dan pengolahan minyak dan gas bumi b. Bangunan yang digunakan untuk usaha pemurnian dan pengolahan minyak dan gas bumi c. Tempat penyelenggaraan pemurnian dan pengolahan minyak dan gas bumi", o: ["termasuk didalamnya peralatan, bangunan dan instalasi yang secara langsung","dan tidak langsung berhubungan dengan proses pemerunian dan pengolahan.","Perusahaan, bangunan, peralatan dan instalasi yang secara langsung dan tidak","langsung berhubungan dengan tempat proses pemurnian dan pengolahan"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "144. Yang dimaksud “Pegawai Pengawas” pada Undang - undang* No. 1 tahun 1970 a. Pegawai teknis berkeahlian khusus dari luar Departemen Tenaga kerja yang ditunjuk oleh Menteri Tenaga Kerja b. Pegawai teknis berkeahlian khusus dari Departemen Tenaga Kerja yang", o: ["ditunjuk oleh Menteri Tenaga Kerja","Pegawai teknis yang berkeahlian khusus untuk mengawasi ketentuan - ketentuan","pada Undang - undang ini","Pegawai yang memiliki kompetensi kerja Keselamatan dan Kesehatan kerja"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "145. Sesuai ketentuan yang masih berlaku, laporan terjadinya tumpahan minyak yang harus segera dilaporkan oleh Kepala Teknik kepada Kepala Inspeksi apabila volumenya?", o: ["> 10 barrel","> 20 barrel","> 5 barrel","> 15 barrel"], a: 3, e: "Ketentuan keselamatan migas mewajibkan tumpahan minyak di atas 15 barrel untuk segera dilaporkan oleh Kepala Teknik kepada Kepala Inspeksi." },
  { q: "146. Jenis kecelakaan kerja yang mengakibatkan kematian pada pekerja disebut", o: ["First Aids","Medical Treatment Case","Nearmiss","Fatality"], a: 3, e: "Fatality adalah klasifikasi kecelakaan kerja yang mengakibatkan hilangnya nyawa pekerja (kematian)." },
  { q: "147. Suatu daerah yang dalam kondisi operasi normal terdapat udara* berbahaya yang muncul terus menerus adalah", o: ["Zona 0","Zona 1","Zona 2","Zona 3"], a: 0, e: "Zona 0 adalah daerah di mana atmosfer gas mudah terbakar ada secara terus-menerus atau dalam waktu lama." },
  { q: "148. Suatu Daerah dimana atmosfer mudah terbakar dapat terjadi* sesekali dalam kondisi normal disebut", o: ["Zona 0","Zona 1","Zona 2","Zona 3"], a: 1, e: "Zona 1 adalah daerah di mana atmosfer gas mudah terbakar cenderung terjadi sesekali dalam operasi normal." },
  { q: "149. suatu daerah dimana atmosfer mudah terbakar hanya akan muncul* dalam kondisi abnormal adalah", o: ["Zona 0","Zona 1","Zona 2","Zona 3"], a: 2, e: "Zona 2 adalah daerah di mana atmosfer gas mudah terbakar hanya muncul dalam kondisi abnormal dan berlangsung singkat." },
  { q: "150. Berikut ini yang merupakan salah satu cara memberi bantuan hidup* dasar (Air Way)”", o: ["Tengadahkan kepala angkat dagu tekan dahi","Melakukan pijat jantung luar","Memasang penyangga leher","Memberi nafas buatan"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "151. di bawah ini yang mempengaruhi Severity Rate, Kecuali", o: ["Pengkali satu juta","Jumlah jam saat itu","Jumlah jam kerja hilang","Jumlah kecelakaan yang mengakibatkan luka"], a: 3, e: "Severity Rate mengukur tingkat keparahan kecelakaan kerja berdasarkan jumlah hari kerja yang hilang per satu juta jam kerja orang." },
  { q: "152. manakah yang tidak termasuk dalam komponen hardness SCBA", o: ["Tali pengunci","Tali pinggang","Backplate","Face Mask"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "153. ilustrasi gambar di bawah ini menggambarkan apa", o: ["harap berhati - hati daerah sekitar licin","harap berhati - hati bekerja di ketinggian","harap berhati - hati kawasan berbahaya","harap berhati - hati wajib mengenakan sepatu di daerah banyak paku terbuka"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "154. Siapa yang bertanggung jawab membuat JSA", o: ["HSE","Pengawass pekerjaan","Pelaksana Pekerjaan","Pemberi ijin"], a: 2, e: "Pelaksana Pekerjaan (Supervisor/Foreman yang memimpin tugas) bertanggung jawab membuat JSA bersama dengan anggota regu kerjanya." },
  { q: "155. Berapa lama golden times untuk pemberian pertolongan RJP* (Resusitasi jantung paru)", o: ["1 menit","3 menit","5 menit","10 menit"], a: 2, e: "Golden time untuk RJP/CPR adalah 5 menit pertama untuk mencegah kerusakan otak permanen akibat henti napas/henti jantung." },
  { q: "156. Yang dimaksud dengan Lost Time injury adalah * a. kasus kecelakaan yang menimbulkan kematian pekerja b. kasus kecelakaan kerja yang menyebabkan si pekerja menmgalami", o: ["ketidakmampuan fisik sebagian yang bersifat permanen","kecelakaan kerja yang menyebabkan pekerja tidak dapat bekerja kembali di","shift berikutnya","kehilangan jam kerja karena pekerja mengalami perawatan luka oleh team medis"], a: 1, e: "Fatality adalah klasifikasi kecelakaan kerja yang mengakibatkan hilangnya nyawa pekerja (kematian)." },
  { q: "157. Kasus kecelakaan kerja dimana korban tidak dapat bekerja secara* normal di bagianya dan ditugaskan untuk bekerja di jenis pekerjaan lainya disebut", o: ["a Medical Treatment Case (MTC)","Restricted Work Case ( RWC)","c Permanent Partial Dissability ( PPD)","d Total Recordable Case (TRC)"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "158. Istilah untuk suatu kejadian yang nyaris menimbulkan kecelakaan* adalah", o: ["Nearmiss","First aid case","Medical treatment case","Restricted Work Case ( RWC)"], a: 0, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "159. kejadian kecelakaan kerja yang dalam perawatan lukanya cukup* ditangani petugas P3K dan tidak membutuhkan penanganan dari team medis yang profesional disebut", o: ["Nearmiss","First aid case","Medical treatment case","Restricted Work Case ( RWC)"], a: 1, e: "First Aid Case (FAC) adalah kecelakaan kerja ringan yang cukup ditangani dengan kotak P3K dan tidak memerlukan perawatan medis profesional." },
  { q: "160. sebutkan syarat dilakukan RJP", o: ["Nadi lemah - henti nafas","sesak nafas - nadi lemah","jantung lemah -, Nadi lemah","Henti nafas - Henti jantung"], a: 3, e: "Golden time untuk RJP/CPR adalah 5 menit pertama untuk mencegah kerusakan otak permanen akibat henti napas/henti jantung." },
  { q: "161. Sebutkan Urutan dari Hirearki Pengendalian Bahaya", o: ["Eleminasi - Modifikasi - Subtitusi - Administrasi - APD","Eleminasi - Administrasi - Modifikasi - Subtitusi - - APD","Eleminasi - Subtitusi - Modifikasi - Administrasi - APD","Eleminasi - APD - Subtitusi - Modifikasi - Administrasi"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "162. Apa fungsi dari eksplosimeter", o: ["Alat yang digunakan untuk mengetest gas beracun","Alat yang digunakan untuk mengetest gas hydrokarbon","Alat yang digunakan untuk mengetest asap","Alat yang digunakan untuk mengetest kadar oksigen"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "163. pelaporan awal kecelakaan wajib dilaporkan dari kepala teknik* kepada kepala inspeksi dalam waktu tidak boleh lebih dari :", o: ["1x 12 jam","1 x 24 jam","2 x 24 jam","3 x 2 jam"], a: 1, e: "Pelaporan awal kecelakaan kerja migas wajib dilaporkan secara lisan/cepat dari kepala teknik ke kepala inspeksi dalam waktu 1x24 jam." },
  { q: "164. Kepala teknik wajib melaporkan secara tertulis kecelakaan yang* terjadi kepada kepala inspeksi sdalam waktu tidak boleh lebih dari :", o: ["a, 1 x 24 jam","b 2 x 24 jam","3 x 24jam","d 1 x 12 jam"], a: 1, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "165. apabila pada suatu lokasi kerja terdapat 4 sumber kebisingan,* masing masing 100dB, 102dB, 101dB, 103 dB, berapa intensitas kebisingan di lokasi tersebut", o: ["102 dB","104 dB","106 dB","108 dB"], a: 3, e: "Rumus penambahan tingkat kebisingan: 100dB, 102dB, 101dB, 103dB disatukan. Penjumlahan logaritmik kebisingan yang setara menghasilkan intensitas sekitar 108 dB." },
  { q: "166. Pasir termasuk juga pemadaman jenis padat, di dalam* pemadamanya pasir berfungsi untuk", o: ["pasir dapat menyerap bahan bakar cair","pasir memiliki daya cooling yang baik","untuk menutupi permukaan yang terbakar (blanketing)","untuk memutus rantai pembakaran"], a: 2, e: "Pasir digunakan dalam pemadaman kebakaran awal untuk menyelimuti/menutupi permukaan yang terbakar agar oksigen terputus (blanketing/smothering)." },
  { q: "167. Istilah pemeriksaan/pengujian dengan menekan tabung dengan* tekanan 1,5x tekanan kerja normal tabung selama 30 detik, dalam pemeriksaan jangka panjang APAR disebut", o: ["Non Distructive test","bump test","calibration test","hydrostatic test"], a: 3, e: "Hydrostatic test adalah pengujian kekuatan tabung bertekanan dengan menekan air sebesar 1,5 kali tekanan kerja untuk mendeteksi retak/kebocoran." },
  { q: "168. Pekerjaan yang melibatkan beberapa orang yang mana pekerjaanya* membersihkan tanki minyak dan mengharuskan pekerja masuk ke dalam tanki tersebut, ijin kerja apa yang diperlukan?", o: ["Hot work permitt","confined spaced permit","cold word permit","lifting permit"], a: 1, e: "Pekerjaan masuk ruang terbatas (Cleaning Tank/Vessel) memerlukan SIKA khusus yaitu Confined Space Entry Permit (Izin Masuk Ruang Terbatas)." },
  { q: "169. pada pelaporan kecelakaan yang pertama kali kita laporkan adalah", o: ["kronologi kejadian","identifikasi korban","tempat dan waktu kejadian","nama korban"], a: 2, e: "Pada pelaporan kecelakaan, informasi krusial pertama adalah kronologi singkat, tempat, dan waktu kejadian agar penanganan darurat tepat sasaran." },
  { q: "170. manakah yang tidak termasuk dalam program K3?", o: ["peraturan perundang-undangan","standarisasi","eleminasi","pengawasan"], a: 2, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "171. berikut merupakan tujuan identifikasi bahaya, kecuali", o: ["Potensi bahaya tidak dapat dikenali","B. Mencegah terjadinya kecelakaan kerja","C. Mengetahui potensi risiko di lingkungan kerja","Mengurangi kerugian akibat kecelakaan kerja"], a: 0, e: "Tujuan identifikasi bahaya adalah mengenali risiko, mencegah kecelakaan, and mengurangi kerugian. 'Potensi bahaya tidak dapat dikenali' adalah salah." },
  { q: "172. Berikut merupakan Parameter dalam pemilihan gas detector,* kecuali?", o: ["spare part mudah didapat","B. tingkat ketelitiannya","C. mudah cara penggunaannya","Sulit/Rumit dioperasikan"], a: 3, e: "Pemilihan gas detector berdasarkan ketelitian, kemudahan kalibrasi, dan operasional. 'Sulit/rumit dioperasikan' bukan merupakan parameter positif." },
  { q: "173. Penyebab terjadinya penyakit akibat kerja, kecuali", o: ["Biologi","B. Fisika","C. Genetik","Kimia"], a: 2, e: "Penyebab PAK meliputi faktor biologi, fisika, kimia, dan ergonomi. Genetik bukanlah faktor luar penyebab PAK di tempat kerja." },
  { q: "174. sarung tangan yang digunakan di area yang terdapat potensi benda* tajam adalah", o: ["sarung tangan PVC","Sarung tangan Karet","Sarung Tangan kain","Sarung tangan kulit"], a: 3, e: "Jawaban ini merupakan standard prosedur operasi K3 Migas yang aman untuk meminimalkan kecelakaan kerja dan dampak lingkungan." },
  { q: "175. Di sebuah bengkel las, pekerja mengeluh karena terkena percikan api saat pengelasan. Untuk mencegah kejadian berulang, perusahaan memasang pelindung logam dan tirai las di antara area kerja dan pekerja lain. Langkah pengendalian tersebut termasuk dalam:", o: ["Eliminasi","Substitusi","Rekayasa (Engineering Control)","Apd"], a: 2, e: "Memasang tirai las dan pelindung logam adalah tindakan rekayasa teknik (Engineering Control) untuk mengisolasi bahaya radiasi/percikan api." }
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
    } else if (k3MasteryState.view === 'score') {
        container.innerHTML = renderK3Score();
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
    }
    k3MasteryState.answers = new Array(k3MasteryState.currentDb.length).fill(null);
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
                        <span style="font-size: 0.75rem; background: rgba(251, 191, 36, 0.15); color: #fbbf24; padding: 3px 8px; border-radius: 20px; font-weight: bold;">60 Pilihan Ganda</span>
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
                        <span style="font-size: 0.75rem; background: rgba(239, 68, 68, 0.15); color: #fca5a5; padding: 3px 8px; border-radius: 20px; font-weight: bold;">60 Pilihan Ganda</span>
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
                        <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.15); color: #a7f3d0; padding: 3px 8px; border-radius: 20px; font-weight: bold;">55 Pilihan Ganda</span>
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
                <!-- Self-assessment buttons -->
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--border);">
                    <button onclick="assessK3Essay(true)" style="padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; border: 2px solid ${k3MasteryState.answers[index] === true ? '#10b981' : 'var(--border)'}; background: ${k3MasteryState.answers[index] === true ? 'rgba(16, 185, 129, 0.15)' : 'var(--surface-hover)'}; color: ${k3MasteryState.answers[index] === true ? '#10b981' : 'var(--text-color)'}; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                        ✅ Paham / Benar
                    </button>
                    <button onclick="assessK3Essay(false)" style="padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; border: 2px solid ${k3MasteryState.answers[index] === false ? '#ef4444' : 'var(--border)'}; background: ${k3MasteryState.answers[index] === false ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-hover)'}; color: ${k3MasteryState.answers[index] === false ? '#ef4444' : 'var(--text-color)'}; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                        ❌ Lupa / Salah
                    </button>
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
            <button class="btn btn-secondary" onclick="k3SubmitSession()" style="padding: 12px 15px; font-weight: bold; border-radius: 12px; color: var(--text-color);">
                📊 Selesai
            </button>
            <button class="btn btn-primary" onclick="k3NextQuestion()" style="flex: 1; padding: 12px 10px; font-weight: bold; border-radius: 12px;">
                ${index === total - 1 ? 'Selesai & Lihat Hasil' : 'Berikutnya →'}
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
                        ${index === total - 1 ? 'Selesai & Lihat Hasil' : 'Selanjutnya →'}
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

                <!-- Submit Button -->
                <button class="btn btn-primary" onclick="k3SubmitSession()" style="width: 100%; margin-top: 15px; padding: 12px; font-weight: bold; border-radius: 10px; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    📊 Selesai & Lihat Hasil
                </button>

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
            <!-- Mobile Submit Button -->
            <button class="btn btn-primary" onclick="k3SubmitSession()" style="width: 100%; margin-top: 15px; padding: 12px; font-weight: bold; border-radius: 10px; font-size: 0.88rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
                📊 Selesai & Lihat Hasil
            </button>
        </div>
    </div>
    `;
}

// ==========================================
// SCORE VIEW COMPILER
// ==========================================

function renderK3Score() {
    const total = k3MasteryState.currentDb.length;
    const isCepu = k3MasteryState.currentDb === dbCepu;
    
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    if (isCepu) {
        k3MasteryState.answers.forEach(ans => {
            if (ans === true) correctCount++;
            else if (ans === false) incorrectCount++;
            else unansweredCount++;
        });
    } else {
        k3MasteryState.answers.forEach((ans, idx) => {
            if (ans === null) unansweredCount++;
            else if (ans === k3MasteryState.currentDb[idx].a) correctCount++;
            else incorrectCount++;
        });
    }

    const percentage = Math.round((correctCount / total) * 100);
    const isPassed = percentage >= 70;
    const passStatusText = isPassed ? 'LULUS CERTIFIED' : 'BELUM LULUS';
    const statusColor = isPassed ? '#10b981' : '#ef4444';
    const statusBg = isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
    const statusBorder = isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    
    let recommendationsHtml = '';
    let hasMistakes = false;

    k3MasteryState.currentDb.forEach((item, idx) => {
        const ans = k3MasteryState.answers[idx];
        const isWrong = isCepu ? (ans === false || ans === null) : (ans !== item.a);
        
        if (isWrong) {
            hasMistakes = true;
            if (isCepu) {
                const statusLabel = ans === null ? 'Dilewati' : 'Lupa / Salah';
                const labelColor = ans === null ? 'var(--text-muted)' : '#ef4444';
                const labelBg = ans === null ? 'var(--surface-hover)' : 'rgba(239, 68, 68, 0.08)';

                recommendationsHtml += `
                <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                        <span style="font-weight: 700; color: #3b82f6; font-size: 0.95rem;">Soal #${idx + 1}</span>
                        <span style="font-size: 0.72rem; font-weight: bold; background: ${labelBg}; color: ${labelColor}; padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border);">${statusLabel}</span>
                    </div>
                    <p style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-color); line-height: 1.5;">${item.q.replace(/^\d+\.\s*/, '')}</p>
                    
                    <div style="background: rgba(59, 130, 246, 0.04); border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-top: 5px;">
                        <span style="font-size: 0.75rem; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 5px;">Kunci Jawaban Essay:</span>
                        <div style="font-size: 0.92rem; font-weight: 600; line-height: 1.6; color: var(--text-color);">
                            ${item.a.split('\n').map(line => `<p style="margin: 0 0 4px 0;">${line}</p>`).join('')}
                        </div>
                    </div>
                </div>
                `;
            } else {
                const userChoiceText = ans !== null ? `${String.fromCharCode(65 + ans)}. ${item.o[ans]}` : 'Belum Dijawab';
                const correctChoiceText = `${String.fromCharCode(65 + item.a)}. ${item.o[item.a]}`;
                const statusLabel = ans === null ? 'Belum Dijawab' : 'Jawaban Salah';
                
                recommendationsHtml += `
                <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                        <span style="font-weight: 700; color: #3b82f6; font-size: 0.95rem;">Soal #${idx + 1}</span>
                        <span style="font-size: 0.72rem; font-weight: bold; background: rgba(239, 68, 68, 0.08); color: #ef4444; padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.15);">${statusLabel}</span>
                    </div>
                    <p style="margin: 0; font-size: 1rem; font-weight: 600; color: var(--text-color); line-height: 1.5;">${item.q.replace(/^\d+\.\s*/, '')}</p>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem;">
                        <div style="padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2); background: rgba(239, 68, 68, 0.02); color: #b91c1c; font-weight: 600;">
                            Pilihan Anda: ${userChoiceText}
                        </div>
                        <div style="padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2); background: rgba(16, 185, 129, 0.02); color: #047857; font-weight: 600;">
                            Kunci Jawaban: ${correctChoiceText}
                        </div>
                    </div>

                    <div style="background: rgba(251, 191, 36, 0.05); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 8px; padding: 12px 14px; margin-top: 5px;">
                        <span style="font-weight: bold; color: #b45309; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                            💡 Detail Pembahasan:
                        </span>
                        <p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-color); font-weight: 500;">
                            ${item.e}
                        </p>
                    </div>
                </div>
                `;
            }
        }
    });

    const mistakesReviewHtml = hasMistakes ? `
        <div style="margin-top: 30px;">
            <h3 style="margin: 0 0 15px 0; font-size: 1.15rem; font-weight: 700; color: var(--text-color); display: flex; align-items: center; gap: 8px;">
                <span>📚</span> Hal Yang Harus Dipelajari Kembali (${incorrectCount + unansweredCount} Soal)
            </h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${recommendationsHtml}
            </div>
        </div>
    ` : `
        <div style="margin-top: 30px; text-align: center; padding: 40px 20px; background: rgba(16, 185, 129, 0.06); border: 2px dashed rgba(16, 185, 129, 0.3); border-radius: 16px;">
            <span style="font-size: 3rem; display: block; margin-bottom: 15px;">🏆</span>
            <h3 style="margin: 0 0 8px 0; font-size: 1.25rem; font-weight: 700; color: #10b981;">Luar Biasa! Perfect Score!</h3>
            <p style="margin: 0; font-size: 0.9rem; color: var(--text-color); max-width: 480px; margin: 0 auto; line-height: 1.6; font-weight: 500;">
                Anda telah menjawab dan memahami semua pertanyaan dengan benar. Anda siap untuk sertifikasi K3 Migas resmi!
            </p>
        </div>
    `;

    return `
    <div style="max-width: 750px; margin: 0 auto;" class="animate-in fade-in duration-300">
        
        <!-- Score Card Header -->
        <div class="card" style="padding: 30px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
            
            <span style="color: var(--text-muted); font-size: 0.72rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">Hasil Evaluasi</span>
            <h2 style="margin: 5px 0 25px 0; font-size: 1.6rem; font-weight: 800; color: var(--text-color);">${k3MasteryState.currentTitle}</h2>
            
            <!-- Circular/Big Score Display -->
            <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 25px;">
                <div style="width: 140px; height: 140px; border-radius: 50%; border: 6px solid ${statusColor}; background: ${statusBg}; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.2);">
                    <span style="font-size: 2.3rem; font-weight: 900; color: var(--text-color); line-height: 1.1;">${percentage}%</span>
                    <span style="font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">Skor Akhir</span>
                </div>
                
                <div style="margin-top: 15px; font-size: 0.85rem; font-weight: bold; padding: 6px 16px; border-radius: 30px; border: 1.5px solid ${statusBorder}; background: ${statusBg}; color: ${statusColor}; text-transform: uppercase; letter-spacing: 1.5px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <span>${isPassed ? '🏆' : '⚠️'}</span> ${passStatusText}
                </div>
            </div>

            <!-- Stats grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 20px 0; margin-bottom: 10px;">
                <div style="text-align: center;">
                    <span style="display: block; font-size: 1.35rem; font-weight: 800; color: #10b981;">${correctCount}</span>
                    <span style="font-size: 0.72rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Benar / Paham</span>
                </div>
                <div style="text-align: center; border-left: 1px solid var(--border); border-right: 1px solid var(--border);">
                    <span style="display: block; font-size: 1.35rem; font-weight: 800; color: #ef4444;">${incorrectCount}</span>
                    <span style="font-size: 0.72rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Salah / Lupa</span>
                </div>
                <div style="text-align: center;">
                    <span style="display: block; font-size: 1.35rem; font-weight: 800; color: var(--text-muted);">${unansweredCount}</span>
                    <span style="font-size: 0.72rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase;">Belum Diisi</span>
                </div>
            </div>
        </div>

        <!-- Review Mistakes Section -->
        ${mistakesReviewHtml}

        <!-- Actions Panel -->
        <div style="display: flex; gap: 15px; margin-top: 25px; margin-bottom: 40px;">
            <button class="btn btn-secondary" onclick="restartK3Session()" style="flex: 1; padding: 14px; font-weight: bold; border-radius: 12px; font-size: 0.95rem;">
                🔄 Ulangi Pelatihan / Ujian
            </button>
            <button class="btn btn-primary" onclick="initK3MigasMastery()" style="flex: 1; padding: 14px; font-weight: bold; border-radius: 12px; font-size: 0.95rem;">
                🏠 Kembali ke Menu Utama
            </button>
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
        k3MasteryState.view = 'score';
        renderK3Mastery();
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

function assessK3Essay(isCorrect) {
    k3MasteryState.answers[k3MasteryState.index] = isCorrect;
    renderK3Mastery();
}

function k3SubmitSession() {
    const mobGrid = document.getElementById('k3-mobile-grid-modal');
    if (mobGrid) mobGrid.classList.add('hidden');
    k3MasteryState.view = 'score';
    renderK3Mastery();
}

function restartK3Session() {
    k3MasteryState.index = 0;
    k3MasteryState.showAnswer = false;
    k3MasteryState.answers = new Array(k3MasteryState.currentDb.length).fill(null);
    if (k3MasteryState.currentDb === dbCepu) {
        k3MasteryState.view = 'cepu';
    } else if (k3MasteryState.currentDb === dbSoalX) {
        k3MasteryState.view = 'soalX';
    } else if (k3MasteryState.currentDb === dbSoalY) {
        k3MasteryState.view = 'soalY';
    } else if (k3MasteryState.currentDb === dbSoalZ) {
        k3MasteryState.view = 'soalZ';
    }
    renderK3Mastery();
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
window.assessK3Essay = assessK3Essay;
window.k3SubmitSession = k3SubmitSession;
window.restartK3Session = restartK3Session;
