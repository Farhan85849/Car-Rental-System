import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Vehicle } from './server/src/models/Vehicle';
import { vehiclesData } from './server/src/db/seed';

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected. Deleting vehicles...');
  await Vehicle.deleteMany({});
  console.log('Inserting vehicles...');
  await Vehicle.insertMany(vehiclesData);
  console.log('Done.');
  process.exit(0);
});
