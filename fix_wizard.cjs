const fs = require('fs');
let code = fs.readFileSync('src/pages/booking/BookingWizard.tsx', 'utf-8');

code = code.replace(
  `                <div className="flex justify-between text-gray-500 text-xs pt-4">
                  <span>Refundable Deposit</span>
                  <span className="font-mono">PKR {priceDetails.securityDeposit.toLocaleString()}</span>
                </div>`,
  ``
);

code = code.replace(
  `                <div className="flex justify-between text-gray-500 text-xs pt-4">\n                  <span>Refundable Deposit</span>\n                  <span className="font-mono">PKR {priceDetails.securityDeposit.toLocaleString()}</span>\n                </div>`,
  ``
);

code = code.replace(
  `                <div className="flex justify-between text-gray-500 text-xs pt-4">\r\n                  <span>Refundable Deposit</span>\r\n                  <span className="font-mono">PKR {priceDetails.securityDeposit.toLocaleString()}</span>\r\n                </div>`,
  ``
);

fs.writeFileSync('src/pages/booking/BookingWizard.tsx', code);
