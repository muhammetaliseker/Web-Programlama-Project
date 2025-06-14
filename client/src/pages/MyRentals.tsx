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
  TableSortLabel,
} from '@mui/material';
import { rentals as rentalsApi } from '../services/api';
import { Rental } from '../types';
import SearchIcon from '@mui/icons-material/Search';

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Rental | 'book.title' | 'book.category' | 'action';
  label: string;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'book.title', label: 'Book Title', sortable: true },
  { id: 'book.category', label: 'Category', sortable: true },
  { id: 'rentedAt', label: 'Rented Date', sortable: true },
  { id: 'dueDate', label: 'Due Date', sortable: true },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'action', label: 'Action', sortable: false },
];

const MyRentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<HeadCell['id']>('rentedAt');

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

  const handleRequestSort = (property: HeadCell['id']) => {
    if (!headCells.find(cell => cell.id === property)?.sortable) return;
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getComparator = (order: Order, orderBy: HeadCell['id']) => {
    return (a: Rental, b: Rental) => {
      let aValue: any, bValue: any;

      if (orderBy === 'book.title') {
        aValue = a.book.title.toLowerCase();
        bValue = b.book.title.toLowerCase();
      } else if (orderBy === 'book.category') {
        aValue = a.book.category.toLowerCase();
        bValue = b.book.category.toLowerCase();
      } else if (orderBy === 'action') {
        return 0;
      } else {
        aValue = a[orderBy as keyof Rental];
        bValue = b[orderBy as keyof Rental];
      }

      if (orderBy === 'rentedAt' || orderBy === 'dueDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (bValue < aValue) {
        return order === 'desc' ? -1 : 1;
      }
      if (bValue > aValue) {
        return order === 'desc' ? 1 : -1;
      }
      return 0;
    };
  };

  const filteredAndSortedRentals = React.useMemo(() => {
    const filtered = rentals.filter(rental => {
      const searchLower = searchTerm.toLowerCase();
      return (
        rental.book.title.toLowerCase().includes(searchLower) ||
        rental.book.category.toLowerCase().includes(searchLower) ||
        new Date(rental.rentedAt).toLocaleDateString().includes(searchLower) ||
        new Date(rental.dueDate).toLocaleDateString().includes(searchLower)
      );
    });

    return filtered.sort(getComparator(order, orderBy));
  }, [rentals, searchTerm, order, orderBy]);

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
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sx={{ 
                      fontWeight: 600, 
                      color: 'primary.main',
                      cursor: headCell.sortable ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: headCell.sortable ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                      },
                      transition: 'background-color 0.2s',
                      whiteSpace: 'nowrap',
                      py: 2,
                    }}
                  >
                    {headCell.sortable ? (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                        sx={{
                          '&.MuiTableSortLabel-root': {
                            color: 'primary.main',
                          },
                          '&.MuiTableSortLabel-root:hover': {
                            color: 'primary.dark',
                          },
                          '&.Mui-active': {
                            color: 'primary.main',
                            '& .MuiTableSortLabel-icon': {
                              color: 'primary.main',
                            },
                          },
                          '& .MuiTableSortLabel-icon': {
                            opacity: orderBy === headCell.id ? 1 : 0.5,
                          },
                        }}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    ) : (
                      headCell.label
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedRentals.map((rental) => {
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