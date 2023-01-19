import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../app/store";

const WEEK_DAYS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const initialState = {
  currentWorkout: {},
  currentSharedWorkout: {},
  workoutHistory: {},
  isWorkoutHistoryEmpty: false,
  isCurrentSharedWorkoutEmpty: false,
  error: "",
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    addWorkoutToHistory(state, action) {
      const workout = JSON.parse(JSON.stringify(action.payload.workout));
      const workoutId = action.payload.workoutId;
      const date = new Date(workout.date).toDateString();
      const day = WEEK_DAYS[date.split(" ")[0]];
      const month = date.split(" ")[1];
      const dayOfMonth = date.split(" ")[2];

      workout["formattedDate"] = `${day}, ${month} ${dayOfMonth}`;

      state.workoutHistory[workoutId] = workout;
    },
    setWorkoutHistory(state, action) {
      const history = JSON.parse(JSON.stringify(action.payload));
      state.workoutHistory = Object.keys(history).reduce((acc, w) => {
        const date = new Date(history[w].date).toDateString();
        const day = WEEK_DAYS[date.split(" ")[0]];
        const month = date.split(" ")[1];
        const dayOfMonth = date.split(" ")[2];

        history[w]["formattedDate"] = `${day}, ${month} ${dayOfMonth}`;
        history[w].workoutId = w;

        return { ...acc, [w]: history[w] };
      }, {});
      console.log(history);
      if (JSON.stringify(action.payload) === "{}")
        state.isWorkoutHistoryEmpty = true;
    },
    deleteWorkout(state, action) {
      delete state.workoutHistory[action.payload];
    },
    setCurrentWorkoutTemplate(state, action) {
      state.currentWorkout = action.payload;
    },
    setCurrentSharedWorkout(state, action) {
      if (JSON.stringify(action.payload) === "{}") {
        state.isCurrentSharedWorkoutEmpty = true;
      } else {
        const workout = JSON.parse(JSON.stringify(action.payload));
        const date = new Date(workout.date).toDateString();
        const day = WEEK_DAYS[date.split(" ")[0]];
        const month = date.split(" ")[1];
        const dayOfMonth = date.split(" ")[2];

        workout["formattedDate"] = `${day}, ${month} ${dayOfMonth}`;

        state.currentSharedWorkout = workout;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const selectWorkout = (state) => state.workouts.currentWorkout;
export const selectWorkoutHistory = (state) => state.workouts.workoutHistory;
export const selectCurrentSharedWorkout = (state) =>
  state.workouts.currentSharedWorkout;
export const selectIsCurrentSharedWorkoutEmpty = (state) =>
  state.workouts.isCurrentSharedWorkoutEmpty;
export const selectIsWorkoutHistoryEmpty = (state) =>
  state.workouts.isWorkoutHistoryEmpty;

export const workoutActions = workoutSlice.actions;

export default workoutSlice.reducer;
