import { apiSlice } from "../../app/api/apiSlice";

export const workoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWorkoutToHistory: builder.mutation({
      query: (body) => ({
        url: "/workout-templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WorkoutTemplates"],
    }),
  }),
});

export const {
  useGetWorkoutTemplatesQuery,
  useGetWorkoutTemplateQuery,
  useCreateWorkoutTemplateMutation,
  useUpdateWorkoutTemplateMutation,
} = workoutApiSlice;
