const fs = require('fs');

const pexelsCars = [
  '120049', '170811', '2127733', '1149137', '112460', '707046', '116675', '1035108',
  '3729464', '3752194', '3764984', '919073', '1402787', '909907', '100656', '358070',
  '3311574', '3802510', '120049', '170811', '2127733', '1149137', '112460', '707046'
];

let seed = fs.readFileSync('server/src/db/seed.ts', 'utf8');
let matchCount = 0;
seed = seed.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^'"]*/g, () => {
  const id = pexelsCars[matchCount++];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`;
});

fs.writeFileSync('server/src/db/seed.ts', seed);
console.log('Replaced ' + matchCount + ' images in seed.ts');
