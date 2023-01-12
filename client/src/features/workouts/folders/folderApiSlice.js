import { apiSlice } from "../../../app/api/apiSlice";
import { folderActions } from "./folderSlice";

export const folderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTemplateFolders: builder.mutation({
      query: (parameters) => ({
        url: "/templates/folders",
        method: "POST",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(folderActions.setFolders(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    createTemplateFolder: builder.mutation({
      query: (parameters) => ({
        url: "/templates/folder",
        method: "POST",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteTemplateFolder: builder.mutation({
      query: (parameters) => ({
        url: "/templates/folder",
        method: "DELETE",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { folderId } = data;
          dispatch(folderActions.deleteFolder(folderId));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateTemplateFolder: builder.mutation({
      query: (parameters) => ({
        url: "/templates/folder",
        method: "PUT",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { folderId, newFolderName } = data;
          dispatch(folderActions.updateFolder({ folderId, newFolderName }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getFolderTemplates: builder.mutation({
      query: (parameters) => ({
        url: "/templates/folders/templates",
        method: "POST",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(folderActions.setTemplates(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetTemplateFoldersMutation,
  useCreateTemplateFolderMutation,
  useDeleteTemplateFolderMutation,
  useUpdateTemplateFolderMutation,
  useGetFolderTemplatesMutation,
} = folderApiSlice;
