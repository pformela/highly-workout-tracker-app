import { apiSlice } from "../../../app/api/apiSlice";
import { folderActions } from "../folders/folderSlice";

export const templateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTemplate: builder.mutation({
      query: (parameters) => ({
        url: "/templates",
        method: "POST",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = queryFulfilled;
          console.log(data);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateTemplate: builder.mutation({
      query: (parameters) => ({
        url: "/templates",
        method: "PUT",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const {
            oldFolderId,
            oldFolderName,
            newFolderId,
            newFolderName,
            templateId,
          } = data;
          if (oldFolderId !== newFolderId) {
            dispatch(
              folderActions.deleteTemplate({
                folderId: oldFolderId,
                templateId,
              })
            );
            dispatch(
              folderActions.addTemplate({
                folderId: newFolderId,
                templateId,
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useCreateTemplateMutation, useUpdateTemplateMutation } =
  templateApiSlice;
