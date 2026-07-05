const fs = require('fs');
let code = fs.readFileSync('server/controllers/bookingController.ts', 'utf-8');

code = code.replace(
  `const { securityDeposit, ...priceDetailsForDb } = calculateBookingPrice(vehicle, startDate, endDate, extras || {});`,
  `const priceDetailsForDb = calculateBookingPrice(vehicle, startDate, endDate, extras || {});`
);

fs.writeFileSync('server/controllers/bookingController.ts', code);
