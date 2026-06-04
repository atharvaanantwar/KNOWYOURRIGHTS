import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  ArrowLeftIcon,
  PlayIcon,
} from '@heroicons/react/24/solid';
import useGameStore from '../store/gameStore';

const domainCards = [
  {
    name: 'Consumer Rights',
    icon: ShieldCheckIcon,
    description: 'Product liability, refunds & unfair trade practices',
    color: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
];

const difficulties = [
  {
    name: 'easy',
    label: 'Easy',
    xp: '10 XP',
    description: 'Great for beginners',
    color: 'from-green-500 to-emerald-600',
    border: 'border-green-200 hover:border-green-400',
    badge: 'bg-green-100 text-green-700',
  },
  {
    name: 'medium',
    label: 'Medium',
    xp: '25 XP',
    description: 'Test your understanding',
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-200 hover:border-amber-400',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'hard',
    label: 'Hard',
    xp: '50 XP',
    description: 'For legal experts',
    color: 'from-red-500 to-rose-600',
    border: 'border-red-200 hover:border-red-400',
    badge: 'bg-red-100 text-red-700',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const Challenges = () => {
  const navigate = useNavigate();
  const { setSelectedDomain, setSelectedDifficulty } = useGameStore();
  const [selectedDomainLocal, setSelectedDomainLocal] = useState(null);

  const handleDomainSelect = (domain) => {
    setSelectedDomainLocal(domain);
  };

  const handleDifficultySelect = (difficulty) => {
    // Set both in the global store, then navigate
    setSelectedDomain(selectedDomainLocal);
    setSelectedDifficulty(difficulty);
    navigate('/scenario');
  };

  const handleBack = () => {
    setSelectedDomainLocal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          {selectedDomainLocal && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Domains
            </motion.button>
          )}

          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            {selectedDomainLocal ? (
              <>
                <span className="text-blue-600">{selectedDomainLocal}</span>
              </>
            ) : (
              <>
                Choose a <span className="text-blue-600">Legal Domain</span>
              </>
            )}
          </h1>
          <p className="text-slate-600 text-lg">
            {selectedDomainLocal
              ? 'Select your difficulty level to begin the challenge'
              : 'Pick a domain to test your legal knowledge'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedDomainLocal ? (
            /* ── Domain Cards ── */
            <motion.div
              key="domains"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {domainCards.map((domain) => {
                const Icon = domain.icon;
                return (
                  <motion.div
                    key={domain.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDomainSelect(domain.name)}
                    className="cursor-pointer group"
                  >
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden transition-shadow group-hover:shadow-xl h-full">
                      {/* Gradient top bar */}
                      <div className={`h-2 bg-gradient-to-r ${domain.color}`} />

                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`${domain.iconBg} p-3 rounded-xl`}>
                            <Icon className={`w-7 h-7 ${domain.iconColor}`} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {domain.name}
                          </h3>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {domain.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* ── Difficulty Selection ── */
            <motion.div
              key="difficulty"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              {difficulties.map((diff) => (
                <motion.div
                  key={diff.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDifficultySelect(diff.name)}
                  className="cursor-pointer group"
                >
                  <div className={`bg-white rounded-2xl shadow-lg border-2 ${diff.border} overflow-hidden transition-all group-hover:shadow-xl h-full`}>
                    {/* Gradient top bar */}
                    <div className={`h-2 bg-gradient-to-r ${diff.color}`} />

                    <div className="p-8 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${diff.badge}`}>
                        {diff.xp} per question
                      </span>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {diff.label}
                      </h3>
                      <p className="text-slate-500 text-sm mb-6">
                        {diff.description}
                      </p>
                      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${diff.color} text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow`}>
                        <PlayIcon className="w-4 h-4" />
                        Start
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Challenges;
