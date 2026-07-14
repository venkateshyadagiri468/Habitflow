const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { calculateStreak } = require('../utils/streak');

// @desc    Get detailed statistics and chart data
// @route   GET /api/statistics
// @access  Private
const getStatistics = async (req, res) => {
  try {
    const todayStr = req.query.date || new Date().toISOString().split('T')[0];
    
    // Fetch user's habits
    const habits = await Habit.find({ createdBy: req.user._id });
    const habitIds = habits.map(h => h._id);

    if (habits.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalHabits: 0,
          totalCompletions: 0,
          maxCurrentStreak: 0,
          maxLongestStreak: 0,
          completionRate: 0,
          weeklyProgress: [],
          categoryDistribution: [],
          monthlyProgress: []
        }
      });
    }

    // Fetch all logs
    const allLogs = await HabitLog.find({
      habitId: { $in: habitIds },
      completed: true
    });

    const totalCompletions = allLogs.length;

    // Calculate streaks for each habit
    const logsByHabit = {};
    habitIds.forEach(id => {
      logsByHabit[id.toString()] = [];
    });
    allLogs.forEach(log => {
      if (logsByHabit[log.habitId.toString()]) {
        logsByHabit[log.habitId.toString()].push(log.date);
      }
    });

    let maxCurrentStreak = 0;
    let maxLongestStreak = 0;
    habitIds.forEach(id => {
      const dates = logsByHabit[id.toString()] || [];
      const { currentStreak, longestStreak } = calculateStreak(dates, todayStr);
      if (currentStreak > maxCurrentStreak) maxCurrentStreak = currentStreak;
      if (longestStreak > maxLongestStreak) maxLongestStreak = longestStreak;
    });

    // 1. Category Distribution (Pie Chart)
    const categoryCounts = {};
    habits.forEach(habit => {
      categoryCounts[habit.category] = (categoryCounts[habit.category] || 0);
    });
    
    allLogs.forEach(log => {
      // Find habit category
      const habitObj = habits.find(h => h._id.toString() === log.habitId.toString());
      if (habitObj) {
        categoryCounts[habitObj.category] = (categoryCounts[habitObj.category] || 0) + 1;
      }
    });

    const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
      category: cat,
      count: categoryCounts[cat],
      label: cat.charAt(0) + cat.slice(1).toLowerCase()
    }));

    // 2. Weekly chart data (last 7 days)
    const weeklyProgress = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = weekdays[date.getDay()];

      const completionsOnDay = allLogs.filter(log => log.date === dateStr).length;
      const totalCount = habits.length;
      const rate = totalCount > 0 ? Math.round((completionsOnDay / totalCount) * 100) : 0;

      weeklyProgress.push({
        date: dateStr,
        day: dayName,
        completed: completionsOnDay,
        total: totalCount,
        rate
      });
    }

    // 3. Monthly progress (last 30 days)
    const monthlyProgress = [];
    for (let i = 29; i >= 0; i -= 3) { // 10 data points across 30 days
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const completionsOnDay = allLogs.filter(log => log.date === dateStr).length;
      const totalCount = habits.length;
      const rate = totalCount > 0 ? Math.round((completionsOnDay / totalCount) * 100) : 0;

      monthlyProgress.push({
        date: dateStr,
        label: dateStr.substring(5), // "MM-DD"
        rate
      });
    }

    // 4. Overall completion rate
    // Calculate based on last 30 days of possible habit completions
    const totalPossibleLogs = habits.length * 30;
    const logsInLast30Days = allLogs.filter(log => {
      const logDate = new Date(log.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return logDate >= thirtyDaysAgo;
    }).length;

    const completionRate = totalPossibleLogs > 0 ? Math.round((logsInLast30Days / totalPossibleLogs) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalHabits: habits.length,
        totalCompletions,
        maxCurrentStreak,
        maxLongestStreak,
        completionRate,
        weeklyProgress,
        categoryDistribution,
        monthlyProgress
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getStatistics };
