import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: "",
    email: "",
    username: "",
  },
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.username = action.payload.username;
    },
    removeUser(state) {
      state.userId = "";
      state.email = "";
      state.username = "";
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
