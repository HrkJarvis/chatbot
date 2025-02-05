import { createTheme } from '@mui/material/styles';

const whatsappTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: {
            main: mode === 'dark' ? '#00a884' : '#075E54', // WhatsApp's green
            light: mode === 'dark' ? '#01d277' : '#25D366',
            dark: mode === 'dark' ? '#005c4b' : '#128C7E',
            contrastText: '#ffffff'
        },
        secondary: {
            main: mode === 'dark' ? '#8696a0' : '#075E54',
            light: mode === 'dark' ? '#a0b4c0' : '#25D366',
            dark: mode === 'dark' ? '#2a3942' : '#128C7E',
            contrastText: '#ffffff'
        },
        background: {
            default: mode === 'dark' ? '#121212' : '#F0F2F5', // WhatsApp-like background
            paper: mode === 'dark' ? '#1f1f1f' : '#ffffff'
        },
        text: {
            primary: mode === 'dark' ? '#e9edef' : '#111b21',
            secondary: mode === 'dark' ? '#8696a0' : '#54656f'
        },
        divider: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'
    },
    typography: {
        fontFamily: [
            'Segoe UI',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif'
        ].join(','),
        body1: {
            fontSize: '1rem',
            lineHeight: 1.5
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.43
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: mode === 'dark' ? '#1f1f1f' : '#F0F2F5',
                    color: mode === 'dark' ? '#e9edef' : '#111b21'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: mode === 'dark' 
                        ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' 
                        : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 20
                    }
                }
            }
        }
    }
});

export default whatsappTheme;
