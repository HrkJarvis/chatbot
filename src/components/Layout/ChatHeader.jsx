'use client';

import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Avatar, 
    Menu, 
    MenuItem,
    Box,
    Tooltip,
    Container,
    Chip
} from '@mui/material';
import { 
    AccountCircle as ProfileIcon, 
    Logout as LogoutIcon,
    DarkMode as DarkModeIcon,
    LightMode as LightModeIcon,
    Verified as VerifiedIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

export default function ChatHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeContext();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <AppBar 
            position="static" 
            color="default" 
            elevation={4}
            sx={{ 
                backgroundColor: 'background.paper',
                backgroundImage: mode === 'dark' 
                    ? 'linear-gradient(135deg, rgba(0,168,132,0.1), rgba(0,0,0,0.2))' 
                    : 'linear-gradient(135deg, rgba(0,168,132,0.05), rgba(255,255,255,0.8))',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                boxShadow: mode === 'dark'
                    ? '0 4px 6px rgba(0,0,0,0.1)'
                    : '0 4px 6px rgba(0,168,132,0.1)'
            }}
        >
            <Container maxWidth="md">
                <Toolbar 
                    disableGutters 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        py: 1
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography 
                            variant="h5" 
                            component="div" 
                            sx={{ 
                                fontWeight: 700,
                                color: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            Ticket Assistant
                            <Chip 
                                label="Beta" 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.625rem',
                                    height: 20,
                                    borderRadius: 2
                                }}
                            />
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
                            <IconButton 
                                onClick={toggleTheme}
                                sx={{ 
                                    color: 'text.secondary',
                                    backgroundColor: 'action.hover',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        transform: 'rotate(180deg)'
                                    }
                                }}
                            >
                                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                            </IconButton>
                        </Tooltip>

                        {user && (
                            <>
                                <Tooltip title={user.name || 'User Profile'}>
                                    <IconButton 
                                        onClick={handleMenuOpen}
                                        sx={{ 
                                            p: 0,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.1)',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }
                                        }}
                                    >
                                        <Avatar 
                                            sx={{ 
                                                width: 40, 
                                                height: 40, 
                                                bgcolor: 'primary.main',
                                                boxShadow: '0 4px 12px rgba(0,168,132,0.3)'
                                            }}
                                        >
                                            {user.name ? user.name.charAt(0).toUpperCase() : ''}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    transformOrigin={{ 
                                        horizontal: 'right', 
                                        vertical: 'top' 
                                    }}
                                    anchorOrigin={{ 
                                        horizontal: 'right', 
                                        vertical: 'bottom' 
                                    }}
                                    PaperProps={{
                                        elevation: 4,
                                        sx: {
                                            borderRadius: 3,
                                            mt: 1,
                                            minWidth: 220,
                                            backgroundImage: mode === 'dark'
                                                ? 'linear-gradient(135deg, rgba(0,168,132,0.1), rgba(0,0,0,0.2))'
                                                : 'linear-gradient(135deg, rgba(0,168,132,0.05), rgba(255,255,255,0.8))',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid',
                                            borderColor: 'divider'
                                        }
                                    }}
                                >
                                    <MenuItem 
                                        onClick={handleMenuClose}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2,
                                            py: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <ProfileIcon color="primary" />
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {user.name || 'User Profile'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                        <VerifiedIcon 
                                            color="primary" 
                                            sx={{ 
                                                ml: 'auto', 
                                                fontSize: '1.25rem' 
                                            }} 
                                        />
                                    </MenuItem>
                                    <MenuItem 
                                        onClick={handleLogout}
                                        sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 2,
                                            color: 'error.main',
                                            py: 1.5,
                                            '&:hover': {
                                                backgroundColor: 'error.light',
                                                color: 'error.contrastText'
                                            }
                                        }}
                                    >
                                        <LogoutIcon />
                                        Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
