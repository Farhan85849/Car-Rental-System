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
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629897048514-3dd74142ffce?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Lamborghini', model: 'Urus', year: 2023, category: 'VIP', dailyPrice: 180000, weeklyPrice: 1080000, monthlyPrice: 4000000, securityDeposit: 400000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 4000,
    color: 'Black', location: 'Lahore', description: 'The worlds first Super Sport Utility Vehicle.',
    features: JSON.stringify([...vipFeatures, 'Bang & Olufsen', 'Carbon Fiber Package']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1662923707759-3cb2f9b1bb95?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1652458428863-881512fb7e56?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Land Rover', model: 'Range Rover Autobiography', year: 2024, category: 'SUV', dailyPrice: 95000, weeklyPrice: 570000, monthlyPrice: 2090000, securityDeposit: 190000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 1500,
    color: 'Black', location: 'Islamabad', description: 'The ultimate luxury SUV with peerless refinement.',
    features: JSON.stringify([...vipFeatures, 'Meridian Signature Sound', 'Executive Class Rear Seats']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606016159991-efe28c4658eb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2032&auto=format&fit=crop'
    ])
  },
  // Pakistani Local Collection
  {
    brand: 'Toyota', model: 'Corolla Altis Grande', year: 2023, category: 'SEDAN', dailyPrice: 15000, weeklyPrice: 90000, monthlyPrice: 350000, securityDeposit: 50000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 15000,
    color: 'White', location: 'Lahore', description: 'Pakistan\'s most favorite and reliable premium sedan.',
    features: JSON.stringify(['Sunroof', 'Alloy Rims', 'Cruise Control', 'Push Start']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1623810142470-349896791e2b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Honda', model: 'Civic Oriel', year: 2023, category: 'SEDAN', dailyPrice: 18000, weeklyPrice: 110000, monthlyPrice: 400000, securityDeposit: 60000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 12000,
    color: 'Black', location: 'Karachi', description: 'Sporty and elegant, the Honda Civic is perfect for executive travel.',
    features: JSON.stringify(['Sunroof', 'Leather Seats', 'Retractable Mirrors', 'Climate Control']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Kia', model: 'Sportage FWD', year: 2023, category: 'SUV', dailyPrice: 20000, weeklyPrice: 120000, monthlyPrice: 450000, securityDeposit: 70000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 10000,
    color: 'Panthera Metal', location: 'Islamabad', description: 'A highly popular compact SUV offering great comfort and utility.',
    features: JSON.stringify(['Panoramic Sunroof', 'Apple CarPlay', 'Android Auto', 'Parking Sensors']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1634599723223-9993309a6326?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1655189689456-91e70e9a31a5?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Toyota', model: 'Fortuner Sigma 4', year: 2023, category: 'SUV', dailyPrice: 35000, weeklyPrice: 220000, monthlyPrice: 800000, securityDeposit: 100000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'DIESEL', seats: 7, mileage: 25000,
    color: 'Super White', location: 'Lahore', description: 'Rugged and reliable 7-seater SUV, excellent for family trips and tough terrains.',
    features: JSON.stringify(['4x4', '7 Seater', 'Cool Box', 'Power Tailgate']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1620953880460-1d8f1e63a8da?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1667232306718-d758f8b89cf5?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Suzuki', model: 'Alto VXL', year: 2024, category: 'ECONOMY', dailyPrice: 5000, weeklyPrice: 30000, monthlyPrice: 100000, securityDeposit: 20000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 5000,
    color: 'White', location: 'Karachi', description: 'The most fuel-efficient and practical city car in Pakistan.',
    features: JSON.stringify(['Air Conditioning', 'Power Windows', 'Power Steering', 'ABS']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Honda', model: 'City Aspire', year: 2023, category: 'SEDAN', dailyPrice: 12000, weeklyPrice: 70000, monthlyPrice: 250000, securityDeposit: 40000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 18000,
    color: 'Urban Titanium', location: 'Islamabad', description: 'Comfortable family sedan with great fuel economy and boot space.',
    features: JSON.stringify(['Alloy Wheels', 'Navigation', 'Keyless Entry', 'Rear Camera']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Suzuki', model: 'Cultus VXL', year: 2022, category: 'ECONOMY', dailyPrice: 7000, weeklyPrice: 40000, monthlyPrice: 140000, securityDeposit: 25000, doors: 4,
    transmission: 'MANUAL', fuelType: 'PETROL', seats: 5, mileage: 30000,
    color: 'Silver', location: 'Lahore', description: 'A spacious hatchback perfect for small families and city commuting.',
    features: JSON.stringify(['Airbags', 'Alloy Rims', 'Power Windows', 'Bluetooth']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1619682817481-e994891cb1b4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Toyota', model: 'Hilux Revo Rocco', year: 2023, category: 'SUV', dailyPrice: 40000, weeklyPrice: 250000, monthlyPrice: 900000, securityDeposit: 150000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'DIESEL', seats: 5, mileage: 20000,
    color: 'Attitude Black', location: 'Islamabad', description: 'Premium 4x4 double cabin pickup for off-road adventures and rugged use.',
    features: JSON.stringify(['4x4', 'Overfenders', 'Sports Bar', 'LED Fog Lamps']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
    ])
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
