import { configureStore } from "@reduxjs/toolkit";
import exerciseReducer from "./exercise-slice";
import authReducer from "./auth-slice";
import userReducer from "./user-slice";

export default configureStore({
  reducer: {
    exercise: exerciseReducer,
    auth: authReducer,
    user: userReducer,
  },
});
