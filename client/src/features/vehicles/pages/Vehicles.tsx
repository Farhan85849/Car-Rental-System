import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchVehicles } from '@/src/features/vehicles/store/vehicleSlice';
import { AppDispatch, RootState } from '@/src/store/store';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function Vehicles() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, loading } = useSelector((state: RootState) => state.vehicles);
  
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const startDate = searchParams.get('pickup');
  const endDate = searchParams.get('return');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (location) params.location = location;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    dispatch(fetchVehicles(params));
  }, [dispatch, location, startDate, endDate]);

  const filteredVehicles = filterCategory === 'ALL' 
    ? vehicles 
    : vehicles.filter(v => v.category === filterCategory);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 md:pt-40 pb-24 md:pb-32 px-4 md:px-8 xl:px-12 max-w-[2000px] mx-auto relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-8 lg:gap-12 relative z-10">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(3rem,6vw,6rem)] font-bold tracking-tighter leading-[0.9] mb-4 md:mb-6"
          >
            THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">COLLECTION.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-slate-400 font-light leading-relaxed"
          >
            Explore our meticulously curated selection of the world's most extraordinary vehicles. Designed for those who demand excellence.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 md:gap-4 w-full lg:w-auto"
        >
          {['ALL', 'SEDAN', 'SUV', 'LUXURY', 'VIP'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 flex-1 sm:flex-none text-center ${
                filterCategory === cat 
                  ? 'bg-white text-black' 
                  : 'bg-transparent text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 md:gap-x-8 lg:gap-x-10 gap-y-16 md:gap-y-24 relative z-10">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div 
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="aspect-[5/4] bg-white/[0.02] rounded-[1.5rem] animate-pulse" 
              />
            ))
          ) : (
            filteredVehicles.map((car: any, index: number) => {
              const images = JSON.parse(car.images || '[]');
              return (
                <motion.div 
                  layout
                  key={car.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col relative bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-[2rem] p-4 md:p-5 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
                >
                  <Link to={`/vehicles/${car.id}`} className="block overflow-hidden rounded-[1.5rem] bg-[#050505] mb-6 relative shadow-inner"> 
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

                    <Link to={`/vehicles/${car.id}`} className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-slate-300 transition-colors group/btn mt-auto">
                      Discover
                      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-white group-hover/btn:bg-white group-hover/btn:text-black transition-all duration-500 shadow-[0_0_15px_rgba(255,255,255,0)] group-hover/btn:shadow-[0_0_15px_rgba(255,255,255,0.3)]"> 
                         <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>
      
      {!loading && filteredVehicles.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-40 border-t border-white/5 mt-24"
        >
          <p className="text-slate-400 text-xl font-light">No vehicles found in this category.</p>
        </motion.div>
      )}
    </div>
  );
}
