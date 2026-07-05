const fs = require('fs');
let code = fs.readFileSync('src/pages/VehicleDetails.tsx', 'utf-8');

// We need to add state for isFullScreen
if (!code.includes('isFullScreen')) {
  code = code.replace(
    /const \[activeImage, setActiveImage\] = useState\(0\);/,
    `const [activeImage, setActiveImage] = useState(0);\n  const [isFullScreen, setIsFullScreen] = useState(false);`
  );
}

if (!code.includes('X } from \'lucide-react\'')) {
  code = code.replace(
    /import \{ ChevronLeft, Star, Settings, Users, Fuel, Calendar, MapPin, Check, ChevronRight \} from 'lucide-react';/,
    `import { ChevronLeft, Star, Settings, Users, Fuel, Calendar, MapPin, Check, ChevronRight, X, Maximize2 } from 'lucide-react';`
  );
}

// Replace the main image block with full-screen support
code = code.replace(
  /<motion\.div\s+initial=\{\{\s*opacity:\s*0,\s*y:\s*20\s*\}\}\s+animate=\{\{\s*opacity:\s*1,\s*y:\s*0\s*\}\}\s+transition=\{\{\s*duration:\s*0\.8,\s*ease:\s*\[0\.16,\s*1,\s*0\.3,\s*1\]\s*\}\}\s+className="w-full aspect-\[4\/3\] md:aspect-\[21\/9\] lg:aspect-\[16\/10\] rounded-\[1\.5rem\] md:rounded-\[2rem\] overflow-hidden bg-\[#0a0a0a\] relative mb-4 md:mb-6"\s*>\s*<AnimatePresence mode="wait">\s*<motion\.img\s*key=\{activeImage\}\s*initial=\{\{\s*opacity:\s*0,\s*scale:\s*1\.05\s*\}\}\s*animate=\{\{\s*opacity:\s*1,\s*scale:\s*1\s*\}\}\s*exit=\{\{\s*opacity:\s*0\s*\}\}\s*transition=\{\{\s*duration:\s*0\.7,\s*ease:\s*\[0\.16,\s*1,\s*0\.3,\s*1\]\s*\}\}\s*src=\{images\[activeImage\]\}\s*alt=\{vehicle\.model\}\s*className="w-full h-full object-cover"\s*\/>\s*<\/AnimatePresence>\s*<\/motion\.div>/m,
  `<motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full aspect-[4/3] md:aspect-[16/10] lg:aspect-[16/10] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-[#050505] relative mb-6 md:mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
              <button 
                onClick={() => setIsFullScreen(true)}
                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  src={images[activeImage]} 
                  alt={vehicle.model} 
                  loading="lazy"
                  className="w-full h-full object-cover origin-center cursor-pointer"
                  onClick={() => setIsFullScreen(true)}
                />
              </AnimatePresence>
            </motion.div>
            
            {/* Full Screen Viewer */}
            <AnimatePresence>
              {isFullScreen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
                >
                  <button 
                    onClick={() => setIsFullScreen(false)}
                    className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="relative w-full max-w-7xl aspect-video flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        src={images[activeImage]} 
                        alt={vehicle.model} 
                        className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg"
                      />
                    </AnimatePresence>
                    
                    <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1); }}
                        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0); }}
                        className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Thumbnails in Fullscreen */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-full px-4 hide-scrollbar">
                    {images.map((img: string, idx: number) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveImage(idx)}
                        className={\`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 relative transition-all duration-300 \${activeImage === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-40 hover:opacity-100'}\`}
                      >
                         <img src={img} alt={\`View \${idx}\`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>`
);

// Update font styles on title
code = code.replace(
  /<h1 className="text-\[clamp\(2\.5rem,5vw,5rem\)\] font-bold mb-6 md:mb-8 tracking-tighter leading-\[0\.9\]">\{vehicle\.model\}<\/h1>/,
  `<h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold mb-6 md:mb-8 tracking-tight font-heading leading-[0.9]">{vehicle.model}</h1>`
);

// Update brand color to white instead of blue
code = code.replace(
  /text-blue-500/g,
  `text-slate-400`
);

// Update booking panel container style
code = code.replace(
  /className="bg-\[#0a0a0a\] rounded-\[1\.5rem\] md:rounded-\[2rem\] p-6 md:p-8 xl:p-12 lg:sticky lg:top-32 border border-white\/5 flex flex-col items-center justify-center text-center"/,
  `className="bg-[#050505] rounded-[2.5rem] p-6 md:p-8 xl:p-12 lg:sticky lg:top-32 border border-white/5 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"`
);

// Add tailwind class to hide scrollbar in standard gallery
code = code.replace(
  /className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"/,
  `className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x"`
);

fs.writeFileSync('src/pages/VehicleDetails.tsx', code);
