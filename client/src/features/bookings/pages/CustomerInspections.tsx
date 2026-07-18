import React, { useEffect, useState } from 'react';
import api from '@/src/api/axios';
import { toast } from 'sonner';
import { AlertCircle, FileText, CheckCircle2, AlertOctagon, CreditCard } from 'lucide-react';

export const CustomerInspections = () => {
  const [fines, setFines] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFines = async () => {
    try {
      const [{ data: finesData }, { data: bookingsData }] = await Promise.all([
        api.get('/inspections/fines/customer'),
        api.get('/bookings/my-bookings')
      ]);
      setFines(finesData.data);
      
      let allInspections: any[] = [];
      for (const booking of bookingsData.data) {
        try {
          const res = await api.get(`/inspections/booking/${booking.id}`);
          if (res.data.data) allInspections = [...allInspections, ...res.data.data];
        } catch(e) {}
      }
      setInspections(allInspections);
    } catch (err) {
      toast.error('Failed to load your fines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const submitAppeal = async (id: string) => {
    const reason = prompt("Enter reason for appeal:");
    if (!reason) return;
    try {
      await api.put(`/inspections/fines/${id}/appeal`, { notes: `Appeal: ${reason}` });
      toast.success('Appeal submitted successfully');
      fetchFines();
    } catch (err) {
      toast.error('Failed to submit appeal');
    }
  };

  const payFine = async (id: string) => {
    try {
      await api.put(`/inspections/fines/${id}/pay`);
      toast.success('Fine paid successfully via simulated gateway.');
      fetchFines();
    } catch (err) {
      toast.error('Failed to process payment');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#030303] text-white pt-32 px-6 flex items-center justify-center"><div className="animate-pulse">Loading data...</div></div>;

  const totalFinesCount = fines.length;
  const pendingFines = fines.filter(f => f.status === 'APPROVED' || f.status === 'PENDING');
  const pendingAmount = pendingFines.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-[#030303] pt-32 pb-24 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tighter text-white mb-8 uppercase">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600">Fines & Damages</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-widest">Total Fines</span>
              <AlertOctagon size={16} />
            </div>
            <div className="text-4xl font-light text-white">{totalFinesCount}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-4 text-red-400 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest">Pending Amount</span>
              <AlertCircle size={16} />
            </div>
            <div className="text-4xl font-mono text-white relative z-10">PKR {pendingAmount.toLocaleString()}</div>
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4 text-green-400">
              <span className="text-[10px] uppercase font-bold tracking-widest">Inspections</span>
              <CheckCircle2 size={16} />
            </div>
            <div className="text-4xl font-light text-white">{inspections.length}</div>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden mb-12">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Damage Fines</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                  <th className="p-6 font-bold">Booking</th>
                  <th className="p-6 font-bold">Reason</th>
                  <th className="p-6 font-bold">Amount</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f) => (
                  <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-white text-sm font-medium">{f.booking?.bookingNumber}</td>
                    <td className="p-6 text-slate-400 text-sm max-w-xs">{f.reason}</td>
                    <td className="p-6 text-white font-mono text-sm">PKR {f.amount.toLocaleString()}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest 
                        ${f.status === 'APPROVED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          f.status === 'REJECTED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                          f.status === 'PAID' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                      {f.status === 'APPROVED' && (
                        <button 
                          onClick={() => payFine(f.id)}
                          className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 px-3 py-1.5 rounded-full transition shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        >
                          <CreditCard size={12} /> Pay Now
                        </button>
                      )}
                      {(f.status === 'APPROVED' || f.status === 'PENDING') && (
                        <button 
                          onClick={() => submitAppeal(f.id)}
                          className="text-[10px] uppercase font-bold tracking-widest text-slate-300 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition"
                        >
                          Appeal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {fines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 text-sm">
                      <CheckCircle2 size={32} className="mx-auto mb-4 text-slate-700" />
                      No fines recorded. You're a safe driver!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden mb-12">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">My Inspections</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                  <th className="p-6 font-bold">Booking</th>
                  <th className="p-6 font-bold">Type</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Odometer</th>
                  <th className="p-6 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((ins) => (
                  <tr key={ins.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-white text-sm font-medium">{ins.booking?.bookingNumber || 'N/A'}</td>
                    <td className="p-6 text-slate-400 text-sm">{ins.type}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${ins.status === 'PASSED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {ins.status}
                      </span>
                    </td>
                    <td className="p-6 text-white font-mono text-sm">{ins.odometer.toLocaleString()} km</td>
                    <td className="p-6 text-right">
                      <button onClick={() => alert('PDF Download Mock\nOdometer: ' + ins.odometer + 'km\nFuel: ' + ins.fuelLevel)} className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-300 border border-white/10 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition">
                        <FileText size={12} /> View Report
                      </button>
                    </td>
                  </tr>
                ))}
                {inspections.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 text-sm">
                      No inspections found.
                    </td>
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
