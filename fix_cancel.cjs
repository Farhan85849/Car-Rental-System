const fs = require('fs');
let code = fs.readFileSync('src/pages/MyBookings.tsx', 'utf-8');

code = code.replace(
  `booking.status === 'PENDING' || booking.status === 'AWAITING_PAYMENT'`,
  `['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED'].includes(booking.status)`
);

fs.writeFileSync('src/pages/MyBookings.tsx', code);
