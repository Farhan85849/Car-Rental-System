const fs = require('fs');
let code = fs.readFileSync('client/src/layouts/Navbar.tsx', 'utf8');

code = code.replace(
  /<Link to="\/bookings" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white\/5 hover:text-white transition-colors">\s*My Bookings\s*<\/Link>/g,
  `<Link to="/bookings" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-colors">\n                    My Bookings\n                  </Link>\n                  <Link to="/my-fines" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-colors">\n                    My Fines\n                  </Link>`
);

fs.writeFileSync('client/src/layouts/Navbar.tsx', code);
