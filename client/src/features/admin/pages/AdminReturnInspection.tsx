import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/src/api/axios';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle2, AlertTriangle, Upload, FileImage, ShieldCheck } from 'lucide-react';

export const AdminReturnInspection = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [pickupInspection, setPickupInspection] = useState<any>(null);
  const [formData, setFormData] = useState({
    odometer: '',
    fuelLevel: 'Full',
    tiresCondition: 'Good',
    lightsCondition: 'Good',
    windshieldCondition: 'Good',
    mirrorsCondition: 'Good',
    engineWarningLights: false,
    cleanliness: 'Clean',
    spareTire: true,
    toolkit: true,
    documents: true,
    notes: '',
    newDamages: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: bData } = await api.get(`/bookings/${bookingId}`);
        setBooking(bData.data);
        
        const { data: iData } = await api.get(`/inspections/booking/${bookingId}`);
        const pickup = iData.data.find((i: any) => i.type === 'PICKUP');
        setPickupInspection(pickup);
      } catch (err) {
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        bookingId,
        odometer: Number(formData.odometer),
        fuelLevel: formData.fuelLevel,
        tiresCondition: formData.tiresCondition,
        lightsCondition: formData.lightsCondition,
        windshieldCondition: formData.windshieldCondition,
        mirrorsCondition: formData.mirrorsCondition,
        engineWarningLights: formData.engineWarningLights,
        cleanliness: formData.cleanliness,
        accessories: {
          spareTire: formData.spareTire,
          toolkit: formData.toolkit,
          documents: formData.documents
        },
        notes: formData.notes
      };

      if (formData.newDamages) {
        payload.newDamages = formData.newDamages.split(',').map(d => ({
          damageType: 'Other',
          description: d.trim(),
          estimatedCost: 5000 // Dummy estimate for now
        }));
      }

      await api.post('/inspections/return', payload);
      
      await api.put(`/bookings/${bookingId}/status`, { status: 'COMPLETED' });
      if (!formData.newDamages) {
        toast.success('Inspection passed! Booking completed.');
      } else {
        toast.warning('Damage reported! Fine applied. Booking completed.');
      }
      navigate('/admin');
    } catch (err) {
      toast.error('Failed to submit return inspection');
    }
  };

  if (loading) return <div className="text-white p-12">Loading...</div>;

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back
      </button>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck size={120} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 uppercase">Vehicle Return Inspection</h1>
        <p className="text-slate-400 text-sm">Booking #{booking?.bookingNumber} • Vehicle: {booking?.vehicle?.brand} {booking?.vehicle?.model}</p>
        
        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg flex gap-4">
          <AlertTriangle className="text-orange-500 shrink-0" />
          <div>
            <h3 className="text-orange-500 font-bold uppercase tracking-widest text-xs mb-1">Attention Required</h3>
            <p className="text-slate-300 text-sm">Please compare the vehicle's current condition with the pickup inspection and record any new damages.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {pickupInspection && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Pickup Reference</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-500 mb-1">Odometer</div>
                <div className="text-white font-mono">{pickupInspection.odometer} km</div>
              </div>
              <div>
                <div className="text-slate-500 mb-1">Fuel Level</div>
                <div className="text-white font-mono">{pickupInspection.fuelLevel}</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold tracking-tight text-white uppercase mb-6">Return Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Current Odometer (km)</label>
              <input 
                type="number" 
                required
                value={formData.odometer}
                onChange={e => setFormData({...formData, odometer: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                placeholder="e.g. 45500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fuel Level</label>
              <select 
                value={formData.fuelLevel}
                onChange={e => setFormData({...formData, fuelLevel: e.target.value})}
                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
              >
                <option value="Empty">Empty</option>
                <option value="1/4">1/4</option>
                <option value="1/2">1/2</option>
                <option value="3/4">3/4</option>
                <option value="Full">Full</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {['tiresCondition', 'lightsCondition', 'windshieldCondition', 'mirrorsCondition', 'cleanliness'].map(field => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {field.replace('Condition', '')} Condition
                </label>
                <select 
                  value={(formData as any)[field]}
                  onChange={e => setFormData({...formData, [field]: e.target.value})}
                  className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
                >
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Damaged">Damaged</option>
                  {field === 'cleanliness' && (
                    <>
                      <option value="Clean">Clean</option>
                      <option value="Dirty">Dirty</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-white uppercase tracking-widest text-xs mb-4">Accessories & Indicators</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" checked={formData.spareTire} onChange={e => setFormData({...formData, spareTire: e.target.checked})} className="accent-white" />
                <span className="text-sm text-slate-300">Spare Tire</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" checked={formData.toolkit} onChange={e => setFormData({...formData, toolkit: e.target.checked})} className="accent-white" />
                <span className="text-sm text-slate-300">Toolkit</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" checked={formData.documents} onChange={e => setFormData({...formData, documents: e.target.checked})} className="accent-white" />
                <span className="text-sm text-slate-300">Documents</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" checked={formData.engineWarningLights} onChange={e => setFormData({...formData, engineWarningLights: e.target.checked})} className="accent-white" />
                <span className="text-sm text-slate-300">Warning Lights</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Upload Evidence Photos</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/30 transition-colors cursor-pointer bg-white/[0.02]">
               <Upload className="mx-auto mb-4 text-slate-500" size={32} />
               <p className="text-sm text-slate-300 mb-1">Click to upload photos</p>
               <p className="text-xs text-slate-500">Front, Rear, Sides, Interior, Dashboard (Mock)</p>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Damages (Comma separated descriptions)</label>
            <textarea 
              value={formData.newDamages}
              onChange={e => setFormData({...formData, newDamages: e.target.value})}
              className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors min-h-[100px]"
              placeholder="e.g. Scratch on front bumper, Broken left mirror..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Inspector Notes</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-[#111] border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors min-h-[100px]"
              placeholder="Any additional observations..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <CheckCircle2 size={18} />
            Complete Inspection
          </button>
        </div>
      </form>
    </div>
  );
};
