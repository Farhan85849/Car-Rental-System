import React from 'react';
import { motion } from 'framer-motion';

const Careers = () => {
  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 px-4 md:px-8 xl:px-12 font-sans text-white">
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter uppercase mb-6 leading-none">
            JOIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">EMDRIVE</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-16">
            We are always looking for passionate, driven individuals to join our team. Currently, we don't have any open positions, but we are growing fast.
          </p>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 tracking-tighter">Send us your resume</h3>
            <p className="text-slate-400 mb-8 font-light">
              Send your CV and a brief cover letter to our recruitment team. We will keep your details on file for future opportunities.
            </p>
            <a href="mailto:careers@emdrive.com" className="inline-block px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:bg-slate-200 transition-colors">
              careers@emdrive.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Careers;
