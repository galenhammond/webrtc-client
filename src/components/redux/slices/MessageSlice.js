import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
  name: "messages",
  initialState: {
    value: [],
  },
  reducers: {
    addToMessages: (state, action) => {
      state.value.push(action.payload);
    },
    clearMessages: (state) => {
      state.value = [];
    },
  },
});

export const { addToMessages, clearMessages } = messageSlice.actions;

export const selectMessages = (state) => state.messages.value;

export default messageSlice.reducer;
