import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialExerciseState = {
  exercises: [],
  count: 0,
  loading: false,
  error: "",
  filter: {},
};

export const fetchExercises = createAsyncThunk(
  "exercise/fetchExercises",
  async (data) => {
    const response = await axios.get(
      `http://localhost:4000/api/getExercises?name=${data.name}&type=${data.type}&muscle=${data.muscle}&difficulty=${data.difficulty}&offset=${data.offset}`,
      {
        headers: {
          "x-api-key": "1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b",
        },
      }
    );
    return {
      data: response.data.result,
      count: response.data.count,
      filter: data,
    };
  }
);

const exerciseSlice = createSlice({
  name: "exercise",
  initialState: initialExerciseState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchExercises.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchExercises.fulfilled, (state, action) => {
      state.loading = false;
      state.exercises = action.payload.data;
      state.count = action.payload.count;
      state.filter = action.payload.filter;
    });
    builder.addCase(fetchExercises.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default exerciseSlice.reducer;

export const exerciseActions = exerciseSlice.actions;
