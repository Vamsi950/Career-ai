import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { register, reset } from './authSlice';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, password2 } = formData;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      // Handle password mismatch
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <Box className="auth-page">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4
          }}
        >
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{
              background: 'var(--primary-gradient)',
              width: 48,
              height: 48,
              boxShadow: '0 8px 16px rgba(168, 85, 247, 0.4)'
            }}>
              <WorkIcon sx={{ color: 'white', fontSize: 28 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" sx={{ color: 'white', letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              CareerAI
            </Typography>
          </Box>

          <Paper
            elevation={0}
            className="auth-card"
            sx={{
              padding: { xs: 4, sm: 6 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{
                fontWeight: 800,
                mb: 1.5,
                color: '#0f172a',
                letterSpacing: '-0.01em'
              }}
            >
              Create Account
            </Typography>
            <Typography
              component="p"
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Join CareerAI to start optimizing your career journey.
            </Typography>

            {isError && (
              <Alert
                severity="error"
                variant="filled"
                sx={{
                  mb: 3,
                  width: '100%',
                  borderRadius: 3,
                  bgcolor: '#fee2e2',
                  color: '#991b1b',
                  '& .MuiAlert-icon': { color: '#ef4444' }
                }}
              >
                {message}
              </Alert>
            )}

            <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={onChange}
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
                className="auth-input"
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="password2"
                autoComplete="new-password"
                value={password2}
                onChange={onChange}
                className="auth-input"
                error={password !== password2 && password2 !== ''}
                helperText={password !== password2 && password2 !== '' ? 'Passwords do not match' : ''}
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 2,
                  background: 'var(--primary-gradient)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 4,
                  boxShadow: '0 12px 24px rgba(168, 85, 247, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(168, 85, 247, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  }
                }}
                disabled={isLoading || password !== password2}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/login" style={{
                    textDecoration: 'none',
                    color: '#6366f1',
                    fontWeight: 700
                  }}>
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;
