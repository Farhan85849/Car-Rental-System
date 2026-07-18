import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { logout } from '@/src/features/auth/store/authSlice';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setShowDropdown(false);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed w-full z-[100] px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-500 ${
        isScrolled ? 'bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-colors duration-500">
            <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          </div>
          <span className="text-xl font-bold tracking-[0.2em] uppercase text-white">
            EMDRIVE
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-12 text-xs font-semibold tracking-[0.1em] uppercase text-slate-400">
        <Link to="/vehicles" className="hover:text-white transition-colors relative group">
          Collection
          <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full"></span>
        </Link>
        <Link to="/services" className="hover:text-white transition-colors relative group">
          Services
          <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full"></span>
        </Link>
        <Link to="/locations" className="hover:text-white transition-colors relative group">
          Locations
          <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full"></span>
        </Link>
      </nav>

      <div className="hidden md:flex items-center gap-6 relative">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                <UserIcon className="w-4 h-4 text-slate-300" />
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase">{user.firstName}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-4 w-48 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-2xl origin-top-right"
                >
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                    My Profile
                  </Link>
                  <Link to="/bookings" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                    My Bookings
                  </Link>
                  <Link to="/my-fines" className="block px-4 py-2 text-xs font-medium uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                    My Fines
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5 mt-2 flex items-center gap-2"
                  >
                    <LogOut className="w-3 h-3" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link to="/login" className="text-xs font-semibold tracking-[0.1em] uppercase text-slate-400 hover:text-white transition-colors group relative">
              Sign In
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full"></span>
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-white text-black text-xs font-bold tracking-wider uppercase rounded-full hover:bg-slate-200 transition-colors">
              Register
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-[80%] max-w-[400px] h-screen bg-[#0a0a0a] border-l border-white/5 z-[120] md:hidden shadow-2xl flex flex-col"
            >
              <div className="flex justify-end p-6">
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-slate-300 transition-colors p-2 rounded-full hover:bg-white/5">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-8">
                <div className="flex flex-col gap-6">
                  <Link to="/vehicles" onClick={() => setIsOpen(false)} className="text-2xl font-bold tracking-tighter text-white hover:text-slate-400 transition-colors">Collection</Link>
                  <Link to="/services" onClick={() => setIsOpen(false)} className="text-2xl font-bold tracking-tighter text-white hover:text-slate-400 transition-colors">Services</Link>
                  <Link to="/locations" onClick={() => setIsOpen(false)} className="text-2xl font-bold tracking-tighter text-white hover:text-slate-400 transition-colors">Locations</Link>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col gap-5 mt-auto mb-8">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Signed in as</p>
                          <p className="font-semibold text-white">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Admin Dashboard</Link>
                      )}
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Profile</Link>
                      <Link to="/bookings" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Bookings</Link>
                      <button onClick={handleLogout} className="text-left text-lg text-red-400 font-medium hover:text-red-300 transition-colors pt-2">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Sign In</Link>
                      <Link to="/register" onClick={() => setIsOpen(false)} className="w-full py-4 bg-white text-black text-center text-sm font-bold tracking-widest uppercase rounded-2xl hover:bg-slate-200 transition-colors">Register</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
