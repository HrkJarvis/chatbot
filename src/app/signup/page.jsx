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
    IconButton,
    CircularProgress
} from '@mui/material';
import { 
    Person as PersonIcon,
    Email as EmailIcon, 
    Lock as LockIcon, 
    Visibility, 
    VisibilityOff 
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/chat');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setIsLoading(false);
            return;
        }

        try {
            // Pass credentials as an object
            const result = await signup({ 
                name, 
                email, 
                password 
            });
            
            if (result.success) {
                // Redirect handled in AuthContext
                return;
            } else {
                setError(result.error || 'Signup failed');
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
                    Create Your Account
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
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
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockIcon />
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
                        startIcon={isLoading ? <CircularProgress size={20} /> : null}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                        <Link href="/login" passHref>
                            <MUILink variant="body2">
                                {"Already have an account? Sign In"}
                            </MUILink>
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
