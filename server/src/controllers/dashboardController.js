const { getStudentDashboard, getAdminDashboard } = require('../services/dashboardService');
const { sendSuccess } = require('../utils/response');

const getStudentStats = async (req, res, next) => {
  try {
    const stats = await getStudentDashboard(req.user.id);
    return sendSuccess(res, stats, 200);
  } catch (error) {
    return next(error);
  }
};

const getAdminStats = async (req, res, next) => {
  try {
    const stats = await getAdminDashboard();
    return sendSuccess(res, stats, 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudentStats,
  getAdminStats,
};
