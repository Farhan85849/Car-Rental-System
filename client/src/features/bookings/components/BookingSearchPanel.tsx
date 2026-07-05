import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingSearchPanel() {
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isFocused, setIsFocused] = useState({ location: false, pickup: false, return: false });
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (pickupDate) params.append('pickup', pickupDate);
    if (returnDate) params.append('return', returnDate);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-3 w-full max-w-5xl mx-auto shadow-2xl relative z-20 mt-8"
    >
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-4">
        
        {/* Location Input */}
        <div className={`relative flex-1 w-full rounded-[1.5rem] border transition-colors duration-300 ${isFocused.location ? 'border-white/20 bg-black/60' : 'border-white/5 bg-[#050505] hover:bg-black/40'} px-5 h-[72px] flex items-center`}>
          <MapPin className="w-5 h-5 text-slate-400 mr-4 shrink-0" />
          <div className="relative flex-1 h-full flex flex-col justify-center">
            <label 
              htmlFor="location" 
              className={`absolute left-0 transition-all duration-300 pointer-events-none text-slate-400 ${
                isFocused.location || location ? '-top-1 text-[10px] font-bold uppercase tracking-wider text-white' : 'top-1/2 -translate-y-1/2 text-sm'
              }`}
            >
              Pick-up Location
            </label>
            <input 
              id="location"
              type="text" 
              className="w-full bg-transparent outline-none text-white text-sm mt-4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, location: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, location: false }))}
            />
          </div>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-white/10 shrink-0" />

        {/* Pick-up Date Input */}
        <div className={`relative flex-1 w-full rounded-[1.5rem] border transition-colors duration-300 ${isFocused.pickup ? 'border-white/20 bg-black/60' : 'border-white/5 bg-[#050505] hover:bg-black/40'} px-5 h-[72px] flex items-center`}>
          <Calendar className="w-5 h-5 text-slate-400 mr-4 shrink-0" />
          <div className="relative flex-1 h-full flex flex-col justify-center">
            <label 
              htmlFor="pickup" 
              className={`absolute left-0 transition-all duration-300 pointer-events-none text-slate-400 ${
                isFocused.pickup || pickupDate ? '-top-1 text-[10px] font-bold uppercase tracking-wider text-white' : 'top-1/2 -translate-y-1/2 text-sm'
              }`}
            >
              Pick-up Date
            </label>
            <input 
              id="pickup"
              type="date" 
              className={`w-full bg-transparent outline-none text-white text-sm mt-4 custom-date-picker ${!pickupDate && !isFocused.pickup ? 'opacity-0' : 'opacity-100'}`}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, pickup: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, pickup: false }))}
            />
          </div>
        </div>

        <div className="hidden lg:block w-[1px] h-10 bg-white/10 shrink-0" />

        {/* Return Date Input */}
        <div className={`relative flex-1 w-full rounded-[1.5rem] border transition-colors duration-300 ${isFocused.return ? 'border-white/20 bg-black/60' : 'border-white/5 bg-[#050505] hover:bg-black/40'} px-5 h-[72px] flex items-center`}>
          <Calendar className="w-5 h-5 text-slate-400 mr-4 shrink-0" />
          <div className="relative flex-1 h-full flex flex-col justify-center">
            <label 
              htmlFor="return" 
              className={`absolute left-0 transition-all duration-300 pointer-events-none text-slate-400 ${
                isFocused.return || returnDate ? '-top-1 text-[10px] font-bold uppercase tracking-wider text-white' : 'top-1/2 -translate-y-1/2 text-sm'
              }`}
            >
              Return Date
            </label>
            <input 
              id="return"
              type="date" 
              className={`w-full bg-transparent outline-none text-white text-sm mt-4 custom-date-picker ${!returnDate && !isFocused.return ? 'opacity-0' : 'opacity-100'}`}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              onFocus={() => setIsFocused(prev => ({ ...prev, return: true }))}
              onBlur={() => setIsFocused(prev => ({ ...prev, return: false }))}
            />
          </div>
        </div>

        {/* Search Button */}
        <button 
          type="submit"
          className="w-full lg:w-auto h-[72px] px-10 rounded-[1.5rem] bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center shrink-0"
        >
          <Search className="w-5 h-5 mr-3" />
          FIND VEHICLE
        </button>
      </form>
    </motion.div>
  );
}
