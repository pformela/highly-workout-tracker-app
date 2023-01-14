import { createSlice } from "@reduxjs/toolkit";

const initialFolderState = {
  folders: [],
  currentTemplate: {},
  loading: false,
  error: "",
};

const folderSlice = createSlice({
  name: "folder",
  initialState: initialFolderState,
  reducers: {
    getFolder(state, action) {
      return state.folders.filter(
        (folder) => folder.folderId === action.payload
      )[0];
    },
    addFolder(state, action) {
      const folder = action.payload;
      state.folders.unshift({ ...folder, isEmpty: true, templates: {} });
    },
    deleteFolder(state, action) {
      const folderIndex = state.folders.findIndex(
        (folder) => folder.folderId === action.payload
      );
      state.folders.splice(folderIndex, 1);
    },
    updateFolder(state, action) {
      const folderIndex = state.folders.findIndex(
        (folder) => folder.folderId === action.payload.folderId
      );
      state.folders[folderIndex].name = action.payload.newFolderName;
    },
    setFolders(state, action) {
      state.folders = action.payload.map((folder) => {
        return {
          ...folder,
          isEmpty: true,
          templates: {},
        };
      });
    },
    setTemplates(state, action) {
      const folderIndex = state.folders.findIndex(
        (folder) => folder.folderId === action.payload.folderId
      );

      if (Object.keys(action.payload.templates).length === 0) {
        state.folders[folderIndex].isEmpty = true;
      } else {
        state.folders[folderIndex].isEmpty = false;
      }

      console.log("templates");
      console.log(action.payload.templates);

      state.folders[folderIndex].templates = action.payload.templates;
    },
    deleteTemplate(state, action) {
      const folderIndex = state.folders.findIndex(
        (folder) => folder.folderId === action.payload.folderId
      );
      state.currentTemplate =
        state.folders[folderIndex].templates[action.payload.templateId];
      delete state.folders[folderIndex].templates[action.payload.templateId];
      if (Object.keys(state.folders[folderIndex].templates).length === 0) {
        state.folders[folderIndex].isEmpty = true;
      }
    },
    addTemplate(state, action) {
      const folderIndex = state.folders.findIndex(
        (folder) => folder.folderId === action.payload.folderId
      );
      state.folders[folderIndex].templates[action.payload.templateId] =
        state.currentTemplate;
      state.folders[folderIndex].isEmpty = false;
      state.currentTemplate = {};
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
      })
      .addCase("folderApi/getFolderTemplates/pending", (state, action) => {
        state.loading = true;
      })
      .addCase("folderApi/getFolderTemplates/fulfilled", (state, action) => {
        state.loading = false;
      })
      .addCase("folderApi/getFolderTemplates/rejected", (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectFolders = (state) => state.folder.folders;

export const folderActions = folderSlice.actions;

export default folderSlice.reducer;
