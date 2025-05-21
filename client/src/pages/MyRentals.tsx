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
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import { rentals as rentalsApi } from '../services/api';
import { Rental } from '../types';
import SearchIcon from '@mui/icons-material/Search';

const MyRentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getRentalStatus = (rental: Rental) => {
    if (rental.status === 'returned') return 'returned';
    if (isOverdue(rental.dueDate)) return 'overdue';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'error';
      case 'active':
        return 'success';
      case 'returned':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusStyle = (status: string) => {
    if (status === 'active') {
      return {
        backgroundColor: '#32CD32', // Lime color
        color: 'white',
        fontWeight: 600,
        '& .MuiChip-label': {
          px: 2
        }
      };
    }
    return {
      fontWeight: 600,
      '& .MuiChip-label': {
        px: 2
      }
    };
  };

  const filteredRentals = rentals.filter(rental => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rental.book.title.toLowerCase().includes(searchLower) ||
      rental.book.category.toLowerCase().includes(searchLower) ||
      new Date(rental.rentedAt).toLocaleDateString().includes(searchLower) ||
      new Date(rental.dueDate).toLocaleDateString().includes(searchLower)
    );
  });

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

  const overdueRentals = rentals.filter(rental => 
    rental.status === 'active' && isOverdue(rental.dueDate)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: 3,
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
            My Rentals
          </Typography>
          <TextField
            placeholder="Search rentals..."
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

        {overdueRentals.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: 'warning.main'
              }
            }}
          >
            You have {overdueRentals.length} overdue book{overdueRentals.length > 1 ? 's' : ''}. Please return {overdueRentals.length > 1 ? 'them' : 'it'} as soon as possible.
          </Alert>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Book Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Rented Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRentals.map((rental) => {
                const status = getRentalStatus(rental);
                return (
                  <TableRow 
                    key={rental._id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      },
                    }}
                  >
                    <TableCell>{rental.book.title}</TableCell>
                    <TableCell>{rental.book.category}</TableCell>
                    <TableCell>
                      {new Date(rental.rentedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(rental.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={status}
                        color={getStatusColor(status)}
                        sx={getStatusStyle(status)}
                      />
                    </TableCell>
                    <TableCell>
                      {rental.status === 'active' && (
                        <Button
                          variant="contained"
                          color={status === 'overdue' ? 'error' : 'primary'}
                          size="small"
                          onClick={() => handleReturn(rental._id)}
                          sx={{
                            height: 32,
                            px: 2,
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }
                          }}
                        >
                          Return Book
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default MyRentals; 