import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-xs uppercase tracking-widest font-bold">Please login</div>;
  }

  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 md:pb-32 px-4 md:px-8 xl:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tighter text-white mb-12 md:mb-16 text-center">CLIENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">PORTAL.</span></h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden"
        >
          <div className="h-24 md:h-32 bg-gradient-to-r from-blue-900/20 to-black relative">
             <div className="absolute inset-0 bg-[url('/images/home_banner.jpg')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
          </div>
          
          <div className="px-6 md:px-12 pb-8 md:pb-12 relative -mt-12 md:-mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#030303] border-4 border-[#0a0a0a] flex items-center justify-center shadow-2xl relative z-10 shrink-0">
                <User className="w-10 h-10 md:w-12 md:h-12 text-slate-400" />
              </div>
              <div className="text-center md:text-left pb-2">
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-3 md:mb-2">{user.firstName} {user.lastName}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                  <div className="px-3 py-1.5 md:py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    {user.role}
                  </div>
                  <div className="px-3 py-1.5 md:py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                    <Award className="w-3 h-3" />
                    Premium Member
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#030303] border border-white/5 p-5 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                  </div>
                  <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Email Address</h3>
                </div>
                <p className="font-medium text-base md:text-lg text-white break-all">{user.email}</p>
              </div>
              
              <div className="bg-[#030303] border border-white/5 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                <p className="text-slate-400 text-sm font-light">More settings coming soon.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
