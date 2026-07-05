const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

if (!code.includes('to="/services"')) {
  code = code.replace(
    `<Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>`,
    `<Link to="/services" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Services</Link>\n              <Link to="/locations" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Locations</Link>\n              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>`
  );
}

fs.writeFileSync('src/components/Footer.tsx', code);
