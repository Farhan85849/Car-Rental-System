const fs = require('fs');
let code = fs.readFileSync('server/controllers/vehicleController.ts', 'utf-8');

code = code.replace(
  `const vehicles = await prisma.vehicle.findMany({ where: whereClause });`,
  `const vehicles = await prisma.vehicle.findMany({ 
      where: whereClause,
      orderBy: { dailyPrice: 'desc' }
    });`
);

fs.writeFileSync('server/controllers/vehicleController.ts', code);
