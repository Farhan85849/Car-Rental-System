import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  
  // Hide sensitive error details in production
  const errorResponse = {
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred. Please try again later.'
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  };

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json(errorResponse);
};
