import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Download, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/src/api/axios';

const MyBookings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my-bookings');
        setBookings(data.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await api.post(`/bookings/${bookingToCancel}/cancel`);
      toast.success('Booking cancelled');
      setBookings(bookings.map(b => b.id === bookingToCancel ? { ...b, status: 'CANCELLED' } : b));
      setBookingToCancel(null);
    } catch(err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };

  if (!user) return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Please login</div>;
  if (loading) return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Loading bookings...</div>;

  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 px-4 md:px-8 xl:px-12 font-sans">
      <div className="max-w-[2000px] mx-auto">
        <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter text-white mb-8 md:mb-12 uppercase">MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">RESERVATIONS</span></h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-20 px-4 bg-[#0a0a0a] border border-white/5 rounded-2xl">
            <h3 className="text-xl text-white font-bold mb-3 uppercase tracking-widest">No reservations found</h3>
            <p className="text-sm text-slate-400 font-light mb-6 max-w-md mx-auto leading-relaxed">You haven't reserved any vehicles yet. Explore our collection to find your next drive.</p>
            <Link to="/vehicles" className="inline-block px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-slate-200 transition-colors">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking: any) => {
               const images = JSON.parse(booking.vehicle.images || '[]');
               let statusColor = 'text-gray-500 border-gray-500/20 bg-gray-500/10';
               if (['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(booking.status)) statusColor = 'text-green-500 border-green-500/20 bg-green-500/10';
               else if (['CANCELLED', 'REJECTED', 'REFUNDED'].includes(booking.status)) statusColor = 'text-red-500 border-red-500/20 bg-red-500/10';
               else if (booking.status === 'AWAITING_PAYMENT') statusColor = 'text-orange-500 border-orange-500/20 bg-orange-500/10';

               return (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row p-6 gap-8"
                >
                  <div className="w-full md:w-64 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-black">
                    <img src={images[0]} alt={booking.vehicle.model} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">{booking.bookingNumber}</p>
                          <h3 className="text-2xl font-bold text-white">{booking.vehicle.brand} {booking.vehicle.model}</h3>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${statusColor}`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-6 mt-4">
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pick up</p>
                          <p className="font-medium text-white text-sm">{new Date(booking.startDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {booking.pickupLoc}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Drop off</p>
                          <p className="font-medium text-white text-sm">{new Date(booking.endDate).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {booking.dropoffLoc}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Cost</span>
                        <div className="text-xl font-mono text-white">PKR {booking.totalPrice.toLocaleString()}</div>
                      </div>
                      <div className="flex gap-3">
                        {['PENDING', 'AWAITING_PAYMENT', 'CONFIRMED'].includes(booking.status) ? (
                          <button onClick={() => setBookingToCancel(booking.id)} className="px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5">
                            Cancel
                          </button>
                        ) : null}
                        {booking.invoice && (
                          <button className="px-6 py-2 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 flex items-center gap-2">
                            <Download className="w-4 h-4"/> Invoice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
               );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {bookingToCancel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setBookingToCancel(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-sm w-full relative"
              >
                <button
                  onClick={() => setBookingToCancel(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Cancel Booking</h3>
                <p className="text-sm text-gray-400 mb-6">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setBookingToCancel(null)}
                    className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Keep It
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
