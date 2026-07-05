import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout } from '@/src/features/auth/store/authSlice';
import { RootState } from '@/src/store/store';
import axios from 'axios';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const { data } = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setCredentials({ user: data.data, token }));
        } catch (error) {
          dispatch(logout());
        }
      }
    };
    fetchMe();
  }, [dispatch, token]);

  return <>{children}</>;
};
