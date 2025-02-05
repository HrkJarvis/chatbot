'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import ChatInterface from '../../components/Chat/ChatInterface';
import ChatHeader from '../../components/Layout/ChatHeader';
import { useAuth } from '../../context/AuthContext';
import { redirect } from 'next/navigation';

export default function ChatPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return null; // or a loading spinner
    }

    if (!user) {
        redirect('/login');
    }

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh' 
        }}>
            <ChatHeader />
            <Container 
                maxWidth="md" 
                sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    py: { xs: 2, sm: 3, md: 4 } 
                }}
            >
                <ChatInterface />
            </Container>
        </Box>
    );
}
