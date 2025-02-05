'use client';

import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Container, 
    TextField, 
    Typography, 
    Paper,
    Link as MUILink,
    InputAdornment,
    IconButton
} from '@mui/material';
import { 
    Email as EmailIcon, 
    Lock as LockIcon, 
    Visibility, 
    VisibilityOff 
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/chat');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const result = await login({ 
                email, 
                password 
            });

            if (result.success) {
                return;
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="xs" sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            height: '100vh' 
        }}>
            <Paper 
                elevation={6} 
                sx={{ 
                    p: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    borderRadius: 3,
                    backgroundColor: 'background.paper'
                }}
            >
                {/* Ticket Assistant Heading */}
                <Typography 
                    component="h2" 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, primary.main, secondary.main)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Ticket Assistant
                </Typography>

                {/* Login Heading */}
                <Typography 
                    component="h1" 
                    variant="h5" 
                    sx={{ 
                        mb: 3, 
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, primary.main, secondary.main)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Login to ChatBot
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && (
                        <Typography 
                            color="error" 
                            variant="body2" 
                            sx={{ mt: 1, textAlign: 'center' }}
                        >
                            {error}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ 
                            mt: 3, 
                            mb: 2,
                            py: 1.5,
                            fontWeight: 600,
                            borderRadius: 2,
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Link href="/signup" passHref>
                            <MUILink variant="body2">
                                {"Don't have an account? Sign Up"}
                            </MUILink>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
