import { apiSlice } from "../../app/api/apiSlice";
import { logout, setCredentials } from "./authSlice";
import { userActions } from "../user/userSlice";
import { folderActions } from "../workouts/folders/folderSlice";
import { workoutActions } from "../workouts/workoutSlice";
import { exerciseActions } from "../exercises/exercisesSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { token, username, email, userId } = data;
          dispatch(setCredentials({ token }));
          dispatch(userActions.setUser({ username, userId, email }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { username, userId, email } = data;
          dispatch(userActions.setUser({ username, userId, email }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(logout());
          // dispatch(folderActions.revertAll());
          // dispatch(workoutActions.revertAll());
          // dispatch(exerciseActions.revertAll());
          // dispatch(userActions.revertAll());
          // dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = await queryFulfilled;
          const { token, username, email, userId } = response.data;
          dispatch(setCredentials({ token }));
          dispatch(userActions.setUser({ username, email, userId }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendLogoutMutation,
  useRefreshMutation,
} = authApiSlice;
