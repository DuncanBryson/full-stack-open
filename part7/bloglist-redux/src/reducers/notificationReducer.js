import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
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
export const setNotification = (notification, error) => {
  return (dispatch) => {
    dispatch(createNotification(notification, error));
  };
};
export default notificationSlice.reducer;
