import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, Settings, Users, Fuel, Calendar, MapPin, Check, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toast } from 'sonner';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [driverOption, setDriverOption] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [pickupLoc, setPickupLoc] = useState('');
  const [dropoffLoc, setDropoffLoc] = useState('');
  
  const [activeImage, setActiveImage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await axios.get(`/api/vehicles/${id}`);
        setVehicle(res.data.data);
        setPickupLoc(res.data.data.location);
        setDropoffLoc(res.data.data.location);
      } catch (error) {
        console.error("Failed to load vehicle details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please sign in to reserve this vehicle.');
      navigate('/login');
      return;
    }

    const days = calculateDays();
    if (days <= 0) {
      toast.error('Please select valid reservation dates.');
      return;
    }

    try {
      const payload = {
        vehicleId: vehicle.id,
        startDate,
        endDate,
        driverOption,
        insurance,
        pickupLoc,
        dropoffLoc
      };

      const res = await axios.post('/api/bookings', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Reservation initialized. Proceeding to payment...');
      
      await axios.post('/api/payments', {
        bookingId: res.data.data.id,
        amount: res.data.data.totalPrice,
        method: 'STRIPE',
        transactionId: `txn_${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Reservation confirmed. Thank you.');
      navigate('/bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Reservation failed.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white font-medium uppercase tracking-widest text-xs">Loading Experience...</div>;
  }

  if (!vehicle) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white">Vehicle not found.</div>;
  }

  const images = JSON.parse(vehicle.images || '[]');
  const features = JSON.parse(vehicle.features || '[]');
  const days = calculateDays();
  let baseTotal = days * vehicle.pricePerDay;
  if (driverOption) baseTotal += (days * 5000);
  if (insurance) baseTotal += (days * 3000);
  const total = baseTotal > 0 ? baseTotal : vehicle.pricePerDay;

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 md:pt-32 pb-24 md:pb-32 relative overflow-hidden">
      
      <div className="max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 relative z-10">
        
        <Link to="/vehicles" className="inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors mb-8 md:mb-12 group">
          <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
          
          {/* Main Content & Gallery */}
          <div className="lg:w-[65%] flex flex-col">
            
            <motion.div 
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
                        className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 relative transition-all duration-300 ${activeImage === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-40 hover:opacity-100'}`}
                      >
                         <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="flex gap-3 md:gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x"
            >
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-24 md:w-32 aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 relative transition-all duration-500 snap-center ${activeImage === idx ? 'ring-1 ring-white ring-offset-4 ring-offset-[#030303]' : 'opacity-40 hover:opacity-100'}`}
                >
                   <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="mt-12 md:mt-16"
            >
              <p className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mb-3 md:mb-4">{vehicle.brand} • {vehicle.category}</p>
              <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold mb-6 md:mb-8 tracking-tight font-heading leading-[0.9]">{vehicle.model}</h1>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 py-8 md:py-12 border-y border-white/10 my-8 md:my-12">
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Transmission</span>
                  <span className="text-base md:text-lg font-medium text-white">{vehicle.transmission}</span>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Capacity</span>
                  <span className="text-base md:text-lg font-medium text-white">{vehicle.seats} Seats</span>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Power</span>
                  <span className="text-base md:text-lg font-medium text-white">{vehicle.fuelType}</span>
                </div>
                <div className="flex flex-col gap-1 md:gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Year</span>
                  <span className="text-base md:text-lg font-medium text-white">{vehicle.year}</span>
                </div>
              </div>

              <div className="max-w-3xl">
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 md:mb-6">Overview</h3>
                <p className="text-slate-300 leading-relaxed text-base md:text-lg font-light">{vehicle.description}</p>
              </div>

              <div className="mt-12 md:mt-16">
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 md:mb-8">Engineering & Comfort</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-6 md:gap-x-8">
                  {features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center text-slate-300 gap-3 md:gap-4 text-xs md:text-sm font-medium border-b border-white/5 pb-3 md:pb-4">
                      <Check className="w-4 h-4 text-slate-500 shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>

          {/* Booking Panel */}
          <div className="lg:w-[35%] relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#050505] rounded-[2.5rem] p-6 md:p-8 xl:p-12 lg:sticky lg:top-32 border border-white/5 flex flex-col items-center justify-center text-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
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

