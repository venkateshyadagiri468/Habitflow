const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');

// @desc    Get all habits for logged-in user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, count: habits.length, data: habits });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const { title, description, category, icon, color } = req.body;

    if (!title || !category) {
      return res.status(400).json({ success: false, error: 'Please provide title and category' });
    }

    const habit = await Habit.create({
      title,
      description,
      category,
      icon,
      color,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: habit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    let habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(444).json({ success: false, error: 'Habit not found' });
    }

    // Make sure user owns habit
    if (habit.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to update this habit' });
    }

    habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: habit });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ success: false, error: 'Habit not found' });
    }

    // Make sure user owns habit
    if (habit.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this habit' });
    }

    // Delete all logs associated with this habit
    await HabitLog.deleteMany({ habitId: habit._id });
    // Delete the habit itself
    await habit.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit
};
