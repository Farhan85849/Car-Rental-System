const fs = require('fs');

function restoreHero() {
  let code = fs.readFileSync('src/components/Hero.tsx', 'utf-8');

  // Restore the video tag to img tag
  code = code.replace(
    /<video[\s\S]*?<\/video>/,
    `<img src="/images/hero_bg.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.65]" />`
  );
  fs.writeFileSync('src/components/Hero.tsx', code);
}

function restoreHome() {
  let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

  // Restore the video tag to img tag
  code = code.replace(
    /<video[\s\S]*?<\/video>/,
    `<img src="/images/home_banner.jpg" alt="Immersive Banner" className="w-full h-full object-cover scale-105 pointer-events-none" />`
  );
  
  // Also change group/video to group/banner to be safe if that exists
  code = code.replace(/group\/video/g, 'group/banner');
  fs.writeFileSync('src/pages/Home.tsx', code);
}

restoreHero();
restoreHome();
