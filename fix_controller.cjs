const fs = require('fs');
let code = fs.readFileSync('server/controllers/bookingController.ts', 'utf-8');

code = code.replace(
`    const priceDetails = calculateBookingPrice(vehicle, startDate, endDate, extras || {});
    const bookingNumber = generateBookingNumber();

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          vehicleId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          pickupLoc,
          dropoffLoc,
          ...priceDetails,
          driverOption: extras?.driverOption || false,`,
`    const { securityDeposit, ...priceDetailsForDb } = calculateBookingPrice(vehicle, startDate, endDate, extras || {});
    const bookingNumber = generateBookingNumber();

    const booking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          vehicleId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          pickupLoc,
          dropoffLoc,
          ...priceDetailsForDb,
          driverOption: extras?.driverOption || false,`
);

fs.writeFileSync('server/controllers/bookingController.ts', code);
