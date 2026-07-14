const express = require('express');
const router = express.Router();
const { getLogs, createLog, deleteLog } = require('../controllers/logController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getLogs)
  .post(createLog);

router.route('/:id')
  .delete(deleteLog);

module.exports = router;
