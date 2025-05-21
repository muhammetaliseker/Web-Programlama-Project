import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { rentals as rentalsApi } from '../services/api';
import { Rental } from '../types';

const MyRentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const { data } = await rentalsApi.getUserRentals();
      setRentals(data);
    } catch (err) {
      setError('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (rentalId: string) => {
    try {
      await rentalsApi.returnBook(rentalId);
      fetchRentals();
    } catch (err) {
      setError('Failed to return book');
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
      <Typography variant="h4" component="h1" gutterBottom>
        My Rentals
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Book Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Rented Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental._id}>
                <TableCell>{rental.book.title}</TableCell>
                <TableCell>{rental.book.category}</TableCell>
                <TableCell>
                  {new Date(rental.rentedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(rental.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{rental.status}</TableCell>
                <TableCell>
                  {rental.status === 'active' && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleReturn(rental._id)}
                    >
                      Return Book
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyRentals; 