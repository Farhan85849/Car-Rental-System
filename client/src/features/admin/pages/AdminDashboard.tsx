import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { motion } from 'framer-motion';
import { Car, CalendarDays, DollarSign, Edit, CheckCircle, XCircle } from 'lucide-react';
import api from '@/src/api/axios';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [bookingsRes, vehiclesRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/vehicles')
        ]);
        
        setBookings(bookingsRes.data.data);
        setVehicles(vehiclesRes.data.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'ADMIN') {
      fetchAdminData();
    }
  }, [user]);

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
      toast.success(`Booking status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-[10px] uppercase tracking-widest font-bold">Access Denied</div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-[10px] uppercase tracking-widest font-bold">Loading...</div>;
  }

  const revenue = bookings.reduce((acc, curr) => curr.status !== 'CANCELLED' && curr.status !== 'REJECTED' && curr.status !== 'REFUNDED' ? acc + curr.totalPrice : acc, 0);

  const stats = [
    { label: 'Total Fleet', value: vehicles.length.toString(), icon: Car, color: 'text-white' },
    { label: 'Total Bookings', value: bookings.length.toString(), icon: CalendarDays, color: 'text-white' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'ACTIVE' || b.status === 'CONFIRMED').length.toString(), icon: CalendarDays, color: 'text-white' },
    { label: 'Revenue', value: `PKR ${(revenue / 1000).toFixed(1)}k`, icon: DollarSign, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-24 px-6 font-sans">
      <div className="max-w-[2000px] mx-auto">
        <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter text-white mb-12 uppercase">Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">Portal</span></h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0a0a0a] p-8 rounded-2xl border border-white/5 flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className={`text-4xl font-bold tracking-tighter ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                  <th className="p-6 font-bold">Booking ID</th>
                  <th className="p-6 font-bold">Customer</th>
                  <th className="p-6 font-bold">Vehicle</th>
                  <th className="p-6 font-bold">Dates</th>
                  <th className="p-6 font-bold">Total</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-slate-300 font-mono text-xs">{booking.bookingNumber}</td>
                    <td className="p-6 text-white">{booking.user?.firstName} {booking.user?.lastName}</td>
                    <td className="p-6 text-slate-300">{booking.vehicle?.brand} {booking.vehicle?.model}</td>
                    <td className="p-6 text-slate-400">
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-white font-mono">PKR {booking.totalPrice?.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                        ['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(booking.status) ? 'text-green-500 border-green-500/20 bg-green-500/10' :
                        ['CANCELLED', 'REJECTED', 'REFUNDED'].includes(booking.status) ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                        'text-orange-500 border-orange-500/20 bg-orange-500/10'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        {['PENDING', 'AWAITING_PAYMENT'].includes(booking.status) && (
                           <>
                             <button onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')} className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20" title="Confirm">
                               <CheckCircle className="w-4 h-4" />
                             </button>
                             <button onClick={() => updateBookingStatus(booking.id, 'REJECTED')} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20" title="Reject">
                               <XCircle className="w-4 h-4" />
                             </button>
                           </>
                        )}
                        {booking.status === 'CONFIRMED' && (
                           <button onClick={() => updateBookingStatus(booking.id, 'ACTIVE')} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20" title="Mark Active">
                             <Car className="w-4 h-4" />
                           </button>
                        )}
                        {booking.status === 'ACTIVE' && (
                           <button onClick={() => updateBookingStatus(booking.id, 'COMPLETED')} className="p-2 bg-slate-500/10 text-slate-300 rounded-lg hover:bg-slate-500/20" title="Complete">
                             <CheckCircle className="w-4 h-4" />
                           </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
