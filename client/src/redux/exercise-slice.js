import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialExerciseState = {
  exercises: [],
};

const exerciseSlice = createSlice({
  name: "exercise",
  initialState: initialExerciseState,
  reducers: {
    findExercises(state, action) {
      const result = axios
        .get(
          `http://localhost:4000/api/getExercises?name=${action.payload.name}&type=${action.payload.type}&muscle=${action.payload.muscle}&difficulty=${action.payload.difficulty}&offset=${action.payload.offset}`,
          {
            headers: {
              "x-api-key": "1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b1b",
            },
          }
        )
        .then((result) => {
          return result;
        })
        .catch((error) => {
          console.log(error);
        });

      state.exercises = result;
    },
  },
});

export default exerciseSlice.reducer;

export const exerciseActions = exerciseSlice.actions;
