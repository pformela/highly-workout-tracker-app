import { createSlice } from "@reduxjs/toolkit";

const initialWorkoutState = {
  currentWorkout: {},
  error: "",
};

const workoutSlice = createSlice({
  name: "workout",
  initialState: initialWorkoutState,
  reducers: {
    setCurrentWorkoutTemplate(state, action) {
      state.currentWorkout = action.payload;
    },
    startWorkout(state, action) {},
  },
  extraReducers: (builder) => {},
});

export const workoutActions = workoutSlice.actions;

export default workoutSlice.reducer;
