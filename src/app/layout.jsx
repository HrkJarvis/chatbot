'use client';

import React, { useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import whatsappTheme from '../theme/whatsappTheme';
import { AuthProvider } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function RootLayout({ children }) {
    const [mode, setMode] = useState('light');

    const theme = useMemo(() => 
        createTheme(whatsappTheme(mode)), 
        [mode]
    );

    const toggleTheme = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    return (
        <html lang="en">
            <body>
                <ThemeContext.Provider value={{ mode, toggleTheme }}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                    </ThemeProvider>
                </ThemeContext.Provider>
            </body>
        </html>
    );
}
