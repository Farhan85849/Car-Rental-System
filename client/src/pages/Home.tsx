import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, MapPin, ChevronRight, X } from 'lucide-react';
import Hero from '@/src/components/common/Hero';
import { AiRecommendations } from '@/src/components/AiRecommendations';
import { fetchVehicles } from '@/src/features/vehicles/store/vehicleSlice';
import { AppDispatch, RootState } from '@/src/store/store';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, loading } = useSelector((state: RootState) => state.vehicles);
  const containerRef = useRef<HTMLDivElement>(null);
  
  

  useEffect(() => {
    dispatch(fetchVehicles({}));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && vehicles.length > 0) {
      const ctx = gsap.context(() => {
        // Text reveals
        gsap.utils.toArray('.reveal-text').forEach((text: any) => {
          gsap.fromTo(text,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 1, ease: 'power3.out',
              scrollTrigger: {
                trigger: text,
                start: 'top 85%',
              }
            }
          );
        });

        // Image Parallax & Scale
        gsap.utils.toArray('.img-parallax').forEach((img: any) => {
          gsap.fromTo(img,
            { scale: 1.2, y: -20 },
            {
              scale: 1, y: 20, ease: 'none',
              scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });
        
        // Cards stagger
        gsap.fromTo('.feature-card',
          { y: 100, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out',
            scrollTrigger: {
              trigger: '.features-container',
              start: 'top 80%',
            }
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, vehicles]);

  const featuredCars = vehicles.filter(v => ['Ghost', 'Continental GT', 'Urus'].includes(v.model)).length === 3 
    ? vehicles.filter(v => ['Ghost', 'Continental GT', 'Urus'].includes(v.model)).sort((a,b) => a.model.localeCompare(b.model))
    : vehicles.slice(0, 3);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030303] text-white selection:bg-white/30 selection:text-white">
      <Hero />
      <AiRecommendations />
      
      {/* Featured Fleet - Editorial Layout */}
      <section className="py-24 md:py-32 xl:py-48 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8">
          <div className="max-w-3xl">
            <h2 className="reveal-text text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tighter leading-[0.9] mb-6 md:mb-8">
              THE <br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">COLLECTION.</span>
            </h2>
            <p className="reveal-text text-base md:text-lg text-slate-400 font-light max-w-xl leading-relaxed">
              An exclusive fleet of the most coveted vehicles. Handpicked for those who appreciate engineering mastery and unparalleled luxury.
            </p>
          </div>
          <div className="reveal-text pb-2">
            <Link 
              to="/vehicles" 
              className="group flex items-center gap-4 text-xs md:text-sm font-bold uppercase tracking-widest text-white hover:text-white transition-colors"
            >
              View Full Fleet 
              <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-400 transition-colors shrink-0">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-24 md:gap-32">
          {loading ? (
            <div className="h-[40vh] md:h-[60vh] w-full bg-white/5 animate-pulse rounded-[1.5rem]" />
          ) : (
            featuredCars.map((car: any, index: number) => {
              const images = JSON.parse(car.images || '[]');
              const isEven = index % 2 === 0;
              
              return (
                <div key={car.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 xl:gap-24 items-center group`}>
                  
                  {/* Image Container with Parallax mask */}
                  <div className="w-full lg:w-[65%] aspect-[4/3] lg:aspect-[16/9] overflow-hidden rounded-[1.5rem] relative transform-gpu">
                    <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-700" />
                    <img 
                      src={images[0]} 
                      alt={car.model}
                      loading="lazy"
                      decoding="async"
                      className="img-parallax w-full h-full object-cover origin-center will-change-transform"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="w-full lg:w-[35%] flex flex-col justify-center relative px-2 lg:px-0">
                    <p className="reveal-text text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4">
                      {car.brand}
                    </p>
                    <h3 className="reveal-text text-[clamp(1.5rem,3vw,2.5rem)] font-heading font-bold tracking-tighter mb-6 md:mb-8 leading-[0.9]">
                      {car.model}
                    </h3>
                    
                    <div className="reveal-text grid grid-cols-2 gap-y-6 gap-x-4 md:flex md:flex-wrap md:gap-x-8 md:gap-y-4 text-sm text-slate-400 font-medium mb-10 border-t border-white/5 pt-6 mt-6 mb-8 w-full flex-row justify-between pl-0">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">Performance</span>
                        <span className="text-white">{car.transmission}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">Capacity</span>
                        <span className="text-white">{car.seats} Seats</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-600 mb-1">Daily Rate</span>
                        <span className="text-white">PKR {car.dailyPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="reveal-text">
                      <Link to={`/vehicles/${car.id}`} className="inline-flex items-center justify-center w-full md:w-auto gap-4 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors group/btn">
                        Discover 
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* Immersive Video Banner */}
      <section className="relative h-[60vh] md:h-[80vh] min-h-[500px] md:min-h-[600px] w-full overflow-hidden flex items-center justify-center group/banner">
        <div className="absolute inset-0 bg-black z-10 opacity-50 group-hover/video:opacity-30 transition-opacity duration-1000"></div>
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu">
          <img src="https://images.unsplash.com/photo-1503376760366-5a413e832041?q=80&w=2070&auto=format&fit=crop" alt="Immersive Banner" loading="lazy" decoding="async" className="w-full h-full object-cover scale-105 pointer-events-none" />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          
          
          <h2 className="reveal-text text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tighter leading-[0.9] mb-4 md:mb-6">
            BEYOND <br/>DRIVING.
          </h2>
          <p className="reveal-text text-sm md:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            A symphony of power, design, and uncompromising luxury. Experience the pinnacle of automotive engineering on your terms.
          </p>
        </div>
      </section>
      
      {/* Premium Features */}
      <section className="py-24 md:py-32 xl:py-48 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="reveal-text text-[clamp(1.5rem,3vw,2.5rem)] font-heading font-bold tracking-tighter mb-4 md:mb-6">
            THE EMDRIVE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">STANDARD</span>
          </h2>
        </div>

        <div className="features-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {[
            { 
              icon: Shield, 
              title: 'White Glove Service', 
              desc: 'From reservation to vehicle return, experience a seamless, fully tailored concierge service that anticipates your needs.' 
            },
            { 
              icon: MapPin, 
              title: 'Anywhere Delivery', 
              desc: 'Your vehicle, delivered to your doorstep, private jet terminal, or hotel. Precision timing, zero friction.' 
            },
            { 
              icon: Star, 
              title: 'Immaculate Fleet', 
              desc: 'Every vehicle is maintained to factory-perfect condition, detailed before every journey, ensuring absolute perfection.' 
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="feature-card p-8 md:p-12 rounded-[1.5rem] bg-[#080808] border border-white/5 hover:border-white/20 transition-colors duration-500 flex flex-col items-start"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 md:mb-8">
                <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}
