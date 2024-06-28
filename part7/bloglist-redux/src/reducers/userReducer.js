import { createSlice } from "@reduxjs/toolkit";
import { createNotification } from "./notificationReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    updateUser(state, action) {
      return action.payload;
    },
  },
});
export const { updateUser } = userSlice.actions;

export const logout = () => {
  return (dispatch) => {
    dispatch(updateUser(null));
    window.localStorage.removeItem("loggedBloglistUser");
    dispatch(createNotification({ message: "Successfully logged out" }));
  };
};

export default userSlice.reducer;
