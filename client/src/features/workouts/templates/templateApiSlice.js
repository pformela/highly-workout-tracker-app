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
    deleteTemplate: builder.mutation({
      query: (parameters) => ({
        url: "/templates",
        method: "DELETE",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { folderId, templateId } = data;
          dispatch(
            folderActions.deleteTemplate({
              folderId,
              templateId,
            })
          );
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
          const { oldFolderId, newFolderId, templateId } = data;
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

export const {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
} = templateApiSlice;
