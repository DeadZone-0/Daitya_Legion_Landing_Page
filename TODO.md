# Daitya Legion GitHub + Vercel Deploy Plan

## Completed ✅

- [x] Created root `.gitignore` (Node/Vite/DS_Store/etc.)
- [x] Created `vercel.json` for frontend static deploy (Vite build → dist/)
- [x] Confirmed no existing Git repo

## Next Steps ⏳

1. **Initialize Git & Push** (run these commands):
   ```
   git init
   git add .
   git commit -m "Initial commit: Daitya Legion full-stack app (React frontend + Express backend)"
   git branch -M main
   git remote add origin https://github.com/Sagar264offici/Daitya_Legion_Landing_Page.git
   git push -u origin main
   ```
2. **Vercel Deploy**:
   - Go to vercel.com → New Project → Import GitHub repo
   - Root: `/` , Build Cmd: auto (uses vercel.json)
   - Deploy → Live URL (frontend static, data manual via code edits)
3. **Manual Data Updates**: Edit `backend/data/players.json` or src/components → rebuild/deploy.
4. **Backend Hosting** (if dynamic data needed): Deploy backend separately to Render Railway.

**Status: GitHub upload ready! Run git commands above.**

**Note**: Frontend proxies /api to localhost:5001 → Update to your hosted backend URL post-deploy for live data.
