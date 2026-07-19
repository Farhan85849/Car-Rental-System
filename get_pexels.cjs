const https = require('https');

async function searchDuckDuckGo(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Look for pexels-photo-<ID>.jpeg or photos/<ID>/
        const matches = data.match(/pexels\.com\/photo\/[^\/"]+-(\d+)\/?/);
        if (matches && matches[1]) {
          resolve(matches[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const queries = [
    'Lahore Badshahi Mosque',
    'Karachi Skyline',
    'Faisal Mosque Islamabad',
    'Rawalpindi City',
    'Luxury Airport Transfer',
    'Professional Chauffeur',
    'Wedding Car Decoration',
    'Customer Car Keys',
    'Vehicle Inspection Mechanic'
  ];
  
  for (const q of queries) {
    const id = await searchDuckDuckGo(`site:pexels.com/photo "${q}"`);
    console.log(`${q} | ${id}`);
    await new Promise(r => setTimeout(r, 1000));
  }
}
run();
