const fs = require('fs');
let code = fs.readFileSync('src/pages/VehicleDetails.tsx', 'utf-8');
const search = 'export default VehicleDetails;';
const parts = code.split(search);
code = parts[0] + search;
fs.writeFileSync('src/pages/VehicleDetails.tsx', code);
