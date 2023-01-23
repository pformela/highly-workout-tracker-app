import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  template: null,
};

export const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setTemplate: (state, action) => {
      state.template = action.payload;
    },
    clearTemplate: (state) => {
      state.template = null;
    },
  },
});

export const templateActions = templateSlice.actions;

export const selectTemplate = (state) => state.template.template;

export default templateSlice.reducer;
