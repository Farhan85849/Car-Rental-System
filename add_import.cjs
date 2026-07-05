const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');
code = "import ReactPlayer from 'react-player';\n" + code;
fs.writeFileSync('src/pages/Home.tsx', code);
