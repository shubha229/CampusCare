const crypto = require('crypto');
const Complaint = require('../models/Complaint');
const ComplaintHistory = require('../models/ComplaintHistory');

const allowedStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

const createComplaintId = () => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `CC-${random}`;
};

const createHistoryEntry = async ({ complaintId, action, previousStatus, newStatus, performedBy, comment, metadata = {} }) => {
  await ComplaintHistory.create({
    complaintId,
    action,
    previousStatus,
    newStatus,
    performedBy,
    comment,
    metadata,
  });
};

const listComplaints = async ({ user, query = {}, status, category, priority, department, assignedStaff }) => {
  const filters = {};

  if (user.role === 'student') {
    filters.student = user.id;
  }

  if (status) filters.status = status;
  if (category) filters.category = category;
  if (priority) filters.priority = priority;
  if (department) filters.department = department;
  if (assignedStaff) filters.assignedStaff = assignedStaff;

  return Complaint.find({ ...filters, ...query }).sort({ createdAt: -1 });
};

const getComplaintById = async (id) => {
  const complaint = await Complaint.findOne({ complaintId: id });

  if (!complaint) {
    const error = new Error('Complaint not found.');
    error.code = 'COMPLAINT_NOT_FOUND';
    error.statusCode = 404;
    throw error;
  }

  return complaint;
};

const submitComplaint = async ({ user, payload }) => {
  const complaint = await Complaint.create({
    complaintId: createComplaintId(),
    title: payload.title,
    description: payload.description,
    category: payload.category,
    location: payload.location,
    priority: payload.priority || 'Medium',
    status: 'Submitted',
    student: user.id,
    attachments: payload.attachments || [],
  });

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Complaint submitted',
    previousStatus: null,
    newStatus: 'Submitted',
    performedBy: user.name || user.email,
    comment: 'Complaint submitted by student.',
  });

  return complaint;
};

const updateComplaintStatus = async ({ complaintId, newStatus, performedBy, comment }) => {
  const complaint = await getComplaintById(complaintId);
  const currentStatus = complaint.status;

  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error('Invalid complaint status.');
    error.code = 'INVALID_STATUS_TRANSITION';
    error.statusCode = 400;
    throw error;
  }

  if (currentStatus === newStatus) {
    return complaint;
  }

  complaint.status = newStatus;

  if (newStatus === 'Resolved') {
    complaint.resolvedAt = new Date();
  }

  if (newStatus === 'Closed') {
    complaint.closedAt = new Date();
  }

  await complaint.save();

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Status updated',
    previousStatus: currentStatus,
    newStatus,
    performedBy,
    comment,
  });

  return complaint;
};

const assignComplaint = async ({ complaintId, department, assignedStaff, performedBy }) => {
  const complaint = await getComplaintById(complaintId);

  complaint.department = department || complaint.department;
  complaint.assignedStaff = assignedStaff || complaint.assignedStaff;

  if (complaint.status === 'Submitted') {
    complaint.status = 'Assigned';
  }

  await complaint.save();

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Complaint assigned',
    previousStatus: complaint.status === 'Assigned' ? 'Submitted' : complaint.status,
    newStatus: 'Assigned',
    performedBy,
    comment: `Assigned to ${department || 'department'}${assignedStaff ? ` / ${assignedStaff}` : ''}`,
  });

  return complaint;
};

const updateComplaintPriority = async ({ complaintId, priority, performedBy }) => {
  const complaint = await getComplaintById(complaintId);

  complaint.priority = priority;
  await complaint.save();

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Priority updated',
    previousStatus: complaint.status,
    newStatus: complaint.status,
    performedBy,
    comment: `Priority changed to ${priority}`,
  });

  return complaint;
};

const addComment = async ({ complaintId, comment, performedBy }) => {
  const complaint = await getComplaintById(complaintId);
  complaint.adminComments.push({
    text: comment,
    createdBy: performedBy,
    createdAt: new Date(),
  });

  await complaint.save();

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Comment added',
    previousStatus: complaint.status,
    newStatus: complaint.status,
    performedBy,
    comment,
  });

  return complaint;
};

const resolveComplaint = async ({ complaintId, resolutionDetails, performedBy }) => {
  const complaint = await getComplaintById(complaintId);

  if (!resolutionDetails || !resolutionDetails.trim()) {
    const error = new Error('Resolution details are required before resolving a complaint.');
    error.code = 'RESOLUTION_REQUIRED';
    error.statusCode = 400;
    throw error;
  }

  complaint.resolutionDetails = resolutionDetails;
  complaint.status = 'Resolved';
  complaint.resolvedAt = new Date();
  await complaint.save();

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Complaint resolved',
    previousStatus: 'In Progress',
    newStatus: 'Resolved',
    performedBy,
    comment: resolutionDetails,
  });

  return complaint;
};

const closeComplaint = async ({ complaintId, performedBy }) => {
  const complaint = await getComplaintById(complaintId);

  if (complaint.status !== 'Resolved') {
    const error = new Error('Complaint must be resolved before closing.');
    error.code = 'INVALID_STATUS_TRANSITION';
    error.statusCode = 400;
    throw error;
  }

  complaint.status = 'Closed';
  complaint.closedAt = new Date();
  await complaint.save();

  await createHistoryEntry({
    complaintId: complaint.complaintId,
    action: 'Complaint closed',
    previousStatus: 'Resolved',
    newStatus: 'Closed',
    performedBy,
    comment: 'Student confirmed resolution and closed complaint.',
  });

  return complaint;
};

const getComplaintHistory = async (complaintId) => {
  return ComplaintHistory.find({ complaintId }).sort({ createdAt: 1 });
};

module.exports = {
  listComplaints,
  getComplaintById,
  submitComplaint,
  updateComplaintStatus,
  assignComplaint,
  updateComplaintPriority,
  addComment,
  resolveComplaint,
  closeComplaint,
  getComplaintHistory,
};
