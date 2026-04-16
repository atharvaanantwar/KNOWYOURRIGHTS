import { motion } from 'framer-motion';
import { BoltIcon } from '@heroicons/react/24/solid';

const XPBar = ({ currentXP, level, progressPercentage, xpToNext }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            Level {level}
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <BoltIcon className="w-4 h-4" />
            <span className="font-semibold text-sm">{currentXP} XP</span>
          </div>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {xpToNext} XP to next level
        </span>
      </div>
      
      <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3)',
          }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ['-100%', '400%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

export default XPBar;
