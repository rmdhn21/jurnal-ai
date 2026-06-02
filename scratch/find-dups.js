const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const idRegex = /id=["']([^"']+)["']/g;
const ids = {};
let match;

while ((match = idRegex.exec(html)) !== null) {
    const id = match[1];
    ids[id] = (ids[id] || 0) + 1;
}

const duplicates = Object.entries(ids)
    .filter(([id, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));

console.log('Duplicate IDs found in index.html:');
console.log(JSON.stringify(duplicates, null, 2));
