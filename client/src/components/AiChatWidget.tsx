import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles } from 'lucide-react';
import api from '@/src/api/axios';

const PremiumAIIcon = ({ size = 48 }: { size?: number }) => (
  <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
    {/* Outer rotating ring */}
    <div className="absolute inset-0 rounded-full border-[2px] border-t-[#00C6FF] border-r-transparent border-b-[#0072FF] border-l-transparent animate-[spin_4s_linear_infinite]" />
    
    {/* Inner dashed rotating ring */}
    <div className="absolute inset-[15%] rounded-full border-[1px] border-dashed border-[#00C6FF]/60 animate-[spin_5s_linear_infinite_reverse]" />
    
    {/* Central glowing core */}
    <div className="absolute inset-[25%] rounded-full bg-gradient-to-br from-[#00C6FF]/20 to-[#0072FF]/20 shadow-[0_0_20px_rgba(0,198,255,0.4)] flex items-center justify-center backdrop-blur-md border border-[#00C6FF]/30">
      <span className="text-white font-bold tracking-wider" style={{ fontSize: size * 0.28, textShadow: '0 0 8px rgba(0,198,255,0.8)' }}>AI</span>
    </div>
  </div>
);

export const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  
  const [history, setHistory] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Welcome to Emdrive AI. I am your premium assistant. How may I help you discover the perfect luxury vehicle today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setMessage('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMsg,
        history: history
      });
      
      setHistory(prev => [...prev, { role: 'assistant', content: response.data.data.message }]);
    } catch (error) {
      console.error('Chat error:', error);
      setHistory(prev => [...prev, { role: 'assistant', content: 'We apologize, but there was an error connecting to our AI service. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[9999] p-2 bg-[#040814] rounded-full border border-[#00C6FF]/20 shadow-[0_0_25px_rgba(0,198,255,0.15)] hover:shadow-[0_0_35px_rgba(0,198,255,0.3)] hover:border-[#00C6FF]/50 hover:scale-105 transition-all duration-300 flex items-center justify-center group"
      >
        <PremiumAIIcon size={56} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="fixed bottom-24 right-6 w-[22rem] sm:w-[26rem] bg-[#0A0F1C]/95 backdrop-blur-2xl border border-[#00C6FF]/20 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(0,198,255,0.1)] overflow-hidden z-[9999] flex flex-col"
            style={{ height: '550px', maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#040814] to-[#0A0F1C] border-b border-[#00C6FF]/10 flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C6FF]/5 to-transparent"></div>
              <div className="flex items-center gap-4 relative z-10">
                <PremiumAIIcon size={40} />
                <div>
                  <h3 className="font-semibold text-[15px] text-white tracking-wide">Emdrive Assistant</h3>
                  <p className="text-[11px] text-[#00C6FF]/80 flex items-center gap-1.5 uppercase tracking-wider mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C6FF] animate-pulse shadow-[0_0_8px_#00C6FF]"></span> Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full relative z-10">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              {history.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx === history.length - 1 ? 0.1 : 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-[14px] leading-relaxed shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white rounded-tr-sm' 
                      : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-sm backdrop-blur-md'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="text-[#00C6FF] mb-2 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase">
                        <Sparkles className="w-3 h-3" /> AI
                      </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl p-5 bg-white/5 text-white rounded-tl-sm border border-white/5 flex gap-2 items-center backdrop-blur-md">
                    <span className="w-2 h-2 bg-[#00C6FF] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#00C6FF] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-2 h-2 bg-[#00C6FF] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-[#0A0F1C] border-t border-white/5 flex gap-3 relative z-10">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message Emdrive AI..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-[#00C6FF]/50 focus:bg-white/10 transition-all"
              />
              <button 
                type="submit"
                disabled={isLoading || !message.trim()}
                className="w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-[#00C6FF] to-[#0072FF] text-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,198,255,0.4)] transition-all disabled:opacity-50 disabled:grayscale"
              >
                <Send className="w-5 h-5 ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
