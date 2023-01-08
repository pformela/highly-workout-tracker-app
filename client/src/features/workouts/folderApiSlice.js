import { apiSlice } from "../../app/api/apiSlice";
import { folderActions } from "./folderSlice";

export const folderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTemplateFolders: builder.mutation({
      query: (parameters) => ({
        url: "/templates/getFolders",
        method: "POST",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(folderActions.setFolders(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    createTemplateFolder: builder.mutation({
      query: (parameters) => ({
        url: "/templates",
        method: "POST",
        body: { ...parameters },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(folderActions.addFolder(data));
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
} = folderApiSlice;
