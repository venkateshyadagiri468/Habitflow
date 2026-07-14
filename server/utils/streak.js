/**
 * Helper to calculate current and longest streaks based on completed log dates.
 * @param {string[]} logDates - Array of dates in "YYYY-MM-DD" format
 * @param {string} todayStr - Today's date in "YYYY-MM-DD" format
 */
function calculateStreak(logDates, todayStr) {
  if (!logDates || logDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Parse strings to days since epoch (using UTC to prevent timezone shifts)
  const days = [...new Set(logDates)]
    .map(d => Math.round(Date.parse(d) / (1000 * 60 * 60 * 24)))
    .sort((a, b) => a - b);

  if (days.some(isNaN)) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Calculate longest streak
  let longest = 0;
  let currentTemp = 0;
  let lastDay = null;

  for (let day of days) {
    if (lastDay === null) {
      currentTemp = 1;
    } else if (day === lastDay + 1) {
      currentTemp++;
    } else if (day > lastDay + 1) {
      currentTemp = 1;
    }
    if (currentTemp > longest) {
      longest = currentTemp;
    }
    lastDay = day;
  }

  // Calculate current streak
  const todayDays = Math.round(Date.parse(todayStr) / (1000 * 60 * 60 * 24));
  const yesterdayDays = todayDays - 1;

  const completedDaysSet = new Set(days);
  let current = 0;

  if (completedDaysSet.has(todayDays)) {
    current = 1;
    let checkDay = todayDays - 1;
    while (completedDaysSet.has(checkDay)) {
      current++;
      checkDay--;
    }
  } else if (completedDaysSet.has(yesterdayDays)) {
    current = 1;
    let checkDay = yesterdayDays - 1;
    while (completedDaysSet.has(checkDay)) {
      current++;
      checkDay--;
    }
  }

  return {
    currentStreak: current,
    longestStreak: longest
  };
}

module.exports = { calculateStreak };
