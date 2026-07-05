const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

code = code.replace(
  /<div className="w-full lg:w-\[65%\] aspect-\[4\/3\] lg:aspect-\[16\/9\] overflow-hidden rounded-\[2rem\] relative">[\s\S]*?<\/div>/g,
  (match) => {
    return `<div className="w-full lg:w-[65%] aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-[2.5rem] relative group border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 mix-blend-overlay z-20 transition-opacity duration-700 pointer-events-none" />
                    <img 
                       src={images[0]} 
                       alt={car.model} 
                       loading="lazy"
                       className="img-parallax w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1] origin-center"
                    />
                  </div>`
  }
);

fs.writeFileSync('src/pages/Home.tsx', code);
