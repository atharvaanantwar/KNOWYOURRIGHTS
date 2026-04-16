# KnowYourRights - Gamified Legal Education Platform

A modern, interactive legal education platform that makes learning about your rights fun and engaging through gamified scenarios.

![KnowYourRights](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Dashboard**: View your stats, level, XP, and streak
- **Scenario Mode**: Answer real-world legal scenarios with a 45-second timer
- **Progress Tracking**: Track your XP history, accuracy, and milestones
- **Gamification**: Earn XP, build streaks, and level up as you learn

## Tech Stack

- **React 18** + **Vite** - Fast development and building
- **Tailwind CSS** - Modern utility-first styling
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations
- **Heroicons** - Beautiful icons

## XP & Level System

| Difficulty | Base XP |
|------------|---------|
| Easy       | 10 XP   |
| Medium     | 25 XP   |
| Hard       | 50 XP   |

**Streak Bonus**: +5 XP per consecutive correct answer

**Level Formula**: `level = Math.floor(totalXP / 100)`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Extract the ZIP file**
   ```bash
   unzip knowyourrights.zip
   cd knowyourrights
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
knowyourrights/
├── src/
│   ├── components/       # Reusable components
│   │   ├── XPBar.jsx
│   │   ├── StreakFlame.jsx
│   │   ├── Timer.jsx
│   │   ├── XPGainAnimation.jsx
│   │   ├── FeedbackBanner.jsx
│   │   └── Navigation.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Scenario.jsx
│   │   └── Progress.jsx
│   ├── store/           # Zustand store
│   │   └── gameStore.js
│   ├── data/            # Mock data
│   │   └── mockScenarios.js
│   ├── App.tsx          # Main app with routing
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Game Features

### Dashboard
- User avatar and level display
- XP progress bar with animated shimmer
- Streak counter with flame animation
- Domain selection dropdown
- Quick stats overview

### Scenario Page
- Real-world legal scenarios across 6 domains
- 4 answer options (A, B, C, D)
- 45-second countdown timer with visual warning
- Streak counter with animated flame
- Hint system (3 hints per scenario)
- XP animation on correct answers
- Correct/Wrong feedback banners
- Legal reference explanations

### Progress Page
- XP history with timestamps
- Accuracy percentage tracking
- Level milestones with unlock status
- Performance overview charts
- XP breakdown by domain

## Legal Domains Covered

1. **Consumer Rights** - Product liability, unfair trade practices
2. **Labor Law** - Employment rights, overtime, termination
3. **Property Law** - Tenancy, property transactions
4. **Criminal Law** - Arrest rights, domestic violence
5. **Constitutional Rights** - Fundamental rights, equality
6. **Cyber Law** - Data protection, online safety

## State Management

The app uses Zustand for state management with persistence:

```javascript
// Key state variables
- totalXP: number
- level: number
- streak: number
- currentScenario: object
- hintsUsed: number
- completedScenarios: array
- xpHistory: array
```

## Customization

### Adding New Scenarios

Edit `src/data/mockScenarios.js` to add new scenarios:

```javascript
{
  id: 16,
  domain: 'Consumer Rights',
  difficulty: 'medium',
  scenario: 'Your scenario text here...',
  question: 'Your question here?',
  options: {
    A: 'Option A',
    B: 'Option B',
    C: 'Option C',
    D: 'Option D'
  },
  correct_answer: 'B',
  explanation: 'Detailed explanation...',
  legal_reference: 'Act Name - Section X',
  xp_reward: 25
}
```

### Changing Theme Colors

Edit `tailwind.config.js` to customize the blue + gold theme.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for educational purposes.

## Credits

Built with ❤️ for legal education and awareness.
