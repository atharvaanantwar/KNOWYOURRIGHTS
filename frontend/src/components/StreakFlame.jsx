import { motion } from 'framer-motion';
import { FireIcon } from '@heroicons/react/24/solid';

const StreakFlame = ({ streak }) => {
  if (streak === 0) return null;
  
  const getStreakColor = (streak) => {
    if (streak >= 10) return 'from-purple-500 to-pink-500';
    if (streak >= 5) return 'from-orange-500 to-red-500';
    return 'from-amber-400 to-orange-500';
  };
  
  const getStreakText = (streak) => {
    if (streak >= 10) return 'Unstoppable!';
    if (streak >= 5) return 'On Fire!';
    return 'Streak!';
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex items-center gap-2"
    >
      <div className="relative">
        {/* Glow effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${getStreakColor(streak)} rounded-full blur-lg opacity-60`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Flame icon */}
        <motion.div
          animate={{
            rotate: [-2, 2, -2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`relative bg-gradient-to-r ${getStreakColor(streak)} p-2 rounded-full`}
        >
          <FireIcon className="w-6 h-6 text-white" />
        </motion.div>
        
        {/* Spark particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-gradient-to-r ${getStreakColor(streak)} rounded-full`}
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, (i - 1) * 20],
              y: [0, -30 - i * 10],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      
      <div className="flex flex-col">
        <motion.span
          key={streak}
          initial={{ scale: 1.5, y: -10 }}
          animate={{ scale: 1, y: 0 }}
          className={`text-2xl font-bold bg-gradient-to-r ${getStreakColor(streak)} bg-clip-text text-transparent`}
        >
          {streak}
        </motion.span>
        <span className={`text-xs font-semibold bg-gradient-to-r ${getStreakColor(streak)} bg-clip-text text-transparent`}>
          {getStreakText(streak)}
        </span>
      </div>
    </motion.div>
  );
};

export default StreakFlame;
