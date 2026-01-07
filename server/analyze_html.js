const fs = require('fs');

const html = fs.readFileSync('sora_page.html', 'utf8');
const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
let match;
let count = 0;

while ((match = regex.exec(html)) !== null) {
    count++;
    const fullTag = match[0];
    const content = match[1];

    // Check if it contains video URL
    if (count === 22) {
        console.log(`--- SCRIPT ${count} DUMP ---`);
        fs.writeFileSync('sora_script_dump.txt', content);
        console.log('Saved sora_script_dump.txt');
    }
}
