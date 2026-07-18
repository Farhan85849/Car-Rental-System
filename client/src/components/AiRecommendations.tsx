import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/src/api/axios';

export const AiRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const { data } = await api.post('/ai/recommend', { preferences: "User is looking for luxury VIP options for high level executives." });
        setRecommendations(data.data.vehicles);
        setReasoning(data.data.reasoning);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading || recommendations.length === 0) return null;

  return (
    <section className="py-12 px-4 md:px-8 xl:px-12 max-w-[1600px] mx-auto relative z-10 border-t border-b border-white/5 my-12 bg-amber-500/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">AI Recommendations</h2>
            <p className="text-[10px] text-amber-500/80 uppercase tracking-widest font-bold">Curated for you</p>
          </div>
        </div>
        <div className="max-w-md bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs text-amber-500/90 leading-relaxed italic">
          "{reasoning}"
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((vehicle, idx) => {
          const images = vehicle.images ? JSON.parse(vehicle.images) : [];
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={vehicle.id}
              className="group relative bg-[#0a0a0a] border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-colors"
            >
              <Link to={`/vehicles/${vehicle.id}`} className="block">
                <div className="h-48 overflow-hidden relative">
                  {images[0] && (
                    <img src={images[0]} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                     <span className="px-2 py-1 bg-amber-500 text-black text-[9px] font-bold uppercase tracking-widest rounded-md">AI Pick</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-1">{vehicle.brand} {vehicle.model}</h3>
                  <div className="flex justify-between items-center mt-4">
                     <span className="font-mono text-amber-500">PKR {vehicle.dailyPrice?.toLocaleString()}/d</span>
                     <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  );
};
