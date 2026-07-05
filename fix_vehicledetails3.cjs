const fs = require('fs');
let code = fs.readFileSync('src/pages/VehicleDetails.tsx', 'utf-8');
code = code.replace(/export default VehicleDetails;/g, '');
fs.writeFileSync('src/pages/VehicleDetails.tsx', code);
