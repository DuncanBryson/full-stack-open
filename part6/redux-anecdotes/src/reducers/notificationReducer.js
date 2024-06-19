import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    createNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

export const { createNotification, clearNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
