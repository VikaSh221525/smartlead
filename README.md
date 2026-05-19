# SmartLead CRM — Full-Stack Monorepo

SmartLead is a premium, high-performance sales intelligence terminal and CRM designed for modern sales teams. Built with a production-grade backend (Node.js, Express, TypeScript, MongoDB) and a responsive, dynamic frontend (React, Vite, TypeScript, DaisyUI).

---

## 📁 Repository Structure

```
smartlead/
├── backend/            # Express.js REST API
└── frontend/           # React + Vite Client
```

---

## ⚡ Improvements Implemented

1. **Register Page Role Selector**:
   - Replaced the browser-default native `<select>` dropdown with premium selectable **Card Tiles** featuring clean icons (`TrendingUp` for Sales, `ShieldCheck` for Admin), clear selected state highlighting, hover micro-interactions, and selection indicator pulses.
2. **Alignment & Input Layout Fixes**:
   - Fixed alignment discrepancies across input fields and CTA buttons in both **Register** and **Login** pages by ensuring consistent width specifications (`w-full`) and proper layout configurations.
3. **Themed Custom Dropdowns in Modal**:
   - Built a beautiful custom `ThemedSelect` element in the Lead creation modal to replace standard OS-default selects. The select dropdowns now match the application's dark mode visual language, including state styling, checkmarks, and animations.
4. **Vercel SPA Fallback Configuration**:
   - Configured `vercel.json` rewrite rules to ensure smooth route loading and page reloads for React Router.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB instance (Local or MongoDB Atlas cluster URI)

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set PORT, MONGODB_URI, JWT_SECRET, and ALLOWED_ORIGINS (e.g. http://localhost:5173)

# Run development server
npm run dev
```

### 2. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local .env.local  # If configured, or let Vite fallback to http://localhost:5000
# Set VITE_API_URL=http://localhost:5000

# Run development server
npm run dev
```

---

## 🌐 Production Deployment Guide

Follow these steps to deploy the application on **Render** (Backend) and **Vercel** (Frontend).

### 📤 1. Backend Deployment on Render

Render makes it easy to run web services directly from GitHub.

1. **Sign in to Render** and navigate to your dashboard.
2. Click **New** → **Web Service**.
3. Connect your GitHub repository containing the `smartlead` project.
4. Configure the Web Service settings:
   - **Name**: `smartlead-api` (or any custom name)
   - **Environment**: `Node`
   - **Region**: Choose the region closest to your users.
   - **Branch**: `main` (or your primary branch)
   - **Root Directory**: `backend` (This targets only the backend folder in the monorepo)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. **Add Environment Variables**:
   Click on the **Environment** tab and add the following keys:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: *Your Atlas MongoDB Connection String*
   - `JWT_SECRET`: *A secure random string (minimum 32 characters)*
   - `ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app` *(Update this with your Vercel URL once the frontend is set up)*
6. Click **Create Web Service**. Render will build and deploy your backend. Note down the public URL provided (e.g., `https://smartlead-api.onrender.com`).

---

### 📥 2. Frontend Deployment on Vercel

Vercel provides seamless deployment for modern frontend frameworks.

1. **Sign in to Vercel** and click **Add New** → **Project**.
2. Import your GitHub repository.
3. Configure the Project settings:
   - **Project Name**: `smartlead`
   - **Framework Preset**: `Vite` (Vercel automatically detects this)
   - **Root Directory**: `frontend` (Click edit and select the `frontend` folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Add Environment Variables**:
   Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://smartlead-api.onrender.com` *(The URL of your live Render backend)*
5. Click **Deploy**. Vercel will build and launch your site.

> [!NOTE]
> The repository includes a `frontend/vercel.json` file. This handles routing fallback, allowing pages like `/dashboard` and `/register` to reload correctly without showing a Vercel 404 page.

---

### 🔄 3. Connect Frontend and Backend (Final Step)
Once your Vercel project is deployed, copy the Vercel app URL (e.g., `https://smartlead.vercel.app`) and update the `ALLOWED_ORIGINS` environment variable in your **Render Web Service settings** to match it. This ensures secure CORS communication.
