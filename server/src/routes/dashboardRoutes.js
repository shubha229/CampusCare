const express = require('express');
const { getStudentStats, getAdminStats } = require('../controllers/dashboardController');
const protect = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

const router = express.Router();

router.use(protect);
router.get('/student', getStudentStats);
router.get('/admin', requireAdmin, getAdminStats);

module.exports = router;
