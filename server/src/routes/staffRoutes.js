const express = require('express');
const protect = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

const router = express.Router();

const staffMembers = [
  { id: '1', name: 'Aisha Khan', email: 'aisha@campus.edu', department: 'IT / Wi-Fi', role: 'Network Admin', isActive: true },
  { id: '2', name: 'Lucas Grant', email: 'lucas@campus.edu', department: 'Infrastructure', role: 'Maintenance Lead', isActive: true },
  { id: '3', name: 'Priya Nair', email: 'priya@campus.edu', department: 'Hostel', role: 'Residence Coordinator', isActive: true },
];

router.use(protect);

router.get('/', requireAdmin, (req, res) => {
  res.json({ success: true, data: staffMembers });
});

router.get('/:id', requireAdmin, (req, res) => {
  const staff = staffMembers.find((member) => member.id === req.params.id);

  if (!staff) {
    return res.status(404).json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found.' } });
  }

  return res.json({ success: true, data: staff });
});

module.exports = router;
