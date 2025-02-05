import { NextResponse } from 'next/server';
import { mockData } from '@/services/mockData';

const bookingStates = new Map();

export async function POST(request) {
    try {
        const { message, sessionId } = await request.json();
        let currentState = bookingStates.get(sessionId) || { step: 'initial' };
        
        const response = await handleMessage(message, currentState, sessionId);
        bookingStates.set(sessionId, response.newState);
        
        delete response.newState;
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error processing message:', error);
        return NextResponse.json({
            message: "I understand you're interested in booking. What would you like to book? (Movies, Events, or Travel)",
            options: ['Movies', 'Events', 'Travel']
        });
    }
}

async function handleMessage(message, currentState, sessionId) {
    const lowerMessage = message.toLowerCase();

    if (currentState.step === 'initial') {
        if (lowerMessage.includes('movie')) {
            return {
                message: 'Great! Here are the available movies:',
                options: mockData.movies.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    price: movie.price,
                    description: `Starting from $${movie.price}`
                })),
                newState: { 
                    step: 'select_item',
                    category: 'movies'
                }
            };
        } else if (lowerMessage.includes('event')) {
            return {
                message: 'Here are our upcoming events:',
                options: mockData.events.map(event => ({
                    id: event.id,
                    title: event.title,
                    price: event.price,
                    description: `Starting from $${event.price}`
                })),
                newState: { 
                    step: 'select_item',
                    category: 'events'
                }
            };
        } else if (lowerMessage.includes('travel')) {
            return {
                message: 'Here are our available destinations:',
                options: mockData.travel.map(trip => ({
                    id: trip.id,
                    title: trip.destination,
                    price: trip.price,
                    description: `Starting from $${trip.price}`
                })),
                newState: { 
                    step: 'select_item',
                    category: 'travel'
                }
            };
        }
        return {
            message: "What would you like to book? (Movies, Events, or Travel)",
            options: ['Movies', 'Events', 'Travel'],
            newState: currentState
        };
    }

    if (currentState.step === 'select_item') {
        const items = mockData[currentState.category];
        const selectedItem = items.find(item => 
            (item.title || item.destination).toLowerCase() === lowerMessage
        );

        if (selectedItem) {
            let dates;
            if (currentState.category === 'movies') {
                dates = Array.from({length: 5}, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    return date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                });
            } else {
                dates = selectedItem.dates || 
                    [new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    })];
            }

            return {
                message: 'Great choice! Please select a date:',
                options: dates,
                newState: { 
                    ...currentState,
                    step: 'select_date',
                    selectedItem: selectedItem
                }
            };
        }
        
        return {
            message: `I couldn't find that option. Please select from the available options:`,
            options: items.map(item => ({
                id: item.id,
                title: item.title || item.destination,
                price: item.price,
                description: `Starting from $${item.price}`
            })),
            newState: currentState
        };
    }

    if (currentState.step === 'select_date') {
        const times = currentState.selectedItem.showTimes || 
            ['10:00 AM', '2:00 PM', '6:00 PM', '9:00 PM'];

        return {
            message: 'Please select your preferred time:',
            options: times,
            newState: {
                ...currentState,
                step: 'select_time',
                selectedDate: message
            }
        };
    }

    if (currentState.step === 'select_time') {
        const { selectedItem } = currentState;
        const seatTypes = Object.entries(selectedItem.seatTypes).map(([type, description]) => ({
            type,
            description,
            price: selectedItem.pricing[type]
        }));

        return {
            message: 'Please select your preferred seat type:',
            options: seatTypes.map(seat => ({
                id: seat.type,
                title: `${seat.description} - $${seat.price}`,
                value: seat.type,
                price: seat.price,
                description: `$${seat.price} per ticket`
            })),
            newState: {
                ...currentState,
                step: 'select_seat_type',
                selectedTime: message,
                availableSeatTypes: seatTypes // Store available seat types in state
            }
        };
    }

    if (currentState.step === 'select_seat_type') {
        // First try to match by the exact seat type
        let selectedSeatType = Object.keys(currentState.selectedItem.seatTypes)
            .find(type => type.toLowerCase() === message.toLowerCase());
        
        // If no match, try to match by description
        if (!selectedSeatType) {
            selectedSeatType = Object.keys(currentState.selectedItem.seatTypes)
                .find(type => {
                    const description = currentState.selectedItem.seatTypes[type];
                    return message.toLowerCase().includes(description.toLowerCase());
                });
        }

        // If still no match, try to match by partial description
        if (!selectedSeatType) {
            selectedSeatType = Object.keys(currentState.selectedItem.seatTypes)
                .find(type => {
                    const description = currentState.selectedItem.seatTypes[type];
                    const words = description.toLowerCase().split(' ');
                    return words.some(word => message.toLowerCase().includes(word));
                });
        }

        // If we found a valid seat type, proceed to quantity selection
        if (selectedSeatType) {
            return {
                message: 'How many tickets would you like?',
                options: [1, 2, 3, 4, 5],
                newState: {
                    ...currentState,
                    step: 'select_quantity',
                    selectedSeatType: selectedSeatType
                }
            };
        }

        // If no valid seat type was found, show options again
        return {
            message: 'Please select a valid seat type from the following options:',
            options: currentState.availableSeatTypes.map(seat => ({
                id: seat.type,
                title: `${seat.description} - $${seat.price}`,
                value: seat.type,
                price: seat.price,
                description: `$${seat.price} per ticket`
            })),
            newState: currentState
        };
    }

    if (currentState.step === 'select_quantity') {
        const { selectedItem, selectedDate, selectedTime, selectedSeatType } = currentState;
        const quantity = parseInt(message);
        const pricePerTicket = selectedItem.pricing[selectedSeatType];
        const totalPrice = pricePerTicket * quantity;
        const itemTitle = selectedItem.title || selectedItem.destination;
        const seatTypeDescription = selectedItem.seatTypes[selectedSeatType];

        bookingStates.delete(sessionId);

        return {
            message: `Perfect! Here's your booking confirmation:\n\n` +
                    `${itemTitle}\n` +
                    `Date: ${selectedDate}\n` +
                    `Time: ${selectedTime}\n` +
                    `Seat Type: ${seatTypeDescription}\n` +
                    `Price per ticket: $${pricePerTicket.toFixed(2)}\n` +
                    `Number of tickets: ${quantity}\n` +
                    `Total Price: $${totalPrice.toFixed(2)}\n\n` +
                    `Your booking is confirmed! Would you like to book something else?`,
            options: ['Book Another', 'No, thank you'],
            newState: { step: 'initial' }
        };
    }

    return {
        message: "I'm not sure what you'd like to do. Would you like to start over?",
        options: ['Yes, start over', 'No, thank you'],
        newState: { step: 'initial' }
    };
}