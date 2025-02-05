import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatHistory: [
        {
            text: 'Hello! I can help you book tickets for events, movies, or travel. What would you like to book today?',
            isUser: false
        }
    ],
    bookingState: {
        category: null, // 'movies', 'events', 'travel'
        selection: null, // specific movie, event, or destination
        date: null,
        time: null,
        tickets: 0
    },
    loading: false,
    error: null
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.chatHistory.push(action.payload);
        },
        setBookingState: (state, action) => {
            state.bookingState = { ...state.bookingState, ...action.payload };
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetBooking: (state) => {
            state.bookingState = initialState.bookingState;
        }
    }
});

export const {
    addMessage,
    setBookingState,
    setLoading,
    setError,
    resetBooking
} = chatSlice.actions;

export default chatSlice.reducer;
