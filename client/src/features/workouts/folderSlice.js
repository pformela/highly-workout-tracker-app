import { createSlice } from "@reduxjs/toolkit";

const initialFolderState = {
  folders: [],
  loading: false,
  error: "",
};

const folderSlice = createSlice({
  name: "folder",
  initialState: initialFolderState,
  reducers: {
    setFolders(state, action) {
      state.folders = action.payload;
    },
    addFolder(state, action) {
      state.folders.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("folderApi/getTemplateFolders/pending", (state, action) => {
        state.loading = true;
      })
      .addCase("folderApi/getTemplateFolders/fulfilled", (state, action) => {
        state.loading = false;
      })
      .addCase("folderApi/getTemplateFolders/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase("folderApi/createTemplateFolder/pending", (state, action) => {
        state.loading = true;
      })
      .addCase("folderApi/createTemplateFolder/fulfilled", (state, action) => {
        state.loading = false;
      })
      .addCase("folderApi/createTemplateFolder/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectFolders = (state) => state.folder.folders;

export const folderActions = folderSlice.actions;

export default folderSlice.reducer;
