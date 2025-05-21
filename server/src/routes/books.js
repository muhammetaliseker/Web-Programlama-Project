import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import Book from '../models/Book.js';

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new book (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { title, category, price, publisher, stockQuantity } = req.body;
    
    const book = new Book({
      title,
      category,
      price,
      publisher,
      stockQuantity,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stock quantity (Admin only)
router.patch('/:id/stock', auth, adminAuth, async (req, res) => {
  try {
    const { stockQuantity } = req.body;
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { stockQuantity, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 