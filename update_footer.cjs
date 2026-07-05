const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

code = code.replace(
  `<Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Careers</Link>
              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Journal</Link>
              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Contact</Link>`,
  `<Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
              <Link to="/careers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Careers</Link>
              <Link to="/journal" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Journal</Link>
              <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Contact</Link>`
);

fs.writeFileSync('src/components/Footer.tsx', code);
