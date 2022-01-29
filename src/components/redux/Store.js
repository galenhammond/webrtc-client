import * as React from "react";
import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./slices/MessageSlice";
import promptReducer from "./slices/PromptSlice";

export default configureStore({
  reducer: {
    messages: messageReducer,
    prompt: promptReducer,
  },
});
