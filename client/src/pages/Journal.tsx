import React from 'react';
import { motion } from 'framer-motion';

const Journal = () => {
  const articles = [
    {
      title: "The Evolution of Electric Luxury",
      category: "Automotive",
      date: "Oct 15, 2023",
      image: "https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Top 5 Scenic Drives in the Country",
      category: "Lifestyle",
      date: "Sep 28, 2023",
      image: "https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "Maintaining Peak Performance",
      category: "Technical",
      date: "Sep 10, 2023",
      image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pt-32 md:pt-40 pb-24 px-4 md:px-8 xl:px-12 font-sans text-white">
      <div className="max-w-[2000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter uppercase mb-6 leading-none">
            THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-600">JOURNAL</span>
          </h1>
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl">
            Stories, insights, and news from the world of EMDRIVE. Explore automotive excellence, lifestyle features, and company updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <span>{article.category}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                <span>{article.date}</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tighter group-hover:text-slate-300 transition-colors">{article.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Journal;
