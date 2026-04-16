import { motion, AnimatePresence } from 'framer-motion';
import { BoltIcon, FireIcon } from '@heroicons/react/24/solid';

const XPGainAnimation = ({ xp, streakBonus, streak, isVisible, onComplete }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          onAnimationComplete={onComplete}
        >
          <div className="relative">
            {/* Background glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-3xl opacity-50"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 1, repeat: 2 }}
            />
            
            {/* Main XP card */}
            <motion.div
              className="relative bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-8 rounded-3xl shadow-2xl border-4 border-white"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                  '0 0 60px rgba(251, 191, 36, 0.8)',
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                ],
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center mb-4"
                >
                  <div className="bg-white p-4 rounded-full shadow-lg">
                    <BoltIcon className="w-12 h-12 text-amber-500" />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-6xl font-black text-white drop-shadow-lg">
                    +{xp}
                  </span>
                  <p className="text-xl font-bold text-white/90 mt-2">XP GAINED!</p>
                </motion.div>
                
                {streakBonus > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full"
                  >
                    <FireIcon className="w-5 h-5 text-orange-600" />
                    <span className="text-white font-bold">
                      +{streakBonus} Streak Bonus!
                    </span>
                  </motion.div>
                )}
                
                {streak > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-3 text-white/80 font-semibold"
                  >
                    {streak} in a row! Keep it up!
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * Math.PI / 4) * 150],
                  y: [0, Math.sin(i * Math.PI / 4) * 150],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.3 + i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XPGainAnimation;
