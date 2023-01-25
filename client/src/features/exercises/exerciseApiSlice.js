import { apiSlice } from "../../app/api/apiSlice";
import { exerciseActions } from "./exercisesSlice";

export const exerciseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExercises: builder.mutation({
      query: (credentials) => ({
        url: "/exercises",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(exerciseActions.setExercises(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    createExercise: builder.mutation({
      query: (credentials) => ({
        url: "/exercises",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(exerciseActions.addExercise(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateExercise: builder.mutation({
      query: (credentials) => ({
        url: "/exercises",
        method: "PUT",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(exerciseActions.updateExercise(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteExercise: builder.mutation({
      query: (credentials) => ({
        url: "/exercises",
        method: "DELETE",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(exerciseActions.deleteExercise(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetExercisesMutation,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
  useDeleteExerciseMutation,
} = exerciseApiSlice;
