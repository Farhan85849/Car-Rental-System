import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import api from '@/src/api/axios';

export const AiAnalytics = () => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const { data } = await api.get('/ai/analytics');
        setInsight(data.data.insight);
      } catch (err) {
         setInsight("AI Insights temporarily unavailable.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, []);

  return (
    <motion.div 
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8 flex gap-4"
    >
       <div className="shrink-0 p-3 bg-amber-500/20 text-amber-500 rounded-xl h-fit">
          <Sparkles className="w-6 h-6" />
       </div>
       <div>
          <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2">
             AI Business Insights
          </h3>
          {loading ? (
             <div className="animate-pulse flex flex-col gap-2">
                <div className="h-4 bg-amber-500/20 rounded w-full"></div>
                <div className="h-4 bg-amber-500/20 rounded w-5/6"></div>
                <div className="h-4 bg-amber-500/20 rounded w-4/6"></div>
             </div>
          ) : (
             <div className="text-amber-500/80 text-sm leading-relaxed prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: insight.replace(/\n/g, '<br/>') }} />
          )}
       </div>
    </motion.div>
  );
};
