import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { conversations: [], activeConversation: null },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
  },
});

export const { setConversations, setActiveConversation } = chatSlice.actions;
export default chatSlice.reducer;
