import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
      }
      
      (req as any).user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Not authorized as admin' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return res.status(403).json({ success: false, error: 'User role not authorized' });
    }
    next();
  };
};
