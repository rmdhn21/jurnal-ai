const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const VAPID_KEYS_FILE = path.join(__dirname, 'vapid-keys.json');
const SUBS_FILE = path.join(__dirname, 'subscriptions.json');

// Initialize or Load VAPID Keys
let vapidKeys;
if (fs.existsSync(VAPID_KEYS_FILE)) {
    vapidKeys = JSON.parse(fs.readFileSync(VAPID_KEYS_FILE, 'utf-8'));
    console.log('✅ Loaded existing VAPID keys.');
} else {
    vapidKeys = webpush.generateVAPIDKeys();
    fs.writeFileSync(VAPID_KEYS_FILE, JSON.stringify(vapidKeys, null, 2));
    console.log('✅ Generated new VAPID keys.');
}

// Ensure Web Push is configured
webpush.setVapidDetails(
    'mailto:m.iksan.alfaresta@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

console.log('--------------------------------------------------');
console.log('PUBLIC VAPID KEY (Copy this to your frontend JS):');
console.log(vapidKeys.publicKey);
console.log('--------------------------------------------------');

// Load or Initialize Subscriptions Database
let subscriptions = [];
if (fs.existsSync(SUBS_FILE)) {
    subscriptions = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf-8'));
    console.log(`✅ Loaded ${subscriptions.length} Web Push subscriptions.`);
}

const saveSubscriptions = () => {
    fs.writeFileSync(SUBS_FILE, JSON.stringify(subscriptions, null, 2));
};

// --- API ROUTES ---

// Route for Frontend to get the Public Key dynamically
app.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
});

// Route for Frontend to subscribe
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    
    // Check if exactly same subscription already exists
    const exists = subscriptions.some(sub => sub.endpoint === subscription.endpoint);
    if (!exists) {
        subscriptions.push(subscription);
        saveSubscriptions();
        console.log('✅ New Web Push Subscription Saved!');
    } else {
        console.log('⚡ Subscription already exists, skipping.');
    }

    res.status(201).json({ status: 'subscribed' });
});

// Route to manually test striking a notification to all devices
app.post('/test-push', (req, res) => {
    console.log('🚀 Triggering test push notification...');
    
    const payload = JSON.stringify({
        title: '☁️ Cloud Engine Aktif!',
        body: 'Server Push Jurnal AI berhasil membangunkan HP Anda dari tidur Pulas!',
        tag: 'cloud-test'
    });

    const promises = subscriptions.map(sub => {
        return webpush.sendNotification(sub, payload)
            .then(() => console.log('✅ Push sent successfully.'))
            .catch(err => {
                console.error('❌ Push error (Subscription might be revoked):', err.statusCode);
                // Clean up dead subscriptions
                if (err.statusCode === 410 || err.statusCode === 404) {
                    subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
                    saveSubscriptions();
                }
            });
    });

    Promise.all(promises).then(() => {
        res.json({ status: 'Push triggered to all devices.' });
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Jurnal AI Push Server is running on http://localhost:${PORT}`);
    console.log(`   (Pastikan iPhone dan PC berada di jaring WiFi yang sama jika menggunakan IP Local)`);
});
