import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const FeedbackBanner = ({ isCorrect, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`fixed top-0 left-0 right-0 z-50 p-4 ${
        isCorrect 
          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
          : 'bg-gradient-to-r from-red-500 to-rose-500'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="bg-white p-2 rounded-full"
          >
            {isCorrect ? (
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
            ) : (
              <XCircleIcon className="w-8 h-8 text-red-500" />
            )}
          </motion.div>
          
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white"
            >
              {isCorrect ? 'Correct Answer!' : 'Wrong Answer!'}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80"
            >
              {isCorrect 
                ? 'Great job! You know your rights!' 
                : 'Don\'t worry, learn from this and try again!'}
            </motion.p>
          </div>
        </div>
        
        {onClose && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Continue
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackBanner;
