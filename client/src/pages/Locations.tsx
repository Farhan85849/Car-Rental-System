import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Locations = () => {
  const locations = [
    {
      city: "Lahore",
      type: "Headquarters",
      address: "123 Luxury Drive, Gulberg III, Lahore, Pakistan",
      phone: "+92 42 111 222 333",
      email: "lahore@emdrive.com",
      hours: "Mon - Sun: 24/7",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=2070&auto=format&fit=crop"
    },
    {
      city: "Karachi",
      type: "Premium Hub",
      address: "45 Elite Avenue, Clifton, Karachi, Pakistan",
      phone: "+92 21 111 222 333",
      email: "karachi@emdrive.com",
      hours: "Mon - Sun: 09:00 - 22:00",
      image: "https://images.unsplash.com/photo-1579548483751-24891b29a27c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      city: "Islamabad",
      type: "Executive Center",
      address: "78 Diplomatic Enclave, Islamabad, Pakistan",
      phone: "+92 51 111 222 333",
      email: "islamabad@emdrive.com",
      hours: "Mon - Sun: 09:00 - 22:00",
      image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=2065&auto=format&fit=crop"
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
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">LOCATIONS</span>
          </h1>
          <p className="text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
            Find an EMDRIVE premium hub near you. We operate in major cities to provide you with seamless access to our extraordinary collection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#080808] border border-white/5 rounded-[2rem] overflow-hidden group"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={loc.image} alt={loc.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="px-3 py-1 bg-white text-black text-[9px] font-bold tracking-widest uppercase rounded-full mb-3 inline-block">
                    {loc.type}
                  </span>
                  <h3 className="text-2xl font-bold font-heading tracking-tight tracking-tighter text-white">{loc.city}</h3>
                </div>
              </div>
              
              <div className="p-8 flex flex-col gap-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-5 h-5 text-slate-500 shrink-0 mt-1" />
                  <p className="text-slate-300 font-light leading-relaxed">{loc.address}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                  <p className="text-slate-300 font-mono text-sm">{loc.phone}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Mail className="w-5 h-5 text-slate-500 shrink-0" />
                  <p className="text-slate-300 font-mono text-sm">{loc.email}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                  <p className="text-slate-300 font-mono text-sm">{loc.hours}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;
