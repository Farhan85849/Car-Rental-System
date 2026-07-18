const fs = require('fs');
let code = fs.readFileSync('client/src/features/admin/pages/AdminInspections.tsx', 'utf8');

code = code.replace(
  /const payload = { bookingId, odometer: Number\(odometer\), fuelLevel: 'Full' };/,
  `const payload: any = { bookingId, odometer: Number(odometer), fuelLevel: 'Full' };`
);
fs.writeFileSync('client/src/features/admin/pages/AdminInspections.tsx', code);
