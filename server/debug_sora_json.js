const puppeteer = require('puppeteer');
const fs = require('fs');

async function debugSora() {
    const url = 'https://sora.chatgpt.com/p/s_695b982f027881918e0ef1cb7c145806?psh=HXVzZXItMzBtTVFGTjlSTGliwMDZTUTBDRmJZemRj.rrm9-7jb37yC';
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--ignore-certificate-errors'
        ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9'
    });

    console.log('Navigating...');
    await page.goto(url, { waitUntil: 'networkidle2' });

    console.log('Extracting HTML...');
    const data = await page.evaluate(() => {
        const video = document.querySelector('video');
        const videoSrc = video ? video.src : 'No video tag found';
        return {
            html: document.documentElement.outerHTML,
            videoSrc: videoSrc
        };
    });

    console.log('Video Src:', data.videoSrc);
    fs.writeFileSync('sora_page.html', data.html);
    console.log('Saved sora_page.html');

    await browser.close();
}

debugSora();
