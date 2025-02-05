'use client';

import React, { useState, useMemo, createContext, useContext } from 'react';
import { 
    ThemeProvider as MUIThemeProvider, 
    createTheme, 
    CssBaseline 
} from '@mui/material';

const ColorModeContext = createContext({ 
    toggleColorMode: () => {},
    mode: 'light'
});

export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeProvider({ children }) {
    const [mode, setMode] = useState('light');

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
        mode,
    }), [mode]);

    const theme = useMemo(() => 
        createTheme({
            palette: {
                mode,
                primary: {
                    main: mode === 'light' ? '#1976d2' : '#90caf9',
                },
                secondary: {
                    main: mode === 'light' ? '#dc004e' : '#f48fb1',
                },
                background: {
                    default: mode === 'light' ? '#ffffff' : '#121212',
                    paper: mode === 'light' ? '#f4f4f4' : '#1e1e1e',
                    chat: mode === 'light' ? '#f5f5f5' : '#2c2c2c',
                },
                text: {
                    primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
                    secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 0.7)',
                },
            },
            typography: {
                fontFamily: 'Inter, Arial, sans-serif',
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: `
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    `,
                },
                MuiButton: {
                    styleOverrides: {
                        root: {
                            textTransform: 'none',
                            borderRadius: 8,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            borderRadius: 12,
                        },
                    },
                },
            },
        }),
        [mode]
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ColorModeContext.Provider>
    );
}
