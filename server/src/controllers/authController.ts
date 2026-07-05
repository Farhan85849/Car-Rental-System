import { Request, Response } from 'express';
import { authService } from '../services/authService';

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (err: any) {
    if (err.message === 'Email already exists') {
      res.status(400).json({ success: false, error: err.message });
    } else {
      console.error('Registration Error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err: any) {
    if (err.message === 'Invalid credentials' || err.message === 'Please provide email and password') {
      res.status(401).json({ success: false, error: err.message });
    } else {
      console.error('Login Error:', err);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};

export const me = async (req: any, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    res.status(200).json({ success: true, data: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role } });
  } catch (err: any) {
    console.error('Me Error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};
