const fs = require('fs');
let code = fs.readFileSync('src/store/slices/vehicleSlice.ts', 'utf-8');

code = code.replace(
  `export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async () => {
  const response = await axios.get('/api/vehicles');
  return response.data.data;
});`,
  `export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async (params?: Record<string, string>) => {
  const queryParams = new URLSearchParams(params || {}).toString();
  const url = queryParams ? \`/api/vehicles?\${queryParams}\` : '/api/vehicles';
  const response = await axios.get(url);
  return response.data.data;
});`
);

fs.writeFileSync('src/store/slices/vehicleSlice.ts', code);
