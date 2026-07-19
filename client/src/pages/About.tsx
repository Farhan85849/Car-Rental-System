import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 px-4 md:px-8 xl:px-12 font-sans text-white">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter uppercase mb-6 leading-none">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">EMDRIVE</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Redefining luxury mobility. We offer a curated collection of the world's most extraordinary vehicles, paired with uncompromising service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="aspect-[21/9] w-full rounded-[2rem] overflow-hidden mb-16 relative"
        >
          <img src="https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Luxury Car" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-bold tracking-tight mb-6 uppercase tracking-widest font-heading text-slate-200">Our Philosophy</h3>
            <p className="text-slate-400 leading-relaxed font-light mb-4">
              At EMDRIVE, we believe that the journey is just as important as the destination. We were founded on a simple principle: to provide an automotive experience that transcends the ordinary.
            </p>
            <p className="text-slate-400 leading-relaxed font-light">
              Every vehicle in our fleet is meticulously maintained and carefully selected to ensure we offer only the pinnacle of performance, luxury, and design.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl font-bold tracking-tight mb-6 uppercase tracking-widest font-heading text-slate-200">Our Commitment</h3>
            <p className="text-slate-400 leading-relaxed font-light mb-4">
              We are committed to excellence without compromise. From the moment you make a reservation to the second you return the keys, our dedicated team ensures a seamless, bespoke experience tailored to your exact needs.
            </p>
            <p className="text-slate-400 leading-relaxed font-light">
              Whether you are an executive requiring reliable corporate transport, or an enthusiast seeking the thrill of a supercar, EMDRIVE delivers.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
