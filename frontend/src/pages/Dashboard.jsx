import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BoltIcon, 
  FireIcon, 
  TrophyIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid';
import useGameStore from '../store/gameStore';
import XPBar from '../components/XPBar';
import StreakFlame from '../components/StreakFlame';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    totalXP, 
    level, 
    streak, 
    getProgressPercentage, 
    getXPToNextLevel,
    getTotalScenariosCompleted,
    getAccuracy,
    loadUserProgress,
  } = useGameStore();

  const accuracy = getAccuracy();
  const completed = getTotalScenariosCompleted();
  const progressPercentage = getProgressPercentage();
  const xpToNext = getXPToNextLevel();

  // Load user progress on mount
  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome back, <span className="text-blue-600">Legal Eagle!</span>
          </h1>
          <p className="text-slate-600">
            Ready to level up your legal knowledge today?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* XP Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-amber-100 p-3 rounded-xl">
                <BoltIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total XP</p>
                <p className="text-2xl font-bold text-slate-800">{totalXP}</p>
              </div>
            </div>
            <XPBar 
              currentXP={totalXP}
              level={level}
              progressPercentage={progressPercentage}
              xpToNext={xpToNext}
            />
          </div>

          {/* Level Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <TrophyIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Current Level</p>
                <p className="text-2xl font-bold text-slate-800">{level}</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {level < 5 ? 'Beginner' : level < 10 ? 'Intermediate' : 'Expert'} Advocate
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Current Streak</p>
                {streak > 0 ? (
                  <StreakFlame streak={streak} />
                ) : (
                  <div className="flex items-center gap-2">
                    <FireIcon className="w-6 h-6 text-slate-300" />
                    <span className="text-xl font-bold text-slate-400">No streak</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Answer correctly to build your streak!
            </p>
          </div>

          {/* Accuracy Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <BookOpenIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Accuracy</p>
                <p className="text-2xl font-bold text-slate-800">{accuracy}%</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {completed} scenarios completed
            </div>
          </div>
        </motion.div>

        {/* Main Action Area — Clickable card → /challenges */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/challenges')}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-8 text-white cursor-pointer group transition-shadow hover:shadow-blue-300/40"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-3">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-blue-100 max-w-xl">
                Choose a legal domain and challenge yourself with real-world scenarios. 
                Earn XP, build your streak, and become a legal expert!
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow shrink-0">
              Browse Challenges
              <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-bold text-slate-800 mb-1">XP System</h3>
            <p className="text-sm text-slate-600">
              Easy: 10 XP | Medium: 25 XP | Hard: 50 XP
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
            <div className="text-2xl mb-2">🔥</div>
            <h3 className="font-bold text-slate-800 mb-1">Streak Bonus</h3>
            <p className="text-sm text-slate-600">
              +5 XP for each consecutive correct answer!
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-slate-100">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="font-bold text-slate-800 mb-1">Hints Available</h3>
            <p className="text-sm text-slate-600">
              Use up to 3 hints per scenario wisely!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
