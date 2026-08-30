const express = require('express');
const protect = require('../middleware/auth');

const router = express.Router();

const notifications = [
  {
    id: '1',
    recipient: 'student',
    complaintId: 'CC-1001',
    type: 'status',
    title: 'Complaint updated',
    message: 'Your complaint has been moved to In Progress.',
    isRead: false,
  },
  {
    id: '2',
    recipient: 'student',
    complaintId: 'CC-1003',
    type: 'comment',
    title: 'New comment',
    message: 'An admin has commented on your complaint.',
    isRead: true,
  },
];

router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, data: notifications });
});

router.patch('/:id/read', (req, res) => {
  const notification = notifications.find((item) => item.id === req.params.id);

  if (!notification) {
    return res.status(404).json({ success: false, error: { code: 'NOTIFICATION_NOT_FOUND', message: 'Notification not found.' } });
  }

  notification.isRead = true;
  return res.json({ success: true, data: notification });
});

router.patch('/read-all', (req, res) => {
  notifications.forEach((item) => {
    item.isRead = true;
  });

  return res.json({ success: true, data: notifications });
});

module.exports = router;
