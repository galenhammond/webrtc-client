import { createSlice } from "@reduxjs/toolkit";

export const promptSlice = createSlice({
  name: "prompt",
  initialState: {
    value: null,
  },
  reducers: {
    usePrompt: (state, action) => {
      state.value = action.payload;
    },
    clearPrompt: (state) => {
      state.value = null;
    },
  },
});

export const { usePrompt, clearPrompt } = promptSlice.actions;

export const selectPrompt = (state) => state.prompt.value;

export default promptSlice.reducer;
