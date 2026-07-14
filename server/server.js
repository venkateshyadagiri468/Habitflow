const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB (dynamically uses local in-memory if no URI provided)
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For development, allow any client origin
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/statistics', require('./routes/statisticsRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// Root path diagnostic
app.get('/', (req, res) => {
  res.json({ message: 'HabitFlow API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
