const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

if(!code.includes('<Play')) {
    code = code.replace(/Play,?\s*/, '');
}
if(!code.includes('isVideoOpen')) {
    // maybe remove useState if not used elsewhere, but usually it's fine.
}

fs.writeFileSync('src/pages/Home.tsx', code);
