const fs = require('fs');

const carImages = {
  'S-Class': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mercedes-Benz_W223_IMG_3951.jpg/1280px-Mercedes-Benz_W223_IMG_3951.jpg',
  'Urus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Lamborghini_Urus_SE_DSC_8524.jpg/1280px-Lamborghini_Urus_SE_DSC_8524.jpg',
};

let seed = fs.readFileSync('server/src/db/seed.ts', 'utf8');

for (const [modelKey, url] of Object.entries(carImages)) {
  const regex = new RegExp(`(model:\\s*'${modelKey}'[\\s\\S]*?images:\\s*JSON\\.stringify\\(\\[)\\s*'[^']*'\\s*,\\s*'[^']*'\\s*(\\]\\))`, 'g');
  seed = seed.replace(regex, `$1'${url}'$2`);
}

fs.writeFileSync('server/src/db/seed.ts', seed);
console.log('Fixed seed.ts');
