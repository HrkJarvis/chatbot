'use client';

import React from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Divider, 
    Grid, 
    IconButton 
} from '@mui/material';
import { 
    Print as PrintIcon, 
    Download as DownloadIcon 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const TicketPaper = styled(Paper)(({ theme }) => ({
    borderRadius: 16,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #1f1f1f, #2a2a2a)' 
        : 'linear-gradient(135deg, #f5f5f5, #ffffff)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 24px rgba(0,0,0,0.3)'
        : '0 8px 24px rgba(0,168,132,0.1)',
    border: `1px solid ${theme.palette.divider}`,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 32px rgba(0,0,0,0.4)'
            : '0 12px 32px rgba(0,168,132,0.2)',
    }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px dashed ${theme.palette.divider}`,
}));

const ActionBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
}));

export default function TicketCard({ ticket }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // Implement ticket download logic
        console.log('Download ticket', ticket);
    };

    // Determine seat numbers display
    const seatNumberDisplay = Array.isArray(ticket.seatNumbers) 
        ? ticket.seatNumbers.join(', ') 
        : ticket.seatNumber || 'Unassigned';

    // Determine event details based on ticket type
    const renderEventDetails = () => {
        switch(ticket.eventType.toLowerCase()) {
            case 'movie':
                return (
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Movie
                        </Typography>
                        <Typography variant="body1">
                            {ticket.eventName}
                        </Typography>
                    </Grid>
                );
            case 'event':
                return (
                    <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Event
                        </Typography>
                        <Typography variant="body1">
                            {ticket.eventName}
                        </Typography>
                    </Grid>
                );
            case 'travel':
                return (
                    <>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Destination
                            </Typography>
                            <Typography variant="body1">
                                {ticket.venue}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Seat Type
                            </Typography>
                            <Typography variant="body1">
                                {ticket.seatType}
                            </Typography>
                        </Grid>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <TicketPaper elevation={4}>
            <HeaderBox>
                <Typography 
                    variant="h5" 
                    color="primary" 
                    sx={{ fontWeight: 700 }}
                >
                    {ticket.eventType} Ticket
                </Typography>
                <Typography 
                    variant="subtitle1" 
                    color="text.secondary"
                >
                    Ticket #{ticket.ticketNumber}
                </Typography>
            </HeaderBox>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Passenger Name
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {ticket.passengerName}
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {renderEventDetails()}
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Date & Time
                            </Typography>
                            <Typography variant="body1">
                                {ticket.eventDate} at {ticket.eventTime}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Seat Number(s)
                            </Typography>
                            <Typography variant="h6" color="primary">
                                {seatNumberDisplay}
                            </Typography>
                        </Grid>
                        {ticket.eventType.toLowerCase() !== 'travel' && (
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Venue
                                </Typography>
                                <Typography variant="body1">
                                    {ticket.venue}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>

                    {ticket.totalTickets && ticket.totalTickets > 1 && (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                Total Tickets: {ticket.totalTickets}
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>

            <ActionBox>
                <IconButton 
                    color="primary" 
                    onClick={handlePrint}
                    sx={{ 
                        border: '1px solid', 
                        borderColor: 'primary.main' 
                    }}
                >
                    <PrintIcon />
                </IconButton>
                <IconButton 
                    color="secondary" 
                    onClick={handleDownload}
                    sx={{ 
                        border: '1px solid', 
                        borderColor: 'secondary.main' 
                    }}
                >
                    <DownloadIcon />
                </IconButton>
            </ActionBox>
        </TicketPaper>
    );
}
