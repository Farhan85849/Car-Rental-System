import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultFeatures = ['Air Conditioning', 'Power Windows', 'Power Steering', 'ABS', 'Airbags'];
const premiumFeatures = [...defaultFeatures, 'Leather Seats', 'Sunroof', 'Cruise Control', 'Alloy Wheels', 'Rear Camera', 'Bluetooth', 'Navigation'];
const vipFeatures = [...premiumFeatures, 'Heated Seats', 'Ventilated Seats', 'Panoramic Roof', '360 Camera', 'Premium Audio', 'Massage Seats', 'Ambient Lighting', 'Adaptive Cruise Control'];

const vehiclesData = [
  // Luxury & VIP Vehicles
  {
    brand: 'Mercedes-Benz', model: 'S-Class', year: 2024, category: 'VIP', dailyPrice: 120000, weeklyPrice: 720000, monthlyPrice: 2640000, securityDeposit: 240000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 2000,
    color: 'Black', location: 'Karachi', description: 'The pinnacle of luxury for weddings and VIP protocols.',
    features: JSON.stringify([...vipFeatures, 'Rear Seat Entertainment', 'Executive Seats']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629897048514-3dd74142ffce?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'BMW', model: '7 Series', year: 2024, category: 'VIP', dailyPrice: 110000, weeklyPrice: 660000, monthlyPrice: 2420000, securityDeposit: 220000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 4000,
    color: 'Dark Gray', location: 'Lahore', description: 'Exceptional luxury and road presence for special events.',
    features: JSON.stringify([...vipFeatures, 'Rear Seat Entertainment', 'Executive Seats']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556189250-93ba23f52474?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Audi', model: 'A8', year: 2023, category: 'VIP', dailyPrice: 105000, weeklyPrice: 630000, monthlyPrice: 2310000, securityDeposit: 210000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 5000,
    color: 'Black', location: 'Islamabad', description: 'Sleek, modern luxury sedan for premium experiences.',
    features: JSON.stringify([...vipFeatures, 'Rear Seat Entertainment', 'Executive Seats']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0b65?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Porsche', model: '911 Carrera', year: 2024, category: 'VIP', dailyPrice: 150000, weeklyPrice: 900000, monthlyPrice: 3300000, securityDeposit: 300000, doors: 2,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 1200,
    color: 'Silver', location: 'Lahore', description: 'Iconic sports car delivering uncompromising performance.',
    features: JSON.stringify([...vipFeatures, 'Sport Chrono', 'Bose Audio']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1503376760366-5a413e832041?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Rolls-Royce', model: 'Ghost', year: 2024, category: 'VIP', dailyPrice: 250000, weeklyPrice: 1500000, monthlyPrice: 5500000, securityDeposit: 600000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 1500,
    color: 'Black', location: 'Islamabad', description: 'A vision of modern luxury and effortless power.',
    features: JSON.stringify([...vipFeatures, 'Starlight Headliner', 'Shooting Star Headliner']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1633504581177-3e5f2dc87d9a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558253974-98c47b56d396?q=80&w=2070&auto=format&fit=crop'
    ])
  },
  {
    brand: 'Bentley', model: 'Continental GT', year: 2023, category: 'VIP', dailyPrice: 200000, weeklyPrice: 1200000, monthlyPrice: 4500000, securityDeposit: 500000, doors: 2,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 3000,
    color: 'Silver', location: 'Karachi', description: 'The ultimate grand tourer blending breathtaking power and exquisite craftsmanship.',
    features: JSON.stringify([...vipFeatures, 'Naim Audio', 'Mulliner Driving Specification']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1620882814836-98ec8d6ae617?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1633505670860-2e45ff99bc22?q=80&w=2070&auto=format&fit=crop'
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
    brand: 'Ferrari', model: 'Roma', year: 2023, category: 'VIP', dailyPrice: 160000, weeklyPrice: 960000, monthlyPrice: 3500000, securityDeposit: 350000, doors: 2,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 2500,
    color: 'Red', location: 'Karachi', description: 'La Nuova Dolce Vita - elegant and powerful.',
    features: JSON.stringify([...vipFeatures, 'Carbon Ceramic Brakes', 'Passenger Display']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592853625511-9e1962383827?q=80&w=2070&auto=format&fit=crop'
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
  {
    brand: 'Mercedes-Benz', model: 'G63 AMG', year: 2023, category: 'SUV', dailyPrice: 140000, weeklyPrice: 840000, monthlyPrice: 3080000, securityDeposit: 280000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 5000,
    color: 'Matte Black', location: 'Lahore', description: 'Unmistakable design and unstoppable performance.',
    features: JSON.stringify([...vipFeatures, 'AMG Ride Control', 'Burmester Surround Sound']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1520050735087-1ed65d9b0273?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop'
    ])
  }
];

async function main() {
  console.log('Clearing old data...');
  // Delete in correct order to avoid foreign key constraints
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@emdrive.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seeding customer users...');
  const customerPassword = await bcrypt.hash('password123', 10);
  
  const customer1 = await prisma.user.create({
    data: {
      firstName: 'Ali',
      lastName: 'Khan',
      email: 'ali.khan@example.com',
      password: customerPassword,
      role: 'CUSTOMER',
    },
  });

  console.log('Seeding vehicles...');
  const createdVehicles = [];
  
  for (const car of vehiclesData) {
    const v = await prisma.vehicle.create({
      data: car
    });
    createdVehicles.push(v);
  }
  
  console.log(`Created ${createdVehicles.length} vehicles.`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
