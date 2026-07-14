const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { calculateStreak } = require('../utils/streak');

// @desc    Get dashboard summary statistics and habits for today
// @route   GET /api/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const todayStr = req.query.date || new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    
    // 1. Fetch user habits
    const habits = await Habit.find({ createdBy: req.user._id });
    const habitIds = habits.map(h => h._id);

    if (habits.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalHabits: 0,
          completedToday: 0,
          remainingHabits: 0,
          progressPercent: 0,
          maxCurrentStreak: 0,
          maxLongestStreak: 0,
          habits: []
        }
      });
    }

    // 2. Fetch logs for today's date
    const todayLogs = await HabitLog.find({
      habitId: { $in: habitIds },
      date: todayStr,
      completed: true
    });

    const completedTodayIds = new Set(todayLogs.map(l => l.habitId.toString()));

    // Map logs to log ID to make undo operations simple
    const logIdMap = {};
    todayLogs.forEach(l => {
      logIdMap[l.habitId.toString()] = l._id;
    });

    // 3. Fetch all history logs for streak calculations
    const allLogs = await HabitLog.find({
      habitId: { $in: habitIds },
      completed: true
    });

    // Group logs by habit
    const logsByHabit = {};
    habitIds.forEach(id => {
      logsByHabit[id.toString()] = [];
    });
    allLogs.forEach(log => {
      if (logsByHabit[log.habitId.toString()]) {
        logsByHabit[log.habitId.toString()].push(log.date);
      }
    });

    // 4. Calculate streaks and prepare enriched habits list
    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;

    const enrichedHabits = habits.map(habit => {
      const habitIdStr = habit._id.toString();
      const dates = logsByHabit[habitIdStr] || [];
      const { currentStreak, longestStreak } = calculateStreak(dates, todayStr);

      if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak;
      if (longestStreak > maxLongestStreak) maxLongestStreak = longestStreak;

      return {
        ...habit.toObject(),
        completedToday: completedTodayIds.has(habitIdStr),
        logId: logIdMap[habitIdStr] || null,
        currentStreak,
        longestStreak
      };
    });

    const totalHabits = habits.length;
    const completedToday = todayLogs.length;
    const remainingHabits = totalHabits - completedToday;
    const progressPercent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalHabits,
        completedToday,
        remainingHabits,
        progressPercent,
        maxCurrentStreak,
        maxLongestStreak,
        habits: enrichedHabits
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getDashboardData };
