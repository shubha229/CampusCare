const express = require('express');
const protect = require('../middleware/auth');

const router = express.Router();

const feedbackList = [];

router.use(protect);

router.post('/:complaintId/feedback', (req, res) => {
  const entry = {
    complaintId: req.params.complaintId,
    student: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment || '',
    createdAt: new Date(),
  };

  feedbackList.push(entry);
  return res.status(201).json({ success: true, data: entry });
});

router.get('/:complaintId/feedback', (req, res) => {
  const results = feedbackList.filter((item) => item.complaintId === req.params.complaintId);
  return res.json({ success: true, data: results });
});

module.exports = router;
