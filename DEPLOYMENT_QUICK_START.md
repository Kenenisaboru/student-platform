# Arsi Aseko Platform - Deployment Quick Start

**Choose your path and follow the steps:**

---

## Path A: Deploy Everything on Vercel (EASIEST - Recommended)

### Step 1: Prepare Your Project (5 minutes)
```bash
# 1. Update frontend API URL
# Edit: client/src/api/axios.js
# Change baseURL to your backend URL (will get this after backend deploy)

# 2. Create .env.production in client/
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_SOCKET_URL=https://your-backend.vercel.app

# 3. Create vercel.json in server/
# See PRODUCTION_DEPLOYMENT_GUIDE.md for content
```

### Step 2: Deploy Backend to Vercel (10 minutes)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Go to server folder
cd server

# Deploy
vercel --prod

# Copy the URL provided (e.g., https://arsiaseko-server.vercel.app)
# Update this in client .env.production
```

### Step 3: Add Secrets to Vercel Backend
```bash
# In Vercel Dashboard: Project Settings > Environment Variables
# Add these secrets:

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/arsiaseko
JWT_SECRET=your_super_secret_32_chars_minimum
CLOUDINARY_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production
```

### Step 4: Deploy Frontend to Vercel (5 minutes)
```bash
# Go to client folder
cd client

# Update API URL in .env.production with backend URL from Step 2

# Deploy
vercel --prod

# Copy the URL (e.g., https://arsiaseko.vercel.app)
```

### Step 5: Update Vercel Backend CORS
```bash
# Backend Vercel Dashboard > Environment Variables
# Update CORS_ORIGIN to include frontend URL from Step 4:
CORS_ORIGIN=https://yourdomain.vercel.app,https://www.yourdomain.vercel.app
```

### Step 6: Add Custom Domain (Optional)
```bash
# Vercel Dashboard > Settings > Domains
# Add your domain (buy from GoDaddy, Namecheap, etc.)
# Update DNS with Vercel's nameservers
```

**Done! Your app is live in ~30 minutes!**

---

## Path B: Backend on Railway + Frontend on Vercel

### Step 1: Deploy Backend to Railway
```bash
1. Go to railway.app
2. Create account
3. New Project > GitHub (connect repo)
4. Select "Server" folder
5. Add environment variables (same as Vercel)
6. Deploy automatically

# Get backend URL from Railway dashboard
```

### Step 2: Deploy Frontend to Vercel
Follow Steps 2-6 from Path A above

---

## Path C: AWS Deployment (Most Scalable)

See AWS_DEPLOYMENT_DETAILED.md for full guide.

---

## Essential Environment Variables

### MongoDB Atlas Setup (Free)
1. Go to mongodb.com/cloud
2. Create cluster
3. Add IP whitelist
4. Create user with password
5. Copy connection string

### Cloudinary (Image Upload)
1. Go to cloudinary.com
2. Sign up (free tier available)
3. Get API credentials from dashboard

### Email (Using Gmail)
1. Enable 2FA on Gmail
2. Generate "App Password"
3. Use that password (not your regular password)

---

## Testing After Deployment

```bash
# Test backend
curl https://your-backend.vercel.app/api/health

# Test frontend loads
curl https://your-frontend-domain.com

# Test login/signup
# Use web browser to test UI

# Test file uploads
# Upload image through app

# Test real-time features
# Open chat and verify messages work
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS error | Update CORS_ORIGIN in backend env vars |
| 404 API errors | Check baseURL in client axios.js matches backend URL |
| Database connection fails | Verify MONGODB_URI and IP whitelist in Atlas |
| File uploads fail | Check Cloudinary credentials |
| Email not sending | Verify email user and app password are correct |
| Socket.io not working | Update SOCKET_URL to backend domain |

---

## Production Checklist

Before going live:
- [ ] All API endpoints tested
- [ ] Database backups configured
- [ ] Monitoring/alerts set up
- [ ] SSL working
- [ ] Mobile responsive verified
- [ ] Performance acceptable (< 3s)
- [ ] Error logs collecting
- [ ] Backup strategy in place

---

## Estimated Costs (Monthly)

**Free Options:**
- Vercel: Free tier covers most projects
- MongoDB Atlas: Free 512MB cluster
- Cloudinary: Free tier includes 25GB storage
- Railway: Free tier ~$5/month equivalent

**Recommended Production:**
- Vercel: $20/month (Pro)
- MongoDB Atlas: $57/month (M10 cluster)
- Cloudinary: $99/month (50GB storage)
- **Total: ~$175/month**

---

## Next Steps

1. **Set up domain** (optional but recommended)
2. **Configure analytics** (Google Analytics)
3. **Set up monitoring** (Sentry, Uptime Robot)
4. **Create admin account** for managing content
5. **Import initial data** (categories, users, etc.)
6. **Test all features** in production
7. **Announce platform** to your community

**Questions? See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed instructions.**
