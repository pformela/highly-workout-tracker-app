import { configureStore } from "@reduxjs/toolkit";
import exerciseReducer from "./exercise-slice";
import authReducer from "./auth-slice";
import userReducer from "./user-slice";
import { apiSlice } from "./api/apiSlice";

export default configureStore({
  reducer: {
    [apiSlice.reducre]: apiSlice.reducer,
    exercise: exerciseReducer,
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
