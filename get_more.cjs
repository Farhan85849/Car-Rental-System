const https = require('https');
async function searchWikimedia(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=0&gsrlimit=1&pithumbsize=1000`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'CoolBot/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(Object.values(json.query.pages)[0].thumbnail.source);
        } catch(e) { resolve(null); }
      });
    });
  });
}
async function run() {
  const items = ['Honda City GN', 'Toyota Hilux AN120', 'Audi A8 D5', 'Porsche Panamera 971', 'Faisalabad Clock Tower', 'Badshahi Mosque', 'Clifton Beach Karachi', 'Islamabad Cityscape', 'Murree Hills', 'Fairy Meadows', 'Skardu'];
  for (const item of items) {
    console.log(item, await searchWikimedia(item));
  }
}
run();
