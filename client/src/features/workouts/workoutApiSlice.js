import { apiSlice } from "../../app/api/apiSlice";

export const workoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkoutTemplates: builder.query({
      query: () => "/workout-templates",
      providesTags: ["WorkoutTemplates"],
    }),
    getWorkoutTemplate: builder.query({
      query: (id) => `/workout-templates/${id}`,
      providesTags: (result, error, id) => [
        { type: "WorkoutTemplate", id },
        ...result?.exercises.map((exercise) => ({
          type: "Exercise",
          id: exercise._id,
        })),
      ],
    }),
    createWorkoutTemplate: builder.mutation({
      query: (body) => ({
        url: "/workout-templates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WorkoutTemplates"],
    }),
    updateWorkoutTemplate: builder.mutation({
      query: (body) => ({
        url: `/workout-templates/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, body) => [
        { type: "WorkoutTemplate", id: body._id },
        ...result?.exercises.map((exercise) => ({
          type: "Exercise",
          id: exercise._id,
        })),
      ],
    }),
  }),
});

export const {
  useGetWorkoutTemplatesQuery,
  useGetWorkoutTemplateQuery,
  useCreateWorkoutTemplateMutation,
  useUpdateWorkoutTemplateMutation,
} = workoutApiSlice;
