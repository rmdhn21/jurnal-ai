# -*- coding: utf-8 -*-
from __future__ import print_function, division, unicode_literals
import json
import random
import os
import io
import codecs

# Set random seed for reproducibility
random.seed(42)

# Pools of words for Syllogisms
A_pool = ["mahasiswa", "guru", "dokter", "insinyur", "pelukis", "PNS", "programmer", "atlet", "petani", "pedagang", "dosen", "ilmuwan", "musisi", "arsitek", "apotheker", "wirausaha"]
B_pool = ["pekerja keras", "disiplin", "berpendidikan", "profesional", "kreatif", "jujur", "rajin", "berbakat", "bertanggung jawab", "berintegritas", "inovatif", "teliti"]
C_pool = ["berprestasi", "sukses", "sejahtera", "dihormati", "bahagia", "produktif", "terkenal", "berpengaruh", "mandiri", "unggul"]

# Analogy word pairs
analogy_pool = [
    ("gergaji", "kayu", "gunting", "kain", "alat dan objek potong"),
    ("mobil", "bensin", "lampu", "listrik", "alat dan sumber energi"),
    ("es", "dingin", "api", "panas", "benda dan sifat alaminya"),
    ("apoteker", "obat", "koki", "masakan", "profesi dan produk"),
    ("penari", "panggung", "petinju", "ring", "profesi dan tempat kerja"),
    ("haus", "minum", "lapar", "makan", "kondisi dan kebutuhan"),
    ("kompas", "arah", "termometer", "suhu", "alat ukur dan besaran"),
    ("malam", "bulan", "siang", "matahari", "waktu dan benda langit"),
    ("sarung tangan", "tangan", "sepatu", "kaki", "aksesoris dan bagian tubuh"),
    ("singa", "rusa", "kucing", "tikus", "predator dan mangsa"),
    ("helm", "kepala", "sabuk", "pinggang", "pelindung dan bagian tubuh"),
    ("hujan", "payung", "dingin", "selimut", "masalah dan solusi"),
    ("buku", "perpustakaan", "barang", "gudang", "benda dan tempat penyimpanan"),
    ("petani", "sawah", "nelayan", "laut", "profesi dan area kerja"),
    ("guru", "sekolah", "dokter", "rumah sakit", "profesi dan instansi"),
    ("kamera", "fotografer", "kuas", "pelukis", "alat dan pelaku"),
    ("pesawat", "pilot", "kereta", "masinis", "kendaraan dan pengemudi"),
    ("sapi", "rumput", "kucing", "ikan", "hewan dan makanannya"),
    ("koran", "informasi", "obat", "penyembuhan", "benda dan fungsi"),
    ("kulit", "raba", "telinga", "dengar", "indra dan fungsinya"),
    ("kertas", "tulis", "pisau", "potong", "benda dan fungsi"),
    ("daging", "karnivora", "tumbuhan", "herbivora", "makanan dan jenis hewan"),
    ("mata", "kacamata", "kaki", "sepatu", "anggota tubuh dan pelengkap"),
    ("pohon", "hutan", "bintang", "galaksi", "bagian dan kumpulan"),
    ("dinding", "batu bata", "jembatan", "beton", "konstruksi dan bahan baku"),
    ("menang", "gembira", "kalah", "sedih", "kejadian dan emosi"),
    ("lapar", "kenyang", "haus", "puas", "keadaan awal dan akhir"),
    ("gandum", "roti", "susu", "keju", "bahan mentah dan hasil olahan"),
    ("kunci", "gembok", "tutup", "botol", "benda berpasangan"),
    ("senapan", "berburu", "pancing", "memancing", "alat dan kegunaan")
]

# Vocabulary (Synonyms and Antonyms)
synonyms = [
    ("afiliasi", "gabungan", ["pemisahan", "kontrak", "perselisihan", "pertikaian"]),
    ("akurat", "tepat", ["salah", "ragu", "meleset", "kira-kira"]),
    ("alternatif", "pilihan", ["keharusan", "kewajiban", "tujuan", "keputusan"]),
    ("ambigu", "taksa", ["jelas", "pasti", "tunggal", "terang"]),
    ("analisis", "penyelidikan", ["penyatuan", "perakitan", "sintesis", "pembagian"]),
    ("apriori", "pra-anggapan", ["aposteriori", "kesimpulan", "kenyataan", "bukti"]),
    ("bias", "simpangan", ["lurus", "fokus", "pusat", "tepat"]),
    ("bonafide", "terpercaya", ["palsu", "curang", "diragukan", "murahan"]),
    ("defisit", "kekurangan", ["kelebihan", "cukup", "surplus", "penambahan"]),
    ("dekade", "dasawarsa", ["abad", "windu", "tahun", "bulan"]),
    ("diferensiasi", "pembedaan", ["penyatuan", "persamaan", "asimilasi", "akulturasi"]),
    ("dominasi", "penguasaan", ["kepatuhan", "kekalahan", "penyerahan", "kesetaraan"]),
    ("efektif", "mujarab", ["sia-sia", "gagal", "lemah", "lambat"]),
    ("efisien", "hemat", ["boros", "mahal", "lambat", "mubazir"]),
    ("fiktif", "rekaan", ["nyata", "fakta", "sejarah", "ilmiah"]),
    ("generik", "umum", ["khusus", "spesifik", "paten", "langka"]),
    ("hipotesis", "dugaan", ["bukti", "teori", "hukum", "kenyataan"]),
    ("implikasi", "keterlibatan", ["pelepasan", "pengecualian", "penolakan", "akibat"]),
    ("indikasi", "petunjuk", ["bukti", "kepastian", "penyebab", "akibat"]),
    ("insinuasi", "sindiran", ["pujian", "hinaan", "sanjungan", "tuduhan"]),
    ("kolektif", "bersama", ["individu", "terpisah", "mandiri", "tunggal"]),
    ("kontemporer", "kekinian", ["kuno", "jadul", "klasik", "tradisional"]),
    ("laten", "tersembunyi", ["tampak", "nyata", "aktif", "jelas"]),
    ("mayoritas", "sebagian besar", ["minoritas", "sedikit", "semua", "sebagian"]),
    ("nominal", "nilai nominal", ["riil", "nyata", "besar", "jumlah"]),
    ("otoritas", "wewenang", ["kepatuhan", "kewajiban", "tunduk", "tanggung jawab"]),
    ("paradoks", "kontradiksi", ["keselarasan", "persamaan", "kebenaran", "fakta"]),
    ("rekonsiliasi", "perdamaian", ["pertikaian", "perselisihan", "peperangan", "konflik"]),
    ("signifikan", "berarti", ["sepele", "kecil", "biasa", "diabaikan"]),
    ("statis", "diam", ["dinamis", "bergerak", "berubah", "lincah"])
]

antonyms = [
    ("nomad", "menetap", ["berpindah", "berkelana", "singgah", "bepergian"]),
    ("progresif", "regresif", ["maju", "modern", "dinamis", "aktif"]),
    ("apriori", "aposteriori", ["praduga", "asumsi", "teori", "hipotesis"]),
    ("permanen", "temporer", ["abadi", "kuat", "tetap", "kokoh"]),
    ("induksi", "deduksi", ["kesimpulan", "analogi", "sintesis", "analisis"]),
    ("tesis", "antitesis", ["argumen", "teori", "kesimpulan", "hipotesis"]),
    ("promosi", "demosi", ["kenaikan", "penghargaan", "mutasi", "rotasi"]),
    ("elastis", "kaku", ["lentur", "fleksibel", "kenyal", "lembut"]),
    ("imigrasi", "emigrasi", ["perpindahan", "transmigrasi", "urbanisasi", "kolonisasi"]),
    ("plural", "tunggal", ["jamak", "banyak", "majemuk", "beragam"]),
    ("konveks", "konkaf", ["cekung", "datar", "lurus", "bulat"]),
    ("optimis", "pesimis", ["yakin", "berani", "ragu", "semangat"]),
    ("protagonis", "antagonis", ["pahlawan", "tokoh utama", "figuran", "pembantu"]),
    ("sceptic", "optimis", ["ragu", "percaya", "pasrah", "khawatir"]),
    ("kaos", "keteraturan", ["kekacauan", "keributan", "kerusakan", "konflik"]),
    ("fusi", "fisi", ["penggabungan", "peleburan", "penyatuan", "reaksi"]),
    ("aktif", "pasif", ["lincah", "giat", "dinamis", "cepat"]),
    ("antagonis", "protagonis", ["musuh", "jahat", "lawan", "penjahat"]),
    ("ekspansi", "kontraksi", ["perluasan", "perkembangan", "penyebaran", "pertumbuhan"]),
    ("stabil", "labil", ["kokoh", "tetap", "tenang", "aman"]),
    ("horizontal", "vertikal", ["mendatar", "rata", "miring", "tegak"]),
    ("monoton", "variatif", ["bosan", "jenuh", "sama", "tetap"]),
    ("sekuler", "keagamaan", ["duniawi", "modern", "bebas", "ilmiah"]),
    ("asli", "palsu", ["murni", "orisinil", "sejati", "tulen"]),
    ("luas", "sempit", ["lebar", "lapang", "longgar", "besar"]),
    ("tinggi", "rendah", ["jangkung", "atas", "puncak", "unggul"]),
    ("terang", "gelap", ["sinar", "cahaya", "putih", "jelas"]),
    ("cepat", "lambat", ["laju", "kencang", "pesat", "segera"]),
    ("panas", "dingin", ["hangat", "terik", "membara", "suhu"]),
    ("kasar", "halus", ["keras", "tajam", "kaku", "buruk"])
]


def gen_number_series():
    stype = random.randint(0, 5)
    
    if stype == 0: # Arithmetic
        diff = random.choice([-5, -3, -2, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15])
        while True:
            start = random.randint(1, 30) if diff > 0 else random.randint(35, 100)
            seq = [start + i * diff for i in range(7)]
            if all(x > 0 for x in seq):
                break
        ans = seq[-1]
        terms = seq[:-1]
        pattern_desc = "ditambah " + str(diff) if diff > 0 else "dikurangi " + str(abs(diff))
        exp = "Deret ini merupakan deret aritmatika dengan suku awal " + str(start) + " dan beda " + str(diff) + ". Pola deret: setiap suku berikutnya " + pattern_desc + " dari suku sebelumnya. Suku ke-7: " + str(seq[5]) + " + (" + str(diff) + ") = " + str(ans) + "."
        
    elif stype == 1: # Geometric
        start = random.choice([1, 2, 3, 5])
        ratio = random.choice([2, 3])
        seq = [start * (ratio ** i) for i in range(6)]
        ans = seq[-1]
        terms = seq[:-1]
        exp = "Deret ini adalah deret geometri dengan suku awal " + str(start) + " dan rasio perkalian " + str(ratio) + ". Pola deret: dikali " + str(ratio) + ". Suku ke-6: " + str(seq[4]) + " * " + str(ratio) + " = " + str(ans) + "."
        
    elif stype == 2: # Fibonacci
        a, b = random.randint(1, 5), random.randint(2, 6)
        seq = [a, b]
        for _ in range(5):
            seq.append(seq[-1] + seq[-2])
        ans = seq[-1]
        terms = seq[:-1]
        exp = "Deret ini mengikuti pola Fibonacci, di mana setiap suku setelah suku kedua merupakan penjumlahan dari dua suku sebelumnya. Pola: " + str(seq[4]) + " + " + str(seq[5]) + " = " + str(ans) + "."
        
    elif stype == 3: # Double difference
        start = random.randint(5, 20)
        d_start = random.randint(2, 5)
        d_step = random.choice([1, 2, 3])
        seq = [start]
        curr_d = d_start
        for _ in range(6):
            seq.append(seq[-1] + curr_d)
            curr_d += d_step
        ans = seq[-1]
        terms = seq[:-1]
        diffs = [seq[i+1]-seq[i] for i in range(len(seq)-1)]
        diffs_str = ", ".join(map(str, diffs[:-1]))
        exp = "Deret ini memiliki selisih antar suku yang terus bertambah secara teratur (bertingkat). Selisih antar suku berturut-turut adalah: " + diffs_str + ". Selisih berikutnya bertambah " + str(d_step) + " menjadi " + str(diffs[-1]) + ", sehingga suku selanjutnya adalah " + str(seq[-2]) + " + " + str(diffs[-1]) + " = " + str(ans) + "."
        
    elif stype == 4: # Alternating
        start1 = random.randint(2, 20)
        diff1 = random.choice([2, 3, 4, 5])
        start2 = random.randint(50, 100)
        diff2 = random.choice([-5, -4, -3, -2])
        
        seq = []
        for i in range(7):
            if i % 2 == 0:
                seq.append(start1 + (i//2) * diff1)
            else:
                seq.append(start2 + (i//2) * diff2)
        ans = seq[-1]
        terms = seq[:-1]
        exp = "Deret ini merupakan penggabungan dua deret yang berselang-seling. \n" + \
              "Deret ganjil (posisi 1, 3, 5): dimulai dari " + str(start1) + " dengan pola ditambah " + str(diff1) + ".\n" + \
              "Deret genap (posisi 2, 4, 6): dimulai dari " + str(start2) + " dengan pola ditambah " + str(diff2) + " (" + str(diff2) + ").\n" + \
              "Suku berikutnya berada di posisi ganjil (suku ke-7), sehingga didapat dari " + str(seq[4]) + " + " + str(diff1) + " = " + str(ans) + "."
              
    else: # Squares
        c = random.randint(0, 5)
        seq = [ (i**2) + c for i in range(1, 8) ]
        ans = seq[-1]
        terms = seq[:-1]
        exp = "Pola deret ini terbentuk dari kuadrat bilangan asli (1^2, 2^2, 3^2, ...) ditambah dengan konstanta " + str(c) + ". Suku ke-7: 7^2 + (" + str(c) + ") = 49 + (" + str(c) + ") = " + str(ans) + "."

    # Generate options
    options = [ans]
    while len(options) < 5:
        offset = random.randint(1, 20)
        val = ans + offset if random.choice([True, False]) else ans - offset
        if val > 0 and val != ans and val not in options:
            options.append(val)
    random.shuffle(options)
    a_idx = options.index(ans)
    
    q_str = "Tentukan suku berikutnya dari barisan angka berikut: " + ", ".join(map(str, terms)) + ", ..."
    return {
        "q": q_str,
        "o": [str(x) for x in options],
        "a": a_idx,
        "e": exp,
        "c": "Numerik (Deret Angka)"
    }


def gen_arithmetic():
    sub_type = random.randint(0, 4)
    if sub_type == 0: # Speed-Distance-Time
        names = ["Andi", "Budi", "Candra", "Dedi", "Eko"]
        cities = [("Jakarta", "Bandung"), ("Surabaya", "Malang"), ("Yogyakarta", "Solo"), ("Semarang", "Solo"), ("Medan", "Binjai")]
        name = random.choice(names)
        city1, city2 = random.choice(cities)
        
        speed = random.randint(50, 90) # km/h
        time = random.choice([2, 3, 4, 5]) # hours
        distance = speed * time
        
        q_str = name + " berkendara dari kota " + city1 + " ke kota " + city2 + " dengan kecepatan rata-rata " + str(speed) + " km/jam. Jika waktu perjalanan yang ditempuh adalah " + str(time) + " jam, berapakah jarak antara kedua kota tersebut?"
        ans = str(distance) + " km"
        
        options = [ans]
        while len(options) < 5:
            offset = random.randint(5, 45)
            dist_val = distance + offset if random.choice([True, False]) else distance - offset
            if dist_val > 0:
                val = str(dist_val) + " km"
                if val not in options:
                    options.append(val)
        random.shuffle(options)
        a_idx = options.index(ans)
        
        exp = "Jarak dihitung menggunakan rumus Jarak = Kecepatan x Waktu. Diketahui Kecepatan = " + str(speed) + " km/jam dan Waktu = " + str(time) + " jam. Jarak = " + str(speed) + " x " + str(time) + " = " + str(distance) + " km."
        
    elif sub_type == 1: # Work Rate
        names = [("Andi", "Budi"), ("Cici", "Dina"), ("Eko", "Fahri"), ("Gani", "Heri")]
        n1, n2 = random.choice(names)
        rates = [(6, 12, 4), (12, 24, 8), (10, 15, 6), (20, 30, 12), (8, 24, 6), (15, 30, 10)]
        r1, r2, joint = random.choice(rates)
        
        q_str = n1 + " dapat menyelesaikan suatu pekerjaan dalam waktu " + str(r1) + " hari, sedangkan " + n2 + " dapat menyelesaikannya dalam waktu " + str(r2) + " hari. Jika mereka bekerja bersama-sama, berapa hari yang dibutuhkan untuk menyelesaikan pekerjaan tersebut?"
        ans = str(joint) + " hari"
        
        options = [ans]
        while len(options) < 5:
            offset = random.randint(1, 5)
            joint_val = joint + offset if random.choice([True, False]) else joint - offset
            if joint_val > 0:
                val = str(joint_val) + " hari"
                if val not in options:
                    options.append(val)
        random.shuffle(options)
        a_idx = options.index(ans)
        
        exp = "Dalam 1 hari, " + n1 + " menyelesaikan 1/" + str(r1) + " bagian pekerjaan dan " + n2 + " menyelesaikan 1/" + str(r2) + " bagian. \n" + \
              "Jika bekerja bersama, bagian yang selesai per hari adalah: 1/" + str(r1) + " + 1/" + str(r2) + " = (" + str(r2) + " + " + str(r1) + ")/(" + str(r1) + "*" + str(r2) + ") = " + str(r1+r2) + "/" + str(r1*r2) + " = 1/" + str(joint) + ". \n" + \
              "Maka total waktu yang dibutuhkan adalah kebalikan dari bagian per hari, yaitu " + str(joint) + " hari."
              
    elif sub_type == 2: # Age
        age_options = [
            (15, 3, 5, 4, "ayah", "anak"),
            (10, 4, 4, 6, "ibu", "anak"),
            (12, 3, 6, 5, "paman", "keponakan"),
            (20, 2, 10, 3, "kakak", "adik"),
            (8, 5, 3, 7, "bibi", "keponakan")
        ]
        son_age, mult, y_years, past_mult, p1, p2 = random.choice(age_options)
        parent_age = son_age * mult
        
        q_str = "Umur " + p1 + " saat ini adalah " + str(mult) + " kali umur " + p2 + ". Jika " + str(y_years) + " tahun yang lalu umur " + p1 + " adalah " + str(past_mult) + " kali umur " + p2 + ", berapakah umur " + p2 + " sekarang?"
        ans = str(son_age) + " tahun"
        
        options = [ans]
        while len(options) < 5:
            offset = random.randint(1, 10)
            age_val = son_age + offset if random.choice([True, False]) else son_age - offset
            if age_val > 0:
                val = str(age_val) + " tahun"
                if val not in options:
                    options.append(val)
        random.shuffle(options)
        a_idx = options.index(ans)
        
        exp = "Misalkan umur " + p2 + " sekarang = S, maka umur " + p1 + " sekarang = " + str(mult) + "S. \n" + \
              "Persamaan " + str(y_years) + " tahun yang lalu: " + str(mult) + "S - " + str(y_years) + " = " + str(past_mult) + " * (S - " + str(y_years) + "). \n" + \
              "Lakukan distribusi: " + str(mult) + "S - " + str(y_years) + " = " + str(past_mult) + "S - " + str(past_mult * y_years) + ". \n" + \
              "Pindahkan variabel S ke satu ruas: " + str(past_mult * y_years - y_years) + " = (" + str(past_mult) + " - " + str(mult) + ")S. \n" + \
              "Sehingga S = " + str(son_age) + " tahun."
              
    elif sub_type == 3: # Profit / Loss
        items = ["laptop", "smartphone", "sepeda", "kamera", "televisi"]
        item = random.choice(items)
        buy_price = random.choice([1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000])
        profit_pct = random.choice([10, 15, 20, 25, 30])
        profit_val = int(buy_price * (profit_pct / 100))
        sell_price = buy_price + profit_val
        
        q_str = "Seorang pedagang membeli sebuah " + item + " dengan harga Rp " + format(buy_price, ",d") + ". Ia kemudian menjual kembali " + item + " tersebut dengan mengharapkan keuntungan sebesar " + str(profit_pct) + "%. Berapakah harga jual " + item + " tersebut?"
        ans = "Rp " + format(sell_price, ",d")
        
        options = [ans]
        while len(options) < 5:
            offset = random.choice([50000, 100000, 150000, 200000, 250000, 300000])
            sell_val = sell_price + offset if random.choice([True, False]) else sell_price - offset
            if sell_val > 0:
                val = "Rp " + format(sell_val, ",d")
                if val not in options:
                    options.append(val)
        random.shuffle(options)
        a_idx = options.index(ans)
        
        exp = "Besar keuntungan = " + str(profit_pct) + "% x Harga Beli = " + str(profit_pct) + "/100 x Rp " + format(buy_price, ",d") + " = Rp " + format(profit_val, ",d") + ". \n" + \
              "Harga Jual = Harga Beli + Keuntungan = Rp " + format(buy_price, ",d") + " + Rp " + format(profit_val, ",d") + " = Rp " + format(sell_price, ",d") + "."
              
    else: # Simple Algebra
        A = random.randint(10, 40)
        B = random.randint(2, 8)
        if (A % 2) != (B % 2):
            A += 1 # ensure same parity
            
        x = (A + B) // 2
        y = (A - B) // 2
        product = x * y
        
        q_str = "Diketahui dua buah bilangan x dan y memenuhi sistem persamaan: x + y = " + str(A) + " dan x - y = " + str(B) + ". Berapakah hasil kali dari kedua bilangan tersebut (x * y)?"
        ans = str(product)
        
        options = [ans]
        while len(options) < 5:
            offset = random.randint(1, 20)
            prod_val = product + offset if random.choice([True, False]) else product - offset
            if prod_val > 0:
                val = str(prod_val)
                if val not in options:
                    options.append(val)
        random.shuffle(options)
        a_idx = options.index(ans)
        
        exp = "Dari sistem persamaan linear dua variabel:\n" + \
              "1) x + y = " + str(A) + "\n" + \
              "2) x - y = " + str(B) + "\n" + \
              "Jika kedua persamaan dijumlahkan: 2x = " + str(A + B) + " => x = " + str(x) + ". \n" + \
              "Substitusi x = " + str(x) + " ke persamaan (1): " + str(x) + " + y = " + str(A) + " => y = " + str(y) + ". \n" + \
              "Maka hasil kali x * y = " + str(x) + " * " + str(y) + " = " + str(product) + "."

    return {
        "q": q_str,
        "o": options,
        "a": a_idx,
        "e": exp,
        "c": "Numerik (Aritmatika & Aljabar)"
    }


def gen_syllogism(q_num):
    a = random.choice(A_pool)
    b = random.choice(B_pool)
    c = random.choice(C_pool)
    
    stype = random.randint(0, 3)
    
    if stype == 0:
        premise1 = "Semua " + a + " adalah orang yang " + b + "."
        premise2 = "Semua orang yang " + b + " akan hidup " + c + "."
        correct = "Semua " + a + " akan hidup " + c + "."
        
        distractors = [
            "Sebagian " + a + " tidak akan hidup " + c + ".",
            "Semua orang yang hidup " + c + " adalah " + a + ".",
            "Sebagian " + a + " adalah orang yang tidak " + b + ".",
            "Tidak ada " + a + " yang hidup " + c + "."
        ]
        exp = "Berdasarkan silogisme kategoris tipe Barbara: Jika Semua A = B dan Semua B = C, maka dapat ditarik kesimpulan mutlak bahwa Semua A = C (Semua " + a + " akan hidup " + c + ")."
        
    elif stype == 1:
        premise1 = "Semua " + a + " adalah orang yang " + b + "."
        premise2 = "Sebagian " + a + " adalah orang yang " + c + "."
        correct = "Sebagian orang yang " + b + " adalah orang yang " + c + "."
        
        distractors = [
            "Semua orang yang " + b + " adalah orang yang " + c + ".",
            "Tidak ada orang yang " + b + " yang " + c + ".",
            "Semua " + a + " adalah orang yang " + c + ".",
            "Sebagian " + a + " bukan orang yang " + b + "."
        ]
        exp = "Karena semua " + a + " adalah " + b + ", dan sebagian dari " + a + " tersebut juga " + c + ", maka anggota " + a + " yang " + c + " tersebut otomatis juga merupakan orang yang " + b + ". Jadi, sebagian orang yang " + b + " adalah orang yang " + c + "."
        
    elif stype == 2:
        premise1 = "Semua " + a + " adalah orang yang " + b + "."
        premise2 = "Tidak ada orang yang " + b + " yang " + c + "."
        correct = "Tidak ada " + a + " yang " + c + "."
        
        distractors = [
            "Sebagian " + a + " adalah orang yang " + c + ".",
            "Semua " + a + " adalah orang yang " + c + ".",
            "Sebagian orang yang " + b + " adalah " + a + ".",
            "Beberapa " + a + " yang tidak " + b + " adalah " + c + "."
        ]
        exp = "Karena seluruh kelompok A termasuk dalam B, dan kelompok B sama sekali terpisah dari C, maka kelompok A juga pasti terpisah dari C. Kesimpulannya: Tidak ada " + a + " yang " + c + "."
        
    else:
        premise1 = "Semua orang yang " + b + " akan hidup " + c + "."
        premise2 = "Sebagian orang yang " + b + " adalah " + a + "."
        correct = "Sebagian " + a + " akan hidup " + c + "."
        
        distractors = [
            "Semua " + a + " akan hidup " + c + ".",
            "Tidak ada " + a + " yang akan hidup " + c + ".",
            "Sebagian orang yang " + b + " bukan " + a + ".",
            "Semua orang yang hidup " + c + " adalah " + a + "."
        ]
        exp = "Karena sebagian dari orang yang " + b + " adalah " + a + ", dan seluruh orang yang " + b + " pasti hidup " + c + ", maka sebagian " + a + " tersebut pasti hidup " + c + "."

    options = [correct] + distractors
    random.shuffle(options)
    a_idx = options.index(correct)
    
    q_str = "Tentukan kesimpulan yang paling tepat dari premis-premis berikut:\n1. " + premise1 + "\n2. " + premise2
    return {
        "q": q_str,
        "o": options,
        "a": a_idx,
        "e": exp,
        "c": "Logika (Silogisme)"
    }


def gen_analogy():
    base = random.choice(analogy_pool)
    w1, w2, c1, c2, rel = base
    
    correct_opt = c1 + " : " + c2
    
    distractors = []
    attempts = 0
    while len(distractors) < 4 and attempts < 100:
        attempts += 1
        cand = random.choice(analogy_pool)
        if cand[0] != w1 and cand[2] != c1:
            opt = cand[0] + " : " + cand[2]
            if opt not in distractors:
                distractors.append(opt)
                
    while len(distractors) < 4:
        distractors.append("pohon : rindang")
        
    options = [correct_opt] + distractors
    random.shuffle(options)
    a_idx = options.index(correct_opt)
    
    q_str = "Pilihlah pasangan kata yang memiliki hubungan analogi paling setara dengan:\n\n" + w1.upper() + " : " + w2.upper()
    exp = "Hubungan antara " + w1 + " dan " + w2 + " adalah hubungan '" + rel + "'. Hubungan yang paling setara adalah " + c1 + " dan " + c2 + ", karena memiliki pola hubungan yang sama."
    
    return {
        "q": q_str,
        "o": options,
        "a": a_idx,
        "e": exp,
        "c": "Verbal (Analogi)"
    }


def gen_synonym_antonym():
    is_syn = random.choice([True, False])
    if is_syn:
        item = random.choice(synonyms)
        word, answer, dists = item
        q_str = "Pilihlah kata yang merupakan SINONIM atau memiliki arti yang paling dekat dengan kata:\n\n" + word.upper()
        correct = answer
        options = [correct] + dists[:4]
        random.shuffle(options)
        a_idx = options.index(correct)
        exp = "Sinonim dari kata '" + word + "' adalah '" + answer + "'."
    else:
        item = random.choice(antonyms)
        word, answer, dists = item
        q_str = "Pilihlah kata yang merupakan ANTONIM atau lawan kata yang paling tepat dari kata:\n\n" + word.upper()
        correct = answer
        options = [correct] + dists[:4]
        random.shuffle(options)
        a_idx = options.index(correct)
        exp = "Antonim (lawan kata) dari kata '" + word + "' adalah '" + answer + "'."

    return {
        "q": q_str,
        "o": options,
        "a": a_idx,
        "e": exp,
        "c": "Verbal (Kosakata)"
    }


def main():
    output_dir = "scratch"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    json_path = os.path.join(output_dir, "tkd_1000_questions.json")
    
    if os.path.exists(json_path):
        print("Membaca data soal yang sudah ada dari " + json_path + "...")
        with codecs.open(json_path, 'r', 'utf-8') as f:
            questions = json.load(f)
        json_data = json.dumps(questions, ensure_ascii=False, indent=2)
    else:
        print("Mulai pembuatan soal secara prosedural...")
        questions = []
        
        # 1. 300 Number Series
        print("Membuat 300 soal Deret Angka...")
        for i in range(300):
            questions.append(gen_number_series())
        print("Selesai membuat Deret Angka.")
            
        # 2. 300 Arithmetic/Algebra
        print("Membuat 300 soal Aritmatika & Aljabar...")
        for i in range(300):
            questions.append(gen_arithmetic())
        print("Selesai membuat Aritmatika & Aljabar.")
            
        # 3. 200 Syllogisms
        print("Membuat 200 soal Silogisme...")
        for i in range(200):
            questions.append(gen_syllogism(i))
        print("Selesai membuat Silogisme.")
            
        # 4. 200 Analogy & Syn/Ant
        print("Membuat 100 soal Analogi...")
        for i in range(100):
            questions.append(gen_analogy())
        print("Membuat 100 soal Kosakata...")
        for i in range(100):
            questions.append(gen_synonym_antonym())
        print("Selesai membuat Verbal/Analogi.")
            
        # Shuffle all questions to make a realistic mixed test
        random.shuffle(questions)
        
        # Re-apply serial numbering in questions
        for idx, q in enumerate(questions):
            q["id"] = idx + 1
            
        with open(json_path, 'wb') as f:
            json_data = json.dumps(questions, ensure_ascii=False, indent=2)
            if isinstance(json_data, unicode):
                json_data = json_data.encode('utf-8')
            f.write(json_data)
            
        print("Generated " + str(len(questions)) + " questions in " + json_path)
    
    # Now generate the HTML App
    html_content = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TKD 1000 - Tes Kemampuan Dasar Interaktif</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0f19;
            --surface-color: #161d31;
            --surface-hover: #222e4e;
            --text-color: #f1f5f9;
            --text-muted: #94a3b8;
            --primary-color: #3b82f6;
            --primary-hover: #2563eb;
            --border-color: #334155;
            --success-color: #10b981;
            --error-color: #ef4444;
            --warning-color: #f59e0b;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            width: 100%;
            max-width: 900px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid var(--border-color);
        }

        h1 {
            margin: 0;
            font-size: 2.2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p.subtitle {
            color: var(--text-muted);
            margin: 8px 0 0 0;
            font-size: 1rem;
        }

        .filter-bar {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
            margin: 10px 0;
        }

        .filter-btn {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .filter-btn.active, .filter-btn:hover {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
        }

        .quiz-card {
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            display: flex;
            flex-direction: column;
            min-height: 380px;
        }

        .quiz-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            font-size: 0.85rem;
            font-weight: bold;
        }

        .category-badge {
            background: rgba(59, 130, 246, 0.15);
            color: #93c5fd;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .progress-text {
            color: var(--text-muted);
        }

        .question-text {
            font-size: 1.25rem;
            font-weight: 700;
            line-height: 1.5;
            margin: 0 0 25px 0;
            white-space: pre-wrap;
        }

        .options-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 25px;
        }

        .option-btn {
            width: 100%;
            text-align: left;
            padding: 15px 20px;
            border-radius: 12px;
            font-family: inherit;
            font-size: 0.95rem;
            font-weight: 600;
            background: var(--bg-color);
            color: var(--text-color);
            border: 2px solid var(--border-color);
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .option-btn:hover:not(:disabled) {
            background: var(--surface-hover);
            border-color: var(--primary-color);
        }

        .option-badge {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--surface-hover);
            color: var(--text-muted);
            border: 2px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
            flex-shrink: 0;
        }

        .option-btn.correct {
            background: rgba(16, 185, 129, 0.08);
            color: #a7f3d0;
            border-color: var(--success-color);
        }
        .option-btn.correct .option-badge {
            background: var(--success-color);
            color: white;
            border-color: var(--success-color);
        }

        .option-btn.incorrect {
            background: rgba(239, 68, 68, 0.08);
            color: #fca5a5;
            border-color: var(--error-color);
        }
        .option-btn.incorrect .option-badge {
            background: var(--error-color);
            color: white;
            border-color: var(--error-color);
        }

        .explanation-panel {
            background: rgba(245, 158, 11, 0.04);
            border: 1px solid rgba(245, 158, 11, 0.25);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            animation: fadeIn 0.3s ease;
        }

        .explanation-title {
            font-weight: 800;
            color: var(--warning-color);
            margin-bottom: 8px;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .explanation-text {
            margin: 0;
            font-size: 0.9rem;
            line-height: 1.5;
            white-space: pre-wrap;
        }

        .nav-controls {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
            gap: 15px;
        }

        .btn {
            padding: 12px 24px;
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 700;
            border-radius: 10px;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--primary-color);
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            background: var(--primary-hover);
        }

        .btn-secondary {
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover:not(:disabled) {
            background: var(--surface-hover);
        }

        .btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .jump-box {
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: center;
            margin-top: 10px;
        }

        .jump-input {
            width: 70px;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            background: var(--bg-color);
            color: var(--text-color);
            text-align: center;
            font-family: inherit;
            font-weight: bold;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
            body { padding: 10px; }
            .quiz-card { padding: 15px; }
            h1 { font-size: 1.7rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>⚡ TKD 1000 - Practice</h1>
            <p class="subtitle">Bank Soal Tes Kemampuan Dasar (TKD) - 1.000 Soal Interaktif</p>
        </header>

        <div class="filter-bar">
            <button class="filter-btn active" onclick="setCategory('ALL')">Semua Soal</button>
            <button class="filter-btn" onclick="setCategory('Numerik (Deret Angka)')">Deret Angka</button>
            <button class="filter-btn" onclick="setCategory('Numerik (Aritmatika & Aljabar)')">Aritmatika/Aljabar</button>
            <button class="filter-btn" onclick="setCategory('Logika (Silogisme)')">Silogisme</button>
            <button class="filter-btn" onclick="setCategory('Verbal (Analogi)')">Analogi</button>
            <button class="filter-btn" onclick="setCategory('Verbal (Kosakata)')">Kosakata (Sinonim/Antonim)</button>
        </div>

        <div class="quiz-card">
            <div class="quiz-meta">
                <span id="category-badge" class="category-badge">Kategori</span>
                <span id="progress-text" class="progress-text">Soal 0 / 0</span>
            </div>

            <div id="question-area">
                <p id="question-text" class="question-text">Loading...</p>
                <div id="options-list" class="options-list"></div>
            </div>

            <div id="explanation-panel" class="explanation-panel" style="display: none;">
                <div class="explanation-title">💡 Pembahasan:</div>
                <p id="explanation-text" class="explanation-text"></p>
            </div>

            <div class="nav-controls">
                <button class="btn btn-secondary" id="prev-btn" onclick="prevQuestion()">← Sebelumnya</button>
                <div class="jump-box">
                    <span>Lompat ke No:</span>
                    <input type="number" id="jump-input" class="jump-input" min="1" onchange="jumpToQuestion()">
                </div>
                <button class="btn btn-primary" id="next-btn" onclick="nextQuestion()">Selanjutnya →</button>
            </div>
        </div>
    </div>

    <script>
        let allQuestions = {QUESTIONS_JSON};
        let filteredQuestions = [];
        let currentIndex = 0;
        let selectedAnswers = {}; // Map of question index -> selected option index
        let currentCategory = 'ALL';

        // Initialize directly
        applyFilter();

        function applyFilter() {
            if (currentCategory === 'ALL') {
                filteredQuestions = allQuestions;
            } else {
                filteredQuestions = allQuestions.filter(q => q.c === currentCategory);
            }
            currentIndex = 0;
            selectedAnswers = {};
            updateUI();
        }

        function setCategory(cat) {
            currentCategory = cat;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.innerText === cat || 
                    (cat === 'ALL' && btn.innerText === 'Semua Soal') ||
                    (cat.includes('Aritmatika') && btn.innerText === 'Aritmatika/Aljabar') ||
                    (cat.includes('Silogisme') && btn.innerText === 'Silogisme') ||
                    (cat.includes('Analogi') && btn.innerText === 'Analogi') ||
                    (cat.includes('Kosakata') && btn.innerText === 'Kosakata (Sinonim/Antonim)') ||
                    (cat.includes('Deret') && btn.innerText === 'Deret Angka')) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            applyFilter();
        }

        function updateUI() {
            if (filteredQuestions.length === 0) return;
            
            const q = filteredQuestions[currentIndex];
            
            // Meta info
            document.getElementById('category-badge').innerText = q.c;
            document.getElementById('progress-text').innerText = `Soal ${currentIndex + 1} / ${filteredQuestions.length}`;
            document.getElementById('jump-input').value = currentIndex + 1;
            document.getElementById('jump-input').max = filteredQuestions.length;

            // Question
            document.getElementById('question-text').innerText = `No. ${q.id}: \\n${q.q}`;

            // Options
            const optionsList = document.getElementById('options-list');
            optionsList.innerHTML = '';
            
            const userChoice = selectedAnswers[currentIndex];
            const hasAnswered = userChoice !== undefined;

            q.o.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.disabled = hasAnswered;
                btn.onclick = () => selectOption(idx);

                const badge = document.createElement('div');
                badge.className = 'option-badge';
                badge.innerText = String.fromCharCode(65 + idx);
                btn.appendChild(badge);

                const textSpan = document.createElement('span');
                textSpan.innerText = opt;
                btn.appendChild(textSpan);

                if (hasAnswered) {
                    if (idx === q.a) {
                        btn.classList.add('correct');
                    } else if (idx === userChoice) {
                        btn.classList.add('incorrect');
                    } else {
                        btn.style.opacity = '0.5';
                    }
                }

                optionsList.appendChild(btn);
            });

            // Explanation
            const expPanel = document.getElementById('explanation-panel');
            if (hasAnswered) {
                document.getElementById('explanation-text').innerText = q.e;
                expPanel.style.display = 'block';
            } else {
                expPanel.style.display = 'none';
            }

            // Prev / Next buttons
            document.getElementById('prev-btn').disabled = currentIndex === 0;
            document.getElementById('next-btn').innerText = currentIndex === filteredQuestions.length - 1 ? 'Selesai' : 'Selanjutnya →';
        }

        function nextQuestion() {
            if (currentIndex < filteredQuestions.length - 1) {
                currentIndex++;
                updateUI();
            } else {
                alert("Anda telah menyelesaikan semua soal di kategori ini!");
            }
        }

        function prevQuestion() {
            if (currentIndex > 0) {
                currentIndex--;
                updateUI();
            }
        }

        function jumpToQuestion() {
            const input = document.getElementById('jump-input');
            let num = parseInt(input.value) - 1;
            if (isNaN(num) || num < 0) num = 0;
            if (num >= filteredQuestions.length) num = filteredQuestions.length - 1;
            currentIndex = num;
            updateUI();
        }
    </script>
</body>
</html>
"""

    html_content = html_content.replace("{QUESTIONS_JSON}", json_data.decode('utf-8') if isinstance(json_data, bytes) else json_data)

    html_path = os.path.join(output_dir, "tkd_practice.html")
    with open(html_path, 'wb') as f:
        if isinstance(html_content, unicode):
            html_content = html_content.encode('utf-8')
        f.write(html_content)
        
    print("Generated practice page in " + html_path)

if __name__ == "__main__":
    main()
