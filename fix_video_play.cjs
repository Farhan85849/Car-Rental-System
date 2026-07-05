const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Add useRef if not there
if(!code.includes('useRef')) {
  code = code.replace(/import \{ useEffect, useState \} from 'react';/, "import { useEffect, useState, useRef } from 'react';");
} else if (!code.match(/import\s+\{[^}]*useRef[^}]*\}\s+from\s+'react'/)) {
  code = code.replace(/import \{ useEffect, useState \}/, 'import { useEffect, useState, useRef }');
}

// Add the video ref inside the component
if(!code.includes('const videoRef = useRef<HTMLVideoElement>(null);')) {
  code = code.replace(
    /const containerRef = useRef<HTMLDivElement>\(null\);/,
    "const containerRef = useRef<HTMLDivElement>(null);\n  const videoRef = useRef<HTMLVideoElement>(null);"
  );
}

// Add useEffect to force play
if(!code.includes('videoRef.current.play()')) {
  code = code.replace(
    /useEffect\(\(\) => \{[\s\S]*?if \(!loading\) \{/,
    (match) => {
      return `useEffect(() => {\n    if(videoRef.current) {\n      videoRef.current.muted = true;\n      videoRef.current.play().catch(e => console.log('Video play failed', e));\n    }\n\n    if (!loading) {`;
    }
  );
}

// Replace the video tag completely
code = code.replace(
  /<video[\s\S]*?<\/video>/,
  `<video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover scale-105 pointer-events-none"
          >
            <source src="https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4" type="video/mp4" />
            <source src="https://assets.mixkit.co/videos/preview/mixkit-driving-a-car-at-night-on-a-highway-33538-large.mp4" type="video/mp4" />
            {/* Fallback image if video fails */}
            <img 
              src="/images/home_banner.jpg" 
              alt="Cinematic Car" 
              className="w-full h-full object-cover"
            />
          </video>`
);

fs.writeFileSync('src/pages/Home.tsx', code);
