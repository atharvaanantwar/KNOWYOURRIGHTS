// Type declarations for JSX modules

declare module '*.jsx' {
  const content: any;
  export default content;
}

declare module '@/components/XPBar' {
  interface XPBarProps {
    currentXP: number;
    level: number;
    progressPercentage: number;
    xpToNext: number;
  }
  const XPBar: (props: XPBarProps) => JSX.Element;
  export default XPBar;
}

declare module '@/components/StreakFlame' {
  interface StreakFlameProps {
    streak: number;
  }
  const StreakFlame: (props: StreakFlameProps) => JSX.Element;
  export default StreakFlame;
}

declare module '@/components/Timer' {
  interface TimerProps {
    duration?: number;
    onTimeUp?: () => void;
    isActive?: boolean;
    key?: number | string;
  }
  const Timer: (props: TimerProps) => JSX.Element;
  export default Timer;
}

declare module '@/components/XPGainAnimation' {
  interface XPGainAnimationProps {
    xp: number;
    streakBonus: number;
    streak: number;
    isVisible: boolean;
    onComplete?: () => void;
  }
  const XPGainAnimation: (props: XPGainAnimationProps) => JSX.Element;
  export default XPGainAnimation;
}

declare module '@/components/FeedbackBanner' {
  interface FeedbackBannerProps {
    isCorrect: boolean;
    onClose?: () => void;
  }
  const FeedbackBanner: (props: FeedbackBannerProps) => JSX.Element;
  export default FeedbackBanner;
}

declare module '@/components/Navigation' {
  const Navigation: () => JSX.Element;
  export default Navigation;
}

declare module '@/pages/Dashboard' {
  const Dashboard: () => JSX.Element;
  export default Dashboard;
}

declare module '@/pages/Scenario' {
  const Scenario: () => JSX.Element;
  export default Scenario;
}

declare module '@/pages/Progress' {
  const Progress: () => JSX.Element;
  export default Progress;
}

declare module '@/store/gameStore' {
  interface GameState {
    totalXP: number;
    level: number;
    streak: number;
    completedScenarios: any[];
    xpHistory: any[];
    currentScenario: any;
    hintsUsed: number;
    selectedDomain: string;
    maxHintsPerScenario: number;
    setSelectedDomain: (domain: string) => void;
    setCurrentScenario: (scenario: any) => void;
    useHint: () => boolean;
    answerScenario: (isCorrect: boolean, baseXP: number) => { earnedXP: number; streakBonus: number; newStreak: number };
    resetStreak: () => void;
    getAccuracy: () => number;
    getTotalScenariosCompleted: () => number;
    getXPToNextLevel: () => number;
    getProgressPercentage: () => number;
    resetGame: () => void;
  }
  const useGameStore: () => GameState;
  export default useGameStore;
}

declare module '@/data/mockScenarios' {
  export const domains: string[];
  export const scenarios: any[];
  export const getRandomScenario: (domain?: string, excludeIds?: number[]) => any;
  export const getScenariosByDifficulty: (difficulty: string) => any[];
}
