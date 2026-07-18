const fs = require('fs');
let code = fs.readFileSync('client/src/App.tsx', 'utf8');

if (!code.includes('import { CustomerInspections }')) {
  code = code.replace(
    /import MyBookings from '@\/src\/features\/bookings\/pages\/MyBookings';/,
    `import MyBookings from '@/src/features/bookings/pages/MyBookings';\nimport { CustomerInspections } from '@/src/features/bookings/pages/CustomerInspections';`
  );
  
  code = code.replace(
    /<Route path="\/bookings" element={<MyBookings \/>} \/>/,
    `<Route path="/bookings" element={<MyBookings />} />\n            <Route path="/my-fines" element={<CustomerInspections />} />`
  );
  
  fs.writeFileSync('client/src/App.tsx', code);
}
