import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import exerciseReducer from "../features/exercises/exercisesSlice";
import authReducer from "../features/authentication/authSlice";
import userReducer from "../features/user/userSlice";
import folderReducer from "../features/workouts/folders/folderSlice";
import workoutReducer from "../features/workouts/workoutSlice";
import templateReducer from "../features/workouts/templates/templateSlice";
import { apiSlice } from "./api/apiSlice";
import logger from "redux-logger";

const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  exercise: exerciseReducer,
  auth: authReducer,
  user: userReducer,
  folder: folderReducer,
  workouts: workoutReducer,
  template: templateReducer,
});

const reducerProxy = (state, action) => {
  if (action.type === "auth/logout") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: reducerProxy,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(logger),
  devTools: true,
});

setupListeners(store.dispatch);
