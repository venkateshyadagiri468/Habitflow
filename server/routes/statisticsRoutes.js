const express = require('express');
const router = express.Router();
const { getStatistics } = require('../controllers/statisticsController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getStatistics);

module.exports = router;
