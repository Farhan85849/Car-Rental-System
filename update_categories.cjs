const fs = require('fs');
let code = fs.readFileSync('src/pages/Vehicles.tsx', 'utf-8');

code = code.replace(
  `{['ALL', 'ECONOMY', 'COMPACT', 'SEDAN', 'SUV', 'MPV', 'LUXURY', 'VIP'].map((cat) => (`,
  `{['ALL', 'SEDAN', 'SUV', 'LUXURY', 'VIP'].map((cat) => (`
);

fs.writeFileSync('src/pages/Vehicles.tsx', code);
