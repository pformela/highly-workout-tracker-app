import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import exerciseReducer from "../features/exercises/exercisesSlice";
import authReducer from "../features/authentication/authSlice";
import userReducer from "../features/user/userSlice";
import folderReducer from "../features/workouts/folderSlice";
import { apiSlice } from "./api/apiSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    exercise: exerciseReducer,
    auth: authReducer,
    user: userReducer,
    folder: folderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
