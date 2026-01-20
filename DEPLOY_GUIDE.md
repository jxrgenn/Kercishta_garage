# 🚀 Deployment Guide - Kërçishta Garage

## Repository
**GitHub:** https://github.com/jxrgenn/Kercishta_garage

---

## 📋 Prerequisites

1. **MongoDB Atlas** account with a cluster set up
2. **Render.com** account (for backend)
3. **Vercel** account (for frontend)
4. Your environment variables ready:
   - `MONGODB_URI` - Your MongoDB connection string
   - `ADMIN_PASSWORD` - Admin dashboard password
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Create New Web Service
1. Go to https://render.com/
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select the `Kercishta_garage` repository

### Step 2: Configure the Service
Render will auto-detect the `render.yaml` file. Verify these settings:

- **Name:** `kercishta-garage-backend`
- **Region:** Frankfurt (or closest to you)
- **Branch:** `main`
- **Build Command:** `npm install`
- **Start Command:** `npm run server`
- **Plan:** Free

### Step 3: Add Environment Variables
Click **"Advanced"** and add these environment variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/kercishta?retryWrites=true&w=majority
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_generated_jwt_secret
NODE_ENV=production
PORT=5001
```

### Step 4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-3 minutes)
3. Once deployed, copy your backend URL: `https://kercishta-garage-backend.onrender.com`

### Step 5: Test Backend
Test the health endpoint:
```bash
curl https://your-backend-url.onrender.com/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2026-01-20T..."
}
```

---

## 🎨 Part 2: Update Frontend for Production

### Step 1: Update API Base URL

You need to update the frontend to use your Render backend URL instead of `/api`.

**Option A: Environment Variable (Recommended)**
1. The app needs to be updated to use `import.meta.env.VITE_API_URL`
2. This requires a small code change to `App.tsx`

**Option B: Hardcode the URL**
1. Find all API calls in `App.tsx`
2. Change `/api/` to `https://your-backend-url.onrender.com/api/`

**Recommended:** Let me know if you want me to add environment variable support.

### Step 2: Update Backend CORS
The backend needs to know your Vercel URL. After deploying to Vercel, update your Render environment variable:

```
FRONTEND_URL=https://kercishta-garage.vercel.app
```

Then restart the Render service.

---

## 🌐 Part 3: Deploy Frontend to Vercel

### Step 1: Import Project
1. Go to https://vercel.com/
2. Click **"Add New..."** → **"Project"**
3. Import the `Kercishta_garage` GitHub repository

### Step 2: Configure Build Settings
Vercel auto-detects Vite projects. Verify:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 3: Add Environment Variables (if using Option A above)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (takes 1-2 minutes)
3. Your frontend will be live at: `https://kercishta-garage.vercel.app`

### Step 5: Update Backend CORS
Go back to Render → Environment Variables → Update:
```
FRONTEND_URL=https://kercishta-garage.vercel.app
```

Restart the Render service for changes to take effect.

---

## ✅ Part 4: Verify Deployment

### Test the Frontend
1. Visit your Vercel URL: `https://kercishta-garage.vercel.app`
2. Fill out the contact form and submit
3. Go to `/admin` page
4. Login with your `ADMIN_PASSWORD`
5. Verify you can see the submitted lead
6. Test filtering, status updates, and deletion

### Test the Backend Directly
```bash
# Health check
curl https://your-backend-url.onrender.com/health

# Test authentication
curl -X POST https://your-backend-url.onrender.com/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password": "your_admin_password"}'

# Should return a JWT token
```

---

## 🔐 Security Checklist

- ✅ `.env` file is in `.gitignore` (never pushed to GitHub)
- ✅ MongoDB connection string uses strong password
- ✅ `JWT_SECRET` is a random 32+ character string
- ✅ `ADMIN_PASSWORD` is strong and unique
- ✅ CORS is configured to only allow your Vercel domain
- ✅ Rate limiting is enabled on all endpoints
- ✅ All API routes are validated and protected

---

## 🔄 Auto-Deployment

Both Render and Vercel are now connected to your GitHub repository:

- **Push to `main` branch** → Automatic deployment on both platforms
- **Check deployment logs** in Render/Vercel dashboards
- **Rollback if needed** via dashboard

---

## 📊 Monitoring

### Render Dashboard
- View logs: `https://dashboard.render.com/`
- Check server health and uptime
- Monitor resource usage

### Vercel Dashboard
- View deployment logs
- Check bandwidth usage
- Monitor function invocations

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
1. Check MongoDB Atlas → Network Access
2. Ensure `0.0.0.0/0` is allowed (or add Render IPs)
3. Verify `MONGODB_URI` in Render environment variables

### CORS Errors
1. Check `FRONTEND_URL` matches your Vercel URL exactly
2. Ensure no trailing slash in the URL
3. Restart Render service after changing env vars

### Frontend can't reach backend
1. Verify backend health endpoint works
2. Check Network tab in browser DevTools
3. Ensure API calls use correct backend URL

---

## 💰 Free Tier Limits

### Render Free Tier
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after sleep takes ~30 seconds
- 750 hours/month (enough for continuous uptime)
- Consider upgrading to $7/month for always-on

### Vercel Free Tier
- 100GB bandwidth/month
- 100 GB-hours serverless function execution
- Unlimited deployments

### MongoDB Atlas Free Tier (M0)
- 512 MB storage
- Shared CPU
- Should handle ~100+ requests/second easily

---

## 🎉 You're Live!

Your production-ready garage management system is now deployed:

- **Frontend:** https://kercishta-garage.vercel.app
- **Backend:** https://kercishta-garage-backend.onrender.com
- **Admin Panel:** https://kercishta-garage.vercel.app/admin

---

## 📝 Next Steps

1. Set up a custom domain on Vercel (optional)
2. Configure MongoDB backups
3. Set up monitoring alerts
4. Add analytics (Google Analytics, Plausible, etc.)
5. Consider upgrading Render to paid plan for always-on backend
