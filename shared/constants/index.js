// Habit categories, default HSL colors, and icons
const HABIT_CATEGORIES = {
  HEALTH: {
    name: 'Health & Fitness',
    color: 'hsl(142, 70%, 45%)', // Green
    icon: 'Activity'
  },
  MIND: {
    name: 'Mental Wellbeing',
    color: 'hsl(262, 80%, 60%)', // Purple
    icon: 'Brain'
  },
  FINANCE: {
    name: 'Finance',
    color: 'hsl(47, 95%, 45%)', // Gold/Amber
    icon: 'DollarSign'
  },
  STUDY: {
    name: 'Learning & Study',
    color: 'hsl(200, 95%, 45%)', // Blue
    icon: 'BookOpen'
  },
  WORK: {
    name: 'Productivity & Work',
    color: 'hsl(12, 90%, 55%)', // Orange/Red
    icon: 'Briefcase'
  },
  ROUTINE: {
    name: 'Daily Routine',
    color: 'hsl(330, 85%, 55%)', // Pink/Magenta
    icon: 'CheckSquare'
  }
};

const DEFAULT_THEME = 'dark';

module.exports = {
  HABIT_CATEGORIES,
  DEFAULT_THEME
};
