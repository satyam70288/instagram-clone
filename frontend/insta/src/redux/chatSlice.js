import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        onlineUsers: [], // Initialize as an empty array for consistency
        messages: [], // Initialize as an empty array
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    }
});

export const { setOnlineUsers, setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
