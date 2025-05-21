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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {book.category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Publisher: {book.publisher}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${book.price}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={`Stock: ${book.stockQuantity}`}
            color={book.stockQuantity > 0 ? 'success' : 'error'}
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        {isAdmin ? (
          <>
            <Button
              size="small"
              color="primary"
              onClick={() => onEdit?.(book)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete?.(book._id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            size="small"
            color="primary"
            onClick={() => onRent?.(book._id)}
            disabled={book.stockQuantity <= 0}
          >
            {book.stockQuantity > 0 ? 'Rent' : 'Out of Stock'}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default BookCard; 