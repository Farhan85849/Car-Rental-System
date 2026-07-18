import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'sonner';

import Navbar from '@/src/layouts/Navbar';
import Footer from '@/src/layouts/Footer';
import { AiChatWidget } from './components/AiChatWidget';

// Lazy loading components for code splitting
const Home = lazy(() => import('@/src/pages/Home'));
const Vehicles = lazy(() => import('@/src/features/vehicles/pages/Vehicles'));
const VehicleDetails = lazy(() => import('@/src/features/vehicles/pages/VehicleDetails'));
const Login = lazy(() => import('@/src/features/auth/pages/Login'));
const Register = lazy(() => import('@/src/features/auth/pages/Register'));
const AdminDashboard = lazy(() => import('@/src/features/admin/pages/AdminDashboard'));
const AdminReturnInspection = lazy(() => import('@/src/features/admin/pages/AdminReturnInspection').then(m => ({ default: m.AdminReturnInspection })));
const Profile = lazy(() => import('@/src/features/users/pages/Profile'));
const MyBookings = lazy(() => import('@/src/features/bookings/pages/MyBookings'));
const CustomerInspections = lazy(() => import('@/src/features/bookings/pages/CustomerInspections').then(m => ({ default: m.CustomerInspections })));
const Services = lazy(() => import('@/src/pages/Services'));
const Locations = lazy(() => import('@/src/pages/Locations'));
const Contact = lazy(() => import('@/src/pages/Contact'));
const About = lazy(() => import('@/src/pages/About'));
const Careers = lazy(() => import('@/src/pages/Careers'));
const Journal = lazy(() => import('@/src/pages/Journal'));
const BookingWizard = lazy(() => import('@/src/features/bookings/pages/BookingWizard'));

const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-[#030303]">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
  </div>
);

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

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#030303] text-white selection:bg-white selection:text-black">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
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
              <Route path="/admin/inspections/return/:bookingId" element={<AdminReturnInspection />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/my-fines" element={<CustomerInspections />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <AiChatWidget />
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
