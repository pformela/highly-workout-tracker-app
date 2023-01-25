import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  email: "",
  username: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
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
  extraReducers: (builder) => {},
});

export const userActions = userSlice.actions;

export const selectUsername = (state) => state.user.username;
export const selectUserId = (state) => state.user.userId;
export const selectEmail = (state) => state.user.email;

export default userSlice.reducer;
