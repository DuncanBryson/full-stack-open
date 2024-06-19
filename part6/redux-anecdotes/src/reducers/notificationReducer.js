import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {},
  reducers: {
    createNotification(state, action) {
      console.log(action.payload);
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

export const { createNotification, clearNotification } =
  notificationSlice.actions;
export const setNotification = (message, timeout = 5) => {
  return (dispatch) => {
    dispatch(createNotification({ message, timeout }));
  };
};
export default notificationSlice.reducer;
