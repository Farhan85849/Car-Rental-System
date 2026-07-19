const fs = require('fs');

const carImages = {
  'Mercedes-Benz S-Class': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mercedes-Benz_W223_IMG_3951.jpg/1280px-Mercedes-Benz_W223_IMG_3951.jpg',
  'Lamborghini Urus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Lamborghini_Urus_SE_DSC_8524.jpg/1280px-Lamborghini_Urus_SE_DSC_8524.jpg',
  'Range Rover Autobiography': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2022_Land_Rover_Range_Rover_SE_P440e_AWD_Automatic_3.0_Front.jpg/1280px-2022_Land_Rover_Range_Rover_SE_P440e_AWD_Automatic_3.0_Front.jpg',
  'Corolla Altis Grande': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/1280px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg',
  'Civic Oriel': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2022_Honda_Civic_Touring_in_Lunar_Silver_Metallic%2C_Front_Left%2C_05-10-2022.jpg/1280px-2022_Honda_Civic_Touring_in_Lunar_Silver_Metallic%2C_Front_Left%2C_05-10-2022.jpg',
  'Sportage FWD': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Kia_Sportage_S_front_only.jpg/1280px-2025_Kia_Sportage_S_front_only.jpg',
  'Fortuner Sigma 4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/1280px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg',
  'Alto VXL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/1994-1997_Suzuki_Alto.jpg/1280px-1994-1997_Suzuki_Alto.jpg',
  'City Aspire': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg/1280px-2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg',
  'Cultus VXL': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/2017_Suzuki_Celerio_SZ4_Automatic_1.0_Front.jpg/1280px-2017_Suzuki_Celerio_SZ4_Automatic_1.0_Front.jpg',
  'Hilux Revo Rocco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/1280px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg'
};

let seed = fs.readFileSync('server/src/db/seed.ts', 'utf8');

for (const [modelKey, url] of Object.entries(carImages)) {
  // Regex to match from `model: 'modelKey'` down to `images: JSON.stringify([\n      'url1',\n      'url2'\n    ])`
  const regex = new RegExp(`(model:\\s*'${modelKey}'[\\s\\S]*?images:\\s*JSON\\.stringify\\(\\[)\\s*'[^']*'\\s*,\\s*'[^']*'\\s*(\\]\\))`, 'g');
  seed = seed.replace(regex, `$1'${url}'$2`);
}

fs.writeFileSync('server/src/db/seed.ts', seed);
console.log('Fixed seed.ts');
