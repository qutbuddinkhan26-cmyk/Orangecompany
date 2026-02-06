# ServiceHub - Urban Company-like Service Booking Platform

A comprehensive, production-ready service booking web application similar to Urban Company that connects customers with service providers across various categories like home cleaning, beauty services, repairs, and more.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## 🌟 Features

### For Customers
- 🏠 **Browse Services**: Access 100+ professional home services across multiple categories
- 📅 **Easy Booking**: Simple date and time slot selection with calendar view
- 💳 **Multiple Payment Options**: Credit/Debit cards, UPI, wallets, and cash on service
- ⭐ **Reviews & Ratings**: Read and write detailed reviews with photos
- 📍 **Address Management**: Save multiple addresses with GPS coordinates
- 🔔 **Real-time Notifications**: Get updates on booking status
- 👤 **User Dashboard**: Track bookings, manage profile, and view history

### For Service Providers
- 📋 **Booking Management**: Accept/reject booking requests
- 📊 **Performance Dashboard**: View earnings, ratings, and metrics
- 📅 **Schedule Management**: Calendar view of all bookings
- 💰 **Earnings Tracking**: Daily, weekly, and monthly reports
- ⭐ **Reviews Management**: View and respond to customer reviews

### For Admins
- 📊 **Analytics Dashboard**: Comprehensive metrics and charts
- 👥 **User Management**: Manage customers and service providers
- 🛠️ **Service Management**: Add/edit/delete services and categories
- 📋 **Booking Oversight**: Monitor all bookings
- 💵 **Payment Reconciliation**: Track and manage payments
- 🎫 **Coupon Management**: Create and manage promotional offers

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **State Management**: React Hooks & Context API

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Express Validator

## 📁 Project Structure

```
Orangecompany/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app directory (pages & layouts)
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── features/        # Feature-based modules
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── store/           # State management
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── server.ts        # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/qutbuddinkhan26-cmyk/Orangecompany.git
cd Orangecompany
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# - Set MONGODB_URI to your MongoDB connection string
# - Set JWT_SECRET to a secure random string
# - Set PORT (default: 5000)

# Start development server
npm run dev
```

The backend server will start at `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# - Set NEXT_PUBLIC_API_URL to your backend URL (default: http://localhost:5000/api)

# Start development server
npm run dev
```

The frontend will start at `http://localhost:3000`

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

## 🔑 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/servicehub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

### Users Collection
- Basic user information (email, password, name)
- Role-based access (customer, provider, admin)
- Verification and activation status

### Services Collection
- Service details (name, description, pricing)
- Category relationships
- Images and media
- Ratings and booking statistics

### Bookings Collection
- Booking details (date, time, status)
- User and service relationships
- Payment information
- Special instructions

### Categories Collection
- Service categories and subcategories
- Icons and images
- Display ordering

### Addresses Collection
- User addresses with GPS coordinates
- Address labels (home, work, other)
- Default address management

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Services
- `GET /api/services` - Get all services (with filters)
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin only)

### Bookings
- `POST /api/bookings` - Create new booking (protected)
- `GET /api/bookings` - Get user bookings (protected)
- `GET /api/bookings/:id` - Get booking details (protected)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (protected)

## 🎨 Key Pages

### Customer-Facing
- **Homepage** (`/`) - Hero section, categories, featured services
- **Services** (`/services`) - Browse and filter services
- **Service Details** (`/services/[id]`) - Detailed service information
- **Booking** (`/booking`) - Complete booking flow
- **User Dashboard** (`/dashboard`) - Manage bookings and profile
- **Auth Pages** (`/login`, `/register`) - Authentication

### Service Provider
- **Provider Dashboard** - Manage bookings and schedule
- **Earnings** - Track income and payments
- **Profile** - Manage skills and certifications

### Admin
- **Admin Dashboard** - Analytics and metrics
- **User Management** - Manage all users
- **Service Management** - CRUD operations for services
- **Booking Management** - Oversee all bookings

## 🎯 Features Implementation Status

### ✅ Completed (Phase 1)
- [x] Project structure setup
- [x] Frontend with Next.js, TypeScript, Tailwind CSS
- [x] Backend with Express.js, TypeScript, MongoDB
- [x] User authentication (register, login, JWT)
- [x] Database models and schemas
- [x] Service listing and details
- [x] Booking system (create, view, cancel)
- [x] API endpoints for core features
- [x] Responsive homepage design
- [x] UI components library (Button, Input)
- [x] Documentation and setup guides

### 🚧 In Progress (Phase 2)
- [ ] Complete all UI components
- [ ] Service provider dashboard
- [ ] Admin panel
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Reviews and ratings system
- [ ] Real-time notifications
- [ ] Search and filters
- [ ] Image upload functionality

### 📋 Planned (Phase 3+)
- [ ] Advanced booking features
- [ ] In-app messaging
- [ ] Referral program
- [ ] Loyalty points system
- [ ] Mobile app (React Native)
- [ ] PWA capabilities
- [ ] Multi-language support
- [ ] Advanced analytics

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection
- **Role-Based Access Control**: Authorization middleware

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (AWS/DigitalOcean/Heroku)
```bash
cd backend
npm run build
npm start
```

### Database (MongoDB Atlas)
- Create a MongoDB Atlas cluster
- Update `MONGODB_URI` in backend .env
- Whitelist your server IP

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

### Git Workflow
- Create feature branches
- Write descriptive commit messages
- Create pull requests for review

### Testing
- Write unit tests for utilities
- Test API endpoints with Postman/Insomnia
- Perform manual testing for UI

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Development Team - ServiceHub

## 🙏 Acknowledgments

- Inspired by Urban Company
- Built with modern web technologies
- Community contributions welcome

## 📞 Support

For support, email support@servicehub.com or open an issue in the repository.

## 🔗 Links

- [Live Demo](#) (Coming soon)
- [API Documentation](#) (Coming soon)
- [User Guide](#) (Coming soon)

---

**Note**: This is a comprehensive service booking platform built with production-ready architecture. The application includes authentication, service management, booking system, and admin capabilities. Additional features like payment integration, real-time notifications, and advanced analytics are planned for future releases.
