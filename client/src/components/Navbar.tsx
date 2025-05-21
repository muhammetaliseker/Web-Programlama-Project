import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 70 }}>
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '-0.5px',
                '&:hover': {
                  color: 'primary.dark',
                }
              }}
            >
              Book Rental
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {user ? (
                <>
                  <Button 
                    color="primary" 
                    component={RouterLink} 
                    to="/books"
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(26, 35, 126, 0.04)',
                      }
                    }}
                  >
                    Books
                  </Button>
                  {!isAdmin && (
                    <Button 
                      color="primary" 
                      component={RouterLink} 
                      to="/my-rentals"
                      sx={{ 
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(26, 35, 126, 0.04)',
                        }
                      }}
                    >
                      My Rentals
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      color="primary" 
                      component={RouterLink} 
                      to="/admin/rentals"
                      sx={{ 
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(26, 35, 126, 0.04)',
                        }
                      }}
                    >
                      Rental History
                    </Button>
                  )}
                  <Button 
                    color="primary" 
                    onClick={logout}
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(26, 35, 126, 0.04)',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    color="primary" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ 
                      fontWeight: 600,
                      '&:hover': {
                        background: 'rgba(26, 35, 126, 0.04)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      fontWeight: 600,
                      px: 3,
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 