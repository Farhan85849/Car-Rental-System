const fs = require('fs');
let code = fs.readFileSync('src/pages/Vehicles.tsx', 'utf-8');

// Replace the vehicle card rendering logic
code = code.replace(
  /<motion\.div\s+layout\s+key=\{car\.id\}[\s\S]*?<\/motion\.div>/g,
  (match) => {
    // Only replace the one inside the map
    if (match.includes('key={car.id}')) {
      return `<motion.div 
                  layout
                  key={car.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col relative bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[2rem] p-4 md:p-5 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
                >
                  <Link to={\`/vehicles/\${car.id}\`} className="block overflow-hidden rounded-[1.5rem] bg-[#050505] mb-6 relative shadow-inner"> 
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity duration-700" />
                     {/* Reflection effect */}
                     <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 mix-blend-overlay z-20 transition-opacity duration-700 pointer-events-none" />
                     <img 
                       src={images[0]} 
                       alt={car.model} 
                       loading="lazy"
                       className="w-full aspect-[5/4] object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1] origin-center"
                    />
                  </Link>
                  <div className="flex flex-col px-2">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-2">{car.brand}</p>
                        <h3 className="text-2xl font-bold font-heading text-white tracking-tight">{car.model}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xl md:text-2xl font-bold text-white group-hover:text-slate-200 transition-colors">PKR {car.dailyPrice.toLocaleString()}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-500 block uppercase tracking-widest font-semibold mt-1">/ day</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-x-6 gap-y-2 text-xs text-slate-400 font-medium mb-8 border-t border-white/5 pt-5 mt-4 w-full flex-row justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-slate-600 mb-1">Transmission</span>
                        <span className="text-white">{car.transmission}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-wider text-slate-600 mb-1">Seats</span>
                        <span className="text-white">{car.seats}</span>
                      </div>
                    </div>

                    <Link to={\`/vehicles/\${car.id}\`} className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-slate-300 transition-colors group/btn mt-auto">
                      Discover
                      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-white group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0)] group-hover/btn:shadow-[0_0_15px_rgba(255,255,255,0.3)]"> 
                         <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </motion.div>`
    }
    return match; // return original if not matched properly (unlikely with this regex)
  }
);

fs.writeFileSync('src/pages/Vehicles.tsx', code);
