import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

const Timer = ({ duration = 45, onTimeUp, isActive = true, key }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    setTimeLeft(duration);
    setIsWarning(false);
    setIsCritical(false);
  }, [key, duration]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 15) setIsCritical(true);
        else if (newTime <= 25) setIsWarning(true);
        
        if (newTime <= 0) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const progressPercentage = (timeLeft / duration) * 100;

  const getTimerColor = () => {
    if (isCritical) return 'from-red-500 to-red-600';
    if (isWarning) return 'from-amber-500 to-orange-500';
    return 'from-blue-500 to-blue-600';
  };

  const getTextColor = () => {
    if (isCritical) return 'text-red-600';
    if (isWarning) return 'text-amber-600';
    return 'text-blue-600';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isCritical ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
          >
            <ClockIcon className={`w-5 h-5 ${getTextColor()}`} />
          </motion.div>
          <span className={`font-bold text-lg ${getTextColor()}`}>
            {timeLeft}s
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Time Remaining
        </span>
      </div>
      
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getTimerColor()} rounded-full`}
          initial={{ width: '100%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, ease: "linear" }}
        />
        
        {/* Pulse effect for critical */}
        {isCritical && (
          <motion.div
            className="absolute inset-0 bg-red-400 rounded-full"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

export default Timer;
