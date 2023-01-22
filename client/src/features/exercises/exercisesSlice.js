import { revertAll } from "../../app/store";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { TYPES, MUSCLE, DIFFICULTY } from "./Exercises";

const initialState = {
  allExercises: [],
  filteredExercises: [],
  currentPageExercises: [],
  exercises: [],
  count: 0,
  loading: false,
  error: "",
};

export const fetchExercises = createAsyncThunk(
  "exercise/fetchExercises",
  async (data) => {
    const response = await axios.get(`http://localhost:4000/exercises`);
    return {
      data: response.data.result,
      count: response.data.count,
      filter: data,
    };
  }
);

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
    goBackToFirstPage: (state) => {
      state.currentPageExercises = state.filteredExercises.slice(0, 25);
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
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
    builder.addCase(fetchExercises.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchExercises.fulfilled, (state, action) => {
      state.loading = false;

      const exercises = JSON.parse(JSON.stringify(action.payload.data)).map(
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
    });
    builder.addCase(fetchExercises.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default exerciseSlice.reducer;

export const selectAllExercises = (state) => state.exercise.allExercises;
export const selectFilteredExercises = (state) =>
  state.exercise.filteredExercises;
export const selectCurrentPageExercises = (state) =>
  state.exercise.currentPageExercises;
export const selectExerciseCount = (state) => state.exercise.count;

export const exerciseActions = exerciseSlice.actions;
