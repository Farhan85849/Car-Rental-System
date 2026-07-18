import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  ArrowLeft, ArrowRight, Check, MapPin, Calendar, Shield, Map, Wifi, Baby, CreditCard, Banknote, Building2,
  Briefcase, Plane, HeartHandshake, Car, CalendarClock, Globe2, Navigation, AlertCircle
} from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate';
import 'flatpickr/dist/themes/dark.css';
import 'flatpickr/dist/plugins/confirmDate/confirmDate.css';
import api from '@/src/api/axios';

const steps = [
  { id: 1, title: 'Rental Type' },
  { id: 2, title: 'Details & Dates' },
  { id: 3, title: 'Extras' },
  { id: 4, title: 'Payment' },
  { id: 5, title: 'Confirmation' }
];

const RENTAL_TYPES = [
  { id: 'CITY', label: 'Within City', icon: Building2, desc: 'Local travel within city limits' },
  { id: 'OUT_OF_CITY', label: 'Out of City', icon: Globe2, desc: 'Travel across different cities' },
  { id: 'AIRPORT', label: 'Airport Transfer', icon: Plane, desc: 'Pick up or drop off at airport' },
  { id: 'EVENT', label: 'Event / Wedding', icon: HeartHandshake, desc: 'Special occasions and events' },
];

const TRIP_TYPES = [
  { id: 'HOURLY', label: 'Hourly', icon: CalendarClock },
  { id: 'DAILY', label: 'Daily', icon: Calendar },
  { id: 'WEEKLY', label: 'Weekly', icon: Calendar },
  { id: 'MONTHLY', label: 'Monthly', icon: Calendar },
];

const DRIVE_TYPES = [
  { id: 'SELF_DRIVE', label: 'Self Drive', icon: Car, desc: 'Drive it yourself' },
  { id: 'CHAUFFEUR', label: 'Chauffeur', icon: Briefcase, desc: 'Professional driver included' },
];

const CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Multan', 'Faisalabad'];

const BookingWizard = () => {
  const { vehicleId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [calculating, setCalculating] = useState(false);
  const [priceDetails, setPriceDetails] = useState<any>(null);
  
  const returnDateRef = useRef<any>(null);
  
  const [cardInfo, setCardInfo] = useState({ name: '', number: '', exp: '', cvc: '' });
  const [bookingResult, setBookingResult] = useState<any>(null);
  
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const [formData, setFormData] = useState({
    rentalType: 'CITY',
    tripType: 'DAILY',
    driveType: 'SELF_DRIVE',
    
    startDate: '',
    endDate: '',
    pickupLoc: 'Karachi',
    dropoffLoc: 'Karachi',
    
    destinationCity: '',
    returnCity: '',
    estimatedDistance: 0,
    
    extras: {
      gps: false,
      childSeat: false,
      wifi: false,
      insurance: false
    },
    paymentMethod: 'CASH'
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to book a vehicle');
      navigate('/login', { state: { from: `/booking/${vehicleId}` } });
      return;
    }

    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${vehicleId}`);
        setVehicle(data.data);
        if (data.data.status !== 'AVAILABLE') {
            toast.error('This vehicle is currently not available.');
            navigate('/fleet');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || 'Failed to fetch vehicle');
        navigate('/fleet');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId, navigate, user]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculatePrice();
    }
  }, [
    formData.startDate, formData.endDate, formData.extras, 
    formData.rentalType, formData.tripType, formData.driveType,
    formData.destinationCity, formData.estimatedDistance
  ]);

  const calculatePrice = async () => {
    if (!formData.startDate || !formData.endDate) return;
    setCalculating(true);
    try {
      const { data } = await api.post('/bookings/calculate', {
        vehicleId,
        ...formData
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
       // Proceed to step 2
       setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.startDate || !formData.endDate) {
        toast.error('Please select start and end dates');
        return;
      }
      if (formData.rentalType === 'OUT_OF_CITY' && (!formData.destinationCity || !formData.estimatedDistance)) {
        toast.error('Please provide destination city and estimated distance');
        return;
      }
      
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start.getTime() < today.getTime()) {
        toast.error('Start date cannot be in the past');
        return;
      }
      if (end.getTime() < start.getTime()) {
        toast.error('End date must be after start date');
        return;
      }
      
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!policyAccepted) {
        toast.error('You must accept the rental policies to continue');
        return;
      }
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleBooking = async () => {
    if (formData.paymentMethod === 'CARD' && (!cardInfo.name || !cardInfo.number || !cardInfo.exp || !cardInfo.cvc)) {
      toast.error('Please fill all card details');
      return;
    }
    
    try {
      // Create Booking
      const { data: bookingData } = await api.post('/bookings', {
        vehicleId,
        ...formData,
        securityDeposit: priceDetails?.securityDeposit
      });
      
      // If payment is card, simulate payment creation
      if (formData.paymentMethod === 'CARD') {
        await api.post('/payments', {
          bookingId: bookingData.data.id,
          amount: priceDetails?.totalPrice,
          paymentMethod: 'CREDIT_CARD'
        });
      }
      
      setBookingResult(bookingData.data);
      setCurrentStep(5);
      toast.success('Booking confirmed!');
      window.scrollTo(0, 0);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create booking');
    }
  };

  if (loading || !vehicle) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-24 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase">Complete your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-500">Booking</span></h1>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between relative mt-8">
            <div className="absolute left-0 right-0 h-1 bg-white/10 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>
            <div 
              className="absolute left-0 h-1 bg-gradient-to-r from-blue-500 to-amber-500 top-1/2 -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= step.id ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-[#111] text-gray-500 border border-white/10'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`absolute top-12 text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap font-bold transition-colors ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 mt-16">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: RENTAL TYPE */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  
                  {/* Category Selection */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2"><MapPin className="w-5 h-5 text-amber-500" /> Travel Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {RENTAL_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, rentalType: type.id})}
                          className={`p-6 rounded-2xl border text-left transition-all ${
                            formData.rentalType === type.id 
                              ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                              : 'bg-[#0a0a0a] border-white/5 hover:bg-white/[0.02]'
                          }`}
                        >
                          <type.icon className={`w-8 h-8 mb-4 ${formData.rentalType === type.id ? 'text-blue-400' : 'text-gray-500'}`} />
                          <h3 className="font-bold text-lg mb-1">{type.label}</h3>
                          <p className="text-xs text-gray-400">{type.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Drive Type */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2"><Car className="w-5 h-5 text-amber-500" /> Drive Type</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {DRIVE_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, driveType: type.id})}
                          className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                            formData.driveType === type.id 
                              ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                              : 'bg-[#0a0a0a] border-white/5 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${formData.driveType === type.id ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'}`}>
                            <type.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-bold mb-0.5">{type.label}</h3>
                            <p className="text-xs text-gray-400">{type.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration Type */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-widest flex items-center gap-2"><CalendarClock className="w-5 h-5 text-amber-500" /> Duration Type</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {TRIP_TYPES.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setFormData({...formData, tripType: type.id})}
                          className={`p-4 rounded-2xl border text-center transition-all ${
                            formData.tripType === type.id 
                              ? 'bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                              : 'bg-[#0a0a0a] border-white/5 text-white hover:bg-white/[0.02]'
                          }`}
                        >
                          <h3 className="font-bold text-xs uppercase tracking-widest">{type.label}</h3>
                        </button>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* STEP 2: DETAILS & DATES */}
              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500" /> Schedule</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pick-up Date & Time</label>
                        <Flatpickr
                          data-enable-time
                          value={formData.startDate}
                          onChange={([date]) => setFormData({...formData, startDate: date.toISOString()})}
                          options={{
                            enableTime: true,
                            minDate: 'today',
                            plugins: [
                              confirmDatePlugin({
                                confirmIcon: "<i class='fa fa-check'></i>",
                                confirmText: "OK",
                                showAlways: true,
                                theme: "dark"
                              })
                            ]
                          }}
                          onClose={() => {
                            if (returnDateRef.current?.flatpickr) {
                              setTimeout(() => returnDateRef.current.flatpickr.open(), 100);
                            }
                          }}
                          className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors custom-date-picker"
                          placeholder="Select pick-up date & time"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Return Date & Time</label>
                        <Flatpickr
                          ref={returnDateRef}
                          data-enable-time
                          value={formData.endDate}
                          onChange={([date]) => setFormData({...formData, endDate: date.toISOString()})}
                          options={{
                            enableTime: true,
                            minDate: formData.startDate || 'today',
                            plugins: [
                              confirmDatePlugin({
                                confirmIcon: "<i class='fa fa-check'></i>",
                                confirmText: "OK",
                                showAlways: true,
                                theme: "dark"
                              })
                            ]
                          }}
                          className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 transition-colors custom-date-picker"
                          placeholder="Select return date & time"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-500" /> Location Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Pick-up City</label>
                        <select 
                          value={formData.pickupLoc}
                          onChange={(e) => setFormData({...formData, pickupLoc: e.target.value})}
                          className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                        >
                          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      
                      {formData.rentalType === 'OUT_OF_CITY' ? (
                         <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Destination City</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Lahore"
                            value={formData.destinationCity}
                            onChange={(e) => setFormData({...formData, destinationCity: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Drop-off City</label>
                          <select 
                            value={formData.dropoffLoc}
                            onChange={(e) => setFormData({...formData, dropoffLoc: e.target.value})}
                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 appearance-none"
                          >
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      )}
                    </div>

                    {formData.rentalType === 'OUT_OF_CITY' && (
                      <div className="pt-4 border-t border-white/5">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Estimated Round-trip Distance (KM)</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            placeholder="e.g. 800"
                            value={formData.estimatedDistance || ''}
                            onChange={(e) => setFormData({...formData, estimatedDistance: Number(e.target.value)})}
                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-white/30"
                          />
                          <Navigation className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2">* Required for calculating toll & fuel estimates.</p>
                      </div>
                    )}

                  </div>
                </motion.div>
              )}

              {/* STEP 3: EXTRAS & POLICIES */}
              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8">
                    <h3 className="font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500" /> Enhance Your Trip</h3>
                    
                    <div className="space-y-4">
                      <ExtraToggle 
                        icon={Shield} title="Premium Insurance" desc="Full coverage with zero excess liability" price="2,000"
                        selected={formData.extras.insurance} onClick={() => setFormData({...formData, extras: {...formData.extras, insurance: !formData.extras.insurance}})}
                      />
                      <ExtraToggle 
                        icon={Map} title="GPS Navigation" desc="Satellite navigation system" price="500"
                        selected={formData.extras.gps} onClick={() => setFormData({...formData, extras: {...formData.extras, gps: !formData.extras.gps}})}
                      />
                      <ExtraToggle 
                        icon={Baby} title="Child Seat" desc="ISOFIX compatible safety seat" price="500"
                        selected={formData.extras.childSeat} onClick={() => setFormData({...formData, extras: {...formData.extras, childSeat: !formData.extras.childSeat}})}
                      />
                      <ExtraToggle 
                        icon={Wifi} title="4G WiFi Router" desc="Unlimited data on the go" price="700"
                        selected={formData.extras.wifi} onClick={() => setFormData({...formData, extras: {...formData.extras, wifi: !formData.extras.wifi}})}
                      />
                    </div>
                  </div>

                  <div className="bg-[#111] border border-blue-500/20 rounded-3xl p-6 md:p-8">
                    <h3 className="font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-blue-400">
                      <AlertCircle className="w-4 h-4" /> Rental Policies ({formData.rentalType})
                    </h3>
                    
                    <ul className="space-y-3 text-sm text-gray-300 mb-6">
                      {formData.rentalType === 'CITY' ? (
                        <>
                          <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Maximum 150km per day. Excess mileage charged at 50 PKR/km.</li>
                          <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Vehicle must be returned with same fuel level.</li>
                          <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Late returns charged at hourly rate after 2 hours grace period.</li>
                        </>
                      ) : (
                         <>
                          <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Out-of-city travel is only permitted to declared destinations.</li>
                          <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Toll taxes and border crossing fees are customer responsibility.</li>
                          {formData.driveType === 'CHAUFFEUR' && <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> Driver accommodation and food allowance is required for night stays.</li>}
                          {formData.driveType === 'SELF_DRIVE' && <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span> A security deposit of {priceDetails?.securityDeposit?.toLocaleString()} PKR is required for self-drive out-of-city rentals.</li>}
                        </>
                      )}
                    </ul>

                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${policyAccepted ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}>
                        {policyAccepted && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-sm font-bold uppercase tracking-widest">I accept the rental policies</span>
                      <input type="checkbox" className="hidden" checked={policyAccepted} onChange={() => setPolicyAccepted(!policyAccepted)} />
                    </label>
                  </div>

                </motion.div>
              )}

              {/* STEP 4: PAYMENT */}
              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 md:p-8">
                    <h3 className="font-bold uppercase tracking-widest mb-6">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'CARD'})}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors ${formData.paymentMethod === 'CARD' ? 'border-white bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                      >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Credit Card</span>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, paymentMethod: 'CASH'})}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors ${formData.paymentMethod === 'CASH' ? 'border-white bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                      >
                        <Banknote className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">Pay at Pickup</span>
                      </button>
                    </div>

                    <AnimatePresence>
                      {formData.paymentMethod === 'CARD' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-4 border-t border-white/10">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Cardholder Name</label>
                              <input 
                                type="text" value={cardInfo.name} onChange={e => setCardInfo({...cardInfo, name: e.target.value})}
                                className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30" 
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Card Number</label>
                              <input 
                                type="text" maxLength={19} placeholder="0000 0000 0000 0000" value={cardInfo.number} onChange={e => setCardInfo({...cardInfo, number: e.target.value})}
                                className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-white/30" 
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Expiry</label>
                                <input 
                                  type="text" placeholder="MM/YY" maxLength={5} value={cardInfo.exp} onChange={e => setCardInfo({...cardInfo, exp: e.target.value})}
                                  className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-white/30" 
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CVC</label>
                                <input 
                                  type="text" placeholder="123" maxLength={4} value={cardInfo.cvc} onChange={e => setCardInfo({...cardInfo, cvc: e.target.value})}
                                  className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-sm font-mono text-white focus:outline-none focus:border-white/30" 
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: CONFIRMATION */}
              {currentStep === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 bg-[#0a0a0a] border border-white/5 rounded-3xl flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                    <Check className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">Booking Confirmed</h2>
                  <p className="text-gray-400 mb-8 max-w-md">Your reservation has been successfully placed. An email confirmation has been sent to your registered address.</p>
                  
                  <div className="w-full max-w-md p-6 bg-[#111] rounded-2xl border border-white/5 mb-8 text-left space-y-4">
                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Booking ID</span>
                      <span className="font-mono text-white">{bookingResult?.bookingNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Vehicle</span>
                      <span className="font-medium text-white">{vehicle.brand} {vehicle.model}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Status</span>
                      <span className="text-green-500 font-bold uppercase tracking-widest text-xs">Confirmed</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button onClick={() => navigate('/bookings')} className="px-8 py-4 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors">
                      View My Bookings
                    </button>
                    <button onClick={() => navigate('/')} className="px-8 py-4 bg-white/5 border border-white/10 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white/10 transition-colors">
                      Back Home
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-8 border-t border-white/5">
                <button 
                  onClick={currentStep === 1 ? () => navigate(-1) : handleBack}
                  className="px-8 py-4 flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-white/5 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                
                {currentStep < 4 ? (
                  <button 
                    onClick={handleNext}
                    className="px-8 py-4 bg-white text-black flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 rounded-full transition-colors"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={handleBooking}
                    className="px-8 py-4 bg-amber-500 text-black flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:bg-amber-400 rounded-full transition-colors"
                  >
                    Confirm & Pay <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          {currentStep < 5 && (
            <div className="lg:col-span-1">
              <div className="sticky top-32 p-6 md:p-8 bg-[#0a0a0a] border border-white/5 rounded-3xl">
                <h3 className="font-bold text-sm mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-amber-500" /> Booking Summary
                </h3>
                
                <div className="flex gap-4 mb-8">
                  <div className="w-20 h-20 bg-[#111] rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img src={JSON.parse(vehicle.images)[0] || 'https://via.placeholder.com/150'} alt={vehicle.model} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{vehicle.brand}</h4>
                    <p className="text-sm text-gray-400 mb-2">{vehicle.model}</p>
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded-md">{vehicle.category}</span>
                  </div>
                </div>

                {calculating ? (
                   <div className="animate-pulse space-y-4 py-4 border-y border-white/5">
                     <div className="h-3 bg-white/10 rounded w-full"></div>
                     <div className="h-3 bg-white/10 rounded w-2/3"></div>
                     <div className="h-3 bg-white/10 rounded w-full"></div>
                   </div>
                ) : priceDetails ? (
                  <div className="space-y-4 text-sm font-medium py-6 border-y border-white/5">
                    
                    {/* Basic Info */}
                    <div className="flex justify-between text-gray-400">
                      <span>{formData.tripType === 'HOURLY' ? 'Hours' : 'Days'}</span>
                      <span className="text-white font-mono">{priceDetails.rentalDuration}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Rate ({formData.tripType === 'HOURLY' ? '/hr' : '/day'})</span>
                      <span className="text-white font-mono">{priceDetails.dailyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 font-bold text-white pt-2">
                      <span>Base Rental</span>
                      <span className="font-mono">PKR {priceDetails.subTotal.toLocaleString()}</span>
                    </div>

                    {/* Driver & Allowances */}
                    {(priceDetails.driverCharges > 0 || priceDetails.driverAllowance > 0) && (
                      <div className="pt-4 mt-4 border-t border-white/5 space-y-3 text-xs">
                        {priceDetails.driverCharges > 0 && (
                          <div className="flex justify-between text-amber-500/80">
                            <span>Chauffeur Charges</span>
                            <span className="font-mono">+ {priceDetails.driverCharges.toLocaleString()}</span>
                          </div>
                        )}
                        {priceDetails.driverAllowance > 0 && (
                          <div className="flex justify-between text-amber-500/80">
                            <span>Driver Food/Acc.</span>
                            <span className="font-mono">+ {priceDetails.driverAllowance.toLocaleString()}</span>
                          </div>
                        )}
                        {priceDetails.nightStayAllowance > 0 && (
                          <div className="flex justify-between text-amber-500/80">
                            <span>Night Stay Allowance</span>
                            <span className="font-mono">+ {priceDetails.nightStayAllowance.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tolls & Deposits */}
                    {(priceDetails.tollCharges > 0 || priceDetails.securityDeposit > 0) && (
                      <div className="pt-4 mt-4 border-t border-white/5 space-y-3 text-xs">
                        {priceDetails.tollCharges > 0 && (
                          <div className="flex justify-between text-gray-400">
                            <span>Est. Toll Charges</span>
                            <span className="font-mono text-white">+ {priceDetails.tollCharges.toLocaleString()}</span>
                          </div>
                        )}
                        {priceDetails.securityDeposit > 0 && (
                          <div className="flex justify-between text-gray-400">
                            <span>Security Deposit <span className="text-[9px] block">(Refundable)</span></span>
                            <span className="font-mono text-white">+ {priceDetails.securityDeposit.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Extras */}
                    {priceDetails.extrasTotal > 0 && (
                      <div className="flex justify-between text-gray-400 pt-4 border-t border-white/5">
                        <span>Selected Extras</span>
                        <span className="text-white font-mono">+ {priceDetails.extrasTotal.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-400 pt-4 border-t border-white/5">
                      <span>Taxes (16% GST)</span>
                      <span className="text-white font-mono">+ {priceDetails.tax.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-end pt-6">
                      <div>
                        <span className="uppercase tracking-widest font-bold block text-[10px] text-gray-500">Total Amount</span>
                        <span className="text-xs text-gray-500">incl. taxes & deposits</span>
                      </div>
                      <span className="text-2xl font-bold tracking-tighter text-amber-500">PKR {priceDetails.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center border-y border-white/5">
                    <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Select dates to view pricing</p>
                  </div>
                )}
                
                <div className="mt-6 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    All transactions are secure and encrypted. Cancel up to 24 hours before pickup for a full refund.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExtraToggle = ({ icon: Icon, title, desc, price, selected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 border rounded-2xl flex items-center gap-4 transition-colors text-left ${selected ? 'border-amber-500/50 bg-amber-500/10' : 'border-white/5 bg-[#111] hover:bg-white/5'}`}
  >
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selected ? 'bg-amber-500 text-black' : 'bg-[#0a0a0a] text-gray-400 border border-white/5'}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div className="flex-grow">
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-[10px] text-gray-500">{desc}</p>
    </div>
    <div className="text-right shrink-0">
      <span className="block font-mono text-xs font-bold">+ {price} <span className="text-[9px] text-gray-500 font-sans">/day</span></span>
    </div>
  </button>
);

export default BookingWizard;
