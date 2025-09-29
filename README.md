# Law Firm Website Backend API

A comprehensive backend API for a law firm website built with Express.js, Prisma, and PostgreSQL.

## Features

- 🔐 **JWT Authentication** for admin routes
- 👨‍💼 **Lawyers Management** with service associations
- ⚖️ **Services Management** with lawyer assignments
- 📝 **Blog Posts** with slug-based routing
- 📰 **Media Coverage** management
- 📧 **Client Enquiries** system
- 🔒 **Security Best Practices** (bcrypt hashing, input validation)
- 📊 **Database Relations** with Prisma ORM
- 🌐 **CORS Support** for frontend integration

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js               # Database seeding script
├── middleware/
│   └── authMiddleware.js     # JWT authentication middleware
├── routes/                   # API route definitions
│   ├── authRoutes.js
│   ├── lawyerRoutes.js
│   ├── serviceRoutes.js
│   ├── postRoutes.js
│   ├── mediaRoutes.js
│   └── enquiryRoutes.js
├── controllers/              # Business logic controllers
│   ├── authController.js
│   ├── lawyerController.js
│   ├── serviceController.js
│   ├── postController.js
│   ├── mediaController.js
│   └── enquiryController.js
├── server.js                 # Main application entry point
├── .env                      # Environment variables
└── package.json
```

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   Update the `.env` file with your database credentials and JWT secret:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lawfirm_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3000
   ```

3. **Setup Database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed database with sample data
   npm run db:seed
   ```

4. **Start Server**
   ```bash
   # Development with auto-restart
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login

### Lawyers (Public + Admin)
- `GET /api/lawyers` - Get all lawyers
- `GET /api/lawyers/:id` - Get lawyer by ID
- `POST /api/admin/lawyers` - Create lawyer (Admin)
- `PUT /api/admin/lawyers/:id` - Update lawyer (Admin)
- `DELETE /api/admin/lawyers/:id` - Delete lawyer (Admin)

### Services (Public + Admin)
- `GET /api/services` - Get all services
- `GET /api/services/:slug` - Get service by slug with lawyers
- `POST /api/admin/services` - Create service (Admin)
- `PUT /api/admin/services/:id` - Update service (Admin)
- `DELETE /api/admin/services/:id` - Delete service (Admin)

### Posts (Public + Admin)
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:slug` - Get post by slug
- `POST /api/admin/posts` - Create post (Admin)
- `PUT /api/admin/posts/:id` - Update post (Admin)
- `DELETE /api/admin/posts/:id` - Delete post (Admin)

### Media Coverage (Public + Admin)
- `GET /api/media` - Get all media coverage
- `POST /api/admin/media` - Create media (Admin)
- `PUT /api/admin/media/:id` - Update media (Admin)
- `DELETE /api/admin/media/:id` - Delete media (Admin)

### Enquiries (Public + Admin)
- `POST /api/enquiry` - Submit enquiry
- `GET /api/admin/enquiries` - Get all enquiries (Admin)
- `DELETE /api/admin/enquiries/:id` - Delete enquiry (Admin)

## Authentication

Admin routes require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Admin Credentials
- Email: `admin@lawfirm.com`
- Password: `admin123`

## Database Schema

The application uses the following main models:
- **Admin** - System administrators
- **Lawyer** - Law firm lawyers/attorneys
- **Service** - Legal services offered
- **LawyerService** - Many-to-many relationship between lawyers and services
- **Post** - Blog posts/articles
- **MediaCoverage** - Media coverage and press mentions
- **Enquiry** - Client enquiries/contact form submissions

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Error handling with appropriate HTTP status codes
- Database relation constraints

## Environment Variables

Required environment variables:

```env
DATABASE_URL=             # PostgreSQL connection string
JWT_SECRET=              # JWT signing secret
PORT=                    # Server port (default: 3000)
NODE_ENV=               # Environment (development/production)
CORS_ORIGIN=            # Allowed CORS origin
```

## Development

The API includes comprehensive error handling, input validation, and follows RESTful conventions. All admin routes are protected with JWT middleware, and public routes are optimized for frontend consumption.

For development, use `npm run dev` which enables auto-restart on file changes.

## Sample Data

The seed script creates:
- Default admin user
- Sample lawyers with different specialties
- Legal services (Corporate Law, Family Law)
- Lawyer-service associations

Run `npm run db:seed` to populate your database with sample data.