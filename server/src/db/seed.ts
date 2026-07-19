import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Vehicle } from '../models/Vehicle';

const vipFeatures = [
  'Premium Leather Seats',
  'Massage Seats',
  'Chauffeur Service Available',
  'Privacy Glass',
  'Champagne Cooler',
  'Ambient Lighting'
];

export const vehiclesData = [
  // Luxury Collection
  {
    brand: 'Mercedes-Benz', model: 'S-Class', year: 2024, category: 'LUXURY', dailyPrice: 120000, weeklyPrice: 720000, monthlyPrice: 2640000, securityDeposit: 240000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 2000,
    color: 'Black', location: 'Karachi', description: 'The pinnacle of luxury for weddings and VIP protocols.',
    features: JSON.stringify([...vipFeatures, 'Rear Seat Entertainment', 'Executive Seats']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Mercedes-Benz_W223_IMG_3951.jpg/1280px-Mercedes-Benz_W223_IMG_3951.jpg'])
  },
  {
    brand: 'Lamborghini', model: 'Urus', year: 2023, category: 'VIP', dailyPrice: 180000, weeklyPrice: 1080000, monthlyPrice: 4000000, securityDeposit: 400000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 4000,
    color: 'Black', location: 'Lahore', description: 'The worlds first Super Sport Utility Vehicle.',
    features: JSON.stringify([...vipFeatures, 'Bang & Olufsen', 'Carbon Fiber Package']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Lamborghini_Urus_SE_DSC_8524.jpg/1280px-Lamborghini_Urus_SE_DSC_8524.jpg'])
  },
  {
    brand: 'Land Rover', model: 'Range Rover Autobiography', year: 2024, category: 'SUV', dailyPrice: 95000, weeklyPrice: 570000, monthlyPrice: 2090000, securityDeposit: 190000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 1500,
    color: 'Black', location: 'Islamabad', description: 'The ultimate luxury SUV with peerless refinement.',
    features: JSON.stringify([...vipFeatures, 'Meridian Signature Sound', 'Executive Class Rear Seats']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/2022_Land_Rover_Range_Rover_SE_P440e_AWD_Automatic_3.0_Front.jpg/1280px-2022_Land_Rover_Range_Rover_SE_P440e_AWD_Automatic_3.0_Front.jpg'])
  },
  // Pakistani Local Collection
  {
    brand: 'Toyota', model: 'Corolla Altis Grande', year: 2023, category: 'SEDAN', dailyPrice: 15000, weeklyPrice: 90000, monthlyPrice: 350000, securityDeposit: 50000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 15000,
    color: 'White', location: 'Lahore', description: 'Pakistan\'s most favorite and reliable premium sedan.',
    features: JSON.stringify(['Sunroof', 'Alloy Rims', 'Cruise Control', 'Push Start']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg/1280px-2018_Toyota_Corolla_%28MZEA12R%29_Ascent_Sport_hatchback_%282018-11-02%29_01.jpg'])
  },
  {
    brand: 'Honda', model: 'Civic Oriel', year: 2023, category: 'SEDAN', dailyPrice: 18000, weeklyPrice: 110000, monthlyPrice: 400000, securityDeposit: 60000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 12000,
    color: 'Black', location: 'Karachi', description: 'Sporty and elegant, the Honda Civic is perfect for executive travel.',
    features: JSON.stringify(['Sunroof', 'Leather Seats', 'Retractable Mirrors', 'Climate Control']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2022_Honda_Civic_Touring_in_Lunar_Silver_Metallic%2C_Front_Left%2C_05-10-2022.jpg/1280px-2022_Honda_Civic_Touring_in_Lunar_Silver_Metallic%2C_Front_Left%2C_05-10-2022.jpg'])
  },
  {
    brand: 'Kia', model: 'Sportage FWD', year: 2023, category: 'SUV', dailyPrice: 20000, weeklyPrice: 120000, monthlyPrice: 450000, securityDeposit: 70000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 10000,
    color: 'Panthera Metal', location: 'Islamabad', description: 'A highly popular compact SUV offering great comfort and utility.',
    features: JSON.stringify(['Panoramic Sunroof', 'Apple CarPlay', 'Android Auto', 'Parking Sensors']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/2025_Kia_Sportage_S_front_only.jpg/1280px-2025_Kia_Sportage_S_front_only.jpg'])
  },
  {
    brand: 'Toyota', model: 'Fortuner Sigma 4', year: 2023, category: 'SUV', dailyPrice: 35000, weeklyPrice: 220000, monthlyPrice: 800000, securityDeposit: 100000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'DIESEL', seats: 7, mileage: 25000,
    color: 'Super White', location: 'Lahore', description: 'Rugged and reliable 7-seater SUV, excellent for family trips and tough terrains.',
    features: JSON.stringify(['4x4', '7 Seater', 'Cool Box', 'Power Tailgate']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/2015_Toyota_Fortuner_%28New_Zealand%29.jpg/1280px-2015_Toyota_Fortuner_%28New_Zealand%29.jpg'])
  },
  {
    brand: 'Suzuki', model: 'Alto VXL', year: 2024, category: 'ECONOMY', dailyPrice: 5000, weeklyPrice: 30000, monthlyPrice: 100000, securityDeposit: 20000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 5000,
    color: 'White', location: 'Karachi', description: 'The most fuel-efficient and practical city car in Pakistan.',
    features: JSON.stringify(['Air Conditioning', 'Power Windows', 'Power Steering', 'ABS']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/1994-1997_Suzuki_Alto.jpg/1280px-1994-1997_Suzuki_Alto.jpg'])
  },
  {
    brand: 'Honda', model: 'City Aspire', year: 2023, category: 'SEDAN', dailyPrice: 12000, weeklyPrice: 70000, monthlyPrice: 250000, securityDeposit: 40000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 18000,
    color: 'Urban Titanium', location: 'Islamabad', description: 'Comfortable family sedan with great fuel economy and boot space.',
    features: JSON.stringify(['Alloy Wheels', 'Navigation', 'Keyless Entry', 'Rear Camera']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg/1280px-2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg'])
  },
  {
    brand: 'Suzuki', model: 'Cultus VXL', year: 2022, category: 'ECONOMY', dailyPrice: 7000, weeklyPrice: 40000, monthlyPrice: 140000, securityDeposit: 25000, doors: 4,
    transmission: 'MANUAL', fuelType: 'PETROL', seats: 5, mileage: 30000,
    color: 'Silver', location: 'Lahore', description: 'A spacious hatchback perfect for small families and city commuting.',
    features: JSON.stringify(['Airbags', 'Alloy Rims', 'Power Windows', 'Bluetooth']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/2017_Suzuki_Celerio_SZ4_Automatic_1.0_Front.jpg/1280px-2017_Suzuki_Celerio_SZ4_Automatic_1.0_Front.jpg'])
  },
  {
    brand: 'Toyota', model: 'Hilux Revo Rocco', year: 2023, category: 'SUV', dailyPrice: 40000, weeklyPrice: 250000, monthlyPrice: 900000, securityDeposit: 150000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'DIESEL', seats: 5, mileage: 20000,
    color: 'Attitude Black', location: 'Islamabad', description: 'Premium 4x4 double cabin pickup for off-road adventures and rugged use.',
    features: JSON.stringify(['4x4', 'Overfenders', 'Sports Bar', 'LED Fog Lamps']),
    images: JSON.stringify(['https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/1280px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg'])
  }
];

export async function seedDatabase() {
  console.log('Checking if seeding is necessary...');
  
  const count = await Vehicle.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} vehicles. Skipping seed.`);
    return;
  }

  console.log('Seeding admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@emdrive.com',
    password: adminPassword,
    role: 'ADMIN',
  });
  await admin.save();

  console.log('Seeding customer users...');
  const customerPassword = await bcrypt.hash('password123', 10);
  const customer1 = new User({
    firstName: 'Ali',
    lastName: 'Khan',
    email: 'ali.khan@example.com',
    password: customerPassword,
    role: 'CUSTOMER',
  });
  await customer1.save();

  console.log('Seeding vehicles...');
  let vCount = 0;
  for (const car of vehiclesData) {
    const v = new Vehicle(car);
    await v.save();
    vCount++;
  }
  
  console.log(`Created ${vCount} vehicles.`);
  console.log('Database seeded successfully!');
}
