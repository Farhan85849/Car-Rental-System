const fs = require('fs');
let code = fs.readFileSync('client/src/features/admin/pages/AdminInspections.tsx', 'utf8');

if (!code.includes('createInspection')) {
  // We'll replace the top bar to add a create button
  const topBar = `<div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">All Inspections</h2>
          </div>`;
  const newTopBar = `<div className="p-8 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">All Inspections</h2>
            <button className="px-4 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors" onClick={() => {
              const bookingId = prompt("Enter Booking ID to inspect:");
              if(bookingId) {
                const odometer = prompt("Enter Odometer Reading:");
                const type = prompt("Type (PICKUP or RETURN):")?.toUpperCase() || 'PICKUP';
                if(odometer && (type === 'PICKUP' || type === 'RETURN')) {
                  const payload = { bookingId, odometer: Number(odometer), fuelLevel: 'Full' };
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
          </div>`;
          
  code = code.replace(topBar, newTopBar);
  fs.writeFileSync('client/src/features/admin/pages/AdminInspections.tsx', code);
}
