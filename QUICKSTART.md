# Quick Start Guide

Get your ServiceHub application up and running in minutes!

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - Either:
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (local installation)
  - OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)
- **Git** - [Download here](https://git-scm.com/)

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/qutbuddinkhan26-cmyk/Orangecompany.git
cd Orangecompany
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your settings
# For Windows: notepad .env
# For Mac/Linux: nano .env
```

**Configure your .env file:**
```env
MONGODB_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your-super-secret-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**MongoDB Atlas Users:** Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/servicehub?retryWrites=true&w=majority
```

### Step 3: Seed the Database (Optional but Recommended)

This will create sample users, categories, and services:

```bash
npm run seed
```

**Sample Credentials Created:**
- **Admin:** admin@servicehub.com / admin123
- **Customer:** customer@example.com / customer123
- **Provider:** provider@example.com / provider123

### Step 4: Start Backend Server

```bash
npm run dev
```

The backend will start at: **http://localhost:5000**

✅ You should see: "🚀 Server is running on port 5000"

### Step 5: Setup Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local
# For Windows: notepad .env.local
# For Mac/Linux: nano .env.local
```

**Configure your .env.local file:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend

```bash
npm run dev
```

The frontend will start at: **http://localhost:3000**

✅ You should see: "Ready - started server on 0.0.0.0:3000"

### Step 7: Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

## Testing the Application

### 1. Test Backend Health

Open a browser or use curl:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 2. Test Frontend

- Visit http://localhost:3000
- You should see the ServiceHub homepage

### 3. Test Authentication

#### Register a New User:
1. Go to http://localhost:3000/register
2. Fill in the form
3. Click "Create Account"
4. You'll be redirected to the dashboard

#### Login:
1. Go to http://localhost:3000/login
2. Use credentials:
   - Email: customer@example.com
   - Password: customer123
3. Click "Sign In"

### 4. Browse Services

1. Click "Services" in the navigation
2. Browse available services
3. Use search and filters

### 5. View Dashboard

1. After logging in, click "Dashboard"
2. View your bookings
3. Explore different sections

## Project Structure

```
Orangecompany/
├── backend/                # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
│
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   ├── .env.example      # Environment variables template
│   └── package.json
│
└── README.md             # Project documentation
```

## Available Scripts

### Backend Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

## Common Issues & Solutions

### Issue: Cannot connect to MongoDB

**Solution:**
1. Make sure MongoDB is running
   ```bash
   # Check MongoDB status (local installation)
   # Windows: services.msc (look for MongoDB)
   # Mac: brew services list
   # Linux: sudo systemctl status mongodb
   ```
2. Verify connection string in `.env`
3. For MongoDB Atlas, check IP whitelist

### Issue: Port already in use

**Solution:**
```bash
# Kill process on port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: Module not found

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Build fails

**Solution:**
1. Clear build cache:
   ```bash
   # Frontend
   rm -rf .next
   
   # Backend
   rm -rf dist
   ```
2. Rebuild:
   ```bash
   npm run build
   ```

## Development Workflow

1. **Start both servers** (backend and frontend)
2. **Make changes** to your code
3. **Hot reload** automatically updates
4. **Test** your changes in the browser
5. **Commit** when ready

## Next Steps

Now that you have the application running:

1. ✅ Explore the codebase
2. ✅ Try creating a booking
3. ✅ Test different user roles
4. ✅ Customize the styling
5. ✅ Add new features
6. ✅ Read the [API Documentation](./API_DOCUMENTATION.md)
7. ✅ Check the [Deployment Guide](./DEPLOYMENT.md)

## Getting Help

If you encounter any issues:

1. Check this guide for common solutions
2. Review the full [README.md](./README.md)
3. Check [API Documentation](./API_DOCUMENTATION.md)
4. Look for existing issues on GitHub
5. Create a new issue with details

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Development Tips

### Hot Reload Not Working?

- Restart the dev server
- Clear browser cache
- Check for syntax errors

### Database Changes Not Reflecting?

```bash
# Reseed the database
cd backend
npm run seed
```

### Styling Not Updating?

```bash
# Frontend: Clear Next.js cache
rm -rf .next
npm run dev
```

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, unique value
- [ ] Use MongoDB Atlas or production database
- [ ] Update FRONTEND_URL and API URLs
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up error monitoring
- [ ] Configure backups
- [ ] Review security settings

## Support

Need help? Reach out:

- 📧 Email: support@servicehub.com
- 💬 GitHub Issues
- 📖 Documentation

---

**Happy Coding! 🚀**
