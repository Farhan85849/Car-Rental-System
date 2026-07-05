import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface VehicleState {
  vehicles: any[];
  currentVehicle: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: VehicleState = {
  vehicles: [],
  currentVehicle: null,
  loading: false,
  error: null,
};

export const fetchVehicles = createAsyncThunk('vehicles/fetchAll', async (params?: Record<string, string>) => {
  const queryParams = new URLSearchParams(params || {}).toString();
  const url = queryParams ? `/api/vehicles?${queryParams}` : '/api/vehicles';
  const response = await axios.get(url);
  return response.data.data;
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load vehicles';
      });
  },
});

export default vehicleSlice.reducer;
