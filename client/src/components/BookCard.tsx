import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { Book } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface BookCardProps {
  book: Book;
  onRent?: (bookId: string) => void;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onRent,
  onEdit,
  onDelete,
}) => {
  const { isAdmin } = useAuth();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }}
    >
      <CardContent sx={{ 
        flexGrow: 1,
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '16px 16px 0 0',
        p: 3
      }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div" 
          sx={{ 
            color: '#1a237e',
            fontWeight: 700,
            mb: 2,
            fontSize: '1.4rem',
            letterSpacing: '-0.5px'
          }}
        >
          {book.title}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          mb: 2
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#455a64',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '0.95rem'
            }}
          >
            <Box component="span" sx={{ 
              color: '#1a237e',
              fontWeight: 600,
              minWidth: '80px'
            }}>
              Category:
            </Box>
            {book.category}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#455a64',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '0.95rem'
            }}
          >
            <Box component="span" sx={{ 
              color: '#1a237e',
              fontWeight: 600,
              minWidth: '80px'
            }}>
              Publisher:
            </Box>
            {book.publisher}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#455a64',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: '0.95rem'
            }}
          >
            <Box component="span" sx={{ 
              color: '#1a237e',
              fontWeight: 600,
              minWidth: '80px'
            }}>
              Price:
            </Box>
            ${book.price}
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Stock: ${book.stockQuantity}`}
            color={book.stockQuantity > 0 ? 'success' : 'error'}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.9rem',
              height: '28px',
              '& .MuiChip-label': {
                px: 2
              },
              background: book.stockQuantity > 0 
                ? 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'
                : 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)',
              color: 'white'
            }}
          />
        </Box>
      </CardContent>
      <Box sx={{ 
        p: 2.5,
        background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
        borderRadius: '0 0 16px 16px',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        {isAdmin ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              color="primary"
              onClick={() => onEdit?.(book)}
              sx={{ 
                flex: 1,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
              }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete?.(book._id)}
              sx={{ 
                flex: 1,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(244, 67, 54, 0.2)'
              }}
            >
              Delete
            </Button>
          </Box>
        ) : (
          <Button
            size="small"
            color="primary"
            onClick={() => onRent?.(book._id)}
            disabled={book.stockQuantity <= 0}
            sx={{
              width: '100%',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.95rem',
              height: '40px',
              background: book.stockQuantity > 0 
                ? 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)'
                : '#e0e0e0',
              boxShadow: book.stockQuantity > 0 
                ? '0 2px 8px rgba(25, 118, 210, 0.2)'
                : 'none',
              '&:hover': {
                background: book.stockQuantity > 0 
                  ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                  : '#e0e0e0',
                boxShadow: book.stockQuantity > 0 
                  ? '0 4px 12px rgba(25, 118, 210, 0.3)'
                  : 'none'
              }
            }}
          >
            {book.stockQuantity > 0 ? 'Rent' : 'Out of Stock'}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default BookCard; 