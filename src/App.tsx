import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'sonner';

import Navbar from '@/src/layouts/Navbar';
import Footer from '@/src/layouts/Footer';
import Home from '@/src/pages/Home';
import Vehicles from '@/src/features/vehicles/pages/Vehicles';
import VehicleDetails from '@/src/features/vehicles/pages/VehicleDetails';
import Login from '@/src/features/auth/pages/Login';
import Register from '@/src/features/auth/pages/Register';
import AdminDashboard from '@/src/features/admin/pages/AdminDashboard';
import Profile from '@/src/features/users/pages/Profile';
import MyBookings from '@/src/features/bookings/pages/MyBookings';
import Services from '@/src/pages/Services';
import Locations from '@/src/pages/Locations';
import Contact from '@/src/pages/Contact';
import About from '@/src/pages/About';
import Careers from '@/src/pages/Careers';
import Journal from '@/src/pages/Journal';
import BookingWizard from '@/src/features/bookings/pages/BookingWizard';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/services" element={<Services />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/vehicles/:id" element={<VehicleDetails />} />
            <Route path="/booking/:vehicleId" element={<BookingWizard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Routes>
        </main>
        <Footer />
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
