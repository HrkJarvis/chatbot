'use client';

import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Stable references for state setters
    const resetAuthState = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
    }, []);

    // Memoized session check function
    const checkSession = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('https://chatbot-wheat-eight.vercel.app/api/auth/session');
            const data = await response.json();
            
            if (data.user) {
                setUser(data.user);
                setIsAuthenticated(true);
            } else {
                resetAuthState();
            }
        } catch (error) {
            console.error('Session check failed', error);
            resetAuthState();
        } finally {
            setLoading(false);
        }
    }, [resetAuthState]);

    // Initial session check
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    // Memoized login function
    const login = useCallback(async (credentials) => {
        try {
            setLoading(true);
            
            const loginData = {
                email: credentials.email,
                password: credentials.password
            };

            const response = await fetch('https://chatbot-wheat-eight.vercel.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setIsAuthenticated(true);
                router.push('/chat');
                return { success: true };
            } else {
                resetAuthState();
                return { 
                    success: false, 
                    error: data.error || 'Login failed' 
                };
            }
        } catch (error) {
            console.error('Login error', error);
            resetAuthState();
            return { 
                success: false, 
                error: 'Network error. Please try again.' 
            };
        } finally {
            setLoading(false);
        }
    }, [router, resetAuthState]);

    // Memoized signup function
    const signup = useCallback(async (userData) => {
        try {
            setLoading(true);
            
            // Ensure userData is in the correct format
            const signupData = {
                name: userData.name,
                email: userData.email,
                password: userData.password
            };

            const response = await fetch('https://chatbot-wheat-eight.vercel.app/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData)
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setIsAuthenticated(true);
                router.push('/chat');
                return { success: true };
            } else {
                resetAuthState();
                return { 
                    success: false, 
                    error: data.error || 'Signup failed' 
                };
            }
        } catch (error) {
            console.error('Signup error', error);
            resetAuthState();
            return { 
                success: false, 
                error: 'Network error. Please try again.' 
            };
        } finally {
            setLoading(false);
        }
    }, [router, resetAuthState]);

    // Memoized logout function
    const logout = useCallback(async () => {
        try {
            setLoading(true);

            // Immediately reset auth state before API call
            resetAuthState();

            const response = await fetch('https://chatbot-wheat-eight.vercel.app/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            // Show logout message if applicable
            if (data.shouldRelogin) {
                alert(data.message || 'You have been logged out.');
            }

            // Redirect to login page
            router.replace('/login');
        } catch (error) {
            console.error('Logout process failed', error);
            alert('Unable to end your session. Please try logging in again.');
            router.replace('/login');
        } finally {
            setLoading(false);
        }
    }, [router, resetAuthState]);

    // Consistent context value
    const contextValue = useMemo(() => ({
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        checkSession
    }), [user, loading, isAuthenticated, login, signup, logout, checkSession]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
