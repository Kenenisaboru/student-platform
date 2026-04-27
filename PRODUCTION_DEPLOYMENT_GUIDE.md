# Arsi Aseko Platform - Production Deployment Guide

## Overview
This guide walks you through deploying your Arsi Aseko student platform to production with proper security, scalability, and monitoring.

---

## Phase 1: Pre-Production Checklist

### Backend (Node.js/Express)
- [ ] Update environment variables in `.env`
- [ ] Set secure session secrets
- [ ] Configure MongoDB Atlas connection (production database)
- [ ] Enable SSL/TLS certificates
- [ ] Set up CORS for production domain
- [ ] Enable rate limiting
- [ ] Configure Cloudinary for image uploads
- [ ] Set up email service (Nodemailer)
- [ ] Enable request logging and monitoring
- [ ] Add error tracking (Sentry)
- [ ] Configure CDN for static assets

### Frontend (React/Vite)
- [ ] Remove all console.log debug statements
- [ ] Build for production
- [ ] Test build locally
- [ ] Verify all API endpoints point to production server
- [ ] Enable gzip compression
- [ ] Set up analytics
- [ ] Test responsive design on real devices
- [ ] Verify SEO meta tags
- [ ] Test performance with Lighthouse
- [ ] Enable caching headers

### Database
- [ ] Backup production database
- [ ] Set up automated backups
- [ ] Configure database indexes
- [ ] Enable IP whitelisting
- [ ] Test database replication
- [ ] Create production admin account
- [ ] Set up monitoring alerts

### Security
- [ ] Enable HTTPS only
- [ ] Set strong JWT secrets
- [ ] Enable helmet.js headers
- [ ] Configure CORS properly
- [ ] Set up Web Application Firewall
- [ ] Enable DDoS protection
- [ ] Test SQL injection protection
- [ ] Test XSS protection
- [ ] Enable password hashing
- [ ] Set up 2FA for admin accounts

---

## Phase 2: Backend Deployment

### Option A: Deploy to Vercel (Recommended for Serverless)

#### Step 1: Prepare Backend for Vercel
```bash
# 1. Create vercel.json in server root
cd server
```

Create `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "MONGODB_URI": "@mongodb_uri",
    "JWT_SECRET": "@jwt_secret",
    "CLOUDINARY_NAME": "@cloudinary_name",
    "CLOUDINARY_KEY": "@cloudinary_key",
    "CLOUDINARY_SECRET": "@cloudinary_secret",
    "EMAIL_USER": "@email_user",
    "EMAIL_PASSWORD": "@email_password"
  }
}
```

#### Step 2: Connect to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd server
vercel --prod
```

#### Step 3: Set Environment Variables
```bash
# Via Vercel Dashboard or CLI
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add CLOUDINARY_NAME
# ... add all other secrets
```

### Option B: Deploy to Railway, Render, or AWS

#### Railway (Easiest)
1. Go to railway.app
2. Connect GitHub repository
3. Add variables in Settings
4. Deploy with one click

#### Render
1. Go to render.com
2. Create new "Web Service"
3. Connect GitHub
4. Set environment variables
5. Deploy

#### AWS EC2/ECS
```bash
# For detailed AWS deployment:
# See AWS_DEPLOYMENT.md
```

---

## Phase 3: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Prepare Frontend
```bash
cd client

# Update API base URL in axios config
# Change from localhost:5001 to your production API URL
```

Edit `client/src/api/axios.js`:
```javascript
const instance = axios.create({
  baseURL: process.env.VITE_API_BASE_URL || 'https://your-api.vercel.app/api',
  withCredentials: true,
  timeout: 10000,
});
```

Create `.env.production`:
```
VITE_API_BASE_URL=https://your-backend-api.vercel.app/api
VITE_APP_NAME=Arsi Aseko Platform
VITE_SOCKET_URL=https://your-backend-api.vercel.app
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel --prod
```

#### Step 3: Configure Domain
1. Go to Vercel Dashboard
2. Go to Settings > Domains
3. Add your custom domain
4. Update DNS records with Vercel's nameservers

### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd client
netlify deploy --prod
```

### Option C: AWS S3 + CloudFront
```bash
# Build for production
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Phase 4: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to mongodb.com/cloud
2. Create account
3. Create organization and project

### Step 2: Create Production Cluster
```
- Cluster Tier: M10 or higher
- Region: Select closest to your users (e.g., Africa)
- Backup: Enable automatic backups
- Encryption: Enable at rest
```

### Step 3: Configure Network Access
```
- Add IP whitelist (your server's IP)
- Or allow 0.0.0.0/0 if using dynamic IPs (less secure)
```

### Step 4: Create Database User
```
- Username: strong_username
- Password: Very_Strong_Password_123!
```

### Step 5: Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/arsiaseko?retryWrites=true&w=majority
```

Add to environment variables as `MONGODB_URI`

---

## Phase 5: Configure Production Environment Variables

### Backend (.env or Vercel/Railway Dashboard)
```env
# Server
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/arsiaseko?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_random_string_min_32_chars

# CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Email (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password (not regular password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Cloudinary (Image Upload)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

# Socket.io
SOCKET_CORS=https://yourdomain.com

# Redis (Optional - for caching)
REDIS_URL=redis://user:pass@localhost:6379

# Analytics
SENTRY_DSN=https://your-sentry-key@sentry.io/project-id
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_SOCKET_URL=https://your-backend-api.com
VITE_ANALYTICS_ID=your-google-analytics-id
```

---

## Phase 6: SSL/HTTPS Setup

### Automatic (Recommended)
- Vercel, Netlify, Railway all provide free SSL automatically
- Domain gets HTTPS immediately

### Manual (If using custom server)
```bash
# Using Let's Encrypt with Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Update nginx/apache config to use certificates
# Auto-renews every 90 days
```

---

## Phase 7: Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --report

# Compress images
# Use tools like ImageOptim, TinyPNG

# Minify CSS/JS (Vite does this automatically)
# Enable gzip in deployment platform
```

### Backend
```javascript
// Already configured in index.js
const compression = require('compression');
app.use(compression());

// Enable caching headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});
```

### Database
```javascript
// Add indexes to frequently queried fields
// In your MongoDB Atlas dashboard or via Mongoose
db.users.createIndex({ email: 1 });
db.posts.createIndex({ createdAt: -1 });
db.jobs.createIndex({ status: 1, postedAt: -1 });
```

---

## Phase 8: Monitoring & Analytics

### Error Tracking (Sentry)
```bash
# 1. Create Sentry account at sentry.io
# 2. Install Sentry
npm install @sentry/node

# 3. Configure in server/index.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.errorHandler());
```

### Logging
```bash
# Use Morgan (already configured)
# Logs: API requests, response times, errors
```

### Uptime Monitoring
- Use Uptime Robot (free)
- Set up alerts for downtime

### Application Monitoring
- New Relic
- Datadog
- AWS CloudWatch

---

## Phase 9: Testing Checklist

### Manual Testing
- [ ] Test login/signup on real device
- [ ] Test all CRUD operations
- [ ] Test file uploads
- [ ] Test real-time features (Socket.io)
- [ ] Test mobile responsiveness
- [ ] Test on different browsers
- [ ] Test slow network (3G)
- [ ] Test offline behavior

### Automated Testing
```bash
# Create test suite
npm test

# Performance testing
# Use tools like: JMeter, LoadRunner, k6
```

### Load Testing
```bash
# k6 load test
k6 run loadtest.js
```

---

## Phase 10: Post-Deployment

### DNS Configuration
1. Buy domain (GoDaddy, Namecheap, etc.)
2. Update nameservers to your hosting provider's
3. Wait 24-48 hours for propagation

### Set Up Email
- Verify email domain in email service
- Configure SPF, DKIM, DMARC records
- Test email sending

### Backup Strategy
```bash
# Daily backups
- MongoDB Atlas: Automatic (included)
- Files: AWS S3 or backup service

# Weekly: Full database backup to S3
# Monthly: Test restore process
```

### Maintenance Plan
- Weekly: Check error logs
- Monthly: Review analytics
- Quarterly: Update dependencies
- Annually: Security audit

---

## Quick Deployment Checklist

```
[ ] Backend deployed and accessible
[ ] Frontend deployed and accessible
[ ] API endpoints responding correctly
[ ] Database connected and populated
[ ] SSL/HTTPS working
[ ] Email sending works
[ ] Image uploads working
[ ] Socket.io real-time features working
[ ] Admin dashboard accessible
[ ] User registration working
[ ] Login/logout working
[ ] All community features accessible
[ ] Mobile responsive
[ ] Performance acceptable (< 3s load)
[ ] Error handling working
[ ] Logs being collected
[ ] Backups configured
[ ] Monitoring alerts set up
[ ] Domain pointing correctly
[ ] Analytics installed
```

---

## Troubleshooting

### Backend won't connect to database
```
- Check MONGODB_URI is correct
- Verify IP is whitelisted in Atlas
- Check username/password
- Test connection locally first
```

### CORS errors
```
- Update CORS_ORIGIN to include your domain
- Check frontend is making requests to correct URL
- Verify credentials: true in axios config
```

### Static files not loading
```
- Check build output in dist/
- Verify assets are in public folder
- Check CDN cache if using CloudFront
```

### Performance issues
```
- Enable caching
- Optimize images
- Enable compression
- Add CDN
- Upgrade database tier
```

---

## Support Resources

- Vercel Docs: vercel.com/docs
- MongoDB Atlas: mongodb.com/docs/atlas
- Express.js: expressjs.com
- React: react.dev
- Vite: vitejs.dev

Good luck with your Arsi Aseko platform launch!
