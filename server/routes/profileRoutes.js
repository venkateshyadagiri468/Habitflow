const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, deleteAccount } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .put(updateProfile)
  .delete(deleteAccount);

router.put('/password', changePassword);

module.exports = router;
