const fs = require('fs');
let code = fs.readFileSync('server/prisma/seed.ts', 'utf-8');

// Replace ECONOMY array with just one or two non-economy cars to keep indices ok, or just remove them.
code = code.replace(
  `// Economy / Small Cars
  {
    brand: 'Suzuki', model: 'Alto', year: 2023, category: 'ECONOMY', dailyPrice: 4000, weeklyPrice: 24000, monthlyPrice: 80000, securityDeposit: 10000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 25000,
    color: 'White', location: 'Karachi', description: 'Perfect for city driving, highly fuel efficient.',
    features: JSON.stringify(standardFeatures)
  },
  {
    brand: 'Suzuki', model: 'Cultus', year: 2022, category: 'ECONOMY', dailyPrice: 4500, weeklyPrice: 27000, monthlyPrice: 90000, securityDeposit: 15000, doors: 4,
    transmission: 'MANUAL', fuelType: 'PETROL', seats: 5, mileage: 35000,
    color: 'Silver', location: 'Lahore', description: 'Reliable and spacious for small families.',
    features: JSON.stringify(standardFeatures)
  },
  {
    brand: 'Suzuki', model: 'Wagon R', year: 2022, category: 'ECONOMY', dailyPrice: 4500, weeklyPrice: 27000, monthlyPrice: 90000, securityDeposit: 15000, doors: 4,
    transmission: 'MANUAL', fuelType: 'PETROL', seats: 5, mileage: 40000,
    color: 'White', location: 'Islamabad', description: 'Tall boy design with good headroom.',
    features: JSON.stringify(standardFeatures)
  },
  {
    brand: 'Kia', model: 'Picanto', year: 2023, category: 'ECONOMY', dailyPrice: 5500, weeklyPrice: 33000, monthlyPrice: 110000, securityDeposit: 20000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 15000,
    color: 'Red', location: 'Karachi', description: 'Compact and stylish automatic hatchback.',
    features: JSON.stringify([...standardFeatures, 'Alloy Wheels'])
  },
  {
    brand: 'Toyota', model: 'Vitz', year: 2021, category: 'ECONOMY', dailyPrice: 6000, weeklyPrice: 36000, monthlyPrice: 120000, securityDeposit: 25000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 45000,
    color: 'Black', location: 'Lahore', description: 'Reliable imported hatchback with good comfort.',
    features: JSON.stringify([...standardFeatures, 'Alloy Wheels', 'Push Start'])
  },`,
  `// Replacing Economy with Luxury
  {
    brand: 'Porsche', model: '911 Carrera', year: 2024, category: 'VIP', dailyPrice: 150000, weeklyPrice: 900000, monthlyPrice: 3300000, securityDeposit: 300000, doors: 2,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 1200,
    color: 'Black', location: 'Lahore', description: 'Iconic sports car delivering uncompromising performance.',
    features: JSON.stringify([...vipFeatures, 'Sport Chrono', 'Bose Audio'])
  },
  {
    brand: 'Bentley', model: 'Continental GT', year: 2023, category: 'VIP', dailyPrice: 200000, weeklyPrice: 1200000, monthlyPrice: 4500000, securityDeposit: 500000, doors: 2,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 3000,
    color: 'Silver', location: 'Karachi', description: 'The ultimate grand tourer blending breathtaking power and exquisite craftsmanship.',
    features: JSON.stringify([...vipFeatures, 'Naim Audio', 'Mulliner Driving Specification'])
  },
  {
    brand: 'Rolls-Royce', model: 'Ghost', year: 2024, category: 'VIP', dailyPrice: 250000, weeklyPrice: 1500000, monthlyPrice: 5500000, securityDeposit: 600000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 1500,
    color: 'White', location: 'Islamabad', description: 'A vision of modern luxury and effortless power.',
    features: JSON.stringify([...vipFeatures, 'Starlight Headliner', 'Shooting Star Headliner'])
  },
  {
    brand: 'Lamborghini', model: 'Urus', year: 2023, category: 'VIP', dailyPrice: 180000, weeklyPrice: 1080000, monthlyPrice: 4000000, securityDeposit: 400000, doors: 4,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 5, mileage: 4000,
    color: 'Yellow', location: 'Lahore', description: 'The worlds first Super Sport Utility Vehicle.',
    features: JSON.stringify([...vipFeatures, 'Bang & Olufsen', 'Carbon Fiber Package'])
  },
  {
    brand: 'Ferrari', model: 'Roma', year: 2023, category: 'VIP', dailyPrice: 160000, weeklyPrice: 960000, monthlyPrice: 3500000, securityDeposit: 350000, doors: 2,
    transmission: 'AUTOMATIC', fuelType: 'PETROL', seats: 4, mileage: 2500,
    color: 'Red', location: 'Karachi', description: 'La Nuova Dolce Vita - elegant and powerful.',
    features: JSON.stringify([...vipFeatures, 'Carbon Ceramic Brakes', 'Passenger Display'])
  },`
);

fs.writeFileSync('server/prisma/seed.ts', code);
