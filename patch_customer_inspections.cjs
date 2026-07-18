const fs = require('fs');
let code = fs.readFileSync('client/src/features/bookings/pages/CustomerInspections.tsx', 'utf8');

if (!code.includes('const [inspections')) {
  // Replace the fines state with fines and inspections
  code = code.replace(
    /const \[fines, setFines\] = useState<any\[\]>\(\[\]\);/,
    `const [fines, setFines] = useState<any[]>([]);\n  const [inspections, setInspections] = useState<any[]>([]);`
  );
  
  // Replace fetchFines to fetch both
  code = code.replace(
    /const { data } = await api\.get\('\/inspections\/fines\/customer'\);\n      setFines\(data\.data\);/,
    `const [{ data: finesData }, { data: bookingsData }] = await Promise.all([\n        api.get('/inspections/fines/customer'),\n        api.get('/bookings/my-bookings')\n      ]);\n      setFines(finesData.data);\n      \n      let allInspections: any[] = [];\n      for (const booking of bookingsData.data) {\n        try {\n          const res = await api.get(\`/inspections/booking/\${booking.id}\`);\n          if (res.data.data) allInspections = [...allInspections, ...res.data.data];\n        } catch(e) {}\n      }\n      setInspections(allInspections);`
  );

  // Add the Inspections table above Fines
  const finesTable = `<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Damage Fines</h2>`;
  const inspectionsTable = `<div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden mb-12">
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
                  <th className="p-6 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((ins) => (
                  <tr key={ins.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-white text-sm font-medium">{ins.booking?.bookingNumber || 'N/A'}</td>
                    <td className="p-6 text-slate-400 text-sm">{ins.type}</td>
                    <td className="p-6">
                      <span className={\`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest \${ins.status === 'PASSED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}\`}>
                        {ins.status}
                      </span>
                    </td>
                    <td className="p-6 text-white font-mono text-sm">{ins.odometer} km</td>
                    <td className="p-6">
                      <button onClick={() => alert('PDF Download Mock\\nOdometer: ' + ins.odometer + 'km\\nFuel: ' + ins.fuelLevel)} className="text-[10px] uppercase font-bold tracking-widest text-white border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/10 transition">
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
                {inspections.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500 text-sm">No inspections found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>\n\n        ` + finesTable;
        
  code = code.replace(finesTable, inspectionsTable);
  fs.writeFileSync('client/src/features/bookings/pages/CustomerInspections.tsx', code);
}
