const fs = require('fs');
let code = fs.readFileSync('src/pages/VehicleDetails.tsx', 'utf-8');

// The side panel is inside `<div className="lg:w-[35%] relative">`
// Let's replace the content of that panel with just a button.
const search = `{/* Booking Panel */}`;
const replace = `{/* Booking Panel */}
          <div className="lg:w-[35%] relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 xl:p-12 lg:sticky lg:top-32 border border-white/5 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-8">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Daily Rate</p>
                <div className="flex items-end gap-2 justify-center">
                  <span className="text-4xl md:text-5xl font-bold tracking-tighter leading-none">PKR {vehicle.dailyPrice?.toLocaleString() || vehicle.pricePerDay?.toLocaleString()}</span>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] md:text-xs font-bold pb-1">/ DAY</span>
                </div>
              </div>
              <p className="text-slate-400 mb-8 text-sm">Proceed to our secure booking wizard to select your dates, locations, and optional extras.</p>
              
              <button onClick={() => navigate('/booking/' + vehicle.id)} className="w-full bg-white text-black py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group">
                Reserve Vehicle
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
`;

const newCode = code.substring(0, code.indexOf(search)) + replace;
fs.writeFileSync('src/pages/VehicleDetails.tsx', newCode);
