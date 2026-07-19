const https = require('https');

async function searchDuckDuckGo(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/pexels\.com\/photo\/[a-zA-Z0-9-]*?(\d+)\//g);
        if (matches && matches.length > 0) {
          resolve(matches[0].match(/(\d+)/)[0]);
        } else {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const cars = ['Mercedes S-Class', 'Lamborghini Urus', 'Range Rover', 'Toyota Corolla', 'Honda Civic', 'Kia Sportage', 'Toyota Fortuner', 'Suzuki Alto', 'Honda City', 'Suzuki Cultus', 'Toyota Hilux'];
  
  for (const car of cars) {
    const id = await searchDuckDuckGo(`site:pexels.com/photo/ "${car}"`);
    console.log(`${car}: ${id}`);
    await new Promise(r => setTimeout(r, 2000));
  }
}
run();
