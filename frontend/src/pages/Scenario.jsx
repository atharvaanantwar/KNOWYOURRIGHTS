import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LightBulbIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import useGameStore from '../store/gameStore';
import { api } from '../services/api';
import Timer from '../components/Timer';
import StreakFlame from '../components/StreakFlame';
import XPGainAnimation from '../components/XPGainAnimation';
import FeedbackBanner from '../components/FeedbackBanner';

const Scenario = () => {
  const {
    currentScenario,
    setCurrentScenario,
    streak,
    hintsUsed,
    useHint,
    answerScenario,
    selectedDomain,
    completedScenarios,
    selectedDifficulty,  
  } = useGameStore();

  const [scenario, setScenario] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [streakBonus, setStreakBonus] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load a new scenario
  const loadNewScenario = useCallback(async () => {
    setLoading(true);
    try {
      const completedIds = completedScenarios.map(c => c.id);
      const domain = selectedDomain === 'All' ? '' : selectedDomain;
      const difficulty = selectedDifficulty === 'All' ? '' : selectedDifficulty;
      
      const questions = await api.getQuestions(domain, difficulty);
      const availableQuestions = questions.filter(q => !completedIds.includes(q.id));
      
      if (availableQuestions.length === 0) {
        setScenario(null);
      } else {
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];
        
        // Convert API format to component format
        const scenario = {
          id: selectedQuestion.id,
          question: selectedQuestion.question,
          options: selectedQuestion.options,
          correct_answer: selectedQuestion.correct_answer,
          explanation: selectedQuestion.explanation,
          domain: selectedQuestion.domain,
          difficulty: selectedQuestion.difficulty,
          xp_reward: selectedQuestion.xp_reward,
          legal_reference: selectedQuestion.legal_reference,
        };
        
        setScenario(scenario);
        setCurrentScenario(scenario);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowExplanation(false);
        setTimerKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load scenario:', error);
      setScenario(null);
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, selectedDifficulty, completedScenarios, setCurrentScenario]);

  // Load scenario on mount
  useEffect(() => {
    if (!scenario) {
      loadNewScenario();
    }
  }, [loadNewScenario, scenario]);

  const handleAnswer = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === scenario.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    const result = answerScenario(correct, scenario.xp_reward);
    setEarnedXP(result.earnedXP);
    setStreakBonus(result.streakBonus);
    
    if (correct) {
      setShowXPAnimation(true);
    }
  };

  const handleTimeUp = () => {
    if (!showResult) {
      setSelectedAnswer(null);
      setIsCorrect(false);
      setShowResult(true);
      answerScenario(false, scenario.xp_reward);
    }
  };

  const handleHint = () => {
    if (useHint()) {
      // Hint used successfully - could show a visual indicator
    }
  };

  const handleNextScenario = () => {
    loadNewScenario();
  };

  const handleXPAnimationComplete = () => {
    setShowXPAnimation(false);
    setShowExplanation(true);
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            All Scenarios Completed!
          </h2>
          <p className="text-slate-600 mb-6">
            You've completed all available scenarios in this domain. 
            Try a different domain or check your progress!
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Back to Dashboard
              </motion.button>
            </Link>
            <Link to="/progress">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold"
              >
                View Progress
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const answerLabels = ['A', 'B', 'C', 'D'];
  const hintsRemaining = 3 - hintsUsed;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      {/* Feedback Banner */}
      <AnimatePresence>
        {showResult && (
          <FeedbackBanner 
            isCorrect={isCorrect} 
          />
        )}
      </AnimatePresence>

      {/* XP Animation */}
      <XPGainAnimation
        xp={earnedXP}
        streakBonus={streakBonus}
        streak={streak}
        isVisible={showXPAnimation}
        onComplete={handleXPAnimationComplete}
      />

      {loading ? (
        <div className="max-w-4xl mx-auto pt-16 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading scenario...</p>
          </div>
        </div>
      ) : !scenario ? (
        <div className="max-w-4xl mx-auto pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <BookOpenIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 mb-4">No More Scenarios</h2>
            <p className="text-slate-600 mb-6">
              You've completed all available scenarios in this domain and difficulty. 
              Try a different combination or check your progress!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Back to Dashboard
                </motion.button>
              </Link>
              <Link to="/progress">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  View Progress
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto pt-16">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-md">
              <span className="text-sm text-slate-500">Domain</span>
              <p className="font-semibold text-blue-600">{scenario.domain}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl shadow-md ${
              scenario.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              scenario.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              <span className="text-sm opacity-70">Difficulty</span>
              <p className="font-semibold capitalize">{scenario.difficulty}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {streak > 0 && <StreakFlame streak={streak} />}
            <div className="bg-white px-4 py-2 rounded-xl shadow-md">
              <span className="text-sm text-slate-500">Reward</span>
              <p className="font-semibold text-amber-600">{scenario.xp_reward} XP</p>
            </div>
          </div>
        </motion.div>

        {/* Timer */}
        {!showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Timer
              key={timerKey}
              duration={45}
              onTimeUp={handleTimeUp}
              isActive={!showResult}
            />
          </motion.div>
        )}

        {/* Scenario Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6"
        >
          {/* Scenario Content */}
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl shrink-0">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-3">
                  Scenario
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {scenario.scenario}
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {scenario.question}
              </h3>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {answerLabels.map((label, index) => {
                const isSelected = selectedAnswer === label;
                const isCorrectAnswer = label === scenario.correct_answer;
                const showCorrectness = showResult && isCorrectAnswer;
                const showWrongness = showResult && isSelected && !isCorrect;
                
                return (
                  <motion.button
                    key={label}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(label)}
                    disabled={showResult}
                    className={`relative p-5 rounded-2xl text-left font-medium transition-all ${
                      showCorrectness
                        ? 'bg-green-500 text-white shadow-lg'
                        : showWrongness
                        ? 'bg-red-500 text-white shadow-lg'
                        : isSelected
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 font-bold mr-3">
                      {label}
                    </span>
                    {scenario.options[label]}
                    
                    {showCorrectness && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                    
                    {showWrongness && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <XCircleIcon className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Hint Button */}
          {!showResult && (
            <div className="px-8 pb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHint}
                disabled={hintsRemaining === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  hintsRemaining > 0
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <LightBulbIcon className="w-5 h-5" />
                <span>Hint ({hintsRemaining} left)</span>
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* Explanation Card */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-8 border border-blue-100 mb-6"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6" />
                Legal Explanation
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                {scenario.explanation}
              </p>
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-sm text-slate-500 mb-1">Legal Reference</p>
                <p className="font-semibold text-blue-700">
                  {scenario.legal_reference}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextScenario}
              className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Next Scenario
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
    )}
  </div>
);
};

export default Scenario;
