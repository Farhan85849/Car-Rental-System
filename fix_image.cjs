const fs = require('fs');
let code = fs.readFileSync('src/pages/Locations.tsx', 'utf-8');

code = code.replace(
  'https://images.unsplash.com/photo-1605663765955-46f04739eb3b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579548483751-24891b29a27c?q=80&w=2070&auto=format&fit=crop'
);

fs.writeFileSync('src/pages/Locations.tsx', code);
