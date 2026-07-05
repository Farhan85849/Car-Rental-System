import { Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#030303] text-slate-50 relative overflow-hidden pt-32 pb-12">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-900/50 to-transparent blur-[2px]"></div>
      
      <div className="max-w-[2000px] mx-auto px-4 md:px-8 xl:px-12 relative z-10 flex flex-col">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-32">
          <div className="max-w-md">
            <h3 className="text-2xl font-bold tracking-tighter mb-6">
              Exceptional journeys begin here.
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-light mb-8">
              Curating the world's most extraordinary vehicles for those who demand excellence without compromise. Experience the pinnacle of automotive engineering on your terms.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24 w-full lg:w-auto">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-4">Collection</h4>
              <Link to="/vehicles" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Performance</Link>
              <Link to="/vehicles" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Luxury</Link>
              <Link to="/vehicles" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">SUVs</Link>
              <Link to="/vehicles" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Electric</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-4">Company</h4>
              <Link to="/services" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Services</Link>
              <Link to="/locations" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Locations</Link>
              <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
              <Link to="/careers" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Careers</Link>
              <Link to="/journal" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Journal</Link>
              <Link to="/contact" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h4 className="font-bold text-[10px] tracking-[0.2em] uppercase text-slate-500 mb-4">Legal</h4>
              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col gap-8 items-center justify-center">
          <h1 className="text-[12vw] md:text-[14vw] font-bold tracking-tighter leading-none text-white/5 select-none text-center">
            EMDRIVE
          </h1>
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
            <p>&copy; {new Date().getFullYear()} EMDRIVE. All rights reserved.</p>
            <p className="uppercase tracking-[0.2em] mt-4 md:mt-0">The Art of Driving</p>
          </div>
        </div>

      </div>
    </footer>
  );
}
