import axios from 'axios';

const test = async () => {
  try {
    const reg = await axios.post('http://localhost:3000/api/auth/register', {
      name: 'Test Customer',
      email: 'customer99@test.com',
      password: 'password123',
      phone: '1234567890',
      licenseNumber: 'LIC123'
    });
    const token = reg.data.token;
    
    const vehicles = await axios.get('http://localhost:3000/api/vehicles');
    const vehicleId = vehicles.data.data[0].id;

    const b = await axios.post('http://localhost:3000/api/bookings', {
      vehicleId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      pickupLoc: 'Test Location',
      dropoffLoc: 'Test Location',
      paymentMethod: 'STRIPE'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Booking created:', b.data.data.id, b.data.data.totalPrice);

    const p = await axios.post('http://localhost:3000/api/payments', {
      bookingId: b.data.data.id,
      amount: b.data.data.totalPrice,
      method: 'STRIPE'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Payment processed:', p.data);
  } catch (err: any) {
    console.log('Error:', err.response?.data || err.message);
  }
};
test();
