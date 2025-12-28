import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  UploadFile as UploadIcon,
  Description as DescriptionIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../utils/hooks';
import { logout } from '../features/auth/authSlice';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Upload Resume', icon: <UploadIcon />, path: '/upload' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#1e293b', color: '#f8fafc' }}>
      <Toolbar sx={{
        bgcolor: '#1e293b',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Avatar sx={{
          background: 'var(--primary-gradient)',
          width: 40,
          height: 40,
        }}>
          <WorkIcon sx={{ color: 'white' }} />
        </Avatar>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          CareerAI
        </Typography>
      </Toolbar>
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                color: 'rgba(248, 250, 252, 0.7)',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: '#1e293b'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Avatar sx={{
              background: 'var(--primary-gradient)',
              width: 36,
              height: 36,
            }}>
              <WorkIcon sx={{ color: 'white', fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" noWrap component="div" fontWeight="bold">
              CareerAI
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="subtitle2" fontWeight="bold">{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">Free Plan</Typography>
            </Box>
            <Avatar sx={{ bgcolor: 'rgba(99, 102, 241, 0.1)', color: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              bgcolor: '#1e293b'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
