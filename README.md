# Book Rental Application

A full-stack application for managing book rentals, built with React, Node.js, Express, and MongoDB.

## Features

### Admin Features
- Add new books to the system
- Remove books from the system
- Update book stock quantities
- View rental history of users

### User Features
- Browse available books
- Rent books
- View personal rental history
- Return rented books

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/book-rental
   JWT_SECRET=your-secret-key-change-in-production
   ```

4. Start MongoDB:
   Make sure MongoDB is running on your system.

5. Start the application:
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory)
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Books
- GET /api/books - Get all books
- GET /api/books/:id - Get single book
- POST /api/books - Add new book (Admin only)
- PUT /api/books/:id - Update book (Admin only)
- DELETE /api/books/:id - Delete book (Admin only)
- PATCH /api/books/:id/stock - Update book stock (Admin only)

### Rentals
- GET /api/rentals - Get all rentals (Admin only)
- GET /api/rentals/my-rentals - Get user's rentals
- POST /api/rentals - Rent a book
- PATCH /api/rentals/:id/return - Return a book
- GET /api/rentals/user/:userId - Get user's rental history (Admin only)

## Default Admin Account
To create an admin account, register normally and then update the user's role to 'admin' in the database:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
