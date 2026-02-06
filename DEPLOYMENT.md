# Deployment Guide

This guide will help you deploy the ServiceHub application to production.

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Vercel account (for frontend)
- VPS/Cloud server (for backend) - AWS, DigitalOcean, Heroku, etc.
- Domain name (optional but recommended)

---

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create servicehub-api
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
   heroku config:set JWT_SECRET="your-super-secret-key"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="https://your-frontend-domain.com"
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Verify Deployment**
   ```bash
   heroku logs --tail
   heroku open
   ```

### Option 2: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - t2.micro or higher
   - Configure security groups (ports 22, 80, 443, 5000)

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx
   sudo npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/servicehub.git
   cd servicehub/backend
   npm install
   ```

5. **Setup Environment Variables**
   ```bash
   nano .env
   # Add your production environment variables
   ```

6. **Build and Start**
   ```bash
   npm run build
   pm2 start dist/server.js --name servicehub-api
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/servicehub
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/servicehub /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.your-domain.com
   ```

### Option 3: Deploy to DigitalOcean App Platform

1. **Connect GitHub Repository**
   - Go to DigitalOcean App Platform
   - Click "Create App"
   - Select your GitHub repository
   - Choose the `backend` directory

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Set Environment Variables**
   - Add all variables from `.env.example`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

---

## Frontend Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
     ```

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Alternative: Deploy to Netlify

1. **Build the Project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Login**
   ```bash
   netlify login
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod --dir=.next
   ```

5. **Configure Environment Variables**
   - Go to Netlify Dashboard
   - Site Settings → Build & Deploy → Environment
   - Add your environment variables

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create Cluster**
   - Choose a cloud provider (AWS/Google/Azure)
   - Select a region close to your backend
   - Choose M0 Sandbox (free tier)

3. **Setup Database User**
   - Database Access → Add New User
   - Create username and password
   - Grant read/write permissions

4. **Whitelist IP Addresses**
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) or specific IPs

5. **Get Connection String**
   - Clusters → Connect → Connect Your Application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this as `MONGODB_URI` in your backend

---

## Domain Configuration

### Setup Custom Domain

1. **For Backend (API)**
   - Add A record pointing to your server IP
   - Or add CNAME record to your cloud provider
   - Example: `api.yourdomain.com`

2. **For Frontend**
   - In Vercel/Netlify, add custom domain
   - Update DNS records as instructed
   - Example: `www.yourdomain.com` or `yourdomain.com`

---

## Post-Deployment Checklist

- [ ] Backend is accessible and health check works
- [ ] Frontend loads correctly
- [ ] API calls from frontend to backend work
- [ ] Database connection is successful
- [ ] Authentication works (register, login)
- [ ] All environment variables are set correctly
- [ ] SSL certificates are installed
- [ ] CORS is configured properly
- [ ] Error logging is setup (Sentry, etc.)
- [ ] Monitoring is configured
- [ ] Backups are scheduled (database)

---

## Monitoring & Logging

### Setup Sentry for Error Tracking

1. **Create Sentry Account**
   - Go to [Sentry.io](https://sentry.io)
   - Create new project

2. **Install Sentry SDK**
   
   Backend:
   ```bash
   npm install @sentry/node
   ```
   
   Frontend:
   ```bash
   npm install @sentry/nextjs
   ```

3. **Configure Sentry**
   
   Backend (`src/server.ts`):
   ```typescript
   import * as Sentry from "@sentry/node";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```
   
   Frontend (`next.config.js`):
   ```javascript
   const { withSentryConfig } = require('@sentry/nextjs');
   // ... rest of config
   ```

### Setup PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /path/to/app/backend
            git pull
            npm install
            npm run build
            pm2 restart servicehub-api

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## Scaling Considerations

### Backend Scaling

1. **Horizontal Scaling**
   - Use load balancer (nginx, AWS ALB)
   - Run multiple instances with PM2 cluster mode
   - Implement Redis for session storage

2. **Database Scaling**
   - Enable MongoDB Atlas auto-scaling
   - Add read replicas for read-heavy operations
   - Implement caching (Redis)

### Frontend Scaling

- Vercel automatically scales
- Use CDN for static assets
- Implement ISR (Incremental Static Regeneration)

---

## Backup Strategy

### Database Backup

1. **MongoDB Atlas Automatic Backups**
   - Enabled by default on paid tiers
   - Continuous backups with point-in-time recovery

2. **Manual Backup Script**
   ```bash
   #!/bin/bash
   DATE=$(date +%Y%m%d_%H%M%S)
   mongodump --uri="$MONGODB_URI" --out="backup_$DATE"
   tar -czf "backup_$DATE.tar.gz" "backup_$DATE"
   # Upload to S3 or other storage
   ```

---

## Security Checklist

- [ ] All environment variables are secure
- [ ] JWT secret is strong and unique
- [ ] HTTPS is enabled everywhere
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (use Mongoose)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Security headers configured (Helmet)
- [ ] Regular dependency updates
- [ ] Database backups enabled

---

## Troubleshooting

### Backend Issues

**Issue**: Can't connect to MongoDB
- Check connection string
- Verify IP whitelist in Atlas
- Check network access

**Issue**: 502 Bad Gateway
- Check if backend is running: `pm2 status`
- Check logs: `pm2 logs servicehub-api`
- Verify nginx configuration

### Frontend Issues

**Issue**: API calls failing
- Check CORS configuration
- Verify API URL in environment variables
- Check browser console for errors

**Issue**: Build failing
- Clear .next folder
- Check for TypeScript errors
- Verify all dependencies are installed

---

## Support

For deployment issues:
- Check logs first
- Review documentation
- Open an issue on GitHub
- Contact support team

---

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)
