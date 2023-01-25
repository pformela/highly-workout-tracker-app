import { createSlice } from "@reduxjs/toolkit";
import { TYPES, MUSCLE, DIFFICULTY } from "./Exercises";

const initialState = {
  allExercises: [],
  filteredExercises: [],
  currentPageExercises: [],
  currentUpdateExercise: {},
  exercises: [],
  count: 0,
  loading: false,
  error: "",
};

const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    changePage: (state, action) => {
      state.currentPageExercises = state.filteredExercises.slice(
        (action.payload - 1) * 25,
        action.payload * 25
      );
    },
    filterExercises: (state, action) => {
      const { name, type, muscle, difficulty } = action.payload;
      state.filteredExercises = state.allExercises.filter((exercise) => {
        return (
          (name !== ""
            ? exercise.name.toLowerCase().includes(name.toLowerCase())
            : true) &&
          (type !== "" ? exercise.type === type : true) &&
          (muscle !== "" ? exercise.muscle === muscle : true) &&
          (difficulty !== "" ? exercise.difficulty === difficulty : true)
        );
      });
      state.currentPageExercises = state.filteredExercises.slice(0, 25);
      state.count = state.filteredExercises.length;
    },
    sortExercises: (state, action) => {
      const { sort, order } = action.payload;

      if (order)
        state.filteredExercises = state.filteredExercises.sort((a, b) => {
          if (a[sort] < b[sort]) {
            return -1;
          }
          if (a[sort] > b[sort]) {
            return 1;
          }
          return 0;
        });
      else
        state.filteredExercises = state.filteredExercises.sort((a, b) => {
          if (a[sort] > b[sort]) {
            return -1;
          }
          if (a[sort] < b[sort]) {
            return 1;
          }
          return 0;
        });

      state.currentPageExercises = state.filteredExercises.slice(0, 25);
    },
    resetSort: (state) => {
      state.currentPageExercises = state.filteredExercises.slice(0, 25);
      state.count = state.filteredExercises.length;
    },
    setExercises: (state, action) => {
      const exercises = JSON.parse(JSON.stringify(action.payload.result)).map(
        (exercise) => {
          const labels = exercise.labels.filter(
            (label) => label !== "Exercise"
          );
          exercise.type = labels.find((label) => TYPES.includes(label));
          exercise.muscle = labels.find((label) => MUSCLE.includes(label));
          exercise.difficulty = labels.find((label) =>
            DIFFICULTY.includes(label)
          );

          return exercise;
        }
      );

      state.allExercises = exercises;
      state.filteredExercises = exercises;
      state.currentPageExercises = exercises.slice(0, 25);
      state.count = action.payload.count;
    },
    addExercise: (state, action) => {
      const exercise = { ...action.payload };
      const labels = exercise.labels.filter((label) => label !== "Exercise");
      exercise.type = labels.find((label) => TYPES.includes(label));
      exercise.muscle = labels.find((label) => MUSCLE.includes(label));
      exercise.difficulty = labels.find((label) => DIFFICULTY.includes(label));

      state.allExercises.push(exercise);
      state.filteredExercises.push(exercise);
      state.currentPageExercises.push(exercise);
      state.count = state.allExercises.length;
    },
    updateExercise: (state, action) => {
      const exercise = { ...action.payload };
      const labels = exercise.labels.filter((label) => label !== "Exercise");
      exercise.type = labels.find((label) => TYPES.includes(label));
      exercise.muscle = labels.find((label) => MUSCLE.includes(label));
      exercise.difficulty = labels.find((label) => DIFFICULTY.includes(label));

      const index = state.allExercises.findIndex((ex) => ex.id === exercise.id);
      state.allExercises[index] = exercise;
      state.filteredExercises[index] = exercise;
      state.currentPageExercises[index] = exercise;
    },
    deleteExercise: (state, action) => {
      const { exerciseId } = action.payload;
      state.allExercises = state.allExercises.filter(
        (ex) => ex.exerciseId !== exerciseId
      );
      state.filteredExercises = state.filteredExercises.filter(
        (ex) => ex.exerciseId !== exerciseId
      );
      state.currentPageExercises = state.currentPageExercises.filter(
        (ex) => ex.exerciseId !== exerciseId
      );
      state.count = state.allExercises.length;
    },
    selectCurrentUpdateExercise: (state, action) => {
      state.currentUpdateExercise = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export default exerciseSlice.reducer;

export const selectAllExercises = (state) => state.exercise.allExercises;
export const selectFilteredExercises = (state) =>
  state.exercise.filteredExercises;
export const selectCurrentPageExercises = (state) =>
  state.exercise.currentPageExercises;
export const selectExerciseCount = (state) => state.exercise.count;
export const selectCurrentUpdateExercise = (state) =>
  state.exercise.currentUpdateExercise;

export const exerciseActions = exerciseSlice.actions;
