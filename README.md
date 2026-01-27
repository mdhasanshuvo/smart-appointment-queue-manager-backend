# Smart Appointment & Queue Manager - Backend

A production-grade Node.js/Express API for managing appointments, staff availability, and waiting queues with real-time conflict detection and analytics.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **API Documentation**: Swagger/OpenAPI
- **Development**: Nodemon

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
DEMO_EMAIL=demo@example.com
DEMO_PASSWORD=demo123
FRONTEND_URL=http://localhost:3000
```

## Installation

```bash
npm install
```

## Running the Server

**Development** (with hot reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

**Seed Database** (with sample data):
```bash
npm run seed
```

The server will run on `http://localhost:5000`
Swagger docs available at `http://localhost:5000/api-docs`

## Project Structure

```
src/
├── config/          # Configuration files (database, swagger)
├── controllers/     # Request handlers
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
├── middleware/      # Custom middleware (auth, validation, rate limiting)
├── utils/           # Helper functions (error handling, validators, monitoring)
├── scripts/         # Database seeding and maintenance scripts
└── server.js        # Main server file
```

## Core Features

- ✅ User authentication (signup, login, demo login)
- 🔒 JWT-based protected routes
- 👥 Staff management with capacity tracking
- 📋 Service management
- 📅 Appointment management with conflict detection
- ⏳ Waiting queue system
- 📊 Dashboard analytics
- 📝 Activity logging
- 📚 Swagger API documentation
- 🛡️ Request rate limiting (100 req/15min)
- 📈 Performance monitoring
- 🔍 Input validation and sanitization

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/demo-login` - Demo login (no credentials)

### Staff Management
- `GET /api/v1/staff` - Get all staff
- `POST /api/v1/staff` - Create staff
- `PUT /api/v1/staff/:id` - Update staff
- `DELETE /api/v1/staff/:id` - Delete staff

### Services
- `GET /api/v1/services` - Get all services
- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service

### Appointments
- `GET /api/v1/appointments` - Get appointments
- `POST /api/v1/appointments` - Create appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

### Queue
- `GET /api/v1/queue` - Get waiting queue
- `POST /api/v1/queue/:appointmentId/assign` - Assign from queue

### Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics

### Activity Logs
- `GET /api/v1/activity-logs` - Get activity logs

## Deployment

Deploy to Vercel:
```bash
vercel
```

Ensure all environment variables are set in Vercel dashboard.

## License

MIT
