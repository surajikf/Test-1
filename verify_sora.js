// Native fetch in Node 18+

async function test() {
    const url = 'http://localhost:3000/analyze';
    const body = {
        url: 'https://sora.chatgpt.com/p/s_695b982f027881918e0ef1cb7c145806?psh=HXVzZXItMzBtTVFGTjlSTGIwMDZTUTBDRmJZemRj.rrm9-7jb37yC'
    };

    try {
        console.log('Sending request to:', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
