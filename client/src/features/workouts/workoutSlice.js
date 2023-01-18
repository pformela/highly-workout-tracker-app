import { createSlice } from "@reduxjs/toolkit";

const initialWorkoutState = {
  currentWorkout: {},
  workoutHistory: {},
  isWorkoutHistoryEmpty: false,
  error: "",
};

const workoutSlice = createSlice({
  name: "workout",
  initialState: initialWorkoutState,
  reducers: {
    setWorkoutHistory(state, action) {
      console.log(action.payload);
      state.workoutHistory = action.payload;
      console.log(action.payload);
      if (JSON.stringify(action.payload) === "{}")
        state.isWorkoutHistoryEmpty = true;
    },
    setCurrentWorkoutTemplate(state, action) {
      state.currentWorkout = action.payload;
    },
    startWorkout(state, action) {},
  },
  extraReducers: (builder) => {},
});

export const selectWorkoutHistory = (state) => state.workouts.workoutHistory;
export const selectIsWorkoutHistoryEmpty = (state) =>
  state.workouts.isWorkoutHistoryEmpty;

export const workoutActions = workoutSlice.actions;

export default workoutSlice.reducer;
