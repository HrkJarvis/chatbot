'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    TextField, 
    IconButton, 
    Typography,
    Container,
    List,
    ListItem,
    Button,
    CircularProgress,
    Avatar,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    Snackbar,
    Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext';
import MovieTicketCard from '../Ticket/MovieTicketCard';
import EventTicketCard from '../Ticket/EventTicketCard';
import TravelTicketCard from '../Ticket/TravelTicketCard';
import { mockData, getMockResponse } from '../../services/mockData';

// Helper function to extract booking details
const extractBookingDetails = (messages) => {
    const bookingTypes = ['movie', 'event', 'travel'];
    const lastMessages = messages.slice(-10); // Increase search range
    
    let bookingDetails = {
        type: '',
        name: '',
        destination: '',
        date: '',
        time: '',
        seatType: '',
        price: '',
        seatNumbers: [],
        numberOfTickets: 1
    };

    console.log('Extracting booking details from messages:', messages);

    // Determine booking type first
    const typeDetectionMessages = [...lastMessages].reverse();
    for (const msg of typeDetectionMessages) {
        const text = msg.text.toLowerCase();
        const foundType = bookingTypes.find(type => text.includes(type));
        if (foundType) {
            bookingDetails.type = foundType;
            console.log(`Booking type detected: ${foundType}`);
            break;
        }
    }

    // If no type found, return null or default
    if (!bookingDetails.type) {
        console.log('No booking type detected');
        return null;
    }

    // Helper function to extract name
    const extractName = (text, type) => {
        // More flexible patterns for each type
        const patterns = {
            movie: [
                /movie\s*(?:is)?\s*(.+?)(?:\s*at|\s*on|\s*$)/i,
                /(?:for|watching)\s*(.+?)(?:\s*movie|ticket|\s*at|\s*on|\s*$)/i,
                /(.+?)\s*movie\s*ticket/i
            ],
            event: [
                /event\s*(?:is)?\s*(.+?)(?:\s*at|\s*on|\s*$)/i,
                /(?:for)\s*(.+?)(?:\s*event|ticket|\s*at|\s*on|\s*$)/i,
                /(.+?)\s*event\s*ticket/i
            ],
            travel: [
                /(?:to|destination)\s*(.+?)(?:\s*at|\s*on|\s*$)/i,
                /(.+?)\s*travel\s*ticket/i
            ]
        };

        for (const pattern of patterns[type]) {
            const match = text.match(pattern);
            if (match) {
                // Clean up the extracted name
                return match[1].replace(/\b(movie|event|ticket|for|watching|travel|to)\b/gi, '').trim();
            }
        }
        return null;
    };

    // Search for details in messages
    for (const msg of lastMessages) {
        if (msg.isUser) {
            const text = msg.text.toLowerCase();
            console.log(`Processing user message: ${text}`);

            // Extract name
            if (!bookingDetails.name) {
                const extractedName = extractName(text, bookingDetails.type);
                if (extractedName) {
                    bookingDetails.name = extractedName;
                    console.log(`Extracted name: ${bookingDetails.name}`);
                }
            }

            // Extract destination for travel
            if (bookingDetails.type === 'travel' && !bookingDetails.destination) {
                const destinationMatch = text.match(/(?:to|destination)\s*(.+?)(?:\s*at|\s*on|\s*$)/i);
                if (destinationMatch) {
                    bookingDetails.destination = destinationMatch[1].trim();
                    console.log(`Extracted destination: ${bookingDetails.destination}`);
                }
            }

            // Extract time
            const timeMatch = text.match(/(?:at)\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i);
            if (timeMatch && !bookingDetails.time) {
                bookingDetails.time = timeMatch[1];
                console.log(`Extracted time: ${bookingDetails.time}`);
            }

            // Seat type keywords
            const seatTypeKeywords = {
                movie: ['standard', 'premium', 'vip', 'regular', 'extra legroom', 'recliner'],
                event: ['general', 'premium', 'vip', 'backstage', 'better view'],
                travel: ['economy', 'business', 'first', 'first class', 'standard']
            };

            // Match seat type
            if (!bookingDetails.seatType) {
                const keywords = seatTypeKeywords[bookingDetails.type];
                const matchedKeyword = keywords.find(keyword => 
                    text.includes(keyword.toLowerCase())
                );
                
                if (matchedKeyword) {
                    bookingDetails.seatType = matchedKeyword;
                    console.log(`Extracted seat type: ${bookingDetails.seatType}`);
                }
            }

            // Extract price
            const priceMatch = text.match(/(?:price|cost)\s*(?:is)?\s*(\$?\d+(?:\.\d{1,2})?)/i);
            if (priceMatch && !bookingDetails.price) {
                bookingDetails.price = priceMatch[1].startsWith('$') ? priceMatch[1] : `$${priceMatch[1]}`;
                console.log(`Extracted price: ${bookingDetails.price}`);
            }
        }
    }

    // Fallback for missing details
    if (!bookingDetails.name) {
        bookingDetails.name = bookingDetails.type === 'travel' 
            ? 'Unspecified Destination' 
            : `Unnamed ${bookingDetails.type.charAt(0).toUpperCase() + bookingDetails.type.slice(1)}`;
    }
    if (!bookingDetails.time) bookingDetails.time = new Date().toLocaleTimeString();
    if (!bookingDetails.seatType) bookingDetails.seatType = 'standard';
    if (!bookingDetails.price) bookingDetails.price = '$50.00';

    // Generate seat numbers
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    bookingDetails.seatNumbers = Array.from({ length: bookingDetails.numberOfTickets }, (_, index) => {
        const row = rows[Math.floor(index / 4)];
        const seat = (index % 4) + 1;
        return `${row}${seat}`;
    });

    console.log('Final booking details:', bookingDetails);
    return bookingDetails;
};

const generateTicket = (bookingDetails) => {
    console.log('Generating ticket with details:', bookingDetails);
    
    // Validate booking details
    if (!bookingDetails || !bookingDetails.type) {
        console.error('Invalid booking details');
        return null;
    }
    
    const ticketNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Try to find matching mock data
    let mockItem = null;
    switch(bookingDetails.type.toLowerCase()) {
        case 'movie':
            // Try multiple ways to find a movie
            mockItem = getMockResponse('movies', bookingDetails.name || 'Matrix')[0];
            console.log('Movie mock item:', mockItem);
            if (mockItem) {
                // Determine seat type from mock data
                const seatTypes = Object.keys(mockItem.seatTypes);
                const seatTypePriority = ['vip', 'premium', 'regular', 'standard'];
                
                let matchedSeatType = seatTypes.find(type => 
                    (bookingDetails.seatType || '').toLowerCase().includes(type)
                ) || seatTypePriority.find(type => seatTypes.includes(type)) || 'regular';

                // Intelligent time selection from available showtimes
                let matchedTime = null;
                if (bookingDetails.time) {
                    // First, try to find an exact match
                    matchedTime = mockItem.showTimes.find(time => 
                        time === bookingDetails.time || 
                        time.startsWith(bookingDetails.time)
                    );
                }
                
                // If no exact match, use the first available showtime
                if (!matchedTime) {
                    matchedTime = mockItem.showTimes[0];
                }

                return {
                    type: 'movie',
                    ticketNumber,
                    movieName: mockItem.title,
                    time: matchedTime,
                    seatType: mockItem.seatTypes[matchedSeatType],
                    seatNumbers: bookingDetails.seatNumbers || ['A1', 'A2', 'A3', 'A4'],
                    price: `$${mockItem.pricing[matchedSeatType]}`
                };
            }
            break;
        case 'event':
            // Try multiple ways to find an event
            mockItem = getMockResponse('events', bookingDetails.name || 'Concert')[0];
            console.log('Event mock item:', mockItem);
            if (mockItem) {
                // Determine seat type from mock data
                const seatTypes = Object.keys(mockItem.seatTypes);
                const seatTypePriority = ['vip', 'premium', 'general', 'standard'];
                
                let matchedSeatType = seatTypes.find(type => 
                    (bookingDetails.seatType || '').toLowerCase().includes(type)
                ) || seatTypePriority.find(type => seatTypes.includes(type)) || 'general';

                // Intelligent time selection from event time
                let matchedTime = null;
                if (bookingDetails.time) {
                    // Check if the provided time is close to or matches the event time
                    matchedTime = mockItem.time;
                    
                    // Optional: Add more sophisticated time matching if needed
                    // For example, matching hour or allowing slight variations
                    if (bookingDetails.time !== matchedTime) {
                        console.log(`Note: User suggested time ${bookingDetails.time} differs from event time ${matchedTime}`);
                    }
                } else {
                    // Use the default event time
                    matchedTime = mockItem.time;
                }

                return {
                    type: 'event',
                    ticketNumber,
                    eventName: mockItem.title,
                    time: matchedTime,
                    seatType: mockItem.seatTypes[matchedSeatType],
                    seatNumbers: bookingDetails.seatNumbers || ['A1', 'A2', 'A3', 'A4'],
                    price: `$${mockItem.pricing[matchedSeatType]}`
                };
            }
            break;
        case 'travel':
            // Ensure destination is captured correctly
            const destinationQuery = bookingDetails.destination || 'Paris';
            mockItem = getMockResponse('travel', destinationQuery)[0];
            console.log('Travel mock item:', mockItem, 'with query:', destinationQuery);
            
            if (mockItem) {
                // Determine seat type from mock data
                const seatTypes = Object.keys(mockItem.seatTypes);
                const seatTypePriority = ['first class', 'business', 'economy', 'standard'];
                
                let matchedSeatType = seatTypes.find(type => 
                    (bookingDetails.seatType || '').toLowerCase().includes(type)
                ) || seatTypePriority.find(type => seatTypes.includes(type)) || 'economy';

                // Intelligent time selection
                let matchedTime = null;
                if (bookingDetails.time) {
                    // If a time is provided, use it as a reference
                    matchedTime = bookingDetails.time;
                } else {
                    // Use a default time from mock data or a standard time
                    matchedTime = '10:00 AM';
                }

                return {
                    type: 'travel',
                    ticketNumber,
                    destination: mockItem.destination,
                    time: matchedTime,
                    seatType: mockItem.seatTypes[matchedSeatType],
                    seatNumbers: bookingDetails.seatNumbers || ['A1', 'A2', 'A3', 'A4'],
                    price: `$${mockItem.pricing[matchedSeatType]}`
                };
            }
            break;
    }

    // Fallback ticket generation if no mock data found
    console.warn('No mock data found, generating fallback ticket');
    return {
        type: bookingDetails.type.toLowerCase(),
        ticketNumber,
        ...(bookingDetails.type === 'movie' ? { movieName: bookingDetails.name || 'Unnamed Movie' } : {}),
        ...(bookingDetails.type === 'event' ? { eventName: bookingDetails.name || 'Unnamed Event' } : {}),
        ...(bookingDetails.type === 'travel' ? { destination: bookingDetails.destination || 'Unspecified Destination' } : {}),
        time: bookingDetails.time || '10:00 AM',
        seatType: bookingDetails.seatType || 'Standard Seating',
        seatNumbers: bookingDetails.seatNumbers || ['A1', 'A2', 'A3', 'A4'],
        price: bookingDetails.price || '$50.00'
    };
};

const MessagesContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
        padding: theme.spacing(2.5),
    },
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
        background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)',
        borderRadius: '4px',
    },
}));

const MessageWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down('sm')]: {
        gap: theme.spacing(0.5),
        marginBottom: theme.spacing(1.5),
    },
}));

const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isUser'
})(({ theme, isUser }) => ({
    maxWidth: '70%',
    padding: theme.spacing(2, 2.5),
    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
    marginBottom: theme.spacing(1),
    backgroundColor: isUser 
        ? theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #6366F1, #4F46E5)'
            : 'linear-gradient(135deg, #E8F0FE, #C7D2FE)'
        : theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #3F3F46, #27272A)'
            : 'linear-gradient(135deg, #F1F5F9, #E2E8F0)',
    color: theme.palette.mode === 'dark' 
        ? '#ffffff'
        : '#000000',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    wordBreak: 'break-word',
    boxShadow: isUser
        ? theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(99, 102, 241, 0.3)'
            : '0 4px 12px rgba(59, 130, 246, 0.2)'
        : theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    transition: 'all 0.3s ease',
    backdropFilter: !isUser && 'blur(10px)',
    border: !isUser && theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.05)',
    '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: isUser
            ? theme.palette.mode === 'dark'
                ? '0 6px 16px rgba(99, 102, 241, 0.4)'
                : '0 6px 16px rgba(59, 130, 246, 0.3)'
            : theme.palette.mode === 'dark'
                ? '0 6px 16px rgba(0, 0, 0, 0.4)'
                : '0 6px 16px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('sm')]: {
        maxWidth: '85%',
        padding: theme.spacing(1.5, 2),
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 32,
    height: 32,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    border: `2px solid ${theme.palette.background.paper}`,
}));

const OptionsContainer = styled(List)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    justifyContent: 'center',
}));

const OptionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0.5),
    borderRadius: theme.spacing(3),
    textTransform: 'none',
    padding: theme.spacing(1, 3),
    transition: 'all 0.3s ease',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: '1px solid ' + theme.palette.divider,
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
}));

const InputContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(63, 63, 70, 0.6)'
        : 'rgba(241, 245, 249, 0.8)',
    borderRadius: theme.shape.borderRadius,
    backdropFilter: 'blur(10px)',
    border: theme.palette.mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.3)'
        : '0 4px 12px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.5),
        gap: theme.spacing(0.5),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: 24,
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
        },
        '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
            },
        },
        '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
            transition: 'all 0.2s ease',
        },
    },
    '& .MuiOutlinedInput-input': {
        padding: '14px 20px',
        [theme.breakpoints.down('sm')]: {
            padding: '10px 15px',
        },
    },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#6366F1' : '#4F46E5',
    color: '#ffffff',
    width: 48,
    height: 48,
    borderRadius: '50%',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#4F46E5' : '#4338CA',
        transform: 'scale(1.05)',
    },
    '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.12)' 
            : 'rgba(0, 0, 0, 0.12)',
        color: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(0, 0, 0, 0.3)',
    },
    transition: 'all 0.2s ease',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(99, 102, 241, 0.3)'
        : '0 4px 12px rgba(79, 70, 229, 0.2)',
    [theme.breakpoints.down('sm')]: {
        width: 40,
        height: 40,
    },
}));

const ChatInterface = () => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { text: 'Hello! I can help you book tickets for events, movies, or travel. What would you like to book today?', isUser: false }
    ]);
    const [sessionId] = useState(uuidv4());
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(null);
    const [generatedTicket, setGeneratedTicket] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const messagesEndRef = useRef(null);
    const theme = useTheme();
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSendMessage = async (text = message) => {
        if (!text.trim()) return;

        const userMessage = { text, isUser: true };
        setChatHistory(prev => [...prev, userMessage]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    sessionId,
                    userId: user.id,
                    bookingInProgress
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Check if booking is confirmed
                const isBookingConfirmed = 
                    data.message.toLowerCase().includes('confirmed') || 
                    data.message.toLowerCase().includes('booked');

                if (isBookingConfirmed && !generatedTicket) {
                    // Extract booking details
                    const bookingDetails = extractBookingDetails(chatHistory);

                    console.log('Booking details extracted:', bookingDetails);

                    // Ensure booking details exist before generating ticket
                    if (bookingDetails) {
                        const ticket = generateTicket(bookingDetails);

                        console.log('Generated ticket:', ticket);

                        if (ticket) {
                            setChatHistory(prev => [
                                ...prev, 
                                { 
                                    text: 'Your ticket has been booked successfully!', 
                                    isUser: false,
                                    type: 'ticket',
                                    ticket
                                }
                            ]);

                            setGeneratedTicket(ticket);
                            setSnackbarMessage('Ticket generated successfully!');
                            setSnackbarOpen(true);
                            setBookingInProgress(false);
                        } else {
                            // Fallback if ticket generation fails
                            setChatHistory(prev => [
                                ...prev, 
                                { 
                                    text: 'Sorry, I could not generate a ticket. Please provide more details.', 
                                    isUser: false
                                }
                            ]);
                        }
                    } else {
                        // Fallback if booking details extraction fails
                        setChatHistory(prev => [
                            ...prev, 
                            { 
                                text: 'Sorry, I could not extract booking details. Please be more specific.', 
                                isUser: false
                            }
                        ]);
                    }
                } else {
                    // Check if booking process is starting
                    const bookingTypes = ['movie', 'event', 'travel'];
                    const isBookingStart = bookingTypes.some(type => 
                        text.toLowerCase().includes(type) || 
                        data.message.toLowerCase().includes(type)
                    );

                    if (isBookingStart) {
                        setBookingInProgress(true);
                    }

                    setChatHistory(prev => [
                        ...prev, 
                        { 
                            text: data.message, 
                            isUser: false 
                        }
                    ]);
                }

                setOptions(data.options);
            } else {
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            console.error('Error:', error);
            setChatHistory(prev => [...prev, { 
                text: 'Sorry, I encountered an error. Please try again.', 
                isUser: false 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (option) => {
        const optionText = typeof option === 'object' ? option.title : option.toString();
        handleSendMessage(optionText);
    };

    const handleCloseTicket = () => {
        setGeneratedTicket(null);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const renderTicket = (ticket) => {
        if (!ticket) return null;

        switch(ticket.type?.toLowerCase()) {
            case 'movie':
                return <MovieTicketCard ticket={ticket} />;
            case 'event':
                return <EventTicketCard ticket={ticket} />;
            case 'travel':
                return <TravelTicketCard ticket={ticket} />;
            default:
                return null;
        }
    };

    return (
        <>
            <Paper 
                elevation={3} 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    maxHeight: { xs: '90vh', sm: '85vh', md: '80vh' },
                    backgroundColor: 'background.paper',
                    borderRadius: 3
                }}
            >
                <MessagesContainer>
                    {chatHistory.map((msg, index) => (
                        <MessageWrapper 
                            key={index} 
                            sx={{ 
                                flexDirection: msg.isUser ? 'row-reverse' : 'row',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.02)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                },
                            }}
                        >
                            <StyledAvatar 
                                sx={{ 
                                    bgcolor: msg.isUser ? 'primary.main' : 'secondary.main',
                                    transform: `scale(${msg.isUser ? 0.9 : 1})`,
                                }}
                            >
                                {msg.isUser ? <PersonIcon /> : <SmartToyIcon />}
                            </StyledAvatar>
                            <MessageBubble isUser={msg.isUser}>
                                {msg.type === 'ticket' ? (
                                    <Typography 
                                        variant="body1" 
                                        color="primary" 
                                        sx={{ 
                                            fontWeight: 600, 
                                            cursor: 'pointer' 
                                        }}
                                        onClick={() => setGeneratedTicket(msg.ticket)}
                                    >
                                        Ticket Generated! Click to view details.
                                    </Typography>
                                ) : (
                                    <Typography variant="body1">{msg.text}</Typography>
                                )}
                            </MessageBubble>
                        </MessageWrapper>
                    ))}
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} />
                        </Box>
                    )}
                    {options && !isLoading && (
                        <OptionsContainer>
                            {options.map((option, index) => (
                                <OptionButton
                                    key={index}
                                    variant="outlined"
                                    onClick={() => handleOptionClick(option)}
                                    startIcon={option.icon}
                                >
                                    {typeof option === 'object' ? 
                                        <Box>
                                            <Typography variant="subtitle2">
                                                {option.title}
                                            </Typography>
                                            {option.description && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {option.description}
                                                </Typography>
                                            )}
                                        </Box>
                                        : option
                                    }
                                </OptionButton>
                            ))}
                        </OptionsContainer>
                    )}
                    <div ref={messagesEndRef} />
                </MessagesContainer>

                <InputContainer>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        size="medium"
                        disabled={isLoading}
                    />
                    <SendButton
                        onClick={() => handleSendMessage()}
                        disabled={!message.trim() || isLoading}
                        size="large"
                    >
                        <SendIcon />
                    </SendButton>
                </InputContainer>
            </Paper>

            {/* Ticket Dialog */}
            <Dialog
                open={!!generatedTicket}
                onClose={handleCloseTicket}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Your Ticket</Typography>
                    <IconButton onClick={handleCloseTicket}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {generatedTicket && renderTicket(generatedTicket)}
                </DialogContent>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ChatInterface;
