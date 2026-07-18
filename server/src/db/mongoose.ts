import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoServer: MongoMemoryReplSet | null = null;

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('dummy') || uri.includes('example.com')) {
    console.warn("MONGODB_URI is not defined or is a dummy. Using in-memory DB for development.");
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    uri = mongoServer.getUri();
  } else {
    console.log("Connecting to MongoDB Atlas...");
    // Robustly replace or append retryWrites=false
    uri = uri.replace(/([?&])retryWrites=[^&]*/gi, '');
    uri += (uri.includes('?') ? '&' : '?') + 'retryWrites=false';
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`\n=============================================`);
    console.error(`❌ CRITICAL: MONGODB ATLAS CONNECTION FAILED ❌`);
    console.error(`=============================================`);
    console.error(`Error Details: ${error.message}`);
    console.error(`\nPossible Causes:`);
    console.error(`1. IP Whitelist: Your current IP address is NOT whitelisted in MongoDB Atlas.`);
    console.error(`   Fix: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access From Anywhere (0.0.0.0/0)`);
    console.error(`2. Invalid Credentials: Username or password in the URI is incorrect.`);
    console.error(`=============================================\n`);
    
    // Fallback to memory replica set to keep the UI working and support transactions!
    console.warn("WARNING: MongoDB connection failed. Falling back to in-memory Replica Set ONLY for this preview environment.");
    
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const fallbackUri = mongoServer.getUri();
    
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`Fallback In-Memory Replica Set Connected: ${conn.connection.host}`);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
