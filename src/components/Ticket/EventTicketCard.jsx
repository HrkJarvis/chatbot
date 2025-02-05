'use client';

import React from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
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

export default function EventTicketCard({ ticket }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        console.log('Download event ticket', ticket);
    };

    return (
        <TicketPaper elevation={4}>
            <HeaderBox>
                <Typography 
                    variant="h5" 
                    color="primary" 
                    sx={{ fontWeight: 700 }}
                >
                    Event Ticket
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
                            Event Name
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {ticket.eventName}
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Time
                            </Typography>
                            <Typography variant="body1">
                                {ticket.time}
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
                    </Grid>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Seat Number(s)
                            </Typography>
                            <Typography variant="h6" color="primary">
                                {ticket.seatNumbers.join(', ')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Price
                            </Typography>
                            <Typography variant="body1">
                                {ticket.price}
                            </Typography>
                        </Grid>
                    </Grid>
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
