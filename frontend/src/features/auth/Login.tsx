import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Email as EmailIcon,
  Lock as LockIcon,
  Work as WorkIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../utils/hooks';
import { login, reset } from './authSlice';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isSuccess || user) {
      navigate(from, { replace: true });
    }

    dispatch(reset());
  }, [user, isSuccess, navigate, dispatch, from]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
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
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
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
              Welcome Back
            </Typography>
            <Typography
              component="p"
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 4 }}
            >
              Sign in to access your professional resume hub.
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
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
                  boxShadow: '0 12px 24px rgba(99, 102, 241, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 30px rgba(99, 102, 241, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to CareerAI'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  New to CareerAI?{' '}
                  <Link to="/register" style={{
                    textDecoration: 'none',
                    color: '#6366f1',
                    fontWeight: 700
                  }}>
                    Create an account
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

export default Login;
