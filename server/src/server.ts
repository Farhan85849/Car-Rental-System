import "dotenv/config";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import authRoutes from './routes/authRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import bookingRoutes from './routes/bookingRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reviewRoutes from './routes/reviewRoutes';
import contactRoutes from './routes/contactRoutes';
import inspectionRoutes from './routes/inspectionRoutes';
import userRoutes from './routes/userRoutes';
import aiRoutes from './routes/aiRoutes';

import { connectDB } from './db/mongoose';
import { errorHandler } from './middleware/errorMiddleware';

async function startServer() {
  try {
    await connectDB();
  } catch (dbErr) {
    console.error("Failed to connect to the database. Server shutting down.");
    process.exit(1);
  }
  
  const { seedDatabase } = await import("./db/seed");
  try {
    await seedDatabase();
  } catch (seedErr: any) {
    console.error("Database seeding error:", seedErr);
  }

  const app = express();
  app.set('trust proxy', 1);
  const PORT = Number(3000);

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false, xForwardedForHeader: false },
  });

  app.use(compression());
  app.use(express.json());
  app.use(cors());
  app.use(helmet({
    frameguard: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));
  app.use(morgan('dev'));
  
  // Apply the rate limiting middleware to API calls only
  app.use('/api', apiLimiter);

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/vehicles', vehicleRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/inspections', inspectionRoutes);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.join(process.cwd(), 'client'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.use(errorHandler);

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
    const { disconnectDB } = await import('./db/mongoose');
    await disconnectDB();
    process.exit(0);
  });
}

startServer();
