import {
  combineReducers,
  configureStore,
  createAction,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import exerciseReducer from "../features/exercises/exercisesSlice";
import authReducer from "../features/authentication/authSlice";
import userReducer from "../features/user/userSlice";
import folderReducer from "../features/workouts/folders/folderSlice";
import workoutReducer from "../features/workouts/workoutSlice";
import { apiSlice } from "./api/apiSlice";

export const revertAll = createAction("REVERT_ALL");

const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  exercise: exerciseReducer,
  auth: authReducer,
  user: userReducer,
  folder: folderReducer,
  workouts: workoutReducer,
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
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
