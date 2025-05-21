import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Books from './pages/Books';
import AdminRentals from './pages/AdminRentals';
import MyRentals from './pages/MyRentals';

const theme = createTheme();

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/books" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <Books />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-rentals"
          element={
            <ProtectedRoute>
              <MyRentals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rentals"
          element={
            <ProtectedRoute requireAdmin>
              <AdminRentals />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/" 
          element={
            user ? <Navigate to="/books" /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
