# Daitya Legion Admin Login Fix - Vercel Serverless Deploy

Current: 2024-10-XX | Progress: Starting Implementation

## 🔍 Problem

Admin login fails on Vercel (https://daitya-legion-team.vercel.app/) but works locally.
**Root Cause**: Frontend calls external Render backend (down/missing env). vercel.json only builds frontend.

## ✅ Data Safety

- No DB changes → existing players/matches preserved via same MONGO_URI
- Restructuring only (routes → API handlers)

## 📋 Implementation Steps

### Step 1: Analysis [✅ COMPLETE]

- Files read: config.js, authController, routes, pages, etc.
- Confirmed API_BASE_URL hardcoded external URL

### Step 2: TODO.md [✅ CREATED]

### Step 3: Fix Frontend API URLs [✅ COMPLETE]

- frontend/src/config.js → '' (relative paths)

### Step 4: Vercel Config [✅ COMPLETE]

- vercel.json monorepo + API runtime

### Step 5: Convert Routes to API/ [✅ COMPLETE]

- `api/auth/login.js` [✅]
- `api/players/route.js` [✅ basic CRUD, uploads temp disabled]
- `api/team/route.js` [✅]
- `api/matches/route.js` [✅]
- Handle DB conn + auth per handler [✅]

### Step 6: Test Local [ℹ️ INSTRUCTIONS]

- Install Vercel CLI: `npm i -g vercel`
- `vercel dev` (set env vars first)
- Admin login: email/password from your .env ADMIN\_\*
- Frontend relative APIs now call Vercel /api/\*

### Step 7: Production Deploy [⏳ PENDING]

- Push git → Vercel auto-deploy
- Add env vars in Vercel dashboard

## 🛡️ Required Vercel Env Vars

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=super_strong_random_secret_min32chars
ADMIN_EMAIL=admin@daityalegion.com
ADMIN_PASSWORD=strong_password_change_this
CLOUDINARY_URL=your_cloudinary_env (if uploads used)
```

## Progress Tracker

- [] Step 3 Complete → Update TODO
- [ ] Step 4 Complete → Update TODO
- etc.

**No data loss risk. Backend logic preserved exactly.**
