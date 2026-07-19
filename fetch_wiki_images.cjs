const https = require('https');
const fs = require('fs');

async function searchWikimedia(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=0&gsrlimit=1&pithumbsize=1000`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'CoolBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (pages) {
            const firstPage = Object.values(pages)[0];
            if (firstPage.thumbnail?.source) {
              resolve(firstPage.thumbnail.source);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const items = [
    'Mercedes-Benz S-Class W223',
    'Lamborghini Urus',
    'Range Rover L460',
    'Toyota Corolla E210',
    'Honda Civic eleventh generation',
    'Kia Sportage NQ5',
    'Toyota Fortuner AN150',
    'Suzuki Alto eighth generation',
    'Honda City seventh generation',
    'Suzuki Celerio second generation',
    'Toyota Hilux AN120',
    'Lahore Fort',
    'Karachi skyline',
    'Faisal Mosque Islamabad',
    'Luxury hotel lobby',
    'Car showroom interior',
    'Professional chauffeur',
    'Wedding car decoration'
  ];

  for (const item of items) {
    const img = await searchWikimedia(item);
    console.log(`${item} | ${img}`);
  }
}
run();
