const fs = require('fs');
let code = fs.readFileSync('server/utils/priceCalculator.ts', 'utf-8');

code = code.replace(
  `const tax = (subTotal + extrasTotal) * 0.16; // 16% GST
  const totalPrice = subTotal + extrasTotal + tax + vehicle.securityDeposit;

  return {
    rentalDays,
    dailyRate,
    subTotal,
    extrasTotal,
    tax,
    securityDeposit: vehicle.securityDeposit,
    totalPrice
  };`,
  `const tax = (subTotal + extrasTotal) * 0.16; // 16% GST
  const totalPrice = subTotal + extrasTotal + tax;

  return {
    rentalDays,
    dailyRate,
    subTotal,
    extrasTotal,
    tax,
    totalPrice
  };`
);

fs.writeFileSync('server/utils/priceCalculator.ts', code);
