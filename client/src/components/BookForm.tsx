import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
} from '@mui/material';
import { Book } from '../types';
import { books as booksApi } from '../services/api';

interface BookFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  book: Book | null;
}

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

const BookForm: React.FC<BookFormProps> = ({ open, onClose, onSave, book }) => {
  const [formData, setFormData] = useState<BookFormData>(initialFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        category: book.category,
        price: book.price,
        publisher: book.publisher,
        stockQuantity: book.stockQuantity,
      });
    } else {
      setFormData(initialFormData);
    }
    setError('');
  }, [book]);

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
      if (book) {
        await booksApi.update(book._id, formData);
      } else {
        await booksApi.create(formData);
      }
      onSave();
      onClose();
    } catch (err) {
      setError('Failed to save book. Please try again.');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          color: 'primary.main',
          fontWeight: 700,
          fontSize: '1.5rem',
          pb: 1
        }}
      >
        {book ? 'Edit Book' : 'Add New Book'}
      </DialogTitle>
      <DialogContent>
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
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            pt: 2
          }}
        >
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleInputChange}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <TextField
            fullWidth
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            required
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          color="primary"
          sx={{
            px: 3,
            height: 40,
          }}
        >
          {book ? 'Save Changes' : 'Add Book'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm; 