const webpush = require('web-push');

// Fungsi Vercel Serverless (Otomatis dipanggil melalui URL /api/cron)
export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // 1. Ambil Variabel Lingkungan dari Dashboard Vercel
    const SUPABASE_URL = process.env.SUPABASE_URL_DEFAULT || 'https://oybywsjhgkilpceisxzn.supabase.co';
    const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY; 
    const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
    
    // Kunci Publik Sesuai Frontend
    const VAPID_PUBLIC_KEY = 'BJ8G4SmhAxKyCDjBv7Qav4npvqhdp2QW48vR_yoMbv2YYW9k9qJnh3wrtMRdTG3A9Ux9ewB4Gv8AiIOj_YVwpWc';

    // Jika environment variable belum diatur, hentikan.
    if (!VAPID_PRIVATE_KEY || !SUPABASE_KEY) {
        console.error("Missing Environment Variables on Vercel!");
        return res.status(500).json({ 
            error: 'Push Server Error: VAPID_PRIVATE_KEY atau SUPABASE_ANON_KEY belum terhubung di Pengaturan Vercel.' 
        });
    }

    // Konfigurasi Web Push
    webpush.setVapidDetails(
        'mailto:admin@jurnal-ai.com',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );

    try {
        // 2. Baca seluruh Pengguna & Langganannya dari tabel 'user_data'
        const response = await fetch(`${SUPABASE_URL}/rest/v1/user_data?select=user_id,data`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Supabase Fetch Error: ${response.statusText}`);
        }

        const users = await response.json();
        const promises = [];
        let notifCount = 0;

        // Waktu server Vercel (UTC)
        const vNow = new Date();
        const currentUtcStr = vNow.toISOString(); // "2026-04-09T08:30:00.000Z"

        // 3. Proses setiap langganan pengguna
        users.forEach(userRow => {
            const data = userRow.data || {};
            const subStr = data.pushSubscription || null;
            if (!subStr) return; // Pengguna ini tidak menyalakan Cloud Push

            let subscription;
            try {
                subscription = JSON.parse(subStr);
            } catch (e) {
                return;
            }

            // --- Logika Penjadwalan Sederhana (Test Ping / Sync Trigger) ---
            // Saat ini kita eksekusi Push secara langsung jika Vercel mendeteksi 'Test Mode'
            // atau jika ada log antrian di awan. Untuk versi MVP, setiap kali Vercel cron
            // dipanggil via /api/cron?test=true, semua pengguna akan diping!
            
            const isTestMode = req.query.test === 'true';
            
            if (isTestMode) {
                const payload = JSON.stringify({
                    title: '☁️ Vercel Cloud Serverless',
                    body: `Server Push Jurnal AI beroperasi sempuran menembus aplikasi Anda yang sedang tertidur!`,
                    tag: 'cloud-test'
                });

                promises.push(
                    webpush.sendNotification(subscription, payload)
                        .then(() => {
                            console.log(`✅ Tembakan berhasil ke user: ${userRow.user_id}`);
                            notifCount++;
                        })
                        .catch(err => console.error(`❌ Gagal ke user ${userRow.user_id}:`, err.statusCode))
                );
            } else {
                // Di masa depan: Tambahkan logika if currentUtcStr == user.ScheduleUTC di sini
            }
        });

        await Promise.all(promises);

        return res.status(200).json({ 
            status: 'success', 
            message: `Cloud Trigger Finished. Pushed ${notifCount} notifications.`,
            serverTimeUTC: currentUtcStr
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
}
