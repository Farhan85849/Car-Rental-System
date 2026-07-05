const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

code = code.replace(/preload="none"/g, 'preload="auto"');

// And remove poster just in case it's masking the video if it fails to play immediately
// code = code.replace(/poster="\/images\/home_banner.jpg"/g, '');

fs.writeFileSync('src/pages/Home.tsx', code);
