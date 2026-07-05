const fs = require('fs');

function updateHero() {
  let code = fs.readFileSync('src/components/Hero.tsx', 'utf-8');
  
  // add ReactPlayer import if not exists
  if(!code.includes("import ReactPlayer from 'react-player';")) {
    code = code.replace(/import \{ useEffect, useRef, useState \} from 'react';/, "import { useEffect, useRef, useState } from 'react';\nimport ReactPlayer from 'react-player';");
  }

  // replace video tag
  code = code.replace(
    /<video[\s\S]*?<\/video>/,
    `<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.65]">
          <div className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2">
            <ReactPlayer 
              url="https://www.youtube.com/watch?v=WtY8s80_dww" 
              playing 
              muted 
              loop 
              width="100%" 
              height="100%"
              config={{
                youtube: {
                  playerVars: { autoplay: 1, controls: 0, showinfo: 0, rel: 0, modestbranding: 1, vq: 'hd2160', disablekb: 1 }
                }
              }}
            />
          </div>
        </div>`
  );
  fs.writeFileSync('src/components/Hero.tsx', code);
}

function updateHome() {
  let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');
  
  // add ReactPlayer import if not exists
  if(!code.includes("import ReactPlayer from 'react-player';")) {
    code = code.replace(/import \{ useEffect, useState, useRef \} from 'react';/, "import { useEffect, useState, useRef } from 'react';\nimport ReactPlayer from 'react-player';");
  }

  // replace iframe tag in Home.tsx
  code = code.replace(
    /<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">[\s\S]*?<\/div>/,
    `<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2">
            <ReactPlayer 
              url="https://www.youtube.com/watch?v=0xdt67tzY2o" 
              playing 
              muted 
              loop 
              width="100%" 
              height="100%"
              config={{
                youtube: {
                  playerVars: { autoplay: 1, controls: 0, showinfo: 0, rel: 0, modestbranding: 1, vq: 'hd2160', disablekb: 1 }
                }
              }}
            />
          </div>
        </div>`
  );
  fs.writeFileSync('src/pages/Home.tsx', code);
}

updateHero();
updateHome();
