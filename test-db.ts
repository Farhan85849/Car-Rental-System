import { connectDB } from './server/src/db/mongoose';
import { Vehicle } from './server/src/models/Vehicle';
async function test() {
  await connectDB();
  const c = await Vehicle.countDocuments();
  console.log("Count:", c);
  process.exit(0);
}
test();
