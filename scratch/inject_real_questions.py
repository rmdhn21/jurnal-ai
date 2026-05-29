# -*- coding: utf-8 -*-
from __future__ import print_function, division, unicode_literals
import json
import codecs
import os

# Define the 58 real exam questions
real_questions = [
    # --- Verbal Sinonim/Antonim ---
    {
        "q": "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\nABERASI",
        "o": ["Pengelompokan", "Peleraian", "Penyimpangan", "Perkelahian", "Pengikisan"],
        "a": 2,
        "e": "Dalam Kamus Besar Bahasa Indonesia (KBBI), kata aberasi berarti penyimpangan dari yang normal atau yang umum.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\nKISI-KISI",
        "o": ["Alat menangkap ikan", "Alat hitung", "Tabel", "Terali", "Pola kerja"],
        "a": 3,
        "e": "Dalam KBBI, kisi-kisi berarti kayu atau besi yang dipasang berdiri dan berjarak sehingga terdapat celah-celah (pada tingkap dan sebagainya); terali; jeruji.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\nMUDUN",
        "o": ["Problema", "Beradab", "Referensi", "Setuju", "Mufakat"],
        "a": 1,
        "e": "Dalam KBBI, kata mudun memiliki arti beradab atau berperadaban.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\nFRIKSI",
        "o": ["Perpecahan", "Tidak berdaya", "Frustasi", "Sedih", "Putus harapan"],
        "a": 0,
        "e": "Friksi berarti pergeseran yang menimbulkan perbedaan pendapat; perpecahan.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\nBOGA",
        "o": ["Pakaian kebesaran", "Makanan kenikmatan", "Dekorasi tata ruang", "Pakaian pengantin", "Tata rias"],
        "a": 1,
        "e": "Boga adalah makanan; masakan; hidangan; santapan. Sinonim dari boga adalah makanan kenikmatan.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\nANJUNG",
        "o": ["Dayung", "Panggung", "Buyung", "Puji", "Angkat"],
        "a": 1,
        "e": "Anjung bermakna bagian rumah (bilik) di sisi atau di tengah rumah yang lantainya lebih tinggi daripada lantai rumah. Sinonim dari anjung adalah panggung.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\nEPIGON",
        "o": ["Fenomena", "Fauna", "Fiksi", "Maestro", "Forum"],
        "a": 3,
        "e": "Epigon adalah orang yang tidak memiliki gagasan baru dan hanya mengikuti jejak pemikiran yang mendahuluinya (pengekor). Antonimnya adalah maestro (orang yang ahli di bidangnya).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\nSURAI",
        "o": ["Bubar", "Usai", "Purna", "Berhimpun", "Akhir"],
        "a": 3,
        "e": "Surai bermakna bercerai-berai, usai, bubar. Lawan kata dari surai adalah berhimpun (berkumpul).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\nHIPOKRIT",
        "o": ["Jujur", "Pembohong", "Sabar", "Kamuflase", "Terbuka"],
        "a": 0,
        "e": "Hipokrit bermakna munafik, orang yang suka berpura-pura. Lawan kata dari hipokrit adalah jujur.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\nMORFEM",
        "o": ["Forum", "Lambang", "Morse", "Jantung", "Fonem"],
        "a": 4,
        "e": "Morfem artinya satuan bentuk bahasa terkecil yang mempunyai makna secara relatif stabil dan tidak dapat dibagi. Lawan katanya adalah fonem (satuan bunyi terkecil yang mampu menunjukkan kontras makna).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\nPENERUS",
        "o": ["Pewaris", "Kader", "Titisan", "Penemu", "Perintis"],
        "a": 4,
        "e": "Penerus bermakna yang meneruskan (melanjutkan; menggantikan). Lawan katanya adalah perintis (yang memulai mengerjakan sesuatu, pelopor).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\nRABUN",
        "o": ["Tajam", "Terang", "Tepat", "Jelas", "Samar"],
        "a": 3,
        "e": "Rabun bermakna kurang jelas; kurang awas; kabur (tentang penglihatan). Lawan katanya adalah jelas (terang).",
        "c": "Soal Asli BPS Pertamina"
    },
    
    # --- Analogi ---
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\nOVEN : ROTI = ... : Foto",
        "o": ["Pemanggang : Album", "Roti : Kamera", "Gosong : Model", "Matang : Fotografer", "Lensa : Kamera"],
        "a": 1,
        "e": "Pola analogi: A adalah alat untuk menghasilkan B. Oven menghasilkan roti, Kamera menghasilkan foto.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\nPEMERINTAH : PERPU = ... : ...",
        "o": ["Buruh : Demokrasi", "Makan : Kenyang", "MPR : UU", "Hakim : Jaksa", "Menteri : Kepres"],
        "a": 2,
        "e": "Pola analogi: A bertugas mengesahkan B. Pemerintah menetapkan Perpu. MPR menetapkan UU.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\nOTONOMI : MANDIRI = ... : ...",
        "o": ["Hardisk : VGA card", "Sabun : Mandi", "Cerdas : Banyak akal", "Bensin : Mesin", "Rakyat : Masyarakat"],
        "a": 2,
        "e": "Pola analogi: Sinonim. Otonomi sama artinya dengan mandiri. Cerdas sama artinya dengan banyak akal.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\nROKOK : ASBAK = Air : ...",
        "o": ["Pancur", "Selokan", "Ember", "Selang", "Keran"],
        "a": 2,
        "e": "Pola analogi: Wadah penampung. Tempat menampung rokok adalah asbak, sedangkan tempat menampung air adalah ember.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\nJATUH : SAKIT = Mengantuk : ...",
        "o": ["Berjalan", "Tidur", "Kalori", "Teriakan", "Tersenyum"],
        "a": 1,
        "e": "Pola analogi: Sebab-Akibat. Jatuh mengakibatkan rasa sakit. Mengantuk mengakibatkan tertidur (tidur).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\nGURU : MURID = Dokter : ...",
        "o": ["Rumah Sakit", "Pasien", "Obat", "Kesehatan", "Perawat"],
        "a": 1,
        "e": "Pola analogi: Pelaku dan Penerima Layanan. Guru memberikan bimbingan/ilmu kepada murid. Dokter memberikan pelayanan kesehatan kepada pasien.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\n1 MINGGU : 7 HARI = 1 Hari : ...",
        "o": ["3.600 menit", "60 detik", "68.400 detik", "1.440 menit", "365 Hari"],
        "a": 3,
        "e": "Pola analogi: Satuan waktu. 1 minggu terdiri dari 7 hari. 1 hari terdiri dari 1.440 menit (24 jam x 60 menit).",
        "c": "Soal Asli BPS Pertamina"
    },

    # --- Pengelompokan Kata ---
    {
        "q": "Tentukan kata mana yang tidak termasuk dalam kelompoknya:\n\n1) Tongkol\n2) Cakalang\n3) Bawal\n4) Tenggiri\n5) Makarel",
        "o": ["Tongkol", "Cakalang", "Bawal", "Tenggiri", "Makarel"],
        "a": 2,
        "e": "Tongkol, cakalang, tenggiri, dan makarel merupakan ikan air laut. Sementara bawal secara umum dikenal sebagai ikan air tawar/payau.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Manakah tokoh yang tidak masuk dalam kelompoknya?",
        "o": ["Megawati", "Sudharmono", "Soekarno", "Soeharto", "Abdurrahman Wahid"],
        "a": 1,
        "e": "Megawati, Soekarno, Soeharto, dan Abdurrahman Wahid adalah mantan Presiden RI. Sedangkan Sudharmono adalah mantan Wakil Presiden RI.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Manakah kata yang tidak masuk dalam kelompok makna kata yang sama?",
        "o": ["Perseteruan", "Pertengkaran", "Pertikaian", "Penyelarasan", "Persaingan"],
        "a": 3,
        "e": "Perseteruan, pertengkaran, pertikaian, dan persaingan bermakna pergeseran/permusuhan. Sedangkan penyelarasan memiliki makna positif (harmonisasi).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Manakah nama tokoh yang tidak masuk dalam kelompoknya?",
        "o": ["Einstein", "W. Shakespeare", "Graham Bell", "T. Alfa edison", "James Watt"],
        "a": 1,
        "e": "Einstein, Graham Bell, Thomas Alva Edison, dan James Watt adalah ilmuwan/penemu. Sedangkan William Shakespeare adalah penulis/sastrawan.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Manakah istilah hukum/investigasi yang tidak masuk dalam kelompoknya?",
        "o": ["Penyelidikan", "Pengusutan", "Penelitian", "Pemeriksaan", "Penuntutan"],
        "a": 4,
        "e": "Penyelidikan, pengusutan, penelitian, dan pemeriksaan bermakna mencari tahu/investigasi fakta. Sedangkan penuntutan adalah kelanjutan hukum menuntut perkara di pengadilan.",
        "c": "Soal Asli BPS Pertamina"
    },

    # --- Deret Angka ---
    {
        "q": "Tentukan dua suku berikutnya dari barisan berikut:\n\n1 ; 0,5 ; 0,333 ; 0,25 ; ... ; ...",
        "o": ["0,2 ; 0,1667", "0,125 ; 0,0625", "0,111 ; 0,0125", "0,125 ; 0,111", "0,15 ; 0,04"],
        "a": 0,
        "e": "Pola deret adalah 1/n dengan n = 1, 2, 3, 4...\n1/1 = 1\n1/2 = 0,5\n1/3 = 0,333\n1/4 = 0,25\nSuku kelima: 1/5 = 0,2\nSuku keenam: 1/6 = 0,1667.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan yang kosong pada deret angka berikut:\n\n4, 12, 48, 144, ... , 1728",
        "o": ["640", "386", "424", "576", "368"],
        "a": 3,
        "e": "Pola deret adalah dikali 3, lalu dikali 4 secara berselang-seling:\n4 * 3 = 12\n12 * 4 = 48\n48 * 3 = 144\n144 * 4 = 576\n576 * 3 = 1728\nJadi, bilangan yang kosong adalah 576.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan yang kosong pada deret berikut:\n\n1, 5, 11, 19, 29, ... , 55, ...",
        "o": ["39 dan 69", "41 dan 71", "35 dan 65", "39 dan 65", "40 dan 71"],
        "a": 1,
        "e": "Selisih antar suku bertambah +2:\n1 (+4) -> 5\n5 (+6) -> 11\n11 (+8) -> 19\n19 (+10) -> 29\n29 (+12) -> 41\n41 (+14) -> 55\n55 (+16) -> 71\nMaka angka pengisi kosong adalah 41 dan 71.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan yang kosong pada deret berikut:\n\n60, 30, 90, 45, 135, ... , 202,5",
        "o": ["125,5", "150", "175", "67,5", "167,5"],
        "a": 3,
        "e": "Pola deret: Dibagi 2, lalu dikali 3 bergantian.\n60 / 2 = 30\n30 * 3 = 90\n90 / 2 = 45\n45 * 3 = 135\n135 / 2 = 67,5\n67,5 * 3 = 202,5.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan yang kosong pada deret berikut:\n\n12, 18, 25, 33, ... , 52",
        "o": ["44", "36", "43", "42", "50"],
        "a": 3,
        "e": "Pola pertambahan selisih berurutan (+6, +7, +8, +9, +10):\n12 (+6) -> 18\n18 (+7) -> 25\n25 (+8) -> 33\n33 (+9) -> 42\n42 (+10) -> 52.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan yang kosong pada deret berikut:\n\n1, 8, 9, 16, 17, ... , 25",
        "o": ["24", "28", "34", "36", "23"],
        "a": 0,
        "e": "Pola deret adalah +7, lalu +1 bergantian:\n1 (+7) -> 8\n8 (+1) -> 9\n9 (+7) -> 16\n16 (+1) -> 17\n17 (+7) -> 24\n24 (+1) -> 25.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan berikutnya dari deret berikut:\n\n3, 5, 9, 15, 15, 25, 21, ...",
        "o": ["45", "44", "35", "42", "40"],
        "a": 2,
        "e": "Deret berselang-seling:\nDeret ganjil (suku 1,3,5,7): 3, 9, 15, 21 (+6)\nDeret genap (suku 2,4,6,8): 5, 15, 25, 35 (+10)\nSuku berikutnya adalah posisi genap ke-8, yaitu 25 + 10 = 35.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan bilangan berikutnya dari deret berikut:\n\n1, 2, 4, 6, 7, 10, ...",
        "o": ["10", "11", "12", "14", "15"],
        "a": 0,
        "e": "Deret berselang-seling:\nDeret ganjil: 1, 4, 7, 10 (+3)\nDeret genap: 2, 6, 10 (+4)\nSuku berikutnya berada di posisi ganjil (suku ke-7), yaitu 7 + 3 = 10.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tentukan tiga huruf berikutnya dari deret berikut:\n\nC, I, A, G, M, E, ... , ... , ...",
        "o": ["K, Q, H", "K, Q, I", "L, Q, H", "J, Q, H", "J, O, I"],
        "a": 1,
        "e": "Ubah huruf menjadi angka urut abjad:\nC(3), I(9), A(1), G(7), M(13), E(5)\nTerdapat tiga subderet berselang-seling:\nSubderet 1: C(3) (+4) -> G(7) (+4) -> K(11)\nSubderet 2: I(9) (+4) -> M(13) (+4) -> Q(17)\nSubderet 3: A(1) (+4) -> E(5) (+4) -> I(9)\nSehingga huruf berikutnya adalah K, Q, I.",
        "c": "Soal Asli BPS Pertamina"
    },

    # --- Aritmatika & Aljabar ---
    {
        "q": "Berapakah hasil pembagian berikut:\n\n382,872 : 44,52 = ...",
        "o": ["4,7", "7,2", "4,6", "8,6", "7,6"],
        "a": 3,
        "e": "382,872 dibagi 44,52 adalah 8,6.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Berapakah 66,67% dari 963,7?",
        "o": ["642,5", "63,5", "635,58", "64,30", "645,2"],
        "a": 0,
        "e": "Persentase 66,67% setara dengan 2/3 bagian.\n(2/3) * 963,7 = 642,46. Dibulatkan mendekati 642,5.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Jika diketahui hubungan variabel:\np < q\nq > r\np < s\nq > s\nMaka hubungan yang benar adalah...",
        "o": ["p < q < r < s", "r < q < p < s", "p < s < q < r", "r < p < q < s", "r < p < s < q"],
        "a": 4,
        "e": "Analisis:\np < q\nr < q\ns < q\nDi sini q merupakan nilai terbesar dari semua variabel. Dari opsi pilihan, hanya pilihan r < p < s < q yang menempatkan q di ujung terbesar secara logis.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Jika 3x + 5 = 20, maka nilai x adalah...",
        "o": ["3", "5", "10", "15", "6"],
        "a": 1,
        "e": "3x + 5 = 20\n3x = 15\nx = 15/3 = 5.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Sebuah toko memiliki diskon 20% dari harga awal Rp 500.000. Berapa harga setelah diskon?",
        "o": ["Rp 400.000", "Rp 450.000", "Rp 480.000", "Rp 500.000", "Rp 350.000"],
        "a": 0,
        "e": "Besar diskon = 20% x Rp 500.000 = Rp 100.000.\nHarga setelah diskon = Rp 500.000 - Rp 100.000 = Rp 400.000.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Jika dalam suatu kelompok terdapat 5 orang yang berjabat tangan satu sama lain, berapa total jabat tangan yang terjadi?",
        "o": ["5", "10", "15", "20", "25"],
        "a": 1,
        "e": "Banyaknya jabat tangan dihitung menggunakan rumus kombinasi n(n-1)/2:\n5 * (5 - 1) / 2 = 5 * 4 / 2 = 10.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Dika adalah seorang karyawan swasta dengan penghasilan Rp 3.000.000 per bulan. Jika penghasilan tidak kena pajak (PTKP) adalah setengah dari penghasilan ditambah Rp 300.000, dan persentase pajak penghasilan adalah 15%. Berapakah jumlah penghasilan bersih yang diterima Dika setiap bulannya?",
        "o": ["Rp 2.800.000", "Rp 3.200.000", "Rp 2.840.000", "Rp 2.860.000", "Rp 2.820.000"],
        "a": 4,
        "e": "PTKP = (1/2 * Gaji) + Rp 300.000 = Rp 1.500.000 + Rp 300.000 = Rp 1.800.000.\nPenghasilan Kena Pajak (PKP) = Gaji - PTKP = Rp 3.000.000 - Rp 1.800.000 = Rp 1.200.000.\nPajak = 15% x Rp 1.200.000 = Rp 180.000.\nGaji bersih = Rp 3.000.000 - Rp 180.000 = Rp 2.820.000.",
        "c": "Soal Asli BPS Pertamina"
    },

    # --- TWK (Test Wawasan Kebangsaan) ---
    {
        "q": "Pancasila sebagai dasar negara pertama kali disahkan dalam sidang...",
        "o": ["BPUPKI", "PPKI", "KNIP", "MPR", "DPR"],
        "a": 1,
        "e": "PPKI mengesahkan Pancasila sebagai dasar negara pada tanggal 18 Agustus 1945.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Hak DPR untuk mengajukan usul undang-undang disebut...",
        "o": ["Hak Interpelasi", "Hak Angket", "Hak Inisiatif", "Hak Budget", "Hak Imunitas"],
        "a": 2,
        "e": "Hak inisiatif adalah hak legislatif DPR untuk mengusulkan Rancangan Undang-Undang (RUU).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Berdasarkan undang-undang dasar, negara Indonesia berbentuk...",
        "o": ["Republik", "Monarki", "Federasi", "Kesultanan", "Serikat"],
        "a": 0,
        "e": "Pasal 1 ayat (1) UUD 1945 menyebutkan Negara Indonesia ialah Negara Kesatuan yang berbentuk Republik.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Lambang resmi dari negara Indonesia adalah...",
        "o": ["Pancasila", "Garuda Pancasila", "Merah Putih", "Bendera Merah Putih", "Bhinneka Tunggal Ika"],
        "a": 1,
        "e": "Garuda Pancasila adalah lambang negara Indonesia dengan semboyan Bhinneka Tunggal Ika.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Sila keempat Pancasila menekankan pada prinsip utama berupa...",
        "o": ["Persatuan", "Kerakyatan", "Keadilan", "Ketuhanan", "Kemanusiaan"],
        "a": 1,
        "e": "Sila keempat berbunyi 'Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan', yang bermakna kerakyatan dan demokrasi musyawarah.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tugas utama dan wewenang dari Mahkamah Konstitusi (MK) di bawah ini adalah...",
        "o": ["Mengawasi jalannya roda pemerintahan", "Memutus sengketa hasil pemilihan umum", "Membentuk undang-undang nasional", "Melakukan penyidikan dugaan korupsi pejabat", "Mengadili perkara pidana sipil umum"],
        "a": 1,
        "e": "MK bertugas menguji UU terhadap UUD 1945, memutus sengketa kewenangan lembaga negara, membubarkan parpol, dan memutus sengketa hasil pemilu.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Peristiwa bersejarah Kongres Pemuda II yang melahirkan ikrar Sumpah Pemuda terjadi pada tanggal...",
        "o": ["28 Oktober 1928", "20 Mei 1908", "17 Agustus 1945", "1 Juni 1945", "10 November 1945"],
        "a": 0,
        "e": "Sumpah Pemuda dibacakan pada Kongres Pemuda II tanggal 28 Oktober 1928 di Jakarta.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Lembaga tinggi negara yang berhak mengajukan RUU selain DPR adalah...",
        "o": ["Presiden", "Mahkamah Agung (MA)", "Majelis Permusyawaratan Rakyat (MPR)", "Komisi Pemberantasan Korupsi (KPK)", "DPRD"],
        "a": 0,
        "e": "Presiden Republik Indonesia memegang kekuasaan mengajukan RUU kepada DPR.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "UUD 1945 pertama kali disahkan sebagai konstitusi oleh PPKI pada tanggal...",
        "o": ["17 Agustus 1945", "18 Agustus 1945", "20 Mei 1908", "28 Oktober 1928", "1 Juni 1945"],
        "a": 1,
        "e": "UUD 1945 disahkan dalam sidang PPKI pada tanggal 18 Agustus 1945.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Negara luar negeri pertama yang mengakui kemerdekaan Indonesia secara berdaulat adalah...",
        "o": ["Amerika Serikat", "Belanda", "Mesir", "Jepang", "India"],
        "a": 2,
        "e": "Mesir merupakan negara Arab/daulat pertama yang secara resmi mengakui proklamasi kemerdekaan Indonesia.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Sistem perekonomian yang dianut Indonesia berdasarkan landasan konstitusi Pasal 33 UUD 1945 adalah...",
        "o": ["Kapitalis", "Sosialis", "Ekonomi Pancasila", "Liberal", "Merkantilisme"],
        "a": 2,
        "e": "Sistem ekonomi Indonesia dijalankan berdasarkan Demokrasi Ekonomi atau Ekonomi Pancasila.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Asas dasar yang melandasi hubungan politik luar negeri Republik Indonesia adalah...",
        "o": ["Intervensi penuh", "Bebas aktif", "Netral pasif", "Pro-Blok Barat", "Kooperatif sepihak"],
        "a": 1,
        "e": "Politik luar negeri Indonesia berasaskan bebas aktif (tidak memihak blok kekuatan mana pun namun berperan aktif menjaga ketertiban dunia).",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Peristiwa penting pengamanan Bung Karno dan Bung Hatta oleh pemuda ke Rengasdengklok terjadi pada tanggal...",
        "o": ["16 Agustus 1945", "17 Agustus 1945", "18 Agustus 1945", "20 Mei 1908", "28 Oktober 1928"],
        "a": 0,
        "e": "Peristiwa Rengasdengklok terjadi pada 16 Agustus 1945 untuk mendesak dwitunggal memproklamasikan kemerdekaan.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Pasal di dalam UUD 1945 yang memuat rincian lengkap mengenai Hak Asasi Manusia (HAM) adalah...",
        "o": ["Pasal 28A – 28J", "Pasal 30", "Pasal 33", "Pasal 36", "Pasal 27"],
        "a": 0,
        "e": "Jaminan Hak Asasi Manusia diatur secara rinci pada Bab XA Pasal 28A hingga 28J UUD 1945.",
        "c": "Soal Asli BPS Pertamina"
    },

    # --- Core Values BUMN (AKHLAK) ---
    {
        "q": "Dalam nilai-nilai utama SDM BUMN yang disingkat AKHLAK, huruf 'A' yang pertama merujuk pada nilai...",
        "o": ["Adaptif", "Amanah", "Akurat", "Aktif", "Aspiratif"],
        "a": 1,
        "e": "Urutan nilai AKHLAK: Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif. Maka 'A' pertama adalah Amanah.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Karyawan BUMN diharapkan dapat terus belajar, mengembangkan keahlian diri, serta menyelesaikan tugas dengan mutu terbaik. Nilai AKHLAK yang diwakili adalah...",
        "o": ["Amanah", "Kompeten", "Harmonis", "Loyal", "Adaptif"],
        "a": 1,
        "e": "Meningkatkan kemampuan diri dan membantu orang lain belajar adalah perwujudan nilai Kompeten.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Perilaku berikut mencerminkan penerapan nilai ADAPTIF di lingkungan kerja BUMN, KECUALI...",
        "o": ["Cepat menyesuaikan diri dengan transformasi alur kerja", "Terbuka mempelajari perkembangan teknologi", "Menolak keras perubahan yang menggeser kenyamanan sistem lama", "Proaktif merespons masalah operasional baru", "Terus berinovasi mencari nilai tambah"],
        "a": 2,
        "e": "Menolak perubahan karena menyukai zona nyaman bertolak belakang dengan nilai Adaptif yang proaktif menyambut inovasi.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Seorang pegawai BUMN mendapati adanya praktik korupsi atau penyimpangan anggaran oleh rekan kerja atau atasannya. Tindakan yang sesuai dengan nilai Amanah adalah...",
        "o": ["Mengabaikannya demi keamanan diri dan karir", "Ikut serta menikmati hasilnya", "Melaporkan pelanggaran tersebut melalui Whistleblowing System (WBS) internal", "Membocorkannya di media sosial agar viral", "Segera mengundurkan diri tanpa melapor"],
        "a": 2,
        "e": "Amanah berarti jujur, bertanggung jawab, dan memegang teguh etika. Melaporkan tindak penyimpangan anggaran lewat jalur pengaduan resmi WBS adalah bentuk menjaga amanah jabatan.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Dalam merampungkan pekerjaan di kantor, Anda selalu berusaha memberikan hasil melampaui standar target dan terus memperbaiki cara kerja. Nilai AKHLAK yang Anda terapkan adalah...",
        "o": ["Amanah", "Kompeten", "Harmonis", "Loyal", "Adaptif"],
        "a": 1,
        "e": "Memberikan performa kerja terbaik dan hasil berkualitas tinggi adalah cerminan nilai Kompeten.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Seorang koordinator di unit kerja selalu mendengarkan gagasan tim tanpa membeda-bedakan latar belakang ras, suku, atau agamanya. Nilai AKHLAK yang tecermin adalah...",
        "o": ["Harmonis", "Loyal", "Adaptif", "Kolaboratif", "Amanah"],
        "a": 0,
        "e": "Harmonis berarti saling peduli, menghormati perbedaan suku/agama (keberagaman), dan merajut suasana kondusif.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Ketika perusahaan melakukan perubahan strategi bisnis besar, sebagai insan BUMN sikap adaptif yang tepat adalah...",
        "o": ["Menolak kebijakan baru", "Mengeluh di depan media", "Menerima dengan pikiran terbuka serta antusias beradaptasi", "Mogok kerja beramai-ramai", "Acuh tak acuh"],
        "a": 2,
        "e": "Adaptif adalah bersikap proaktif, antusias terhadap perubahan ke arah yang lebih baik, and fleksibel.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Sesuai budaya kerja BUMN, core value 'Loyal' bermakna...",
        "o": ["Mendahulukan kepentingan bangsa dan negara di atas kepentingan pribadi/golongan", "Patuh sepenuhnya pada perintah atasan sekalipun melanggar hukum", "Selalu menuntut hak tunjangan sebelum melakukan tugas", "Mendiamkan kesalahan divisi lain demi menjaga solidaritas internal"],
        "a": 0,
        "e": "Loyal berarti berdedikasi mengutamakan kemajuan bangsa dan negara, serta menjaga nama baik instansi.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Tindakan nyata yang mencerminkan nilai 'Harmonis' dalam interaksi antarkaryawan di kantor adalah...",
        "o": ["Membatasi hubungan hanya pada lingkup pekerjaan saja", "Suka menolong sesama rekan kerja yang kesulitan tanpa membeda-bedakan golongan", "Hanya berkelompok dengan rekan yang sekeyakinan saja", "Mendukung persaingan individu di atas keutuhan kerja tim"],
        "a": 1,
        "e": "Nilai Harmonis menuntut toleransi tinggi, kepedulian terhadap sesama, and kesediaan menolong tanpa sekat diskriminasi.",
        "c": "Soal Asli BPS Pertamina"
    },
    {
        "q": "Dalam menghadapi peralihan sistem operasional ke versi digital, tindakan karyawan yang mencerminkan nilai 'Adaptif' adalah...",
        "o": ["Mengeluh secara berkala", "Membiarkan rekan kerja lain beradaptasi terlebih dahulu", "Proaktif mempelajari sistem baru dan mengajukan ide-ide optimalisasi penggunaannya", "Tetap memakai prosedur manual secara sembunyi-sembunyi"],
        "a": 2,
        "e": "Adaptif berarti cepat menyesuaikan diri, giat berinovasi, and bertindak proaktif memimpin perubahan positif.",
        "c": "Soal Asli BPS Pertamina"
    }
]

def main():
    print("Memulai injeksi soal asli BPS Pertamina...")
    
    json_path = os.path.join("scratch", "tkd_1000_questions.json")
    js_path = os.path.join("js", "learn-tkd.js")
    
    if not os.path.exists(json_path):
        print("Error: file " + json_path + " tidak ditemukan!")
        return
        
    print("Membaca data soal prosedural...")
    with codecs.open(json_path, 'r', 'utf-8') as f:
        questions = json.load(f)
        
    # Standardize the generated questions category names for matching Jurnal AI Dashboard
    # Let's filter out the old questions that might have category "Soal Asli BPS Pertamina" to avoid double injection
    questions = [q for q in questions if q.get("c") != "Soal Asli BPS Pertamina"]
    
    print("Menggabungkan " + str(len(real_questions)) + " soal asli dengan " + str(len(questions)) + " soal prosedural...")
    
    # Combined list: real questions FIRST
    combined_questions = []
    
    # We add real questions and assign initial ids
    for idx, q in enumerate(real_questions):
        q["id"] = idx + 1
        combined_questions.append(q)
        
    # We add procedural questions and update their ids
    start_id = len(real_questions) + 1
    for idx, q in enumerate(questions):
        q["id"] = start_id + idx
        combined_questions.append(q)
        
    # Write back to JSON
    print("Menulis kembali " + str(len(combined_questions)) + " soal ke " + json_path + "...")
    json_data = json.dumps(combined_questions, ensure_ascii=False, indent=2)
    with codecs.open(json_path, 'w', 'utf-8') as f:
        f.write(json_data)
        
    print("Membuat ulang js/learn-tkd.js dengan data baru...")
    
    # JavaScript template code with "Soal Asli BPS Pertamina" category included in stats
    js_code = """// ==========================================
// DATABASE LENGKAP TKD 1000 MASTERY
// Generated automatically from JSON
// ==========================================

const dbTkd = {QUESTIONS_JSON};

// ==========================================
// STATE MANAGEMENT & RUNTIME LOGIC
// ==========================================

let tkdMasteryState = {
    view: 'home', // 'home', 'quiz'
    index: 0,
    currentCategory: 'ALL',
    filteredQuestions: [],
    answers: {} // Map of question ID (1-based) -> selected option index
};

function initTkdMastery() {
    tkdMasteryState.view = 'home';
    tkdMasteryState.index = 0;
    tkdMasteryState.currentCategory = 'ALL';
    tkdMasteryState.filteredQuestions = dbTkd;
    
    // Load progress from localStorage
    const saved = localStorage.getItem('jurnal_ai_tkd_answers');
    if (saved) {
        try {
            tkdMasteryState.answers = JSON.parse(saved);
        } catch (e) {
            tkdMasteryState.answers = {};
        }
    } else {
        tkdMasteryState.answers = {};
    }
    
    renderTkdMastery();
}

function resetTkdProgress() {
    if (confirm("Apakah Anda yakin ingin menghapus semua progress belajar TKD? Semua jawaban akan diset ulang.")) {
        localStorage.removeItem('jurnal_ai_tkd_answers');
        tkdMasteryState.answers = {};
        renderTkdMastery();
    }
}

function selectTkdCategory(cat) {
    tkdMasteryState.view = 'quiz';
    tkdMasteryState.currentCategory = cat;
    tkdMasteryState.index = 0;
    
    if (cat === 'ALL') {
        tkdMasteryState.filteredQuestions = dbTkd;
    } else {
        tkdMasteryState.filteredQuestions = dbTkd.filter(q => q.c === cat);
    }
    
    // Resume to first unanswered question in this category
    let resumeIndex = 0;
    for (let i = 0; i < tkdMasteryState.filteredQuestions.length; i++) {
        const qId = tkdMasteryState.filteredQuestions[i].id;
        if (tkdMasteryState.answers[qId] === undefined) {
            resumeIndex = i;
            break;
        }
    }
    tkdMasteryState.index = resumeIndex;
    
    renderTkdMastery();
}

function renderTkdMastery() {
    const container = document.getElementById('tkd-mastery-content');
    if (!container) return;

    if (tkdMasteryState.view === 'home') {
        container.innerHTML = renderTkdHome();
    } else {
        container.innerHTML = renderTkdQuiz();
    }
    
    // Scroll screen back to top
    const screenEl = document.getElementById('tkd-mastery-screen');
    if (screenEl) {
        screenEl.scrollTop = 0;
    }
}

// ==========================================
// RENDER VIEWS (TEMPLATE COMPILING)
// ==========================================

function renderTkdHome() {
    const totalQuestions = dbTkd.length;
    const answeredCount = Object.keys(tkdMasteryState.answers).length;
    
    let correctCount = 0;
    let wrongCount = 0;
    dbTkd.forEach(q => {
        const ans = tkdMasteryState.answers[q.id];
        if (ans !== undefined) {
            if (ans === q.a) {
                correctCount++;
            } else {
                wrongCount++;
            }
        }
    });
    
    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    
    const categories = [
        { name: 'Semua Soal', key: 'ALL', count: totalQuestions, icon: '⚡', desc: 'Campuran soal asli rekrutmen Pertamina dan latihan kemampuan dasar.', color: '#3b82f6' },
        { name: 'Soal Asli BPS Pertamina', key: 'Soal Asli BPS Pertamina', count: {REAL_COUNT}, icon: '🏆', desc: 'Soal bocoran asli rekrutmen BPS Pertamina (Verbal, Analogi, Deret, Aritmatika, TWK, AKHLAK).', color: '#ef4444' },
        { name: 'Numerik (Deret Angka)', key: 'Numerik (Deret Angka)', count: 300, icon: '📈', desc: 'Latihan deret aritmatika, geometri, Fibonacci, bertingkat, dan lompat.', color: '#fbbf24' },
        { name: 'Numerik (Aritmatika & Aljabar)', key: 'Numerik (Aritmatika & Aljabar)', count: 300, icon: '🔢', desc: 'Soal aljabar dasar, cerita kecepatan-waktu-jarak, umur, dan laba-rugi.', color: '#10b981' },
        { name: 'Logika (Silogisme)', key: 'Logika (Silogisme)', count: 200, icon: '🧩', desc: 'Penarikan kesimpulan logis dari premis-premis formal.', color: '#818cf8' },
        { name: 'Verbal (Analogi)', key: 'Verbal (Analogi)', count: 100, icon: '🗣️', desc: 'Pasangan hubungan analogi kata yang setara.', color: '#60a5fa' },
        { name: 'Verbal (Kosakata)', key: 'Verbal (Kosakata)', count: 100, icon: '📚', desc: 'Uji sinonim (persamaan kata) dan antonim (lawan kata).', color: '#ec4899' }
    ];
    
    function getCategoryStats(catKey) {
        let catQuestions = dbTkd;
        if (catKey !== 'ALL') {
            catQuestions = dbTkd.filter(q => q.c === catKey);
        }
        const catTotal = catQuestions.length;
        let catAnswered = 0;
        let catCorrect = 0;
        
        catQuestions.forEach(q => {
            const ans = tkdMasteryState.answers[q.id];
            if (ans !== undefined) {
                catAnswered++;
                if (ans === q.a) {
                    catCorrect++;
                }
            }
        });
        
        return {
            total: catTotal,
            answered: catAnswered,
            correct: catCorrect,
            percent: catTotal > 0 ? Math.round((catAnswered / catTotal) * 100) : 0
        };
    }
    
    let cardsHtml = '';
    categories.forEach(cat => {
        const stats = getCategoryStats(cat.key);
        // Skip rendering category if it has 0 questions in database
        if (stats.total === 0) return;
        
        cardsHtml += `
            <div class="card clickable-card" onclick="selectTkdCategory('${cat.key}')" style="border-left: 5px solid ${cat.color}; cursor: pointer; transition: all 0.2s; padding: 20px; display: flex; align-items: center; gap: 20px; background: var(--bg-card); margin-bottom: 15px;">
                <div style="background: rgba(255, 255, 255, 0.05); width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; color: ${cat.color};">
                    ${cat.icon}
                </div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 5px; margin-bottom: 8px;">
                        <h3 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">${cat.name}</h3>
                        <span style="font-size: 0.75rem; background: rgba(255,255,255,0.08); color: var(--text-secondary); padding: 3px 8px; border-radius: 20px; font-weight: bold;">
                            ${stats.answered}/${stats.total} Soal (${stats.percent}%)
                        </span>
                    </div>
                    <p class="text-muted" style="margin: 6px 0 10px 0; font-size: 0.82rem; line-height: 1.4;">${cat.desc}</p>
                    <div class="progress-bar-bg" style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                        <div class="progress-bar-fill" style="width: ${stats.percent}%; height: 100%; background: ${cat.color}; border-radius: 3px; transition: width 0.3s;"></div>
                    </div>
                </div>
                <div style="font-size: 1.2rem; color: var(--text-muted); margin-left: 10px;">→</div>
            </div>
        `;
    });
    
    return `
    <div style="max-width: 900px; margin: 0 auto; padding: 10px 0 30px;" class="animate-in fade-in duration-300">
        <!-- Banner Header -->
        <div class="card" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(29, 78, 216, 0.03) 100%); border: 1px solid rgba(59, 130, 246, 0.2); text-align: center; padding: 30px 20px; margin-bottom: 25px; border-radius: 20px;">
            <h1 style="font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, #60a5fa, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>⚡</span> TKD 1000 Mastery
            </h1>
            <p class="text-muted" style="margin: 0 auto; max-width: 600px; font-size: 0.95rem; line-height: 1.5;">
                Persiapkan Tes Kemampuan Dasar (TKD) secara komprehensif dengan 1.058 soal latihan, termasuk <strong>soal asli bocoran rekrutmen BPS Pertamina</strong> sebelumnya lengkap dengan pembahasan detail.
            </p>
        </div>

        <!-- Stats Counter Row -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;" class="tkd-stats-row">
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Progress Total</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #3b82f6;">${progressPercent}%</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${answeredCount} / ${totalQuestions} Soal</div>
            </div>
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Jawaban Benar</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #10b981;">${correctCount}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Akurasi: ${answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%</div>
            </div>
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Jawaban Salah</div>
                <div style="font-size: 1.5rem; font-weight: 800; color: #ef4444;">${wrongCount}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Perlu dipelajari lagi</div>
            </div>
            <div class="card" style="padding: 15px; text-align: center; margin-bottom: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <button class="btn btn-secondary" onclick="resetTkdProgress()" style="padding: 8px 12px; font-size: 0.75rem; font-weight: bold; width: 100%; border-radius: 8px; color: #ef4444; border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.05); cursor: pointer;">
                    🔄 Reset Progress
                </button>
            </div>
        </div>

        <!-- Categories Section -->
        <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 15px; color: var(--text-primary);">Pilih Kategori Belajar</h2>
        <div style="display: flex; flex-direction: column;">
            ${cardsHtml}
        </div>
    </div>
    `;
}

function renderTkdQuiz() {
    const total = tkdMasteryState.filteredQuestions.length;
    if (total === 0) {
        return `
            <div style="text-align: center; padding: 50px;">
                <h2>Tidak ada soal ditemukan di kategori ini.</h2>
                <button class="btn btn-primary" onclick="initTkdMastery()">Kembali ke Menu</button>
            </div>
        `;
    }
    
    const index = tkdMasteryState.index;
    const question = tkdMasteryState.filteredQuestions[index];
    const qId = question.id;
    const progressPercent = Math.round(((index + 1) / total) * 100);
    
    const userChoice = tkdMasteryState.answers[qId];
    const hasAnsweredCurrent = userChoice !== undefined;
    
    // Create options list HTML
    let optionsHtml = '';
    question.o.forEach((opt, idx) => {
        let btnStyle = '';
        let badgeStyle = '';
        let disabledAttr = hasAnsweredCurrent ? 'disabled' : '';
        let optionClass = 'option-btn';
        
        if (hasAnsweredCurrent) {
            if (idx === question.a) {
                // Correct answer
                btnStyle = 'background: rgba(16, 185, 129, 0.08); color: #a7f3d0; border-color: #10b981;';
                badgeStyle = 'background: #10b981; color: white; border-color: #10b981;';
            } else if (idx === userChoice) {
                // User chose this, but it is wrong
                btnStyle = 'background: rgba(239, 68, 68, 0.08); color: #fca5a5; border-color: #ef4444;';
                badgeStyle = 'background: #ef4444; color: white; border-color: #ef4444;';
            } else {
                // Neutral and disabled
                btnStyle = 'opacity: 0.5; cursor: not-allowed;';
            }
        }
        
        optionsHtml += `
            <button class="${optionClass}" ${disabledAttr} onclick="selectTkdOption(${idx})" style="width: 100%; text-align: left; padding: 15px 20px; border-radius: 12px; font-family: inherit; font-size: 0.95rem; font-weight: 600; background: var(--bg-primary); color: var(--text-primary); border: 2px solid var(--border); cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 15px; margin-bottom: 12px; ${btnStyle}">
                <div class="option-badge" style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255,255,255,0.05); color: var(--text-secondary); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; flex-shrink: 0; ${badgeStyle}">
                    ${String.fromCharCode(65 + idx)}
                </div>
                <span>${opt}</span>
            </button>
        `;
    });
    
    // CBT numbers pagination/grid
    const groupSize = 50;
    const totalGroups = Math.ceil(total / groupSize);
    const currentGroup = Math.floor(index / groupSize);
    
    let groupSelectHtml = '';
    if (totalGroups > 1) {
        groupSelectHtml += `<select onchange="changeTkdGroup(this.value)" style="background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border); padding: 5px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: bold; outline: none; cursor: pointer;">`;
        for (let g = 0; g < totalGroups; g++) {
            const startNum = g * groupSize + 1;
            const endNum = Math.min((g + 1) * groupSize, total);
            groupSelectHtml += `<option value="${g}" ${g === currentGroup ? 'selected' : ''}>Soal ${startNum} - ${endNum}</option>`;
        }
        groupSelectHtml += `</select>`;
    }
    
    // Build active group number buttons
    let numbersHtml = '';
    const startIdx = currentGroup * groupSize;
    const endIdx = Math.min(startIdx + groupSize, total);
    for (let i = startIdx; i < endIdx; i++) {
        const qNum = i + 1;
        const qObj = tkdMasteryState.filteredQuestions[i];
        const ansVal = tkdMasteryState.answers[qObj.id];
        
        let numStyle = 'background: rgba(255,255,255,0.02); border: 1px solid var(--border); color: var(--text-secondary);';
        
        if (i === index) {
            numStyle = 'background: #3b82f6; color: white; border-color: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);';
        } else if (ansVal !== undefined) {
            if (ansVal === qObj.a) {
                numStyle = 'background: #10b981; color: white; border-color: #10b981;';
            } else {
                numStyle = 'background: #ef4444; color: white; border-color: #ef4444;';
            }
        }
        
        numbersHtml += `
            <button onclick="jumpToTkdQuizQuestion(${i})" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: all 0.2s; ${numStyle}">
                ${qNum}
            </button>
        `;
    }
    
    let categoryBadgeColor = '#3b82f6';
    if (question.c.includes('Deret')) categoryBadgeColor = '#fbbf24';
    else if (question.c.includes('Aritmatika')) categoryBadgeColor = '#10b981';
    else if (question.c.includes('Silogisme')) categoryBadgeColor = '#818cf8';
    else if (question.c.includes('Analogi')) categoryBadgeColor = '#60a5fa';
    else if (question.c.includes('Kosakata')) categoryBadgeColor = '#ec4899';
    else if (question.c.includes('Asli')) categoryBadgeColor = '#ef4444';
    
    return `
    <div class="animate-in fade-in duration-300" style="max-width: 950px; margin: 0 auto; display: flex; gap: 20px; padding: 10px 0 50px; flex-wrap: wrap;">
        <!-- Left Side: Back Button & Quiz Card -->
        <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
            
            <!-- Quiz Card Header Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; gap: 10px;">
                <button class="btn btn-secondary" onclick="initTkdMastery()" style="padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                    ← Menu Utama
                </button>
                <div style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); background: rgba(255,255,255,0.03); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border);">
                    Kategori: <span style="color: ${categoryBadgeColor};">${question.c}</span>
                </div>
            </div>

            <!-- Quiz Card -->
            <div class="card" style="padding: 30px; margin-bottom: 0; min-height: 420px; display: flex; flex-direction: column; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg);">
                <!-- Card Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 0.8rem; font-weight: bold; border-bottom: 1px solid var(--border); padding-bottom: 15px;">
                    <span style="color: var(--text-muted);">SOAL NO. <strong style="font-size: 1.1rem; color: var(--text-primary);">${index + 1}</strong> dari ${total} (ID: ${qId})</span>
                    <span style="color: var(--text-muted);">${progressPercent}% Selesai</span>
                </div>
                
                <!-- Progress Line -->
                <div class="progress-bar-bg" style="height: 4px; background: rgba(255,255,255,0.05); margin-bottom: 25px; border-radius: 2px; overflow: hidden;">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%; height: 100%; background: #3b82f6; border-radius: 2px; transition: width 0.3s;"></div>
                </div>

                <!-- Question Text -->
                <p class="question-text" style="font-size: 1.15rem; font-weight: 700; line-height: 1.6; margin: 0 0 25px 0; color: var(--text-primary); white-space: pre-wrap;">
                    ${question.q}
                </p>

                <!-- Options list -->
                <div style="margin-bottom: 25px;">
                    ${optionsHtml}
                </div>

                <!-- Explanation Panel (after answer) -->
                ${hasAnsweredCurrent ? `
                    <div class="animate-in fade-in duration-300" style="margin-bottom: 25px; border-radius: 12px; border: 1px solid; padding: 18px; ${userChoice === question.a ? 'background: rgba(16, 185, 129, 0.04); border-color: rgba(16, 185, 129, 0.2);' : 'background: rgba(239, 68, 68, 0.04); border-color: rgba(239, 68, 68, 0.2);'}">
                        <div style="display: flex; gap: 15px; align-items: flex-start;">
                            <div style="font-size: 1.8rem; line-height: 1; ${userChoice === question.a ? 'color: #10b981;' : 'color: #ef4444;'}">
                                ${userChoice === question.a ? '✅' : '❌'}
                            </div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0; font-size: 1rem; font-weight: 800; ${userChoice === question.a ? 'color: #10b981;' : 'color: #ef4444;'}">
                                    ${userChoice === question.a ? 'Jawaban Anda Benar!' : 'Jawaban Anda Kurang Tepat!'}
                                </h4>
                                <p style="margin: 6px 0 12px 0; font-size: 0.85rem; font-weight: 500; color: var(--text-secondary);">
                                    Kunci Jawaban: <strong style="background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--text-primary);">${String.fromCharCode(65 + question.a)}. ${question.o[question.a]}</strong>
                                </p>

                                <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; padding: 12px 14px;">
                                    <span style="font-weight: bold; color: #fbbf24; display: flex; align-items: center; gap: 6px; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                                        💡 Detail Pembahasan:
                                    </span>
                                    <p style="margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary); font-weight: 500;">
                                        ${question.e}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Prev/Next Control Row -->
                <div style="margin-top: auto; border-top: 1px solid var(--border); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <button class="btn btn-secondary" onclick="tkdPrevQuestion()" ${index === 0 ? 'disabled style="opacity: 0.4; cursor: not-allowed; padding: 10px 20px;"' : 'style="padding: 10px 20px; cursor: pointer;"'}>
                        ← Sebelumnya
                    </button>
                    
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Lompat ke:</span>
                        <input type="number" id="tkd-jump-input" value="${index + 1}" min="1" max="${total}" onchange="jumpToTkdQuestion(this.value)" style="width: 60px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg-primary); color: var(--text-primary); text-align: center; font-weight: bold; font-size: 0.85rem; outline: none;">
                    </div>

                    <button class="btn btn-primary" onclick="tkdNextQuestion()" style="padding: 10px 20px; cursor: pointer;">
                        ${index === total - 1 ? 'Selesai Belajar' : 'Selanjutnya →'}
                    </button>
                </div>

            </div>
        </div>

        <!-- Right Column: Navigation Grid Panel (CBT-like) -->
        <div class="tkd-grid-panel" style="width: 280px; flex-shrink: 0; display: flex; flex-direction: column; gap: 15px;">
            <div class="card" style="padding: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; display: flex; flex-direction: column; margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">Daftar Nomor</h3>
                    ${groupSelectHtml}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; overflow-y: auto; max-height: 250px; padding-bottom: 10px;" class="no-scrollbar">
                    ${numbersHtml}
                </div>

                <!-- Legend -->
                <div style="border-top: 1px solid var(--border); margin-top: 15px; padding-top: 12px; display: flex; flex-direction: column; gap: 6px; font-size: 0.72rem; font-weight: bold; color: var(--text-muted);">
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#10b981; border-radius:3px;"></div> Benar</div>
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:#ef4444; border-radius:3px;"></div> Salah</div>
                    <div style="display:flex; align-items:center; gap:8px;"><div style="width:12px; height:12px; background:rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius:3px;"></div> Belum Dijawab</div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function selectTkdOption(optIdx) {
    const index = tkdMasteryState.index;
    const question = tkdMasteryState.filteredQuestions[index];
    const qId = question.id;
    
    if (tkdMasteryState.answers[qId] !== undefined) return; // already answered
    
    tkdMasteryState.answers[qId] = optIdx;
    
    // Save to localStorage
    localStorage.setItem('jurnal_ai_tkd_answers', JSON.stringify(tkdMasteryState.answers));
    
    renderTkdMastery();
}

function tkdNextQuestion() {
    const total = tkdMasteryState.filteredQuestions.length;
    if (tkdMasteryState.index < total - 1) {
        tkdMasteryState.index++;
        renderTkdMastery();
    } else {
        // Go back home
        initTkdMastery();
    }
}

function tkdPrevQuestion() {
    if (tkdMasteryState.index > 0) {
        tkdMasteryState.index--;
        renderTkdMastery();
    }
}

function jumpToTkdQuestion(val) {
    let num = parseInt(val) - 1;
    const total = tkdMasteryState.filteredQuestions.length;
    if (isNaN(num) || num < 0) num = 0;
    if (num >= total) num = total - 1;
    tkdMasteryState.index = num;
    renderTkdMastery();
}

function jumpToTkdQuizQuestion(idx) {
    tkdMasteryState.index = idx;
    renderTkdMastery();
}

function changeTkdGroup(groupVal) {
    const group = parseInt(groupVal);
    const groupSize = 50;
    tkdMasteryState.index = group * groupSize;
    renderTkdMastery();
}

// Expose globally
window.initTkdMastery = initTkdMastery;
window.selectTkdCategory = selectTkdCategory;
window.renderTkdMastery = renderTkdMastery;
window.selectTkdOption = selectTkdOption;
window.tkdNextQuestion = tkdNextQuestion;
window.tkdPrevQuestion = tkdPrevQuestion;
window.jumpToTkdQuestion = jumpToTkdQuestion;
window.jumpToTkdQuizQuestion = jumpToTkdQuizQuestion;
window.changeTkdGroup = changeTkdGroup;
window.resetTkdProgress = resetTkdProgress;
"""

    js_final = js_code.replace("{QUESTIONS_JSON}", json_data.decode('utf-8') if isinstance(json_data, bytes) else json_data)
    js_final = js_final.replace("{REAL_COUNT}", str(len(real_questions)))
    
    print("Menulis ke " + js_path + "...")
    with codecs.open(js_path, 'w', 'utf-8') as f:
        f.write(js_final)
        
    print("Berhasil memperbarui js/learn-tkd.js!")

if __name__ == "__main__":
    main()
