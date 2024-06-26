import { keyframes } from '@mui/system';

import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { mainButtonStyle } from '../styles/buttonStyles';
import { useApi } from '../api/ApiProvider';
import { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';
import { AccountCircle } from '@mui/icons-material';

export default function MenuAppBar() {
  const navigate = useNavigate();
  const apiClient = useApi();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = apiClient.getUserRole();
    setUserRole(role);
  }, [apiClient]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const waveAnimation = keyframes`
  0%, 20%, 80%, 100% { transform: translateY(0); }
  40%, 60% { transform: translateY(-10px); }
`;

  const LibraryText = () => {
    const letters = 'LIBRARY'.split('');

    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        {letters.map((letter, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              width: '35px',
              height: '35px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginX: '2px',
              animation: `${waveAnimation} 6.1s ease-in-out ${index * 0.7}s infinite`,
            }}
          >
            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
              {letter}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#f0f0f0' }}>
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2, color: 'black' }}
          >
            <MenuIcon sx={{ fontSize: '35px' }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ color: 'black', fontWeight: 'bold' }}
          >
            Photos
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
          <LibraryText />
        </Box>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
          <div>
            <Link to="/home">
              <Button
                startIcon={<HomeIcon />}
                sx={{
                  ...mainButtonStyle,
                  paddingX: 2,
                  marginRight: 2,
                }}
              >
                Home
              </Button>
            </Link>
            <Link to="/books">
              <Button
                startIcon={<BookIcon />}
                sx={{
                  ...mainButtonStyle,
                  paddingX: 2,
                  marginRight: 2,
                }}
              >
                Books
              </Button>
            </Link>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: 'black' }}
            >
              <AccountCircle sx={{ fontSize: '40px' }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/my_books');
                }}
              >
                My Books
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate('/about');
                }}
              >
                About
              </MenuItem>
              {userRole === 'ROLE_ADMIN' && (
                <>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/admin/addBook');
                    }}
                  >
                    Add Book
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/admin/addUser');
                    }}
                  >
                    Add User
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      navigate('/admin/users');
                    }}
                  >
                    Users
                  </MenuItem>
                </>
              )}
              <MenuItem
                onClick={() => {
                  handleClose();
                  apiClient.signOut();
                  navigate('/login');
                }}
              >
                Sign Out
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
