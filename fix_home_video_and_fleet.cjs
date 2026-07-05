const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Filter for the 3 specific cars if they exist, otherwise fallback to slice(0,3)
code = code.replace(
  /const featuredCars = vehicles\.slice\(0, 3\);/,
  `const featuredCars = vehicles.filter(v => ['Ghost', 'Continental GT', 'Urus'].includes(v.model)).length === 3 
    ? vehicles.filter(v => ['Ghost', 'Continental GT', 'Urus'].includes(v.model)).sort((a,b) => a.model.localeCompare(b.model))
    : vehicles.slice(0, 3);`
);

// Replace video iframe with HTML5 video
code = code.replace(
  /<iframe\s+width="100%"\s+height="100%"\s+src="https:\/\/www\.youtube\.com\/embed\/1-iR23K1LpQ\?autoplay=1&mute=0&rel=0&showinfo=0"\s+title="8K HDR Car Video"\s+frameBorder="0"\s+allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\s+allowFullScreen\s+className="absolute inset-0"\s*><\/iframe>/,
  `<video 
                autoPlay 
                controls
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-driving-a-car-at-night-on-a-highway-33538-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>`
);

fs.writeFileSync('src/pages/Home.tsx', code);
