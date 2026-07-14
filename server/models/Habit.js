const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a habit title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['HEALTH', 'MIND', 'FINANCE', 'STUDY', 'WORK', 'ROUTINE']
  },
  icon: {
    type: String,
    default: 'CheckSquare'
  },
  color: {
    type: String,
    default: 'hsl(200, 95%, 45%)'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Habit', HabitSchema);
