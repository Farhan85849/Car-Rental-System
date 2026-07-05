const fs = require('fs');
let code = fs.readFileSync('src/pages/MyBookings.tsx', 'utf-8');

code = code.replace(
`import { MapPin, ExternalLink, Download } from 'lucide-react';`,
`import { MapPin, ExternalLink, Download, X } from 'lucide-react';\nimport { AnimatePresence } from 'framer-motion';`
);

code = code.replace(
`  const [loading, setLoading] = useState(true);`,
`  const [loading, setLoading] = useState(true);\n  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);`
);

code = code.replace(
`  const handleCancel = async (id: string) => {
    try {
      await api.post(\`/bookings/\${id}/cancel\`);
      toast.success('Booking cancelled');
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    } catch(err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };`,
`  const confirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await api.post(\`/bookings/\${bookingToCancel}/cancel\`);
      toast.success('Booking cancelled');
      setBookings(bookings.map(b => b.id === bookingToCancel ? { ...b, status: 'CANCELLED' } : b));
      setBookingToCancel(null);
    } catch(err: any) {
      toast.error(err.response?.data?.error || 'Failed to cancel');
    }
  };`
);

code = code.replace(
`                          <button onClick={() => handleCancel(booking.id)} className="px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5">
                            Cancel
                          </button>`,
`                          <button onClick={() => setBookingToCancel(booking.id)} className="px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/5">
                            Cancel
                          </button>`
);

code = code.replace(
`      </div>
    </div>
  );
};`,
`      </div>

      <AnimatePresence>
        {bookingToCancel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setBookingToCancel(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-sm w-full relative"
              >
                <button
                  onClick={() => setBookingToCancel(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Cancel Booking</h3>
                <p className="text-sm text-gray-400 mb-6">Are you sure you want to cancel this reservation? This action cannot be undone.</p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setBookingToCancel(null)}
                    className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Keep It
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};`
);

fs.writeFileSync('src/pages/MyBookings.tsx', code);
