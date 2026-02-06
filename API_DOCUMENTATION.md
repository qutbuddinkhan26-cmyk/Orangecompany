# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "customer"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "customer"
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "customer",
    "profilePhoto": "photo-url"
  }
}
```

#### Get Profile
```http
GET /auth/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "customer",
    "isVerified": false,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Services

#### Get All Services
```http
GET /services
```

**Query Parameters:**
- `category` (string) - Filter by category slug
- `search` (string) - Search in name and description
- `sort` (string) - Sort by: `price_asc`, `price_desc`, `rating`, `popular`
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `featured` (boolean) - Show only featured services

**Example:**
```http
GET /services?category=cleaning&sort=rating&featured=true
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "services": [
    {
      "_id": "service-id",
      "name": "Deep Home Cleaning",
      "slug": "deep-home-cleaning",
      "description": "Comprehensive cleaning of your entire home",
      "categoryId": {
        "name": "Home Cleaning",
        "slug": "cleaning"
      },
      "basePrice": 999,
      "discountPercentage": 10,
      "durationMinutes": 180,
      "images": ["image-url-1", "image-url-2"],
      "thumbnail": "thumbnail-url",
      "whatIncluded": ["Floor cleaning", "Bathroom cleaning"],
      "whatExcluded": ["Window cleaning"],
      "isActive": true,
      "isFeatured": true,
      "rating": 4.8,
      "totalBookings": 2534
    }
  ]
}
```

#### Get Service by ID
```http
GET /services/:id
```

**Response:**
```json
{
  "success": true,
  "service": {
    "_id": "service-id",
    "name": "Deep Home Cleaning",
    "slug": "deep-home-cleaning",
    "description": "Comprehensive cleaning of your entire home",
    "categoryId": {
      "name": "Home Cleaning",
      "slug": "cleaning",
      "icon": "🧹"
    },
    "basePrice": 999,
    "discountPercentage": 10,
    "durationMinutes": 180,
    "images": ["image-url-1", "image-url-2"],
    "thumbnail": "thumbnail-url",
    "whatIncluded": ["Floor cleaning", "Bathroom cleaning"],
    "whatExcluded": ["Window cleaning"],
    "isActive": true,
    "isFeatured": true,
    "rating": 4.8,
    "totalBookings": 2534,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Create Service (Admin Only)
```http
POST /services
```

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "name": "New Service",
  "slug": "new-service",
  "description": "Service description",
  "categoryId": "category-id",
  "basePrice": 500,
  "discountPercentage": 0,
  "durationMinutes": 60,
  "images": ["image-url"],
  "whatIncluded": ["Item 1", "Item 2"],
  "whatExcluded": ["Item 3"]
}
```

---

### Bookings

#### Create Booking
```http
POST /bookings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "serviceId": "service-id",
  "bookingDate": "2024-12-31",
  "timeSlot": "10:00 AM - 12:00 PM",
  "addressId": "address-id",
  "specialInstructions": "Please call before arriving"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "_id": "booking-id",
    "bookingNumber": "BK1234567890",
    "userId": "user-id",
    "serviceId": "service-id",
    "bookingDate": "2024-12-31T00:00:00.000Z",
    "timeSlot": "10:00 AM - 12:00 PM",
    "addressId": "address-id",
    "status": "pending",
    "paymentStatus": "pending",
    "totalAmount": 999,
    "discountAmount": 99.9,
    "finalAmount": 899.1,
    "specialInstructions": "Please call before arriving"
  }
}
```

#### Get User Bookings
```http
GET /bookings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "bookings": [
    {
      "_id": "booking-id",
      "bookingNumber": "BK1234567890",
      "serviceId": {
        "name": "Deep Home Cleaning",
        "thumbnail": "thumbnail-url",
        "durationMinutes": 180
      },
      "addressId": {
        "fullAddress": "123 Main St",
        "city": "New York"
      },
      "bookingDate": "2024-12-31T00:00:00.000Z",
      "timeSlot": "10:00 AM - 12:00 PM",
      "status": "confirmed",
      "paymentStatus": "paid",
      "finalAmount": 899.1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Booking by ID
```http
GET /bookings/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "_id": "booking-id",
    "bookingNumber": "BK1234567890",
    "serviceId": { ... },
    "addressId": { ... },
    "providerId": {
      "fullName": "Service Provider",
      "profilePhoto": "photo-url",
      "phone": "+1234567890"
    },
    "bookingDate": "2024-12-31T00:00:00.000Z",
    "timeSlot": "10:00 AM - 12:00 PM",
    "status": "confirmed",
    "paymentStatus": "paid",
    "totalAmount": 999,
    "discountAmount": 99.9,
    "finalAmount": 899.1,
    "specialInstructions": "Please call before arriving"
  }
}
```

#### Cancel Booking
```http
PATCH /bookings/:id/cancel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "cancellationReason": "Change of plans"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "booking": {
    "_id": "booking-id",
    "status": "cancelled",
    "cancelledAt": "2024-01-01T00:00:00.000Z",
    "cancellationReason": "Change of plans"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Email, password, and full name are required"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "Service not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Models

### User
```typescript
{
  _id: string
  email: string
  phone?: string
  password: string (hashed)
  fullName: string
  profilePhoto?: string
  dateOfBirth?: Date
  role: 'customer' | 'provider' | 'admin'
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Service
```typescript
{
  _id: string
  name: string
  slug: string
  description: string
  categoryId: ObjectId
  basePrice: number
  discountPercentage: number
  durationMinutes: number
  images: string[]
  thumbnail?: string
  whatIncluded: string[]
  whatExcluded: string[]
  isActive: boolean
  isFeatured: boolean
  rating: number
  totalBookings: number
  createdAt: Date
  updatedAt: Date
}
```

### Booking
```typescript
{
  _id: string
  bookingNumber: string
  userId: ObjectId
  serviceId: ObjectId
  providerId?: ObjectId
  bookingDate: Date
  timeSlot: string
  addressId: ObjectId
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
  totalAmount: number
  discountAmount: number
  finalAmount: number
  specialInstructions?: string
  cancellationReason?: string
  completedAt?: Date
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}
```
