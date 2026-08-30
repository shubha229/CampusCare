const express = require('express');
const { getComplaints, createComplaint, getComplaint, updateStatus, updatePriority, assign, addAdminComment, resolve, close, getHistory } = require('../controllers/complaintController');
const protect = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');
const { validateComplaint } = require('../middleware/validation');

const router = express.Router();

router.use(protect);
router.get('/', getComplaints);
router.post('/', validateComplaint, createComplaint);
router.get('/:id', getComplaint);
router.patch('/:id/status', requireAdmin, updateStatus);
router.patch('/:id/priority', requireAdmin, updatePriority);
router.patch('/:id/assign', requireAdmin, assign);
router.post('/:id/comments', requireAdmin, addAdminComment);
router.post('/:id/resolve', requireAdmin, resolve);
router.post('/:id/close', close);
router.get('/:id/history', getHistory);

module.exports = router;
