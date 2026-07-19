import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { seedDatabase } from './server/src/db/seed';

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected.');
  await mongoose.connection.collection('vehicles').deleteMany({});
  await seedDatabase();
  console.log('Done.');
  process.exit(0);
});
