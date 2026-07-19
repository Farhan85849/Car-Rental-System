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
  const cars = [
    { brand: 'Mercedes-Benz', model: 'S-Class' },
    { brand: 'Lamborghini', model: 'Urus' },
    { brand: 'Land Rover', model: 'Range Rover' },
    { brand: 'Toyota', model: 'Corolla Altis' },
    { brand: 'Honda', model: 'Civic' },
    { brand: 'Kia', model: 'Sportage' },
    { brand: 'Toyota', model: 'Fortuner' },
    { brand: 'Suzuki', model: 'Alto' },
    { brand: 'Honda', model: 'City' },
    { brand: 'Suzuki', model: 'Cultus' },
    { brand: 'Toyota', model: 'Hilux Revo' }
  ];

  for (const car of cars) {
    const q = `${car.brand} ${car.model} car front`;
    const img = await searchWikimedia(q);
    console.log(`${car.brand} ${car.model}: ${img}`);
  }
}

run();
