'use client';

import React from 'react';
import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from '../theme/ThemeProvider';

const ThemeToggle = () => {
    const theme = useTheme();
    const { toggleColorMode, mode } = useColorMode();

    return (
        <IconButton
            onClick={toggleColorMode}
            color="inherit"
            sx={{
                position: 'fixed',
                top: 20,
                right: 20,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[2],
                '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                },
            }}
        >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
};

export default ThemeToggle;
