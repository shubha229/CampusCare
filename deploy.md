# Deployment Guide for CampusCare

This project is split into:

- Frontend: `client/` deployed on Vercel
- Backend: `server/` deployed on Render
- Database: MongoDB Atlas (recommended for production)

---

## 1) Prepare the Git repository

From the project root:

```bash
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

> The `.gitignore` file already excludes `node_modules`, build folders, and `.env` files so secrets are not pushed to GitHub.

---

## 2) Backend deployment on Render

### Step 1: Create MongoDB Atlas database

1. Go to MongoDB Atlas.
2. Create a free cluster.
3. Create a database user.
4. Allow access from anywhere for testing: `0.0.0.0/0` (or restrict to Render IPs if needed).
5. Copy the connection string.

Example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campuscare?retryWrites=true&w=majority
```

### Step 2: Create Render Web Service

1. Log in to Render.
2. Click `New` → `Web Service`.
3. Connect your GitHub repository.
4. Set the service root to:

```text
server
```

5. Use these settings:

- Runtime: `Node`
- Build Command:

```bash
npm install
```

- Start Command:

```bash
npm start
```

### Step 3: Add environment variables in Render

Add these values:

```env
PORT=10000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/campuscare?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret
CLIENT_URL=https://your-vercel-app.vercel.app
UPLOAD_MAX_SIZE=5242880
OPENROUTER_API_KEY=
GEMINI_API_KEY=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
```

> Render automatically provides a `PORT`, so you usually do not need to hardcode it locally in production; but the app already expects a `PORT` environment value.

### Step 4: Deploy

Render will build and deploy the backend automatically.

Once deployed, your API base URL will look like:

```text
https://your-backend-name.onrender.com/api
```

Check health endpoint:

```text
https://your-backend-name.onrender.com/api/health
```

---

## 3) Frontend deployment on Vercel

### Step 1: Prepare the frontend

Inside `client/.env` set:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

If the app uses a direct API URL in code, replace it with the deployed backend URL before pushing.

### Step 2: Import repository into Vercel

1. Go to Vercel.
2. Click `Add New Project`.
3. Import your GitHub repo.
4. Set the project root to:

```text
client
```

5. Framework: `Vite`
6. Build command:

```bash
npm install && npm run build
```

7. Output directory:

```text
dist
```

### Step 3: Set environment variables

Add:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### Step 4: Deploy

Vercel will push the frontend and generate a live URL such as:

```text
https://campuscare.vercel.app
```

---

## 4) Final production configuration check

### Backend check

Open this URL:

```text
https://your-backend-name.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "CampusCare API is running"
}
```

### Frontend check

Open the Vercel URL and test:

- Registration
- Login
- Student dashboard access
- Admin dashboard access
- Complaint creation and viewing

---

## 5) Common deployment issues

### Issue: backend fails to connect to MongoDB

Check:

- `MONGODB_URI` is correct
- the database user exists
- your Atlas IP whitelist includes your environment
- the database name is valid

### Issue: login fails in production

Check:

- `JWT_SECRET` is set in Render
- the frontend is calling the correct Render URL
- CORS is configured properly
- `CLIENT_URL` matches the Vercel frontend URL

### Issue: frontend cannot reach backend

Check the Vercel environment variable:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## 6) Recommended next step

After deployment, create a real admin account inside the database or via a seed script so the admin role works correctly in production.

If you want, you can also add a script like `npm run seed` to create an admin user automatically.

---

## 7) Recommended Git flow

```bash
git status
git add .
git commit -m "Prepare for deployment"
git push origin main
```

This keeps your repo clean and ready for Vercel and Render deployment.
