import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, UserCheck, Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: UserCheck,
      title: "Chauffeur Drive",
      desc: "Experience ultimate luxury with our professional, highly-trained chauffeurs. Perfect for executives and VIPs.",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?q=80&w=2070&auto=format&fit=crop"
    },
    {
      icon: Briefcase,
      title: "Corporate Fleet",
      desc: "Comprehensive mobility solutions for businesses. Flexible leasing and premium transport for your executives.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    {
      icon: Heart,
      title: "Wedding & Events",
      desc: "Make your special day unforgettable with our fleet of luxury and exotic vehicles, styled to perfection.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    },
    {
      icon: Clock,
      title: "Airport Transfers",
      desc: "Punctual, seamless, and comfortable airport pick-ups and drop-offs. We track your flight for guaranteed on-time service.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 px-4 md:px-8 xl:px-12 font-sans">
      <div className="max-w-[2000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24"
        >
          <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter text-white uppercase mb-6 leading-none">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">SERVICES</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
            Beyond exceptional vehicles, we provide a suite of premium services designed to elevate every aspect of your journey. Experience the EMDRIVE standard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-[2rem] bg-[#080808] border border-white/5"
            >
              <div className="absolute inset-0 z-0">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
              </div>
              
              <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end min-h-[400px]">
                <service.icon className="w-12 h-12 text-white mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight font-heading">{service.title}</h3>
                <p className="text-slate-300 leading-relaxed font-light mb-8 max-w-md">{service.desc}</p>
                <Link to="/contact" className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-slate-300 transition-colors w-fit">
                  Inquire Now <span className="ml-2">→</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
