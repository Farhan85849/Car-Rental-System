export const calculateBookingPrice = (
  vehicle: any,
  startDate: string | Date,
  endDate: string | Date,
  extras: { driverOption: boolean; insurance: boolean; gps: boolean; childSeat: boolean; wifi: boolean }
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Calculate difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());
  let rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (rentalDays < 1) rentalDays = 1;

  let dailyRate = vehicle.dailyPrice;
  let subTotal = 0;

  if (rentalDays >= 30) {
    dailyRate = vehicle.monthlyPrice / 30; // approximate
    subTotal = vehicle.monthlyPrice * Math.floor(rentalDays / 30) + (rentalDays % 30) * (vehicle.monthlyPrice / 30);
  } else if (rentalDays >= 7) {
    dailyRate = vehicle.weeklyPrice / 7; // approximate
    subTotal = vehicle.weeklyPrice * Math.floor(rentalDays / 7) + (rentalDays % 7) * vehicle.dailyPrice;
  } else {
    subTotal = rentalDays * vehicle.dailyPrice;
  }

  let extrasTotal = 0;
  if (extras.driverOption) extrasTotal += rentalDays * 3000;
  if (extras.insurance) extrasTotal += rentalDays * 2000;
  if (extras.gps) extrasTotal += rentalDays * 500;
  if (extras.childSeat) extrasTotal += rentalDays * 500;
  if (extras.wifi) extrasTotal += rentalDays * 700;

  const tax = (subTotal + extrasTotal) * 0.16; // 16% GST
  const totalPrice = subTotal + extrasTotal + tax;

  return {
    rentalDays,
    dailyRate,
    subTotal,
    extrasTotal,
    tax,
    totalPrice
  };
};

export const generateBookingNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `PKR-${year}-${rand}`;
};
