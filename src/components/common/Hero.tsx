import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Search, ChevronDown } from 'lucide-react';
import BookingSearchPanel from '@/src/features/bookings/components/BookingSearchPanel';
import gsap from 'gsap';

export default function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo('.hero-text-line', 
        { y: 100, opacity: 0, rotateX: 20 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.5, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
      );
      
      gsap.fromTo('.hero-badge',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)', delay: 1 }
      );

      gsap.fromTo('.hero-booking',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 1.2 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen min-h-[800px] w-full bg-[#030303] flex flex-col items-center justify-center overflow-hidden perspective-1000"
    >
      {/* Dynamic Ambient Lighting */}
      <motion.div 
        animate={{ 
          x: mousePos.x * -50, 
          y: mousePos.y * -50 
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
      </motion.div>

      {/* Cinematic Background */}
      <motion.div 
        animate={{ 
          scale: 1.05 + (mousePos.x * 0.02),
          x: mousePos.x * -20,
          y: mousePos.y * -20
        }}
        transition={{ type: "spring", stiffness: 40, damping: 30 }}
        className="absolute inset-0 z-0 bg-[#030303]"
      >
        <img src="/images/hero_bg.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.65]" />
        {/* Vignette & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/80 via-transparent to-[#030303] opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[2000px] px-4 md:px-8 xl:px-12 flex flex-col items-center justify-center flex-grow mt-24 md:mt-20">
        
        <div className="hero-badge flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md mb-8">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-slate-300 tracking-[0.2em] uppercase">
            The New Standard of Luxury
          </span>
        </div>

        <div ref={textRef} className="text-center perspective-1000">
          <div className="overflow-hidden pb-2">
            <h1 className="hero-text-line text-[clamp(4rem,12vw,12rem)] font-bold text-white tracking-tighter leading-[0.85] drop-shadow-2xl">
              DRIVE
            </h1>
          </div>
          <div className="overflow-hidden pb-4">
            <h1 className="hero-text-line text-[clamp(4rem,12vw,12rem)] font-bold tracking-tighter leading-[0.85] drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500">
              PERFECTION.
            </h1>
          </div>
        </div>

        <div className="overflow-hidden mt-8 max-w-2xl text-center">
          <p className="hero-text-line text-lg md:text-xl text-slate-400 font-light leading-relaxed">
            Curated selection of the world's most extraordinary vehicles. <br className="hidden md:block"/>
            Designed for those who demand excellence without compromise.
          </p>
        </div>
      </div>

      {/* Booking Form - Glassmorphic Float */}
      <div className="hero-booking relative z-20 w-full max-w-[1200px] px-4 md:px-8 xl:px-12 pb-16 mt-auto">
        <BookingSearchPanel />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/30"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
}

