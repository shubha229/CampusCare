const Complaint = require('../models/Complaint');

const getStudentDashboard = async (userId) => {
  const complaints = await Complaint.find({ student: userId });

  return {
    total: complaints.length,
    active: complaints.filter((item) => ['Submitted', 'Under Review', 'Assigned', 'In Progress'].includes(item.status)).length,
    resolved: complaints.filter((item) => item.status === 'Resolved').length,
    closed: complaints.filter((item) => item.status === 'Closed').length,
    recent: complaints.slice(0, 5),
  };
};

const getAdminDashboard = async () => {
  const complaints = await Complaint.find({});

  return {
    total: complaints.length,
    pending: complaints.filter((item) => ['Submitted', 'Under Review', 'Assigned'].includes(item.status)).length,
    inProgress: complaints.filter((item) => item.status === 'In Progress').length,
    resolved: complaints.filter((item) => item.status === 'Resolved').length,
    critical: complaints.filter((item) => item.priority === 'Critical').length,
    recent: complaints.slice(0, 5),
  };
};

module.exports = {
  getStudentDashboard,
  getAdminDashboard,
};
