import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import rentalRoutes from './routes/rentals.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../database.env') });

const MONGODB_URI = 'mongodb+srv://oyunali123:oyunali123@library.xccm1d3.mongodb.net/?retryWrites=true&w=majority&appName=library';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Book Rental API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/rentals', rentalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// MongoDB connection with better error handling
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Create indexes for better performance
    Promise.all([
      mongoose.model('User').createIndexes(),
      mongoose.model('Book').createIndexes(),
      mongoose.model('Rental').createIndexes()
    ]).then(() => {
      console.log('Database indexes created successfully');
    }).catch(err => {
      console.error('Error creating indexes:', err);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 