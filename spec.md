# College Complaint Management System — Project Specification

## 1. Project Overview & Tech Stack

### Project Overview

Build a full-stack web application called **CampusCare — College Complaint Management System** that allows students to report problems within their college and track complaints from submission to resolution.

The platform must replace manual complaint processes with a centralized digital system connecting students, administrators, departments, and responsible staff.

Students can submit complaints related to classrooms, laboratories, hostels, Wi-Fi, infrastructure, transportation, cleanliness, security, and other campus facilities. Administrators can review complaints, assign them to departments or staff, update their status, add comments, manage priorities, and record resolution details.

The complete complaint lifecycle must be:

**Student → Submit Complaint → Admin Reviews → Assign Department/Staff → In Progress → Resolved → Student Confirms → Closed**

The application must provide complaint history, search and filtering, basic statistics, role-based access, file attachments, responsive UI, REST APIs, database persistence, validation, error handling, and deployment readiness.

### Tech Stack

* **Frontend:** React.js / Vite, React Router
* **Backend:** Node.js, Express.js, MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **File Uploads:** Multer with configurable local/cloud storage
* **Validation:** express-validator
* **Deployment:** Frontend and backend must be deployable independently
* **Database:** MongoDB with Mongoose schemas

---

## 2. Authentication, Roles, and Complaint Management

### Authentication

The authentication system must support:

* Student registration
* Student login
* Admin login
* JWT-based authentication
* Protected routes
* `/api/auth/me` profile endpoint
* Password hashing using bcrypt
* Persistent login state on the client
* Logout functionality
* Authentication error handling
* Role-based authorization

Users must have one of the following roles:

* `student`
* `admin`

Administrators must have access to complaint management functionality that ordinary students cannot access.

### Student Functionality

Students must be able to:

* Register and log in
* View their dashboard
* Submit complaints
* Select complaint category
* Enter complaint description
* Specify issue location
* Set relevant complaint details
* Upload images/files
* View submitted complaints
* Search/filter their complaint history
* Open complaint details
* Track complaint status
* View assigned department/staff
* View administrator comments
* View resolution details
* Close resolved complaints
* Provide optional feedback/rating after resolution

### Complaint Management

Every complaint must contain:

* Complaint ID
* Student/complainant
* Category
* Title
* Description
* Location
* Attachment(s)
* Priority
* Current status
* Assigned department
* Assigned staff member
* Admin comments
* Resolution details
* Created timestamp
* Updated timestamp
* Resolved timestamp
* Closed timestamp

### Complaint Status Lifecycle

The supported statuses are:

**Submitted → Under Review → Assigned → In Progress → Resolved → Closed**

Status transitions must be controlled by the backend.

Example:

```text
Submitted
    ↓
Under Review
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
    ↓
Closed
```

A complaint should not be silently moved between states.

Every status change must be recorded in the complaint history.

### Complaint Priority

Each complaint must support:

* `Low`
* `Medium`
* `High`
* `Critical`

Administrators can change priority when necessary.

---

## 3. Admin Dashboard and Complaint Operations

### Admin Dashboard

The admin dashboard must provide:

* Total complaints
* New complaints
* Complaints under review
* Assigned complaints
* Complaints in progress
* Resolved complaints
* Closed complaints
* Critical/high-priority complaints
* Average resolution time
* Department-wise complaint statistics
* Recent complaint activity

The dashboard must provide an overview of the current state of campus complaints.

### Admin Complaint Management

Administrators must be able to:

* View all complaints
* Search complaints
* Filter by status
* Filter by category
* Filter by priority
* Filter by department
* Filter by date
* Sort complaints
* Open complaint details
* Change complaint priority
* Assign department
* Assign responsible staff
* Add comments
* Update complaint status
* Add resolution details
* Resolve complaints
* Close complaints
* View complete complaint history

### Department Assignment

Complaints must be assignable to departments such as:

* Infrastructure
* IT / Wi-Fi
* Hostel
* Transport
* Laboratory
* Classroom
* Electrical
* Plumbing
* Cleanliness
* Security
* Other

The department list should be configurable rather than hardcoded into the UI.

### Staff Assignment

An administrator must be able to assign a complaint to a responsible staff member.

The complaint detail page must clearly show:

```text
Assigned Department: IT Department
Assigned Staff: Staff Member
Priority: High
Status: In Progress
```

---

## 4. Complaint Details and History

### Complaint Details Page

The complaint details page must display:

* Complaint ID
* Complaint title
* Category
* Description
* Location
* Submitted by
* Submission date
* Priority
* Current status
* Assigned department
* Assigned staff
* Attachments
* Admin comments
* Resolution details
* Complete status timeline

### Complaint Timeline

The complaint must display a visual timeline such as:

```text
✓ Submitted
  Aug 28, 10:30 AM

✓ Under Review
  Aug 28, 11:15 AM

✓ Assigned
  Aug 28, 1:20 PM
  IT Department

✓ In Progress
  Aug 29, 9:00 AM

✓ Resolved
  Aug 29, 4:30 PM

○ Closed
  Waiting for student confirmation
```

Every status transition must record:

* Previous status
* New status
* Changed by
* Timestamp
* Optional comment

---

## 5. Notifications

The system should generate notifications for important complaint events.

Examples:

* Complaint submitted successfully
* Complaint moved to Under Review
* Complaint assigned to department
* Complaint assigned to staff
* Complaint status changed
* Complaint resolved
* Complaint closed
* Administrator added a comment
* High/Critical complaint created

Notifications should appear in the application notification area.

### Optional Email Notifications

If email functionality is enabled, students may receive emails when:

* Complaint is submitted
* Complaint is assigned
* Complaint status changes
* Complaint is resolved
* Complaint is closed

Email functionality must fail gracefully if email configuration is unavailable.

---

## 6. Search, Filtering, and Statistics

### Search

Students should be able to search their complaints by:

* Complaint ID
* Title
* Category
* Location

Administrators should be able to search across all complaints.

### Filters

Supported filters:

* Status
* Category
* Priority
* Department
* Date range
* Assigned staff

Filters must be combinable.

Example:

```text
Status: In Progress
Priority: High
Department: IT
```

### Basic Statistics

The system must calculate:

* Total complaints
* Complaints by status
* Complaints by category
* Complaints by priority
* Complaints by department
* Resolved complaints
* Pending complaints
* Average resolution time

---

## 7. File Attachments

Students must be able to attach evidence to a complaint.

Supported examples:

* JPG
* JPEG
* PNG
* PDF

The backend must:

* Validate file type
* Validate file size
* Generate safe filenames
* Store attachment metadata
* Prevent unauthorized access
* Return attachment information through the API

The application must never trust the original uploaded filename.

---

## 9. Frontend Pages

The application must use React Router for client-side routing.

### `/`

Landing page featuring:

* Platform introduction
* Complaint management explanation
* Feature highlights
* Student/Admin entry points
* Responsive design

### `/login`

Login page featuring:

* Email field
* Password field
* Role-aware authentication
* Validation
* Loading state
* Error messages

### `/register`

Student registration page featuring:

* Name
* Email
* Password
* Confirm password
* Validation
* Registration success/error states

### `/dashboard`

Role-specific dashboard.

#### Student Dashboard

Must contain:

* Total submitted complaints
* Active complaints
* Resolved complaints
* Closed complaints
* Recent complaints
* Complaint status overview
* Submit Complaint CTA

#### Admin Dashboard

Must contain:

* Total complaints
* Pending complaints
* In-progress complaints
* Resolved complaints
* Critical complaints
* Resolution statistics
* Department statistics
* Recent complaints

### `/complaints`

Complaint listing page.

Features:

* Search
* Filters
* Sorting
* Pagination
* Status badges
* Priority badges
* Complaint ID
* Category
* Date
* Department

Students see their own complaints.

Admins see all complaints.

### `/complaints/new`

Complaint submission form featuring:

* Complaint title
* Category
* Description
* Location
* Priority
* File attachment
* Submit button
* Validation
* Loading state
* Success/error handling

### `/complaints/[id]`

Complaint details page featuring:

* Complaint information
* Status timeline
* Attachments
* Assignment details
* Admin comments
* Resolution information
* Student closure action

Admins additionally see:

* Assign department
* Assign staff
* Change priority
* Update status
* Add comment
* Add resolution details

### `/admin/complaints`

Admin complaint management console featuring:

* Complaint table
* Search
* Filters
* Sorting
* Bulk-friendly management interface
* Status management
* Assignment controls

### `/notifications`

Notification center displaying complaint-related notifications.

### `/profile`

Profile page featuring:

* Name
* Email
* Role
* Account information
* Password update

---

## 10. Backend Architecture

### Architecture

The backend must follow a layered architecture.

* **Routes:** HTTP routing and middleware
* **Controllers:** Request parsing and response formatting only
* **Services:** Business logic and database operations
* **Models:** Mongoose schemas
* **Middleware:** Authentication, authorization, validation, errors, uploads
* **Utils:** Helper functions
* **Config:** Environment variables and database configuration

Controllers must remain thin.

Business logic must be implemented inside services.

Controllers must not contain complex database or business logic.

---

## 11. Database Collections

### Users

Stores authenticated users.

Fields:

```text
name
email
password
role: student | admin
lastLogin
createdAt
updatedAt
```

Password must never be returned in normal API responses.

### Complaints

Stores complaint records.

Fields:

```text
complaintId
title
description
category
location
attachments
student
priority
status
department
assignedStaff
adminComments
resolutionDetails
createdAt
updatedAt
resolvedAt
closedAt
```

### ComplaintHistory

Stores every important complaint event.

Fields:

```text
complaintId
action
previousStatus
newStatus
performedBy
comment
metadata
createdAt
```

### Departments

Stores college departments.

Fields:

```text
name
description
isActive
createdAt
updatedAt
```

### Staff

Stores responsible staff members.

Fields:

```text
name
email
department
role
isActive
createdAt
updatedAt
```

### Notifications

Stores user notifications.

Fields:

```text
recipient
complaintId
type
title
message
isRead
createdAt
```

### Feedback

Stores student feedback after resolution.

Fields:

```text
complaintId
student
rating
comment
createdAt
```

---

## 12. API Endpoints

### Health and Authentication

* `GET /api/health` — System health check
* `POST /api/auth/register` — Register student
* `POST /api/auth/login` — Authenticate user
* `GET /api/auth/me` — Get current user
* `POST /api/auth/logout` — Logout

### Complaints

* `GET /api/complaints` — List complaints
* `POST /api/complaints` — Submit complaint
* `GET /api/complaints/:id` — Get complaint details
* `PUT /api/complaints/:id` — Update complaint
* `DELETE /api/complaints/:id` — Delete complaint where permitted
* `PATCH /api/complaints/:id/status` — Update status
* `PATCH /api/complaints/:id/priority` — Update priority
* `PATCH /api/complaints/:id/assign` — Assign department/staff
* `POST /api/complaints/:id/comments` — Add admin comment
* `POST /api/complaints/:id/resolve` — Add resolution details
* `POST /api/complaints/:id/close` — Close complaint
* `GET /api/complaints/:id/history` — Get complaint history

### Dashboard

* `GET /api/dashboard/student` — Student statistics
* `GET /api/dashboard/admin` — Admin statistics
* `GET /api/dashboard/statistics` — Complaint statistics

### Departments and Staff

* `GET /api/departments` — List departments
* `POST /api/departments` — Create department
* `PUT /api/departments/:id` — Update department
* `GET /api/staff` — List staff
* `GET /api/staff/:id` — Get staff details

### Notifications

* `GET /api/notifications` — List notifications
* `PATCH /api/notifications/:id/read` — Mark notification as read
* `PATCH /api/notifications/read-all` — Mark all as read

### Feedback

* `POST /api/complaints/:id/feedback` — Submit resolution feedback
* `GET /api/complaints/:id/feedback` — View feedback

### AI

* `POST /api/ai/categorize-complaint` — Suggest complaint category
* `POST /api/ai/summarize-complaint` — Generate complaint summary

---

## 13. Folder Structure

### Frontend Structure

```text
client/
└── src/
    ├── components/
    │   ├── AppShell/
    │   ├── Navbar/
    │   ├── Sidebar/
    │   ├── ComplaintCard/
    │   ├── ComplaintTable/
    │   ├── ComplaintForm/
    │   ├── ComplaintTimeline/
    │   ├── StatusBadge/
    │   ├── PriorityBadge/
    │   ├── SearchFilter/
    │   ├── NotificationDrawer/
    │   ├── StatsCard/
    │   ├── FileUploader/
    │   └── ProtectedRoute/
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── Complaints.jsx
    │   ├── NewComplaint.jsx
    │   ├── ComplaintDetails.jsx
    │   ├── Notifications.jsx
    │   ├── Profile.jsx
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       └── AdminComplaints.jsx
    ├── store/
    │   ├── authStore.js
    │   └── complaintStore.js
    ├── services/
    │   └── api.js
    └── utils/
        └── helpers.js
```

### Backend Structure

```text
server/
└── src/
    ├── config/
    │   ├── env.js
    │   └── db.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── complaintRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── departmentRoutes.js
    │   ├── staffRoutes.js
    │   ├── notificationRoutes.js
    │   └── aiRoutes.js
    ├── controllers/
    │   ├── authController.js
    │   ├── complaintController.js
    │   ├── dashboardController.js
    │   ├── departmentController.js
    │   ├── staffController.js
    │   ├── notificationController.js
    │   └── aiController.js
    ├── services/
    │   ├── authService.js
    │   ├── complaintService.js
    │   ├── dashboardService.js
    │   ├── departmentService.js
    │   ├── notificationService.js
    │   └── aiService.js
    ├── middleware/
    │   ├── auth.js
    │   ├── role.js
    │   ├── validation.js
    │   ├── upload.js
    │   └── errorHandler.js
    ├── models/
    │   ├── User.js
    │   ├── Complaint.js
    │   ├── ComplaintHistory.js
    │   ├── Department.js
    │   ├── Staff.js
    │   ├── Notification.js
    │   └── Feedback.js
    ├── utils/
    │   ├── jwt.js
    │   └── response.js
    └── app.js
```

---

## 14. Development Phases

### Phase 1: Project Setup

* Set up React/Vite frontend
* Set up Express backend
* Configure MongoDB
* Configure environment variables
* Implement JWT authentication
* Implement bcrypt password hashing
* Create basic AppShell
* Implement protected routes

### Phase 2: Student Complaint System

* Create complaint model
* Build complaint submission form
* Implement CRUD APIs
* Add categories
* Add locations
* Add priorities
* Add file attachments
* Build complaint listing
* Build complaint details page

### Phase 3: Complaint Lifecycle

* Implement status transitions
* Implement complaint history
* Build visual status timeline
* Add department assignment
* Add staff assignment
* Add admin comments
* Add resolution details
* Implement complaint closure

### Phase 4: Admin Console

* Build admin dashboard
* Build complaint management table
* Add search
* Add filters
* Add sorting
* Add statistics
* Add department-wise analytics
* Add resolution-time statistics

### Phase 5: Notifications and Feedback

* Implement notification system
* Add status-change notifications
* Add resolution notifications
* Build notification drawer
* Add student resolution feedback
* Add complaint rating

### Phase 6: Deployment

* Add production environment configuration
* Deploy frontend
* Deploy backend
* Deploy MongoDB
* Perform end-to-end testing

---

## 15. UI and UX Requirements

The application must use a modern **campus service-management console** aesthetic.

The UI must:

* Be fully responsive
* Work on desktop, tablet, and mobile
* Use clear status indicators
* Use clear priority indicators
* Provide loading states
* Provide skeleton loaders where appropriate
* Provide empty states
* Provide meaningful error messages
* Provide confirmation dialogs for destructive actions
* Provide success feedback after operations
* Make complaint status immediately visible
* Make complaint IDs easy to copy
* Provide accessible forms
* Support keyboard navigation where practical

### Status Colors

Status badges should visually distinguish:

* Submitted
* Under Review
* Assigned
* In Progress
* Resolved
* Closed

Priority badges should distinguish:

* Low
* Medium
* High
* Critical

The complaint details page should prioritize **"What is the issue?", "Who is handling it?", and "What happens next?"**

---

## 16. Security Requirements

The application must:

* Hash passwords using bcrypt
* Sign and verify JWTs using `JWT_SECRET`
* Never expose passwords through APIs
* Validate all request bodies
* Validate uploaded files
* Limit upload file sizes
* Use helmet
* Configure CORS
* Rate-limit authentication endpoints
* Sanitize user-controlled input
* Restrict admin APIs using role-based middleware
* Ensure students can only access their own complaints
* Ensure students cannot modify administrative fields
* Never expose sensitive environment variables
* Never log passwords or authentication tokens
* Return appropriate HTTP status codes
* Use centralized error handling

Authorization must be enforced on the backend and must never rely only on frontend route protection.

---

## 17. Error Handling

The backend must use centralized error handling.

Common errors include:

```text
AUTH_REQUIRED
INVALID_CREDENTIALS
FORBIDDEN
COMPLAINT_NOT_FOUND
INVALID_STATUS_TRANSITION
INVALID_PRIORITY
INVALID_CATEGORY
INVALID_FILE_TYPE
FILE_TOO_LARGE
DEPARTMENT_NOT_FOUND
STAFF_NOT_FOUND
VALIDATION_ERROR
DUPLICATE_COMPLAINT
INTERNAL_SERVER_ERROR
```

Errors must return a consistent response structure.

Example:

```json
{
  "success": false,
  "error": {
    "code": "COMPLAINT_NOT_FOUND",
    "message": "Complaint could not be found."
  }
}
```

---

## 18. Core Business Rules

1. A student can only view their own complaints.
2. An admin can view all complaints.
3. Only authorized administrators can assign departments/staff.
4. Only administrators can change complaint priority.
5. Students cannot mark an unresolved complaint as resolved.
6. A complaint cannot be closed before it is resolved.
7. Every status change must create a history record.
8. Resolution details are required before a complaint becomes `Resolved`.
9. A student can close a resolved complaint after reviewing the resolution.
10. Every complaint must have a category and location.
11. Critical complaints must be visually prominent in the admin dashboard.
12. Deleted complaints should not be physically removed if doing so would destroy required audit history.
13. AI recommendations must never override user/admin control automatically.
14. The backend is the source of truth for complaint status and permissions.

---

## 19. Optional Duplicate Complaint Detection

The system may detect potentially duplicated complaints.

Example:

```text
Complaint A:
"Wi-Fi is not working in Block B."

Complaint B:
"Internet unavailable in Block B hostel."
```

The system may display:

> "A similar complaint may already exist."

The student can still choose to submit the complaint.

Duplicate detection must be advisory rather than blocking.

---

## 20. Testing Requirements

The completed application must be tested for:

### Authentication

* Registration
* Login
* Invalid credentials
* Protected routes
* Role authorization

### Complaints

* Create complaint
* View complaint
* Update complaint
* Search complaint
* Filter complaint
* Status transitions
* Priority updates
* Assignment
* Resolution
* Closure

### Security

* Student accessing another student's complaint
* Unauthorized admin APIs
* Invalid JWT
* Invalid file uploads
* Oversized uploads

### UI

* Loading states
* Empty states
* API errors
* Responsive layout
* Form validation
* Mobile navigation

### Integration

Verify:

```text
Frontend → API → Service → MongoDB
```

for all major complaint operations.

---

## 21. Environment Variables

All secrets must be stored in environment variables.

Example:

```text
PORT=
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=

UPLOAD_MAX_SIZE=

OPENROUTER_API_KEY=
GEMINI_API_KEY=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

Secrets must never be hardcoded into source code.

---

## 22. Final Expected Outcome

The completed **CampusCare — College Complaint Management System** must provide a complete digital complaint lifecycle.

A student should be able to:

```text
Register
   ↓
Login
   ↓
Submit Complaint
   ↓
Upload Evidence
   ↓
Track Status
   ↓
View Assignment
   ↓
View Resolution
   ↓
Provide Feedback
   ↓
Close Complaint
```

An administrator should be able to:

```text
Login
   ↓
View Dashboard
   ↓
Review Complaints
   ↓
Filter/Search
   ↓
Assign Department & Staff
   ↓
Set Priority
   ↓
Update Status
   ↓
Add Comments
   ↓
Resolve Complaint
   ↓
Track Resolution Statistics
```

The final product should feel like a **modern digital campus service desk**, rather than a basic CRUD application.

The system must demonstrate:

* Full-stack development
* Authentication
* Role-based authorization
* CRUD operations
* REST APIs
* Database relationships
* File uploads
* Search and filtering
* Status workflow
* Audit history
* Admin analytics
* Notifications
* Frontend-backend integration
* Responsive UI
* Security
* Deployment

Optional AI features can elevate the project from a conventional complaint portal into an **intelligent campus issue-resolution platform**.

---

## 23. Codex & AI Agent Implementation Instructions

The AI coding agent must:

* Build the application phase by phase.
* Follow the folder structure strictly.
* Keep controllers thin.
* Put business logic inside services.
* Never access MongoDB directly from frontend code.
* Never put database logic inside controllers when it belongs in services.
* Enforce authentication on protected APIs.
* Enforce role authorization on admin APIs.
* Treat the backend as the source of truth for permissions.
* Validate every request body.
* Validate every uploaded file.
* Never expose passwords or secrets.
* Treat every environment secret as `process.env`.
* Implement the complete complaint lifecycle.
* Record every status change in `ComplaintHistory`.
* Ensure students cannot access other students' complaints.
* Ensure admin-only functionality cannot be triggered through direct API calls by students.
* Keep AI functionality optional so the core application works without an AI API key.
* Handle unavailable external services gracefully.
* Implement loading, error, and empty states throughout the frontend.
* Test every major API endpoint.
* Test role-based authorization.
* Test complaint status transitions.
* Test file upload validation.
* Test responsive UI.
* Keep the application deployment-ready.
* Report the list of files created or changed at the end of every development phase.
