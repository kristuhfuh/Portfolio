import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 400);
          return 100;
        }
        return prev + Math.random() * 18;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cream dark:bg-[#0e0e0e]"
        >
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, transform: 'translateY(12px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="mb-10 flex items-center gap-3"
          >
            <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" className="fill-ink dark:fill-cream" />
              <text x="16" y="22" fontFamily="Fraunces, serif" fontSize="18" fontWeight="500" textAnchor="middle" className="fill-cream dark:fill-ink">C</text>
              <circle cx="24" cy="8" r="3" fill="#6D28D9" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="label text-ink dark:text-dark-ink">Christopher Akpoguma</span>
              <span className="label text-muted dark:text-dark-muted">/kris+tuh+fuh/</span>
            </div>
          </motion.div>

          {/* Progress track */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="w-48"
          >
            <div className="h-px w-full bg-line dark:bg-dark-line overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: 'linear' }}
                className="h-full bg-accent"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="label text-muted dark:text-dark-muted">Loading</span>
              <span className="label tabular-nums text-muted dark:text-dark-muted">{Math.min(100, Math.round(progress))}%</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
