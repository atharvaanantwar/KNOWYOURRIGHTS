import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  TrophyIcon,
  FireIcon,
  AcademicCapIcon,
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import { getCurrentUser, logoutUser } from '../services/authService';
import useGameStore from '../store/gameStore';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const {
    totalXP,
    level,
    streak,
    completedScenarios,
    getAccuracy,
    loadUserProgress,
  } = useGameStore();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    loadUserProgress();
  }, [loadUserProgress]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const totalAnswered = completedScenarios.length;
  const correctAnswers = completedScenarios.filter((s) => s.correct).length;
  const accuracy = getAccuracy();

  // Generate initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const statCards = [
    {
      icon: BoltIcon,
      label: 'Total XP',
      value: totalXP.toLocaleString(),
      color: 'from-amber-400 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      icon: TrophyIcon,
      label: 'Level',
      value: level,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      icon: FireIcon,
      label: 'Current Streak',
      value: streak,
      color: 'from-red-400 to-rose-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      icon: ChartBarIcon,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: 'from-emerald-400 to-green-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      icon: AcademicCapIcon,
      label: 'Answered',
      value: totalAnswered,
      color: 'from-purple-400 to-violet-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      icon: ShieldCheckIcon,
      label: 'Correct',
      value: correctAnswers,
      color: 'from-teal-400 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 w-16 h-16 rounded-full bg-white/20 blur-xl" />
              <div className="absolute bottom-2 right-12 w-24 h-24 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute top-8 right-32 w-10 h-10 rounded-full bg-white/25 blur-lg" />
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-16 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white"
            >
              {initials}
            </motion.div>
          </div>

          {/* User Info */}
          <div className="text-center px-8 pt-4 pb-8">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-slate-800 mb-1"
            >
              {user?.name || 'Player'}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-slate-500 mb-4"
            >
              <EnvelopeIcon className="w-4 h-4" />
              <span className="text-sm">{user?.email || 'No email set'}</span>
            </motion.div>

            {/* Level Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold text-sm shadow-lg"
            >
              <TrophyIcon className="w-4 h-4" />
              Level {level} • {totalXP} XP
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
            Your Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.08 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`${stat.bgColor} rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5 text-blue-600" />
            Account Details
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Name</p>
                  <p className="text-slate-700 font-semibold">{user?.name || 'Player'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Email</p>
                  <p className="text-slate-700 font-semibold">{user?.email || 'Not set'}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">User ID</p>
                  <p className="text-slate-700 font-mono text-sm">
                    {localStorage.getItem('knowyourrights_user_id')?.slice(0, 8) || '—'}•••
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          {!showLogoutConfirm ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-6 py-4 rounded-2xl font-semibold text-lg transition-all shadow-sm hover:shadow-md"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              Log Out
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center"
            >
              <p className="text-red-700 font-semibold mb-4 text-lg">
                Are you sure you want to log out?
              </p>
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-6 py-2.5 bg-white text-slate-600 rounded-xl font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md"
                >
                  Yes, Log Out
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
