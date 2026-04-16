import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  BoltIcon 
} from '@heroicons/react/24/outline';
import useGameStore from '../store/gameStore';

const Navigation = () => {
  const location = useLocation();
  const { level, totalXP } = useGameStore();

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/scenario', icon: AcademicCapIcon, label: 'Play' },
    { path: '/progress', icon: ChartBarIcon, label: 'Progress' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg"
            >
              <BoltIcon className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              KnowYourRights
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Stats */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <BoltIcon className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-amber-700">{totalXP} XP</span>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1.5 rounded-full font-bold text-sm">
              Lvl {level}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
