const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

if(!code.includes('videoRef.current.play()')) {
  code = code.replace(
    /const videoRef = useRef<HTMLVideoElement>\(null\);/,
    `const videoRef = useRef<HTMLVideoElement>(null);\n\n  useEffect(() => {\n    if (videoRef.current) {\n      videoRef.current.muted = true;\n      videoRef.current.play().catch(e => console.log('Video play failed', e));\n    }\n  }, []);`
  );
}

fs.writeFileSync('src/pages/Home.tsx', code);
