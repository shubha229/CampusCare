const { listComplaints, submitComplaint, getComplaintById, updateComplaintStatus, assignComplaint, updateComplaintPriority, addComment, resolveComplaint, closeComplaint, getComplaintHistory } = require('../services/complaintService');
const { sendSuccess } = require('../utils/response');

const getComplaints = async (req, res, next) => {
  try {
    const complaints = await listComplaints({
      user: req.user,
      status: req.query.status,
      category: req.query.category,
      priority: req.query.priority,
      department: req.query.department,
      assignedStaff: req.query.assignedStaff,
    });

    return sendSuccess(res, complaints, 200);
  } catch (error) {
    return next(error);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const complaint = await submitComplaint({
      user: req.user,
      payload: req.body,
    });

    return sendSuccess(res, complaint, 201);
  } catch (error) {
    return next(error);
  }
};

const getComplaint = async (req, res, next) => {
  try {
    const complaint = await getComplaintById(req.params.id);

    if (req.user.role === 'student' && complaint.student.toString() !== req.user.id.toString()) {
      const error = new Error('You are not allowed to access this complaint.');
      error.code = 'FORBIDDEN';
      error.statusCode = 403;
      throw error;
    }

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const complaint = await updateComplaintStatus({
      complaintId: req.params.id,
      newStatus: req.body.status,
      performedBy: req.user.name || req.user.email,
      comment: req.body.comment || '',
    });

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const updatePriority = async (req, res, next) => {
  try {
    const complaint = await updateComplaintPriority({
      complaintId: req.params.id,
      priority: req.body.priority,
      performedBy: req.user.name || req.user.email,
    });

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const assign = async (req, res, next) => {
  try {
    const complaint = await assignComplaint({
      complaintId: req.params.id,
      department: req.body.department,
      assignedStaff: req.body.assignedStaff,
      performedBy: req.user.name || req.user.email,
    });

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const addAdminComment = async (req, res, next) => {
  try {
    const complaint = await addComment({
      complaintId: req.params.id,
      comment: req.body.comment,
      performedBy: req.user.name || req.user.email,
    });

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const resolve = async (req, res, next) => {
  try {
    const complaint = await resolveComplaint({
      complaintId: req.params.id,
      resolutionDetails: req.body.resolutionDetails,
      performedBy: req.user.name || req.user.email,
    });

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const close = async (req, res, next) => {
  try {
    const complaint = await closeComplaint({
      complaintId: req.params.id,
      performedBy: req.user.name || req.user.email,
    });

    return sendSuccess(res, complaint, 200);
  } catch (error) {
    return next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await getComplaintHistory(req.params.id);
    return sendSuccess(res, history, 200);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getComplaints,
  createComplaint,
  getComplaint,
  updateStatus,
  updatePriority,
  assign,
  addAdminComment,
  resolve,
  close,
  getHistory,
};
