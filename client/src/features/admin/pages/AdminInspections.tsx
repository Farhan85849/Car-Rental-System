import React, { useEffect, useState } from 'react';
import api from '@/src/api/axios';
import { toast } from 'sonner';
import { FileText, Wrench, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminInspections = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [damages, setDamages] = useState<any[]>([]);
  const [fines, setFines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inspections' | 'damages' | 'fines'>('inspections');

  const fetchData = async () => {
    try {
      const [insRes, damRes, finRes] = await Promise.all([
        api.get('/inspections'),
        api.get('/inspections/damages'),
        api.get('/inspections/fines')
      ]);
      setInspections(insRes.data.data);
      setDamages(damRes.data.data);
      setFines(finRes.data.data);
    } catch (err) {
      toast.error('Failed to fetch inspection data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markRepaired = async (id: string, cost: number) => {
    try {
      await api.put(`/inspections/damages/${id}/repair`, { cost, notes: 'Repaired by admin' });
      toast.success('Damage marked as repaired');
      fetchData();
    } catch (err) {
      toast.error('Failed to mark repaired');
    }
  };

  const updateFine = async (id: string, status: string) => {
    try {
      await api.put(`/inspections/fines/${id}/status`, { status });
      toast.success(`Fine status updated to ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update fine');
    }
  };

  if (loading) return <div className="text-white text-xs uppercase p-8">Loading...</div>;

  return (
    <div className="mt-12">
      <div className="flex gap-4 mb-8">
        {['inspections', 'damages', 'fines'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-white text-black' 
                : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'inspections' && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">All Inspections</h2>
            <button className="px-4 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors" onClick={() => {
              const bookingId = prompt("Enter Booking ID to inspect:");
              if(bookingId) {
                const odometer = prompt("Enter Odometer Reading:");
                const type = prompt("Type (PICKUP or RETURN):")?.toUpperCase() || 'PICKUP';
                if(odometer && (type === 'PICKUP' || type === 'RETURN')) {
                  const payload: any = { bookingId, odometer: Number(odometer), fuelLevel: 'Full' };
                  if (type === 'RETURN') {
                     const damage = prompt("Enter new damages (comma separated) or leave empty if none:");
                     if (damage) payload.newDamages = damage.split(',').map(d => ({ damageType: 'Other', description: d.trim(), estimatedCost: 5000 }));
                     api.post('/inspections/return', payload).then(() => { toast.success('Return Inspection created'); window.location.reload(); }).catch(e => toast.error('Failed to create inspection'));
                  } else {
                     api.post('/inspections/pickup', payload).then(() => { toast.success('Pickup Inspection created'); window.location.reload(); }).catch(e => toast.error('Failed to create inspection'));
                  }
                }
              }
            }}>
              + Create Inspection
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                  <th className="p-6 font-bold">Type</th>
                  <th className="p-6 font-bold">Vehicle</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Odometer</th>
                  <th className="p-6 font-bold">Date</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((ins) => (
                  <tr key={ins.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-white text-sm font-medium">{ins.type}</td>
                    <td className="p-6 text-slate-300">{ins.vehicle?.brand} {ins.vehicle?.model}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${ins.status === 'PASSED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {ins.status}
                      </span>
                    </td>
                    <td className="p-6 text-slate-400 text-sm">{ins.odometer} km</td>
                    <td className="p-6 text-slate-400 text-sm">{new Date(ins.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {inspections.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 text-sm">No inspections found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'damages' && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Damage Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                  <th className="p-6 font-bold">Vehicle</th>
                  <th className="p-6 font-bold">Type</th>
                  <th className="p-6 font-bold">Description</th>
                  <th className="p-6 font-bold">Cost Estimate</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {damages.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-white text-sm font-medium">{d.vehicle?.brand} {d.vehicle?.model}</td>
                    <td className="p-6 text-slate-300">{d.damageType}</td>
                    <td className="p-6 text-slate-400 text-sm">{d.description}</td>
                    <td className="p-6 text-white font-mono text-sm">PKR {d.estimatedCost}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${d.status === 'REPAIRED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="p-6">
                      {d.status !== 'REPAIRED' && (
                        <button 
                          onClick={() => markRepaired(d.id, d.estimatedCost)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase hover:bg-blue-500/20 transition-colors"
                        >
                          <Wrench className="w-3 h-3" /> Mark Repaired
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {damages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 text-sm">No damages found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fines' && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Fine Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-widest text-slate-500 bg-white/[0.02]">
                  <th className="p-6 font-bold">Customer</th>
                  <th className="p-6 font-bold">Reason</th>
                  <th className="p-6 font-bold">Amount</th>
                  <th className="p-6 font-bold">Status</th>
                  <th className="p-6 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((f) => (
                  <tr key={f.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-white text-sm font-medium">{f.customer?.firstName} {f.customer?.lastName}</td>
                    <td className="p-6 text-slate-400 text-sm max-w-xs truncate">{f.reason}</td>
                    <td className="p-6 text-white font-mono text-sm">PKR {f.amount}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest 
                        ${f.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                          f.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                          f.status === 'PAID' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="p-6">
                      {f.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateFine(f.id, 'APPROVED')}
                            className="p-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => updateFine(f.id, 'REJECTED')}
                            className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {fines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 text-sm">No fines found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
