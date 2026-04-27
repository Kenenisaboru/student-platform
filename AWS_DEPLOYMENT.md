# AWS Deployment Guide for Arsi Aseko Platform

## Services You'll Use
- **EC2**: Virtual server for backend
- **S3**: Static file storage for frontend
- **CloudFront**: CDN for fast content delivery
- **RDS**: Managed MongoDB alternative (or keep Atlas)
- **Route 53**: Domain management
- **CloudWatch**: Monitoring and logging

---

## Backend Deployment on EC2

### 1. Launch EC2 Instance
```
- AMI: Ubuntu 22.04 LTS (t3.small or larger)
- Security Group: Allow 22 (SSH), 80 (HTTP), 443 (HTTPS), 5001 (API)
- Key Pair: Download and save securely
- Storage: 20GB minimum
```

### 2. SSH into Instance
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### 4. Deploy Application
```bash
# Clone repository
git clone https://github.com/yourusername/student-platform.git
cd student-platform/server

# Install dependencies
npm install

# Create .env file
nano .env
# Add all environment variables

# Start with PM2
pm2 start index.js --name "arsiaseko-api"
pm2 startup
pm2 save
```

### 5. Configure Nginx (Reverse Proxy)
```bash
sudo nano /etc/nginx/sites-available/default
```

Replace content with:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Enable HTTPS with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx

sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal configured automatically
```

### 7. Start Nginx
```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## Frontend Deployment on S3 + CloudFront

### 1. Create S3 Bucket
```bash
aws s3 mb s3://arsiaseko-frontend --region us-east-1

# Enable static website hosting
aws s3 website s3://arsiaseko-frontend \
  --index-document index.html \
  --error-document index.html
```

### 2. Build Frontend
```bash
cd client
npm run build

# Output in dist/ folder
```

### 3. Upload to S3
```bash
aws s3 sync dist/ s3://arsiaseko-frontend/ \
  --delete \
  --cache-control "public, max-age=3600"
```

### 4. Create CloudFront Distribution
```bash
# Via AWS Console:
1. Create distribution
2. Origin: Your S3 bucket
3. Compress objects automatically: YES
4. Viewer protocol: Redirect to HTTPS
5. Default root object: index.html
6. Error handling: Return index.html (for SPA)
```

### 5. Connect Domain
```bash
# Create CNAME in Route 53
Name: yourdomain.com
Type: CNAME
Value: d111111abcdef8.cloudfront.net
```

---

## Database on AWS (RDS)

### Option 1: RDS for MongoDB (Atlas Alternative)
```bash
1. RDS Console > Create Database
2. Engine: MongoDB 5.0+
3. DB Instance: db.t3.small
4. Storage: 100GB
5. Backup retention: 30 days
6. Multi-AZ: Yes (for production)
```

### Option 2: Keep MongoDB Atlas (Recommended for simplicity)
- Already secure and managed
- No additional AWS services needed
- Just update MONGODB_URI in .env

---

## Cost Estimation

| Service | Usage | Cost/Month |
|---------|-------|-----------|
| EC2 (t3.small) | Backend | $10 |
| Data Transfer | Out | $5 |
| S3 | Frontend storage | $1 |
| CloudFront | CDN traffic | $20 |
| Route 53 | Domain management | $1 |
| **Total** | | **~$37** |

Plus optional:
- RDS MongoDB: $50+/month
- Data backup: $5+/month

---

## Automated Deployment (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to AWS
        run: |
          # Build frontend
          cd client && npm run build
          # Upload to S3
          aws s3 sync dist/ s3://arsiaseko-frontend/ --delete
          # Invalidate CloudFront
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
          
      - name: Restart backend
        run: |
          ssh -i ${{ secrets.EC2_KEY }} ubuntu@${{ secrets.EC2_IP }} 'cd ~/student-platform && git pull && npm install && pm2 restart all'
```

---

## Monitoring

```bash
# View logs
pm2 logs

# Monitor CPU/Memory
pm2 monit

# CloudWatch dashboard
# AWS Console > CloudWatch
```

---

## Backup Strategy

```bash
# Daily backup to S3
0 2 * * * aws s3 sync ~/student-platform/server/backups s3://arsiaseko-backups

# MongoDB backup
mongodump --uri "mongodb+srv://..." --archive > backup-$(date +%Y%m%d).archive
```

---

## Auto-Scaling (Advanced)

For high traffic, use AWS Auto Scaling:
1. Create AMI from configured EC2
2. Create Launch Template
3. Create Auto Scaling Group
4. Set min: 2, max: 10 instances
5. Attach Load Balancer

---

## Security Best Practices

```bash
# EC2 Security Group rules:
- SSH (22): Only from your IP
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
- API (5001): Only from CloudFront
```

---

Need help? Check PRODUCTION_DEPLOYMENT_GUIDE.md for more details.
