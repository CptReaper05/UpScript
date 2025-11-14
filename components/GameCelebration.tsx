'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface GameCelebrationProps {
  show: boolean;
  type: 'correct' | 'incorrect' | 'complete';
  message?: string;
}

export default function GameCelebration({ show, type, message }: GameCelebrationProps) {
  const emoji = type === 'correct' ? '🎉' : type === 'incorrect' ? '😊' : '🏆';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none ${
            type === 'correct' ? 'bg-green-500/20' : type === 'incorrect' ? 'bg-red-500/20' : 'bg-purple-500/20'
          }`}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1], rotate: [0, 360] }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {emoji}
            </motion.div>
            {message && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-3xl font-bold ${
                  type === 'correct' ? 'text-green-600' : type === 'incorrect' ? 'text-red-600' : 'text-purple-600'
                }`}
              >
                {message}
              </motion.div>
            )}
            {type === 'correct' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: (Math.random() - 0.5) * 400,
                      y: (Math.random() - 0.5) * 400,
                      opacity: [1, 0],
                      scale: [1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1.5, delay: i * 0.05 }}
                    className="absolute left-1/2 top-1/2 text-2xl"
                  >
                    {['⭐', '✨', '🎊'][Math.floor(Math.random() * 3)]}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

