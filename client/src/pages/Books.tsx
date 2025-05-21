import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../contexts/AuthContext';
import { books as booksApi, rentals as rentalsApi } from '../services/api';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import BookForm from './../components/BookForm';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    setEditingBook(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBook(null);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setOpen(true);
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

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="calc(100vh - 70px)"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 4,
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          flexWrap="wrap"
          gap={2}
        >
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            {isAdmin ? 'Manage Books' : 'Available Books'}
          </Typography>
          <Box 
            display="flex" 
            gap={2} 
            alignItems="center"
            flexWrap="wrap"
          >
            <TextField
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            {isAdmin && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpen}
                sx={{
                  height: 40,
                  px: 3,
                }}
              >
                Add New Book
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: 'error.main'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {filteredBooks.map((book) => (
              <Box key={book._id}>
                <BookCard
                  book={book}
                  onRent={handleRentBook}
                  onEdit={isAdmin ? handleEdit : undefined}
                  onDelete={isAdmin ? handleDelete : undefined}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {isAdmin && (
        <BookForm
          open={open}
          onClose={handleClose}
          onSave={fetchBooks}
          book={editingBook}
        />
      )}
    </Container>
  );
};

export default Books; 