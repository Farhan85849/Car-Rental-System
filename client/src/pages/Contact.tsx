import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully. We will contact you shortly.');
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 px-4 md:px-8 xl:px-12 font-sans">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 md:mb-24 text-center"
        >
          <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter text-white uppercase mb-6 leading-none">
            GET IN <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">TOUCH</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Whether you have a question about our fleet, need assistance with a booking, or want to inquire about our premium services, our team is here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8 tracking-tighter">Contact Information</h3>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Phone</h4>
                  <p className="text-slate-400 font-mono">+92 42 111 222 333</p>
                  <p className="text-slate-500 text-sm mt-1">Available 24/7 for urgent inquiries</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Email</h4>
                  <p className="text-slate-400 font-mono">inquiries@emdrive.com</p>
                  <p className="text-slate-500 text-sm mt-1">We aim to respond within 2 hours</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">Headquarters</h4>
                  <p className="text-slate-400 leading-relaxed">123 Luxury Drive<br/>Gulberg III, Lahore<br/>Pakistan</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                  <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                  <input required type="text" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <input required type="email" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Service Interest</label>
                <select className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none">
                  <option value="general">General Inquiry</option>
                  <option value="chauffeur">Chauffeur Drive</option>
                  <option value="corporate">Corporate Fleet</option>
                  <option value="wedding">Wedding & Events</option>
                  <option value="airport">Airport Transfers</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                <textarea required rows={4} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button disabled={loading} type="submit" className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
                {loading ? 'Sending...' : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
