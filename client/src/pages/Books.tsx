import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { GridProps } from '@mui/material/Grid';
import { books as booksApi, rentals as rentalsApi } from '../services/api';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import { useAuth } from '../contexts/AuthContext';

interface BookFormData {
  title: string;
  category: string;
  price: number;
  publisher: string;
  stockQuantity: number;
}

const initialFormData: BookFormData = {
  title: '',
  category: '',
  price: 0,
  publisher: '',
  stockQuantity: 0,
};

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await booksApi.getAll();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setEditingBook(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await booksApi.update(editingBook._id, formData);
      } else {
        await booksApi.create(formData);
      }
      handleClose();
      fetchBooks();
    } catch (err) {
      setError('Failed to save book');
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      category: book.category,
      price: book.price,
      publisher: book.publisher,
      stockQuantity: book.stockQuantity,
    });
    handleOpen();
  };

  const handleDelete = async (bookId: string) => {
    try {
      await booksApi.delete(bookId);
      fetchBooks();
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleRentBook = async (bookId: string) => {
    try {
      await rentalsApi.rentBook(bookId);
      fetchBooks();
    } catch (err) {
      setError('Failed to rent book');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {isAdmin ? 'Manage Books' : 'Available Books'}
        </Typography>
        {isAdmin && (
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Book
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {books.map((book) => (
          <Grid {...{ item: true, xs: 12, sm: 6, md: 4 } as GridProps} key={book._id}>
            <BookCard
              book={book}
              onRent={handleRentBook}
              onEdit={isAdmin ? handleEdit : undefined}
              onDelete={isAdmin ? handleDelete : undefined}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Publisher"
              name="publisher"
              value={formData.publisher}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              margin="normal"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingBook ? 'Save Changes' : 'Add Book'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Books; 