import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/src/features/auth/store/authSlice';
import vehicleReducer from '@/src/features/vehicles/store/vehicleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicles: vehicleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
