import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Book Rental
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/books">
                Books
              </Button>
              {!isAdmin && (
                <Button color="inherit" component={RouterLink} to="/my-rentals">
                  My Rentals
                </Button>
              )}
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/admin/rentals">
                  Rental History
                </Button>
              )}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 