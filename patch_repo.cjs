const fs = require('fs');
let code = fs.readFileSync('server/src/repositories/vehicleRepository.ts', 'utf8');

if (!code.includes('updateVehicle(')) {
  code = code.replace(
    /update: async \(id: string, vehicleData: any\) => {/,
    `updateVehicle: async (id: string, data: any) => {\n    return await Vehicle.findByIdAndUpdate(id, data, { new: true });\n  },\n  update: async (id: string, vehicleData: any) => {`
  );
  fs.writeFileSync('server/src/repositories/vehicleRepository.ts', code);
}
