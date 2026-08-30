# CampusCare — College Complaint Management System

This project is built according to the specification in [spec.md](spec.md). It is the single source of truth for the application requirements, architecture, APIs, roles, and expected behavior.

CampusCare is a full-stack college complaint management platform that allows students to submit issues, track complaint progress, and lets administrators review, assign, prioritize, resolve, and close complaints across departments.

---

## 1. Project Overview

### Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs
- File Uploads: Multer
- Validation: express-validator
- Security: Helmet, CORS, rate limiting

### Core Features

- Student registration and login
- Admin login and protected routes
- Complaint submission, tracking, and history
- Department and staff assignment
- Priority and status lifecycle management
- File attachments and validation
- Search, filters, and statistics
- Notification center
- Admin dashboard with analytics
- Feedback after resolution

---

## 2. Repository Structure

The project is expected to follow this structure:

```text
CollegeComplaintManagementSystem/
├── spec.md
├── README.md
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── store/
│       ├── services/
│       └── utils/
├── server/
│   └── src/
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── middleware/
│       ├── models/
│       ├── utils/
│       └── app.js
└── .gitignore
```

---

## 3. Local Development Requirements

Before starting, install the following:

- Node.js 18+ or 20+
- npm
- MongoDB running locally or MongoDB Atlas account
- Git
- A code editor such as VS Code

Optional:

- Postman or Insomnia for API testing
- MongoDB Compass for database inspection

---

## 4. Backend Setup

### 4.1 Create the backend project

From the project root:

```bash
mkdir server
cd server
npm init -y
```

Then install backend dependencies:

```bash
npm install express mongoose dotenv cors helmet express-validator jsonwebtoken bcryptjs multer morgan
npm install -D nodemon
```

If you want to use a more structured setup, you can also install:

```bash
npm install express-rate-limit
```

### 4.2 Create environment file

Inside the `server` folder, create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campuscare
JWT_SECRET=replace_with_a_strong_secret
CLIENT_URL=http://localhost:5173
UPLOAD_MAX_SIZE=5242880
OPENROUTER_API_KEY=
GEMINI_API_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

Notes:

- `MONGODB_URI` can point to a local MongoDB instance or MongoDB Atlas.
- `JWT_SECRET` should be a strong random value.
- AI keys are optional and should not block app functionality if missing.

### 4.3 Create backend scripts

In `server/package.json` add scripts like:

```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js"
  }
}
```

### 4.4 Start MongoDB

If MongoDB is installed locally:

```bash
mongod
```

Or use MongoDB Atlas and set `MONGODB_URI` accordingly.

### 4.5 Run the backend

```bash
cd server
npm install
npm run dev
```

The API should be available at:

```text
http://localhost:5000/api
```

Health check endpoint:

```text
GET http://localhost:5000/api/health
```

---

## 5. Frontend Setup

### 5.1 Create the frontend project

From the project root:

```bash
npm create vite@latest client -- --template react
```

Then install required frontend dependencies:

```bash
cd client
npm install
npm install react-router-dom axios tailwindcss @tailwindcss/vite lucide-react
```

If using Tailwind, configure it according to your Vite setup.

### 5.2 Create frontend environment file

Inside the `client` folder, create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5.3 Run the frontend

```bash
cd client
npm run dev
```

The app should run at:

```text
http://localhost:5173
```

---

## 6. Required Application Flow

### Student flow

```text
Register → Login → Submit Complaint → Upload Evidence → Track Status → View Assignment → View Resolution → Provide Feedback → Close Complaint
```

### Admin flow

```text
Login → View Dashboard → Review Complaints → Search and Filter → Assign Department/Staff → Set Priority → Update Status → Add Comments → Resolve Complaint → Track Statistics
```

---

## 7. Database Models to Build

The backend should define the following collections:

- `User`
- `Complaint`
- `ComplaintHistory`
- `Department`
- `Staff`
- `Notification`
- `Feedback`

Each model should match the schema requirements in [spec.md](spec.md).

---

## 8. Authentication and Authorization

The backend must enforce:

- Student registration and login
- Admin login
- JWT-based auth
- Protected routes
- Role-based authorization
- Student access restrictions to only their own complaints
- Admin-only operations for assignment, priority changes, and resolution management

The frontend should still protect routes, but the backend is the source of truth.

---

## 9. Core API Endpoints

The backend should implement the endpoints listed in the project specification:

### Authentication

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Complaints

- `GET /api/complaints`
- `POST /api/complaints`
- `GET /api/complaints/:id`
- `PUT /api/complaints/:id`
- `DELETE /api/complaints/:id`
- `PATCH /api/complaints/:id/status`
- `PATCH /api/complaints/:id/priority`
- `PATCH /api/complaints/:id/assign`
- `POST /api/complaints/:id/comments`
- `POST /api/complaints/:id/resolve`
- `POST /api/complaints/:id/close`
- `GET /api/complaints/:id/history`

### Dashboard

- `GET /api/dashboard/student`
- `GET /api/dashboard/admin`
- `GET /api/dashboard/statistics`

### Departments and Staff

- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/:id`
- `GET /api/staff`
- `GET /api/staff/:id`

### Notifications

- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `PATCH /api/notifications/read-all`

### Feedback

- `POST /api/complaints/:id/feedback`
- `GET /api/complaints/:id/feedback`

### AI (Optional)

- `POST /api/ai/categorize-complaint`
- `POST /api/ai/summarize-complaint`

---

## 10. Important Rules to Follow During Development

These are requirements from the project specification and must be respected:

- Keep controllers thin and services responsible for business logic.
- Do not perform MongoDB logic in frontend code.
- Treat backend permissions as the source of truth.
- Hash passwords using bcrypt.
- Validate request bodies and uploaded files.
- Keep AI features optional and non-destructive.
- Record every complaint status transition in `ComplaintHistory`.
- Require resolution details before a complaint can become `Resolved`.
- Never expose passwords or tokens in API responses.
- Use centralized error handling.
- Keep the app deployment-ready.

---

## 11. File Upload Requirements

The backend must:

- Accept JPG, JPEG, PNG, and PDF files
- Validate MIME types and extensions
- Limit upload size
- Generate safe filenames
- Store metadata in the database
- Prevent unauthorized file access
- Return attachment metadata via the API

Recommended size:

```env
UPLOAD_MAX_SIZE=5242880
```

This is 5 MB in bytes.

---

## 12. Suggested Local Development Workflow

### Start from the project root

```bash
cd CollegeComplaintManagementSystem
```

### Terminal 1: Start backend

```bash
cd server
npm install
npm run dev
```

### Terminal 2: Start frontend

```bash
cd client
npm install
npm run dev
```

### Browser

Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## 13. Testing Checklist

Before completion, test the following major scenarios:

- User registration and login
- Admin login and role-based access
- Complaint creation and retrieval
- Status transitions
- Priority changes
- Assignment to department/staff
- File upload validation
- Search and filters
- Unauthorized access attempts
- Feedback submission after resolution
- Notification behavior
- Responsive frontend layouts

---

## 14. Production / Deployment Readiness

For production deployment, plan for:

- Environment variables in `.env` or deployment secrets manager
- MongoDB Atlas or managed MongoDB instance
- Separate frontend and backend deployments
- Secure CORS configuration
- Production build for the React app
- Reverse proxy or hosting environment for the backend
- Secure JWT secret management
- Optional email service or external AI provider integration

---

## 15. Common Local Troubleshooting

### MongoDB connection error

- Check that MongoDB is running
- Verify `MONGODB_URI` is correct
- Confirm the database exists or can be created

### JWT errors

- Ensure `JWT_SECRET` is set and non-empty
- Confirm the token is being sent in the Authorization header

### File upload fails

- Check the allowed formats and file size
- Confirm `UPLOAD_MAX_SIZE` is set correctly
- Make sure `multer` middleware is configured

### Frontend cannot reach the API

- Confirm the backend is running on `http://localhost:5000`
- Verify `VITE_API_URL` in the frontend `.env`
- Check browser devtools for CORS or network errors

---

## 16. Final Notes

This README is intended to support the implementation and local setup of the CampusCare project described in [spec.md](spec.md). Follow the specification closely, keep the backend as the source of truth for permissions and business rules, and build the app in phases as described in the specification.

---

## 17. Recommended First Commands

If you are starting from a blank workspace, begin with these commands:

```bash
mkdir CollegeComplaintManagementSystem
cd CollegeComplaintManagementSystem

# create backend
mkdir server
cd server
npm init -y
npm install express mongoose dotenv cors helmet express-validator jsonwebtoken bcryptjs multer morgan
npm install -D nodemon
cd ..

# create frontend
npm create vite@latest client -- --template react
cd client
npm install
npm install react-router-dom axios tailwindcss @tailwindcss/vite lucide-react
```

Then configure the environment files and start both apps.
