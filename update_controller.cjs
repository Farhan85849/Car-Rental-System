const fs = require('fs');
let code = fs.readFileSync('server/controllers/vehicleController.ts', 'utf-8');

if (!code.includes('const { category, brand, startDate, endDate, location }')) {
  code = code.replace(
    `const { category, brand, startDate, endDate } = req.query;`,
    `const { category, brand, startDate, endDate, location } = req.query;`
  );
  
  code = code.replace(
    `if (brand) whereClause.brand = brand;`,
    `if (brand) whereClause.brand = brand;\n    if (location) whereClause.location = { contains: String(location) };`
  );
  fs.writeFileSync('server/controllers/vehicleController.ts', code);
}
