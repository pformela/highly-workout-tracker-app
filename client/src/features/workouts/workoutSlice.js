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
  filteredWorkoutHistory: {},
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
      const editedHistory = Object.keys(history).reduce((acc, w) => {
        const date = new Date(history[w].date).toDateString();
        const day = WEEK_DAYS[date.split(" ")[0]];
        const month = date.split(" ")[1];
        const dayOfMonth = date.split(" ")[2];

        history[w]["formattedDate"] = `${day}, ${month} ${dayOfMonth}`;
        history[w].workoutId = w;

        return { ...acc, [w]: history[w] };
      }, {});

      state.workoutHistory = editedHistory;
      state.filteredWorkoutHistory = editedHistory;

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
    filterWorkoutHistory(state, action) {
      const filter = action.payload;
      const volume = filter.volume;
      const hours = filter.hours;
      const name = filter.name;
      const re = new RegExp(`.*${name}.*`, "i");
      const history = state.workoutHistory;
      const filteredKeys = Object.keys(history).filter(
        (key) =>
          history[key].templateName.match(re) &&
          (volume === "any"
            ? true
            : volume === "10001"
            ? history[key].volume >= +volume
            : history[key].volume >= +volume &&
              history[key].volume < +volume + 5000) &&
          (hours === ""
            ? true
            : hours === "2"
            ? history[key].duration.hours >= +hours
            : history[key].duration.hours <= hours)
      );

      state.filteredWorkoutHistory = filteredKeys.reduce((acc, key) => {
        return { ...acc, [key]: history[key] };
      }, {});
    },
    resetFilters(state) {
      state.filteredWorkoutHistory = state.workoutHistory;
    },
    sortWorkoutHistory(state, action) {
      const sort = action.payload.type;
      const ascending = action.payload.ascending;
      const history = state.filteredWorkoutHistory;
      const sortedKeys = Object.keys(history).sort((a, b) => {
        if (sort === "date") {
          return new Date(history[b].date) - new Date(history[a].date);
        } else if (sort === "name") {
          return history[a].templateName.localeCompare(history[b].templateName);
        } else if (sort === "volume") {
          return history[b].volume - history[a].volume;
        }
      });

      if (!ascending) sortedKeys.reverse();

      state.filteredWorkoutHistory = sortedKeys.reduce((acc, key) => {
        return { ...acc, [key]: history[key] };
      }, {});
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

export const selectWorkout = (state) => state.workouts.currentWorkout;
export const selectWorkoutHistory = (state) => state.workouts.workoutHistory;
export const selectFilteredWorkoutHistory = (state) =>
  state.workouts.filteredWorkoutHistory;
export const selectCurrentSharedWorkout = (state) =>
  state.workouts.currentSharedWorkout;
export const selectIsCurrentSharedWorkoutEmpty = (state) =>
  state.workouts.isCurrentSharedWorkoutEmpty;
export const selectIsWorkoutHistoryEmpty = (state) =>
  state.workouts.isWorkoutHistoryEmpty;

export const workoutActions = workoutSlice.actions;

export default workoutSlice.reducer;
