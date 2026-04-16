import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  TrophyIcon,
  BoltIcon,
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  BookOpenIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import useGameStore from '../store/gameStore';
import XPBar from '../components/XPBar';

const Progress = () => {
  const { 
    totalXP, 
    level, 
    streak, 
    xpHistory, 
    completedScenarios,
    getProgressPercentage,
    getXPToNextLevel,
    getAccuracy,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState('overview');
  
  const accuracy = getAccuracy();
  const xpToNext = getXPToNextLevel();
  const progressPercentage = getProgressPercentage();
  
  // Calculate stats
  const totalCorrect = completedScenarios.filter(s => s.correct).length;
  const totalWrong = completedScenarios.filter(s => !s.correct).length;
  
  // Get recent XP history (last 10)
  const recentXPHistory = [...xpHistory].reverse().slice(0, 10);
  
  // Calculate XP by domain
  const xpByDomain = xpHistory.reduce((acc, entry) => {
    acc[entry.domain] = (acc[entry.domain] || 0) + entry.totalEarned;
    return acc;
  }, {});
  
  // Level milestones
  const milestones = [
    { level: 1, title: 'Legal Novice', description: 'Started your journey', icon: '🌱' },
    { level: 5, title: 'Rights Aware', description: 'Completed 5+ scenarios', icon: '📚' },
    { level: 10, title: 'Law Enthusiast', description: 'Reached Level 10', icon: '⚖️' },
    { level: 20, title: 'Legal Eagle', description: 'Reached Level 20', icon: '🦅' },
    { level: 50, title: 'Justice Warrior', description: 'Reached Level 50', icon: '⚔️' },
    { level: 100, title: 'Legal Legend', description: 'Master of the law', icon: '👑' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white rounded-xl shadow-md text-slate-600 hover:text-blue-600"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Your Progress</h1>
            <p className="text-slate-600">Track your legal learning journey</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 mb-8"
        >
          {[
            { id: 'overview', label: 'Overview', icon: ChartBarIcon },
            { id: 'history', label: 'XP History', icon: CalendarIcon },
            { id: 'milestones', label: 'Milestones', icon: TrophyIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <TrophyIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Current Level</p>
                    <p className="text-3xl font-bold text-slate-800">{level}</p>
                  </div>
                </div>
                <XPBar
                  currentXP={totalXP}
                  level={level}
                  progressPercentage={progressPercentage}
                  xpToNext={xpToNext}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <BoltIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total XP</p>
                    <p className="text-3xl font-bold text-slate-800">{totalXP}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Keep earning to level up!
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <FireIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Best Streak</p>
                    <p className="text-3xl font-bold text-slate-800">{streak}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Current streak: {streak}
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <BookOpenIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Accuracy</p>
                    <p className="text-3xl font-bold text-slate-800">{accuracy}%</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  {totalCorrect} correct / {totalWrong} wrong
                </p>
              </motion.div>
            </div>

            {/* Performance Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-2xl">
                  <div className="text-4xl font-bold text-green-600 mb-2">{totalCorrect}</div>
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">Correct</span>
                  </div>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-2xl">
                  <div className="text-4xl font-bold text-red-600 mb-2">{totalWrong}</div>
                  <div className="flex items-center justify-center gap-2 text-red-700">
                    <XCircleIcon className="w-5 h-5" />
                    <span className="font-semibold">Wrong</span>
                  </div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-2xl">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{completedScenarios.length}</div>
                  <div className="flex items-center justify-center gap-2 text-blue-700">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-semibold">Total</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* XP by Domain */}
            {Object.keys(xpByDomain).length > 0 && (
              <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">XP by Domain</h3>
                <div className="space-y-4">
                  {Object.entries(xpByDomain)
                    .sort((a, b) => b[1] - a[1])
                    .map(([domain, xp], index) => (
                      <div key={domain} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-slate-700">{domain}</span>
                            <span className="font-bold text-amber-600">{xp} XP</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((xp / totalXP) * 100 * 2, 100)}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* XP History Tab */}
        {activeTab === 'history' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Recent XP Gains</h3>
            </div>
            {recentXPHistory.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentXPHistory.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    variants={itemVariants}
                    className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-3 rounded-xl">
                        <BoltIcon className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{entry.domain}</p>
                        <p className="text-sm text-slate-500">
                          {new Date(entry.timestamp).toLocaleDateString()} at{' '}
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-amber-600">+{entry.totalEarned} XP</p>
                      {entry.streakBonus > 0 && (
                        <p className="text-sm text-orange-500">
                          Includes +{entry.streakBonus} streak bonus
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No XP History Yet</h3>
                <p className="text-slate-600 mb-6">
                  Start playing scenarios to earn XP and see your history here!
                </p>
                <Link to="/scenario">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Start Playing
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {milestones.map((milestone, index) => {
              const isUnlocked = level >= milestone.level;
              
              return (
                <motion.div
                  key={milestone.level}
                  variants={itemVariants}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className="text-4xl mb-4">{milestone.icon}</div>
                  <h3 className={`text-xl font-bold mb-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                    {milestone.title}
                  </h3>
                  <p className={`text-sm mb-3 ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                    {milestone.description}
                  </p>
                  <div className={`text-sm font-semibold ${isUnlocked ? 'text-amber-600' : 'text-slate-400'}`}>
                    {isUnlocked ? 'Unlocked!' : `Reach Level ${milestone.level}`}
                  </div>
                  
                  {!isUnlocked && (
                    <div className="mt-4">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${Math.min((level / milestone.level) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {milestone.level - level} levels to go
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Progress;
