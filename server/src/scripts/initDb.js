import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';
import Book from '../models/Book.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../database.env') });

const MONGODB_URI = 'mongodb+srv://oyunali123:oyunali123@library.xccm1d3.mongodb.net/?retryWrites=true&w=majority&appName=library';

const sampleBooks = [
  {
    title: 'The Great Gatsby',
    category: 'Fiction',
    price: 9.99,
    publisher: 'Scribner',
    stockQuantity: 5,
  },
  {
    title: '1984',
    category: 'Science Fiction',
    price: 12.99,
    publisher: 'Penguin Books',
    stockQuantity: 3,
  },
  {
    title: 'To Kill a Mockingbird',
    category: 'Fiction',
    price: 14.99,
    publisher: 'Harper Perennial',
    stockQuantity: 4,
  },
];

const initializeDb = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Created admin user');

    // Create sample books
    await Book.insertMany(sampleBooks);
    console.log('Created sample books');

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDb(); 