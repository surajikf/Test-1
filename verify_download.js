// Native fetch
const fs = require('fs');

async function testDownload() {
    const url = 'http://localhost:3000/download';
    console.log('Testing download with watermark removal...');

    // Using the previously extracted Sora URL (or any working video URL)
    // Note: If authentication or ephemeral links are expired, this might fail, so usually we need to analyze first to get a fresh link.
    // For this test, I will first analyze, then download.

    try {
        // 1. Analyze
        const analyzeRes = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://sora.chatgpt.com/p/s_695b982f027881918e0ef1cb7c145806' })
        });
        const meta = await analyzeRes.json();
        console.log('Analyzed:', meta.title);

        if (!meta.original_url) throw new Error('No url found');

        // 2. Download
        const downloadRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: meta.original_url,
                removeWatermark: true
            })
        });

        if (!downloadRes.ok) {
            console.error('Download headers:', downloadRes.headers);
            throw new Error(`Download failed: ${downloadRes.status}`);
        }

        const fileStream = fs.createWriteStream('test_clean.mp4');
        const stream = downloadRes.body;

        // Handle stream correctly for node-fetch vs native fetch
        if (stream.pipe) {
            stream.pipe(fileStream);
        } else {
            // Native fetch (Node 18+)
            const reader = stream.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fileStream.write(Buffer.from(value));
            }
            fileStream.end();
        }

        console.log('Download started... check test_clean.mp4');

    } catch (e) {
        console.error(e);
    }
}

testDownload();
