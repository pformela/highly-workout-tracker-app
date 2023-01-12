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
  }),
});

export const { useCreateTemplateMutation } = templateApiSlice;