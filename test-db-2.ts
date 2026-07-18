import { connectDB } from './server/src/db/mongoose';
import { Vehicle } from './server/src/models/Vehicle';
import { seedDatabase } from './server/src/db/seed';

async function test() {
  await connectDB();
  await seedDatabase();
  const c = await Vehicle.countDocuments();
  console.log("Count:", c);
  const data = await Vehicle.find();
  console.log("Data count:", data.length);
  process.exit(0);
}
test();
