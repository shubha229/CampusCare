const express = require('express');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/categorize-complaint', (req, res) => {
  res.json({
    success: true,
    data: {
      category: 'IT / Wi-Fi',
      priority: 'High',
      department: 'IT Department',
      confidence: 0.86,
    },
  });
});

router.post('/summarize-complaint', (req, res) => {
  res.json({
    success: true,
    data: {
      summary: 'Wi-Fi connectivity is unavailable in the affected area, limiting students\' access to online academic resources.',
      recommendedDepartment: 'IT Department',
    },
  });
});

module.exports = router;
