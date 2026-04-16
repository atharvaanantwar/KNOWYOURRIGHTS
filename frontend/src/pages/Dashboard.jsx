import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserCircleIcon, 
  BoltIcon, 
  FireIcon, 
  TrophyIcon,
  BookOpenIcon,
  ChevronDownIcon,
  PlayIcon
} from '@heroicons/react/24/solid';
import useGameStore from '../store/gameStore';
import { domains } from '../data/mockScenarios';
import XPBar from '../components/XPBar';
import StreakFlame from '../components/StreakFlame';

const Dashboard = () => {
  const { 
    totalXP, 
    level, 
    streak, 
    getProgressPercentage, 
    getXPToNextLevel,
    getTotalScenariosCompleted,
    getAccuracy,
    selectedDomain,
    setSelectedDomain,
    selectedDifficulty,
    setSelectedDifficulty,
    loadUserProgress,
    isLoading,
  } = useGameStore();

  const difficulties = ['All', 'easy', 'medium', 'hard']; 
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);
  const accuracy = getAccuracy();
  const completed = getTotalScenariosCompleted();
  const progressPercentage = getProgressPercentage();
  const xpToNext = getXPToNextLevel();

  // Load user progress on mount
  useEffect(() => {
    loadUserProgress();
  }, [loadUserProgress]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.domain-dropdown')) {
        setIsDomainOpen(false);
        setIsDifficultyOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

        {/* Main Action Area */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl shadow-2xl p-8 text-white"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-3">
                Ready to Test Your Knowledge?
              </h2>
              <p className="text-blue-100 mb-6 max-w-xl">
                Choose a legal domain and challenge yourself with real-world scenarios. 
                Earn XP, build your streak, and become a legal expert!
              </p>
              
              {/* Domain Selector */}
              
              <div className="domain-dropdown relative inline-block">
                <button
                  onClick={() => setIsDomainOpen(!isDomainOpen)}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <span>{selectedDomain === 'All' ? 'All Domains' : selectedDomain}</span>
                  <motion.div
                    animate={{ rotate: isDomainOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDownIcon className="w-5 h-5" />
                  </motion.div>
                </button>
                
                {isDomainOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-10"
                  >
                    {domains.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => {
                          setSelectedDomain(domain);
                          setIsDomainOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-medium transition-colors ${
                          selectedDomain === domain
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {domain === 'All' ? 'All Domains' : domain}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              {/* Difficulty Selector */}
              <div className="domain-dropdown relative inline-block ml-4">
                <button
                  onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <span>{selectedDifficulty === 'All' ? 'All Difficulties' : selectedDifficulty}</span>
                  <ChevronDownIcon className="w-5 h-5" />
                </button>
                
                {isDifficultyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-10"
                  >
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => {
                          setSelectedDifficulty(difficulty);
                          setIsDifficultyOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 font-medium transition-colors ${
                          selectedDifficulty === difficulty
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {difficulty === 'All' ? 'All Difficulties' : difficulty}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Play Button */}
            <Link to="/scenario">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <PlayIcon className="w-6 h-6" />
                Start Challenge
              </motion.button>
            </Link>
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
