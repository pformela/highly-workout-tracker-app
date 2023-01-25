import { apiSlice } from "../../app/api/apiSlice";
import { workoutActions } from "./workoutSlice";

export const workoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addWorkoutToHistory: builder.mutation({
      query: (parameters) => ({
        url: "/workouts",
        method: "POST",
        body: { ...parameters },
      }),
      invalidatesTags: ["WorkoutTemplates"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getWorkouts: builder.mutation({
      query: (parameters) => ({
        url: "/workouts/history",
        method: "POST",
        body: { ...parameters },
      }),
      invalidatesTags: ["WorkoutTemplates"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workoutActions.setWorkoutHistory(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getSingleWorkout: builder.mutation({
      query: (parameters) => ({
        url: "/workouts/single",
        method: "POST",
        body: { ...parameters },
      }),
      invalidatesTags: ["WorkoutTemplates"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workoutActions.setCurrentSharedWorkout(data));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    deleteWorkout: builder.mutation({
      query: (parameters) => ({
        url: "/workouts",
        method: "DELETE",
        body: { ...parameters },
      }),
      invalidatesTags: ["WorkoutTemplates"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(workoutActions.deleteWorkout(data.workoutId));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    updateWorkout: builder.mutation({
      query: (parameters) => ({
        url: "/workouts",
        method: "PUT",
        body: { ...parameters },
      }),
      invalidatesTags: ["WorkoutTemplates"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useAddWorkoutToHistoryMutation,
  useGetWorkoutsMutation,
  useUpdateWorkoutMutation,
  useDeleteWorkoutMutation,
  useGetSingleWorkoutMutation,
} = workoutApiSlice;
