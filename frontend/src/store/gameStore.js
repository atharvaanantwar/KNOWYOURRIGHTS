import { create } from 'zustand';
import { api } from '../services/api';

const XP_PER_LEVEL = 100;

const calculateLevel = (totalXP) => Math.floor(totalXP / XP_PER_LEVEL);

const useGameStore = create((set, get) => ({
  // User Stats
  totalXP: 0,
  level: 1,
  streak: 0,
  completedScenarios: [],
  xpHistory: [],

  // Current Game State
  currentScenario: null,
  hintsUsed: 0,
  selectedDomain: 'All',
  selectedDifficulty: 'All',

  // Game Settings
  maxHintsPerScenario: 3,
  isLoading: false,

  // Actions
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),
  setSelectedDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),

  setCurrentScenario: (scenario) => set({
    currentScenario: scenario,
    hintsUsed: 0
  }),

  useHint: () => {
    const { hintsUsed, maxHintsPerScenario } = get();
    if (hintsUsed < maxHintsPerScenario) {
      set({ hintsUsed: hintsUsed + 1 });
      return true;
    }
    return false;
  },

  answerScenario: async (isCorrect, baseXP) => {
    const { streak, totalXP, completedScenarios, currentScenario } = get();

    if (isCorrect) {
      const newStreak = streak + 1;
      const streakBonus = newStreak >= 2 ? (newStreak - 1) * 5 : 0;
      const earnedXP = baseXP + streakBonus;
      const newTotalXP = totalXP + earnedXP;

      const xpEntry = {
        scenario_id: currentScenario?.id,
        domain: currentScenario?.domain,
        base_xp: baseXP,
        streak_bonus: streakBonus,
        total_earned: earnedXP,
      };

      // Update local state
      set({
        totalXP: newTotalXP,
        level: calculateLevel(newTotalXP),
        streak: newStreak,
        completedScenarios: [
          ...completedScenarios,
          {
            id: currentScenario?.id,
            domain: currentScenario?.domain,
            correct: true,
            timestamp: new Date().toISOString(),
          }
        ],
        xpHistory: [...get().xpHistory, { ...xpEntry, id: Date.now(), timestamp: new Date().toISOString() }],
      });

      // Save to API
      try {
        await api.updateUserStats({
          total_xp: newTotalXP,
          level: calculateLevel(newTotalXP),
          streak: newStreak
        });
        await api.addCompletedScenario({
          scenario_id: currentScenario?.id,
          domain: currentScenario?.domain,
          correct: true
        });
        await api.addXPEntry(xpEntry);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }

      return { earnedXP, streakBonus, newStreak };
    } else {
      // Update local state
      set({
        streak: 0,
        completedScenarios: [
          ...completedScenarios,
          {
            id: currentScenario?.id,
            domain: currentScenario?.domain,
            correct: false,
            timestamp: new Date().toISOString(),
          }
        ],
      });

      // Save to API
      try {
        await api.updateUserStats({
          total_xp: totalXP,
          level: calculateLevel(totalXP),
          streak: 0
        });
        await api.addCompletedScenario({
          scenario_id: currentScenario?.id,
          domain: currentScenario?.domain,
          correct: false
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }

      return { earnedXP: 0, streakBonus: 0, newStreak: 0 };
    }
  },

  resetStreak: () => set({ streak: 0 }),

  getAccuracy: () => {
    const { completedScenarios } = get();
    if (completedScenarios.length === 0) return 0;
    const correct = completedScenarios.filter(s => s.correct).length;
    return Math.round((correct / completedScenarios.length) * 100);
  },

  getTotalScenariosCompleted: () => {
    return get().completedScenarios.length;
  },

  getXPToNextLevel: () => {
    const { totalXP } = get();
    const currentLevelXP = calculateLevel(totalXP) * XP_PER_LEVEL;
    return XP_PER_LEVEL - (totalXP - currentLevelXP);
  },

  getProgressPercentage: () => {
    const { totalXP } = get();
    const currentLevelXP = calculateLevel(totalXP) * XP_PER_LEVEL;
    return ((totalXP - currentLevelXP) / XP_PER_LEVEL) * 100;
  },

  // Load user progress from API
  loadUserProgress: async () => {
    set({ isLoading: true });
    try {
      const progress = await api.getUserProgress();
      set({
        totalXP: progress.user_stats.total_xp,
        level: progress.user_stats.level,
        streak: progress.user_stats.streak,
        completedScenarios: progress.completed_scenarios,
        xpHistory: progress.xp_history,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to load user progress:', error);
      set({ isLoading: false });
    }
  },

  // Reset game (for testing)
  resetGame: () => set({
    totalXP: 0,
    level: 1,
    streak: 0,
    completedScenarios: [],
    xpHistory: [],
    currentScenario: null,
    hintsUsed: 0,
  }),
}));

export default useGameStore;
