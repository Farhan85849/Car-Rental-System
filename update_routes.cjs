const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes('import Contact')) {
  code = code.replace(
    `import Locations from './pages/Locations';`,
    `import Locations from './pages/Locations';\nimport Contact from './pages/Contact';\nimport About from './pages/About';\nimport Careers from './pages/Careers';\nimport Journal from './pages/Journal';`
  );
}

if (!code.includes('<Route path="/contact"')) {
  code = code.replace(
    `<Route path="/locations" element={<Locations />} />`,
    `<Route path="/locations" element={<Locations />} />\n            <Route path="/contact" element={<Contact />} />\n            <Route path="/about" element={<About />} />\n            <Route path="/careers" element={<Careers />} />\n            <Route path="/journal" element={<Journal />} />`
  );
}

fs.writeFileSync('src/App.tsx', code);
