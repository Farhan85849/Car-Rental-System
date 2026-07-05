const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Remove the play button
code = code.replace(
  /<button[\s\S]*?onClick=\{\(\) => setIsVideoOpen\(true\)\}[\s\S]*?<\/button>/,
  ''
);

// Remove the Video Modal completely
code = code.replace(
  /\{\/\* Video Modal \*\/\}\s*<AnimatePresence>[\s\S]*?<\/AnimatePresence>/,
  ''
);

// Remove isVideoOpen state
code = code.replace(
  /const \[isVideoOpen, setIsVideoOpen\] = useState\(false\);/,
  ''
);

fs.writeFileSync('src/pages/Home.tsx', code);
