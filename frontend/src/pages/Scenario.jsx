import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LightBulbIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid';
import useGameStore from '../store/gameStore';
import { api } from '../services/api';
import Timer from '../components/Timer';
import StreakFlame from '../components/StreakFlame';
import XPGainAnimation from '../components/XPGainAnimation';
import FeedbackBanner from '../components/FeedbackBanner';

// ─── Helper: shuffle an array (Fisher-Yates) ──────────────────────────
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─── MCQ renderer ──────────────────────────────────────────────────────
const MCQOptions = ({ scenario, selectedAnswer, showResult, isCorrect, onAnswer }) => {
  const answerLabels = Object.keys(scenario.options);
  return (
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
            onClick={() => onAnswer(label)}
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
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </motion.div>
            )}
            {showWrongness && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                <XCircleIcon className="w-6 h-6 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── True / False renderer ─────────────────────────────────────────────
const TrueFalseOptions = ({ scenario, selectedAnswer, showResult, isCorrect, onAnswer }) => {
  const options = ['True', 'False'];
  return (
    <div className="grid grid-cols-2 gap-6">
      {options.map((opt, index) => {
        const isSelected = selectedAnswer === opt;
        const isCorrectAnswer = opt === scenario.correct_answer;
        const showCorrectness = showResult && isCorrectAnswer;
        const showWrongness = showResult && isSelected && !isCorrect;

        return (
          <motion.button
            key={opt}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.15 }}
            whileHover={!showResult ? { scale: 1.04 } : {}}
            whileTap={!showResult ? { scale: 0.96 } : {}}
            onClick={() => onAnswer(opt)}
            disabled={showResult}
            className={`relative p-8 rounded-2xl font-bold text-xl text-center transition-all ${
              showCorrectness
                ? 'bg-green-500 text-white shadow-lg ring-4 ring-green-300'
                : showWrongness
                ? 'bg-red-500 text-white shadow-lg ring-4 ring-red-300'
                : isSelected
                ? 'bg-blue-500 text-white shadow-lg ring-4 ring-blue-300'
                : opt === 'True'
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-2 border-emerald-200'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-2 border-rose-200'
            }`}
          >
            <div className="text-4xl mb-2">{opt === 'True' ? '✓' : '✗'}</div>
            {opt}

            {showCorrectness && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                <CheckCircleIcon className="w-7 h-7 text-white" />
              </motion.div>
            )}
            {showWrongness && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3">
                <XCircleIcon className="w-7 h-7 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── Match the Pairs renderer ──────────────────────────────────────────
const MatchPairsOptions = ({ scenario, showResult, isCorrect, onAnswer, matchState, setMatchState }) => {
  const pairs = scenario.match_pairs || [];

  // Initialise shuffled right-side options once
  const shuffledRight = useMemo(() => shuffle(pairs.map(p => p.right)), [pairs]);

  const { selected, userMatches } = matchState;

  const selectLeft = (left) => {
    if (showResult) return;
    setMatchState(prev => ({ ...prev, selected: { ...prev.selected, left } }));
  };

  const selectRight = (right) => {
    if (showResult) return;
    const leftPick = selected.left;
    if (!leftPick) return; // must pick left first

    const newMatches = { ...userMatches, [leftPick]: right };
    setMatchState({ selected: { left: null, right: null }, userMatches: newMatches });

    // Auto-submit when all pairs matched
    if (Object.keys(newMatches).length === pairs.length) {
      const allCorrect = pairs.every(p => newMatches[p.left] === p.right);
      onAnswer(allCorrect ? '__match_correct__' : '__match_wrong__');
    }
  };

  const removeMatch = (left) => {
    if (showResult) return;
    const newMatches = { ...userMatches };
    delete newMatches[left];
    setMatchState(prev => ({ ...prev, userMatches: newMatches }));
  };

  const usedRight = new Set(Object.values(userMatches));

  return (
    <div>
      {/* Instructions */}
      <p className="text-sm text-slate-500 mb-4 text-center italic">
        Select an item on the left, then pick its match on the right. Click a matched pair to undo.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 text-center">Terms</div>
          {pairs.map((p, i) => {
            const isMatched = p.left in userMatches;
            const isActive = selected.left === p.left;
            let matchCorrect = false;
            let matchWrong = false;
            if (showResult && isMatched) {
              matchCorrect = userMatches[p.left] === p.right;
              matchWrong = !matchCorrect;
            }
            return (
              <motion.button
                key={p.left}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => isMatched && !showResult ? removeMatch(p.left) : selectLeft(p.left)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all text-sm ${
                  showResult && matchCorrect
                    ? 'bg-green-500 text-white'
                    : showResult && matchWrong
                    ? 'bg-red-500 text-white'
                    : isMatched
                    ? 'bg-indigo-500 text-white shadow-md'
                    : isActive
                    ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50'
                }`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs font-bold mr-2">
                  {i + 1}
                </span>
                {p.left}
                {isMatched && !showResult && (
                  <span className="ml-2 text-xs opacity-70">→ {userMatches[p.left]}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 text-center">Definitions</div>
          {shuffledRight.map((right, i) => {
            const isUsed = usedRight.has(right);
            return (
              <motion.button
                key={right}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => selectRight(right)}
                disabled={showResult || isUsed || !selected.left}
                className={`w-full p-4 rounded-xl text-left font-medium transition-all text-sm ${
                  isUsed
                    ? 'bg-slate-200 text-slate-400 cursor-default'
                    : selected.left
                    ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border-2 border-amber-200 cursor-pointer'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {right}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Badge for question type ───────────────────────────────────────────
const QuestionTypeBadge = ({ type }) => {
  const config = {
    mcq: { label: 'Multiple Choice', color: 'bg-blue-100 text-blue-700' },
    true_false: { label: 'True or False', color: 'bg-purple-100 text-purple-700' },
    match_pairs: { label: 'Match the Pairs', color: 'bg-amber-100 text-amber-700' },
  };
  const c = config[type] || config.mcq;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}>
      {c.label}
    </span>
  );
};
const DOMAIN_MAP = {
  "Consumer Rights": "consumer_law",
  "Women Safety": "women_safety",
};

const DIFFICULTY_MAP = {
  easy: 1,
  medium: 2,
  hard: 3,
};
// ═══════════════════════════════════════════════════════════════════════
// Main Scenario component
// ═══════════════════════════════════════════════════════════════════════
const Scenario = () => {
  const navigate = useNavigate();
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
  const [backendExplanation, setBackendExplanation] = useState("");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Match-the-pairs local state
  const [matchState, setMatchState] = useState({
    selected: { left: null, right: null },
    userMatches: {},
  });
console.log("Selected:", selectedDomain, selectedDifficulty);
  // Load a new scenario
  const loadNewScenario = useCallback(async () => {
    setLoading(true);
    try {
      const completedIds = completedScenarios.map(c => c.id);
      const domain = selectedDomain === 'All'
        ? ''
        : DOMAIN_MAP[selectedDomain];

      const difficulty = selectedDifficulty === 'All'
        ? ''
        : DIFFICULTY_MAP[selectedDifficulty];
      
      const questions = await api.getQuestions(domain, difficulty);
      const availableQuestions = questions.filter(q => !completedIds.includes(q.id));
      
      if (availableQuestions.length === 0) {
        setScenario(null);
      } else {
        // Questions already shuffled by backend, pick first
        const selectedQuestion = availableQuestions[0];
        
        // Convert API format to component format
        const sc = {
          id: selectedQuestion.id,

          // 🔥 FIX: backend sends "question"
          question: selectedQuestion.question || selectedQuestion.question_text,

          // 🔥 FIX: backend sends "type"
          question_type:
            selectedQuestion.type === "tf"
              ? "true_false"
              : selectedQuestion.type === "match"
              ? "match_pairs"
              : "mcq",

          options: selectedQuestion.options,

          correct_answer:
            selectedQuestion.type === "tf"
              ? "True" // fallback (not used anyway)
              : selectedQuestion.correct_answer,

          // Store answer_map for MCQ reverse-lookup when highlighting correct answer
          answer_map: selectedQuestion.answer_map || {},

          match_pairs: selectedQuestion.pairs || [],

          scenario: selectedQuestion.question || "",

          explanation: selectedQuestion.explanation || "",
          domain: selectedQuestion.domain || selectedDomain,
          difficulty: selectedQuestion.difficulty || selectedDifficulty,
          xp_reward: 10,
          legal_reference: selectedQuestion.source || "Legal Reference",
        };
                
        setScenario(sc);
        setCurrentScenario(sc);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowExplanation(false);
        setMatchState({ selected: { left: null, right: null }, userMatches: {} });
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

  const handleAnswer = async (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);

    try {
      // 🔥 CALL BACKEND
      const res = await api.submitAnswer(
        scenario.id,
        answer,
        scenario.answer_map || {}
      );

      console.log("BACKEND RESULT:", res);

      // 🔥 Update scenario with correct answer from backend so UI can highlight it
      if (res.correct_answer) {
        if (scenario.question_type === 'mcq' || !scenario.question_type) {
          // For MCQ: backend returns the original key (e.g. "B"),
          // but we display shuffled keys. Reverse-lookup the answer_map
          // to find which displayed label maps to the correct original key.
          const answerMap = scenario.answer_map || {};
          let correctDisplayLabel = res.correct_answer;
          for (const [displayKey, originalKey] of Object.entries(answerMap)) {
            if (originalKey === res.correct_answer) {
              correctDisplayLabel = displayKey;
              break;
            }
          }
          setScenario(prev => ({ ...prev, correct_answer: correctDisplayLabel }));
        } else if (scenario.question_type === 'true_false') {
          setScenario(prev => ({ ...prev, correct_answer: res.correct_answer }));
        }
      }

      // 🔥 USE BACKEND RESPONSE
      setIsCorrect(res.correct);
      setShowResult(true);

      // XP handling (keep your system)
      const result = await answerScenario(res.correct, scenario.xp_reward);
      setEarnedXP(result.earnedXP);
      setStreakBonus(result.streakBonus);

      if (res.correct) {
        setShowXPAnimation(true);
      } else {
        setTimeout(() => setShowExplanation(true), 800);
      }

      if (res.explanation) {
        setBackendExplanation(res.explanation);
      }

      // Store references from backend
      if (res.references) {
        setScenario(prev => ({ ...prev, references: res.references }));
      }

    } catch (err) {
      console.error("Answer error:", err);
    }
  };

  const handleTimeUp = () => {
    if (!showResult && scenario) {
      setSelectedAnswer(null);
      setIsCorrect(false);
      setShowResult(true);
      answerScenario(false, scenario.xp_reward);
      setTimeout(() => setShowExplanation(true), 800);
    }
  };

  const handleHint = () => {
    if (useHint()) {
      // Hint used successfully
    }
  };

  const handleNextScenario = () => {
    loadNewScenario();
  };

  const handleXPAnimationComplete = () => {
    setShowXPAnimation(false);
    setShowExplanation(true);
  };

  // Timer duration varies by question type
  const timerDuration = scenario?.question_type === 'match_pairs' ? 60 : 45;

  if (!scenario && !loading) {
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

        {/* ── Exit Confirmation Modal ── */}
        <AnimatePresence>
          {showExitConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setShowExitConfirm(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

                <div className="p-8 text-center">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-5 rounded-full bg-amber-100 flex items-center justify-center"
                  >
                    <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Exit Quiz?
                  </h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    Are you sure you want to leave? Don't worry —
                    <span className="font-semibold text-slate-700"> your progress will be saved</span>.
                    You can pick up right where you left off.
                  </p>

                  {/* Progress saved indicator */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-6 flex items-center gap-3">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 text-left">
                      Your XP, streak, and completed questions are safely stored.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setShowExitConfirm(false)}
                      className="flex-1 px-5 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Keep Playing
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setShowExitConfirm(false);
                        navigate('/dashboard');
                      }}
                      className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-md"
                    >
                      Exit Quiz
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            {/* Exit Quiz Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExitConfirm(true)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
              title="Exit quiz"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Exit</span>
            </motion.button>

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
            <QuestionTypeBadge type={scenario.question_type} />
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
              duration={timerDuration}
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
            
            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {scenario.question}
              </h3>
            </div>

            {/* Render based on question type */}
            {scenario.question_type === 'true_false' && (
              <TrueFalseOptions
                scenario={scenario}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
                onAnswer={handleAnswer}
              />
            )}

            {scenario.question_type === 'match_pairs' && (
              <MatchPairsOptions
                scenario={scenario}
                showResult={showResult}
                isCorrect={isCorrect}
                onAnswer={handleAnswer}
                matchState={matchState}
                setMatchState={setMatchState}
              />
            )}

            {(scenario.question_type === 'mcq' || !scenario.question_type) && (
              <MCQOptions
                scenario={scenario}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
                onAnswer={handleAnswer}
              />
            )}
          </div>

          {/* Hint Button — hide for match_pairs */}
          {!showResult && scenario.question_type !== 'match_pairs' && (
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
          {showExplanation && (backendExplanation || scenario.explanation) && (
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
                {backendExplanation || scenario.explanation}
              </p>

              <div className="bg-white/60 rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-500 mb-1">Legal Reference</p>
                <p className="font-semibold text-blue-700">
                  {scenario.legal_reference}
                </p>
              </div>

              {/* Official References Section */}
              {scenario.references && scenario.references.length > 0 && (
                <div className="bg-white/60 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    Official Documents & Resources
                  </h4>
                  <div className="space-y-2">
                    {scenario.references.map((ref, idx) => (
                      <a
                        key={idx}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium p-2 rounded hover:bg-blue-50 transition group"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition" />
                        <div className="flex-1">
                          <div className="font-semibold">{ref.title}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{ref.description}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
