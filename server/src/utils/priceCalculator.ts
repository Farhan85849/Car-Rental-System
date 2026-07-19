export const calculateBookingPrice = (
  vehicle: any,
  startDate: string | Date,
  endDate: string | Date,
  rentalType: string = 'CITY', // 'CITY', 'OUT_OF_CITY', 'AIRPORT', 'EVENT'
  tripType: string = 'DAILY', // 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'
  driveType: string = 'SELF_DRIVE', // 'SELF_DRIVE', 'CHAUFFEUR'
  extras: { gps?: boolean; childSeat?: boolean; wifi?: boolean } = {},
  tripDetails: { estimatedDistance?: number; securityDeposit?: number } = {}
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(end.getTime() - start.getTime());
  
  let rentalDuration = 1; // Default 1
  let subTotal = 0;
  let dailyRate = vehicle.dailyPrice;
  
  if (tripType === 'HOURLY') {
    rentalDuration = Math.ceil(diffTime / (1000 * 60 * 60));
    if (rentalDuration < 1) rentalDuration = 1;
    // Assuming hourly price is calculated from daily price if not provided directly
    const hourlyPrice = (vehicle.dailyPrice / 24) * 1.5; // Premium for hourly
    dailyRate = hourlyPrice;
    subTotal = rentalDuration * hourlyPrice;
  } else {
    rentalDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (rentalDuration < 1) rentalDuration = 1;
    
    if (rentalDuration >= 30) {
      dailyRate = vehicle.monthlyPrice / 30; // approximate
      subTotal = vehicle.monthlyPrice * Math.floor(rentalDuration / 30) + (rentalDuration % 30) * (vehicle.monthlyPrice / 30);
    } else if (rentalDuration >= 7) {
      dailyRate = vehicle.weeklyPrice / 7; // approximate
      subTotal = vehicle.weeklyPrice * Math.floor(rentalDuration / 7) + (rentalDuration % 7) * vehicle.dailyPrice;
    } else {
      subTotal = rentalDuration * vehicle.dailyPrice;
    }
  }

  let driverCharges = 0;
  let driverAllowance = 0;
  let nightStayAllowance = 0;
  let tollCharges = 0;
  let securityDeposit = tripDetails.securityDeposit || 0;
  let extrasTotal = 0;

  // Driver Charges
  if (driveType === 'CHAUFFEUR' || rentalType === 'AIRPORT' || rentalType === 'EVENT') {
    if (tripType === 'HOURLY') {
      driverCharges = rentalDuration * 300; // 300 per hour
    } else {
      driverCharges = rentalDuration * 3000; // 3000 per day
    }
  }

  // Out of City specific charges
  if (rentalType === 'OUT_OF_CITY') {
    if (driveType === 'CHAUFFEUR') {
      driverAllowance = rentalDuration * 1000; // Food/allowance
      nightStayAllowance = (rentalDuration > 1 ? rentalDuration - 1 : 0) * 2000;
    }
    // Estimated toll charges
    tollCharges = 1500; // Base estimate for out of city tolls
    
    if (driveType === 'SELF_DRIVE' && !securityDeposit) {
      securityDeposit = vehicle.securityDeposit || 50000; // Default out of city self drive deposit
    }
  }

  // General extras
  if (extras.gps) extrasTotal += rentalDuration * 500;
  if (extras.childSeat) extrasTotal += rentalDuration * 500;
  if (extras.wifi) extrasTotal += rentalDuration * 700;

  const preTaxTotal = subTotal + driverCharges + driverAllowance + nightStayAllowance + tollCharges + extrasTotal;
  const tax = preTaxTotal * 0.02; // 2% GST
  
  const discount = 0;
  const totalPrice = preTaxTotal + tax - discount + securityDeposit;

  return {
    rentalDuration,
    dailyRate,
    subTotal,
    driverCharges,
    driverAllowance,
    nightStayAllowance,
    tollCharges,
    securityDeposit,
    extrasTotal,
    tax,
    discount,
    totalPrice
  };
};

export const generateBookingNumber = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `PKR-${year}-${rand}`;
};
