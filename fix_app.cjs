const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('import Services')) {
  code = code.replace(
    `import MyBookings from './pages/MyBookings';`,
    `import MyBookings from './pages/MyBookings';\nimport Services from './pages/Services';\nimport Locations from './pages/Locations';`
  );
}

if (!code.includes('<Route path="/services"')) {
  code = code.replace(
    `<Route path="/vehicles" element={<Vehicles />} />`,
    `<Route path="/vehicles" element={<Vehicles />} />\n            <Route path="/services" element={<Services />} />\n            <Route path="/locations" element={<Locations />} />`
  );
}

fs.writeFileSync('src/App.tsx', code);
