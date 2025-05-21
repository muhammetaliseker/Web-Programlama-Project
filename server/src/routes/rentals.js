import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import Rental from '../models/Rental.js';
import Book from '../models/Book.js';

const router = express.Router();

// Get all rentals (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'username email')
      .populate('book', 'title category');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's rentals
router.get('/my-rentals', auth, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user.id })
      .populate('book', 'title category price');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Rent a book
router.post('/', auth, async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Check book availability
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (book.stockQuantity <= 0) {
      return res.status(400).json({ message: 'Book is out of stock' });
    }
    
    // Create rental
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks rental period
    
    const rental = new Rental({
      user: req.user.id,
      book: bookId,
      dueDate,
    });
    
    // Update book stock
    book.stockQuantity -= 1;
    await book.save();
    
    await rental.save();
    
    await rental.populate('book', 'title category price');
    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Return a book
router.patch('/:id/return', auth, async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (rental.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (rental.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }
    
    // Update rental status
    rental.status = 'returned';
    rental.returnedAt = Date.now();
    
    // Update book stock
    const book = await Book.findById(rental.book);
    book.stockQuantity += 1;
    await book.save();
    
    await rental.save();
    
    await rental.populate('book', 'title category price');
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get rental history for a specific user (Admin only)
router.get('/user/:userId', auth, adminAuth, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.params.userId })
      .populate('book', 'title category price')
      .populate('user', 'username email');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 