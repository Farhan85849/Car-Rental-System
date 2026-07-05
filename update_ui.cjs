const fs = require('fs');

const updateFile = (path, replaceFn) => {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf-8');
    code = replaceFn(code);
    fs.writeFileSync(path, code);
  }
}

// Update Vehicles.tsx
updateFile('src/pages/Vehicles.tsx', (code) => {
  return code
    .replace(/bg-\[#0a0a0a\]/g, 'bg-[#080808]')
    .replace(/bg-white\/5/g, 'bg-white/[0.02]')
    .replace(/rounded-\[2rem\]/g, 'rounded-[1.5rem]')
    .replace(/text-3xl font-bold/g, 'text-2xl font-bold font-heading')
    .replace(/THE <br\/>\<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">COLLECTION\.<\/span>/g, 'THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">COLLECTION.</span>')
    .replace(/gap-x-6 md:gap-x-8 xl:gap-x-12/g, 'gap-x-6 md:gap-x-8 lg:gap-x-10')
    .replace(/aspect-\[4\/3\]/g, 'aspect-[5/4]')
    .replace(/border-white\/10 hover:border-white\/40/g, 'border-white/5 hover:border-white/20')
    .replace(/border-l border-white\/10 pl-4/g, 'border-t border-white/5 pt-4 mt-6 mb-6 w-full flex-row justify-between pl-0');
});

// Update Services.tsx
updateFile('src/pages/Services.tsx', (code) => {
  return code
    .replace(/bg-\[#0a0a0a\]/g, 'bg-[#080808]')
    .replace(/rounded-3xl/g, 'rounded-[2rem]')
    .replace(/text-3xl font-bold text-white mb-4 tracking-tighter/g, 'text-2xl font-bold text-white mb-4 tracking-tight font-heading')
    .replace(/OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">SERVICES<\/span>/g, 'OUR <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">SERVICES</span>');
});

// Update About.tsx
updateFile('src/pages/About.tsx', (code) => {
  return code
    .replace(/ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">EMDRIVE<\/span>/g, 'ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">EMDRIVE</span>')
    .replace(/rounded-3xl/g, 'rounded-[2rem]')
    .replace(/text-2xl font-bold tracking-tighter mb-6/g, 'text-xl font-bold tracking-tight mb-6 uppercase tracking-widest font-heading text-slate-200')
    .replace(/aspect-video/g, 'aspect-[21/9]');
});

// Update Locations.tsx
updateFile('src/pages/Locations.tsx', (code) => {
  return code
    .replace(/bg-\[#0a0a0a\]/g, 'bg-[#080808]')
    .replace(/rounded-3xl/g, 'rounded-[2rem]')
    .replace(/OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">LOCATIONS<\/span>/g, 'OUR <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">LOCATIONS</span>')
    .replace(/text-3xl font-bold/g, 'text-2xl font-bold font-heading tracking-tight');
});

// Update Home.tsx
updateFile('src/pages/Home.tsx', (code) => {
  return code
    .replace(/bg-\[#0a0a0a\]/g, 'bg-[#080808]')
    .replace(/THE <br\/>\<span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-600">COLLECTION\.<\/span>/g, 'THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">COLLECTION.</span>')
    .replace(/THE EMDRIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">STANDARD<\/span>/g, 'THE EMDRIVE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">STANDARD</span>')
    .replace(/text-blue-500/g, 'text-slate-400')
    .replace(/text-blue-400/g, 'text-white')
    .replace(/bg-blue-400/g, 'bg-white')
    .replace(/rounded-\[2rem\]/g, 'rounded-[1.5rem]')
    .replace(/border-white\/10 hover:border-white\/20/g, 'border-white/5 hover:border-white/10')
    .replace(/border-l-2 border-white\/10 pl-6/g, 'border-t border-white/5 pt-6 mt-6 mb-8 w-full flex-row justify-between pl-0')
    .replace(/text-\[clamp\(2rem,4vw,3\.5rem\)\]/g, 'text-[clamp(1.5rem,3vw,2.5rem)] font-heading');
});

