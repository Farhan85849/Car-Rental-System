const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Replace the video block
code = code.replace(
  /<div className="absolute inset-0 z-0">[\s\S]*?<\/video>\s*<\/div>/,
  `<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <iframe 
            className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src="https://www.youtube.com/embed/PTmfcPYRIgA?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=PTmfcPYRIgA&vq=hd1080" 
            allow="autoplay; encrypted-media" 
            frameBorder="0"
          ></iframe>
        </div>`
);

// Remove the videoRef and its useEffect
code = code.replace(
  /const videoRef = useRef<HTMLVideoElement>\(null\);\s*useEffect\(\(\) => \{\s*if \(videoRef\.current\) \{\s*videoRef\.current\.muted = true;\s*videoRef\.current\.play\(\)\.catch\(e => console\.log\('Video play failed', e\)\);\s*\}\s*\}, \[\]\);/,
  ''
);

fs.writeFileSync('src/pages/Home.tsx', code);
