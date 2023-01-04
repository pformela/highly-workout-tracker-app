import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    token: null,
    userId: null,
    error: null,
    loading: false,
  },
  reducers: {
    authSuccess(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
