const https = require('https');
const fs = require('fs');
const path = require('path');

const terms = [
    { name: 'real_circulating.jpg', search: 'mud pump oil' },
    { name: 'real_bop.jpg', search: 'blowout preventer' },
    { name: 'real_mast.jpg', search: 'oil derrick' },
    { name: 'real_hoisting.jpg', search: 'traveling block oil' },
    { name: 'real_genset.jpg', search: 'industrial diesel generator' },
    { name: 'real_apar.jpg', search: 'fire extinguisher' },
    { name: 'real_handtools.jpg', search: 'pipe wrench' }
];

const dest = path.join(__dirname, 'img', 'hse-rig');
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return downloadImage(response.headers.location, destPath).then(resolve).catch(reject);
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(file, () => {});
            reject(err);
        });
    });
}

async function fetchCommonsUrl(query) {
    return new Promise((resolve, reject) => {
        const q = encodeURIComponent(query);
        const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&gsrlimit=1`;
        https.get(apiUrl, { headers: { 'User-Agent': 'JurnalAI-Bot/1.0 (someone@example.com)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (!json.query || !json.query.pages) return resolve(null);
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    const info = pages[pageId]?.imageinfo?.[0];
                    if (info && info.thumburl) {
                        resolve(info.thumburl);
                    } else if (info && info.url) {
                        resolve(info.url);
                    } else {
                        resolve(null);
                    }
                } catch(e) { reject(e); }
            });
        }).on('error', reject);
    });
}

(async () => {
    for (const term of terms) {
        console.log(`Searching for ${term.search}...`);
        const url = await fetchCommonsUrl(term.search);
        if (url) {
            console.log(`Found: ${url}`);
            const destPath = path.join(dest, term.name);
            try {
                await downloadImage(url, destPath);
                console.log(`Saved ${term.name}`);
            } catch(e) {
                console.error(`Error downloading ${term.name}: ${e.message}`);
            }
        } else {
            console.log(`No image found for ${term.search}`);
        }
        await sleep(2000); // 2 seconds delay
    }
})();
