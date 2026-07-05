const fs = require('fs');
let code = fs.readFileSync('src/components/BookingSearchPanel.tsx', 'utf-8');

code = code.replace(
  `navigate('/vehicles');`,
  `const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (pickupDate) params.append('pickup', pickupDate);
    if (returnDate) params.append('return', returnDate);
    navigate(\`/vehicles?\${params.toString()}\`);`
);

fs.writeFileSync('src/components/BookingSearchPanel.tsx', code);
