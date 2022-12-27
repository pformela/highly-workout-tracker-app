import { configureStore } from "@reduxjs/toolkit";
import exerciseReducer from "./exercise-slice";

export default configureStore({
  reducer: { exercise: exerciseReducer },
});
