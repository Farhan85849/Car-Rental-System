import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchVehicles } from '@/src/features/vehicles/store/vehicleSlice';
import { AppDispatch, RootState } from '@/src/store/store';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Sparkles, Loader2, X } from 'lucide-react';
import api from '@/src/api/axios';

const VehicleCard = memo(({ vehicle, idx }: { vehicle: any, idx: number }) => {
  const images = useMemo(() => {
    try {
      return vehicle.images ? JSON.parse(vehicle.images) : [];
    } catch {
      return [];
    }
  }, [vehicle.images]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.5, delay: idx * 0.05 }}
      className="group relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-700"
    >
      <Link to={`/vehicles/${vehicle.id}`} className="block h-full flex flex-col">
        <div className="relative h-[250px] md:h-[300px] overflow-hidden bg-[#111]">
          {images[0] ? (
             <img 
                src={images[0]} 
                alt={vehicle.model} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform group-hover:scale-105 group-hover:rotate-1 transition-transform duration-1000 ease-[0.16,1,0.3,1]"
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">No Image</div>
          )}
          
          {/* Brand Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white border border-white/10">
              {vehicle.brand}
            </span>
          </div>
          
          {/* Price Badge */}
          <div className="absolute bottom-4 right-4">
             <div className="bg-white text-black px-4 py-2 rounded-xl flex flex-col items-end shadow-xl">
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">From</span>
                <span className="font-mono font-bold">PKR {vehicle.dailyPrice?.toLocaleString()}<span className="text-xs opacity-60">/d</span></span>
             </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-1 group-hover:text-amber-500 transition-colors">{vehicle.model}</h3>
              <p className="text-sm text-slate-400 font-mono">{vehicle.year}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Transmission</span>
              <span className="text-sm">{vehicle.transmission}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Fuel</span>
              <span className="text-sm">{vehicle.fuelType}</span>
            </div>
          </div>

          <div className="flex items-center text-[10px] uppercase tracking-widest font-bold text-slate-400 group-hover:text-white transition-colors">
            View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default function Vehicles() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, loading } = useSelector((state: RootState) => state.vehicles);
  
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const startDate = searchParams.get('pickup');
  const endDate = searchParams.get('return');

  const [aiQuery, setAiQuery] = useState('');
  const [aiSearching, setAiSearching] = useState(false);
  const [aiResults, setAiResults] = useState<any[] | null>(null);
  const [aiUnderstanding, setAiUnderstanding] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (location) params.location = location;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    dispatch(fetchVehicles(params));
  }, [dispatch, location, startDate, endDate]);

  const handleAiSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    
    setAiSearching(true);
    setFilterCategory('ALL'); // Reset standard filters
    
    try {
      const { data } = await api.post('/ai/search', { query: aiQuery });
      setAiResults(data.data.vehicles);
      setAiUnderstanding(data.data.understanding);
    } catch (err) {
      console.error(err);
    } finally {
      setAiSearching(false);
    }
  }, [aiQuery]);

  const clearAiSearch = useCallback(() => {
    setAiQuery('');
    setAiResults(null);
    setAiUnderstanding('');
  }, []);

  const displayVehicles = useMemo(() => aiResults !== null 
    ? aiResults 
    : filterCategory === 'ALL' 
      ? vehicles 
      : vehicles.filter(v => v.category === filterCategory), [aiResults, filterCategory, vehicles]);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-32 md:pt-40 pb-24 md:pb-32 px-4 md:px-8 xl:px-12 max-w-[2000px] mx-auto relative overflow-hidden">
      
      {/* Background FX */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 lg:gap-12 relative z-10">
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
      </div>

      {/* AI Search & Filters */}
      <div className="mb-16 space-y-8 relative z-10">
        
        {/* AI Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <form onSubmit={handleAiSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-500/0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 pl-6 focus-within:border-amber-500/50 transition-colors">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <input 
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask AI: e.g. 'I need a luxury SUV under PKR 25,000 for a family trip'"
                className="w-full bg-transparent border-none outline-none text-white px-4 py-3 text-sm"
              />
              {aiQuery && (
                <button type="button" onClick={clearAiSearch} className="p-2 text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button 
                type="submit"
                disabled={aiSearching || !aiQuery.trim()}
                className="bg-amber-500 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {aiSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </div>
          </form>
          
          <AnimatePresence>
            {aiUnderstanding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-500/80 leading-relaxed">{aiUnderstanding}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Standard Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-3 md:gap-4 w-full"
        >
          {['ALL', 'SEDAN', 'SUV', 'LUXURY', 'VIP', 'ECONOMY'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilterCategory(cat); clearAiSearch(); }}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 flex-1 sm:flex-none text-center ${
                filterCategory === cat && aiResults === null
                  ? 'bg-white text-black' 
                  : 'bg-transparent text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 text-white/50">
           <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
           <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Loading Fleet</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {displayVehicles.map((vehicle: any, idx: number) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} idx={idx} />
            ))}
          </AnimatePresence>
          {displayVehicles.length === 0 && !loading && (
             <div className="col-span-full py-32 text-center">
                <h3 className="text-2xl font-bold text-slate-600 mb-2">No Vehicles Found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
