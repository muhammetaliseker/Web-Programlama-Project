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
  Chip,
  Box,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { rentals as rentalsApi } from '../services/api';
import { Rental } from '../types';

const AdminRentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const { data } = await rentalsApi.getAll();
      setRentals(data);
    } catch (err) {
      setError('Failed to load rentals');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredRentals = rentals.filter(rental => 
    rental.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Rental History
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by username, email, or book title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Rented Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Returned Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.map((rental) => (
              <TableRow key={rental._id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1">{rental.user.username}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {rental.user.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{rental.book.title}</TableCell>
                <TableCell>{formatDate(rental.rentedAt)}</TableCell>
                <TableCell>{formatDate(rental.dueDate)}</TableCell>
                <TableCell>
                  {rental.returnedAt ? formatDate(rental.returnedAt) : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={rental.status}
                    color={rental.status === 'active' ? 'primary' : 'success'}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminRentals; 