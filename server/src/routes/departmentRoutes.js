const express = require('express');
const protect = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

const router = express.Router();

const departments = [
  { id: '1', name: 'Infrastructure', description: 'Campus infrastructure and facilities' },
  { id: '2', name: 'IT / Wi-Fi', description: 'Networks and digital services' },
  { id: '3', name: 'Hostel', description: 'Residential support' },
  { id: '4', name: 'Transport', description: 'Campus transport complaints' },
  { id: '5', name: 'Laboratory', description: 'Lab maintenance' },
  { id: '6', name: 'Classroom', description: 'Classroom equipment and environment' },
  { id: '7', name: 'Electrical', description: 'Power and electrical systems' },
  { id: '8', name: 'Plumbing', description: 'Water and sanitation services' },
  { id: '9', name: 'Cleanliness', description: 'Cleaning and hygiene' },
  { id: '10', name: 'Security', description: 'Campus safety and security' },
  { id: '11', name: 'Other', description: 'General support' },
];

router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, data: departments });
});

router.post('/', requireAdmin, (req, res) => {
  const department = {
    id: String(departments.length + 1),
    name: req.body.name,
    description: req.body.description || '',
  };

  departments.push(department);
  res.status(201).json({ success: true, data: department });
});

module.exports = router;
