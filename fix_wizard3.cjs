const fs = require('fs');
let code = fs.readFileSync('src/pages/booking/BookingWizard.tsx', 'utf-8');

code = code.replace(
`      setBookingResult(pData.data.booking);`,
`      setBookingResult(bData.data);`
);

fs.writeFileSync('src/pages/booking/BookingWizard.tsx', code);
