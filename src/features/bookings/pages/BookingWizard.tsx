import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, MapPin, Calendar, Shield, Map, Wifi, Baby, CreditCard, Banknote, Building2 } from 'lucide-react';
import api from '@/src/api/axios';

const steps = [
  { id: 1, title: 'Dates & Location' },
  { id: 2, title: 'Extras' },
  { id: 3, title: 'Summary & Payment' },
  { id: 4, title: 'Confirmation' }
];

const BookingWizard = () => {
  const { vehicleId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [priceDetails, setPriceDetails] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    pickupLoc: 'Karachi',
    dropoffLoc: 'Karachi',
    extras: {
      driverOption: false,
      insurance: false,
      gps: false,
      childSeat: false,
      wifi: false
    },
    paymentMethod: 'CASH'
  });

  const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Multan', 'Faisalabad'];

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${vehicleId}`);
        setVehicle(data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to fetch vehicle');
        navigate('/vehicles');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId, navigate]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculatePrice();
    }
  }, [formData.startDate, formData.endDate, formData.extras]);

  const calculatePrice = async () => {
    if (!formData.startDate || !formData.endDate) return;
    setCalculating(true);
    try {
      const { data } = await api.post('/bookings/calculate', {
        vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        extras: formData.extras
      });
      setPriceDetails(data.data);
    } catch (err: any) {
      toast.error('Error calculating price');
    } finally {
      setCalculating(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.startDate || !formData.endDate) {
        toast.error('Please select start and end dates');
        return;
      }
      
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start.getTime() < today.getTime() - 24 * 60 * 60 * 1000) {
        toast.error('Start date cannot be in the past');
        return;
      }
      if (end.getTime() <= start.getTime()) {
        toast.error('End date must be after start date');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleBooking = async () => {
    try {
      const { data: bData } = await api.post('/bookings', {
        vehicleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        pickupLoc: formData.pickupLoc,
        dropoffLoc: formData.dropoffLoc,
        extras: formData.extras
      });

      const bookingId = bData.data.id;
      
      const { data: pData } = await api.post('/payments', {
        bookingId,
        amount: bData.data.totalPrice,
        method: formData.paymentMethod
      });

      setBookingResult(bData.data);
      setCurrentStep(4);
      toast.success('Booking confirmed successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2 uppercase">Complete Booking</h1>
        <p className="text-gray-400">Reserve your {vehicle.brand} {vehicle.model} today.</p>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 hide-scrollbar">
        {steps.map(step => (
          <div key={step.id} className={`flex items-center gap-3 shrink-0 ${currentStep >= step.id ? 'text-white' : 'text-white/30'}`}>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-mono border ${currentStep >= step.id ? 'border-white bg-white/10' : 'border-white/20'}`}>
              {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span className="text-sm font-medium uppercase tracking-widest">{step.title}</span>
            {step.id !== 4 && <div className={`w-8 h-px ${currentStep > step.id ? 'bg-white' : 'bg-white/20'}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white appearance-none outline-none focus:border-white transition-colors"
                        value={formData.pickupLoc}
                        onChange={e => setFormData({...formData, pickupLoc: e.target.value})}
                      >
                        {CITIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Drop-off Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white appearance-none outline-none focus:border-white transition-colors"
                        value={formData.dropoffLoc}
                        onChange={e => setFormData({...formData, dropoffLoc: e.target.value})}
                      >
                        {CITIES.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Pickup Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="datetime-local" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:border-white transition-colors [color-scheme:dark]"
                        value={formData.startDate}
                        onChange={e => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-400">Return Date & Time</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="datetime-local" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white outline-none focus:border-white transition-colors [color-scheme:dark]"
                        value={formData.endDate}
                        onChange={e => setFormData({...formData, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <ExtraToggle 
                  icon={Shield} 
                  title="Comprehensive Insurance" 
                  desc="Full coverage without deductible." 
                  price={2000} 
                  selected={formData.extras.insurance} 
                  onClick={() => setFormData({...formData, extras: {...formData.extras, insurance: !formData.extras.insurance}})} 
                />
                <ExtraToggle 
                  icon={CreditCard} 
                  title="Chauffeur / Driver" 
                  desc="Professional local driver for the trip." 
                  price={3000} 
                  selected={formData.extras.driverOption} 
                  onClick={() => setFormData({...formData, extras: {...formData.extras, driverOption: !formData.extras.driverOption}})} 
                />
                <ExtraToggle 
                  icon={Wifi} 
                  title="Portable Wi-Fi" 
                  desc="4G Internet anywhere in Pakistan." 
                  price={700} 
                  selected={formData.extras.wifi} 
                  onClick={() => setFormData({...formData, extras: {...formData.extras, wifi: !formData.extras.wifi}})} 
                />
                <ExtraToggle 
                  icon={Baby} 
                  title="Child Seat" 
                  desc="Safe seating for infants/toddlers." 
                  price={500} 
                  selected={formData.extras.childSeat} 
                  onClick={() => setFormData({...formData, extras: {...formData.extras, childSeat: !formData.extras.childSeat}})} 
                />
                <ExtraToggle 
                  icon={Map} 
                  title="GPS Navigation" 
                  desc="Offline maps and route planner." 
                  price={500} 
                  selected={formData.extras.gps} 
                  onClick={() => setFormData({...formData, extras: {...formData.extras, gps: !formData.extras.gps}})} 
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-bold uppercase tracking-widest">Select Payment Method</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setFormData({...formData, paymentMethod: 'CASH'})}
                      className={`p-6 border rounded-xl flex flex-col items-center gap-3 transition-colors ${formData.paymentMethod === 'CASH' ? 'border-white bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <Banknote className="w-8 h-8" />
                      <span className="font-medium tracking-widest uppercase text-xs">Cash on Pickup</span>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, paymentMethod: 'BANK_TRANSFER'})}
                      className={`p-6 border rounded-xl flex flex-col items-center gap-3 transition-colors ${formData.paymentMethod === 'BANK_TRANSFER' ? 'border-white bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <Building2 className="w-8 h-8" />
                      <span className="font-medium tracking-widest uppercase text-xs">Bank Transfer</span>
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, paymentMethod: 'STRIPE'})}
                      className={`p-6 border rounded-xl flex flex-col items-center gap-3 transition-colors ${formData.paymentMethod === 'STRIPE' ? 'border-white bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                    >
                      <CreditCard className="w-8 h-8" />
                      <span className="font-medium tracking-widest uppercase text-xs">Credit Card</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-bold mb-4 uppercase tracking-widest">Terms & Conditions</h3>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    By confirming this booking, you agree to our terms of service. Security deposit will be held upon vehicle pickup. Valid CNIC and driving license must be presented.
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">Booking Confirmed</h2>
                <p className="text-gray-400 mb-8 max-w-md">Your reservation has been successfully placed. An email confirmation has been sent to your registered address.</p>
                
                <div className="w-full p-6 bg-[#0a0a0a] rounded-xl border border-white/5 mb-8 text-left space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-gray-500 text-sm uppercase tracking-widest">Booking ID</span>
                    <span className="font-mono">{bookingResult?.bookingNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-gray-500 text-sm uppercase tracking-widest">Vehicle</span>
                    <span className="font-medium">{vehicle.brand} {vehicle.model}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-500 text-sm uppercase tracking-widest">Status</span>
                    <span className="text-green-500 font-bold uppercase tracking-widest text-sm">Confirmed</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => navigate('/bookings')} className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors">
                    View My Bookings
                  </button>
                  <button onClick={() => navigate('/')} className="px-8 py-3 bg-white/10 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/20 transition-colors">
                    Back Home
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentStep < 4 && (
            <div className="flex justify-between mt-12 pt-8 border-t border-white/10">
              <button 
                onClick={currentStep === 1 ? () => navigate(-1) : handleBack}
                className="px-8 py-4 flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-white/5 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              {currentStep < 3 ? (
                <button 
                  onClick={handleNext}
                  className="px-8 py-4 bg-white text-black flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 rounded-full transition-colors"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleBooking}
                  className="px-8 py-4 bg-white text-black flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 rounded-full transition-colors"
                >
                  Confirm & Pay <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="font-bold text-lg mb-6 uppercase tracking-widest">Booking Summary</h3>
            
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-24 bg-[#111] rounded-xl overflow-hidden shrink-0">
                <img src={JSON.parse(vehicle.images)[0] || 'https://via.placeholder.com/150'} alt={vehicle.model} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold">{vehicle.brand}</h4>
                <p className="text-sm text-gray-400">{vehicle.model}</p>
                <p className="text-xs font-mono mt-2 bg-white/10 inline-block px-2 py-1 rounded">{vehicle.category}</p>
              </div>
            </div>

            {calculating ? (
               <div className="animate-pulse space-y-4">
                 <div className="h-4 bg-white/10 rounded w-full"></div>
                 <div className="h-4 bg-white/10 rounded w-2/3"></div>
                 <div className="h-4 bg-white/10 rounded w-full"></div>
               </div>
            ) : priceDetails ? (
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between text-gray-400">
                  <span>Rental Duration</span>
                  <span className="text-white font-mono">{priceDetails.rentalDays} Days</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">PKR {priceDetails.subTotal.toLocaleString()}</span>
                </div>
                {priceDetails.extrasTotal > 0 && (
                  <div className="flex justify-between text-gray-400">
                    <span>Extras</span>
                    <span className="text-white font-mono">PKR {priceDetails.extrasTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 border-b border-white/10 pb-4">
                  <span>Taxes (16%)</span>
                  <span className="text-white font-mono">PKR {priceDetails.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg pt-2">
                  <span className="uppercase tracking-widest font-bold">Total</span>
                  <span className="font-mono">PKR {priceDetails.totalPrice.toLocaleString()}</span>
                </div>

              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Select dates to view price breakdown.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExtraToggle = ({ icon: Icon, title, desc, price, selected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 border rounded-xl flex items-center gap-4 transition-colors text-left ${selected ? 'border-white bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${selected ? 'bg-white text-black' : 'bg-[#111] text-gray-400'}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-grow">
      <h4 className="font-bold">{title}</h4>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
    <div className="text-right shrink-0">
      <span className="block font-mono text-sm">+ PKR {price} / day</span>
    </div>
  </button>
);

export default BookingWizard;
