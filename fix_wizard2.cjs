const fs = require('fs');
let code = fs.readFileSync('src/pages/booking/BookingWizard.tsx', 'utf-8');

code = code.replace(
`      if (start.getTime() < today.getTime()) {
        toast.error('Start date cannot be in the past');
        return;
      }`,
`      if (start.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
        toast.error('Start date cannot be in the past');
        return;
      }`
);

fs.writeFileSync('src/pages/booking/BookingWizard.tsx', code);
