const HabitLog = require('../models/HabitLog');
const Habit = require('../models/Habit');

// @desc    Get all habit logs for user's habits
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res) => {
  try {
    // First find all habits for the user
    const userHabits = await Habit.find({ createdBy: req.user._id });
    const habitIds = userHabits.map(h => h._id);

    // Filter query options
    const query = { habitId: { $in: habitIds } };
    if (req.query.habitId) {
      query.habitId = req.query.habitId;
    }
    if (req.query.date) {
      query.date = req.query.date;
    }

    const logs = await HabitLog.find(query);
    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create/Toggle log check-in
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res) => {
  try {
    const { habitId, date } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({ success: false, error: 'Please provide habitId and date' });
    }

    // Verify habit belongs to user
    const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ success: false, error: 'Habit not found' });
    }
    if (habit.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to log for this habit' });
    }

    // Create log (or update if already exists)
    const log = await HabitLog.findOneAndUpdate(
      { habitId, date },
      { completed: true },
      { new: true, upsert: true }
    );

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete log check-in (undo complete)
// @route   DELETE /api/logs/:id
// @access  Private
const deleteLog = async (req, res) => {
  try {
    const log = await HabitLog.findById(req.params.id);

    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    // Verify owner
    const habit = await Habit.findById(log.habitId);
    if (!habit || habit.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to modify this log' });
    }

    await log.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getLogs,
  createLog,
  deleteLog
};
