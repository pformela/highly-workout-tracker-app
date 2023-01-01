import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5, // for development purposes
      transformResponse: (responseData) => {
        // mapping user_id for mongodb, check for neo4j?
        const loadedUsers = responseData.map((user) => {
          user.user_id = user._user_id;
          return user;
        });
        return usersAdapter.setAll(initialState, loadedUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetUserQuery } = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (userResult) => userResult.data // normalized style object
);

export const {
  selectAll: selectAllUsers, // check later if needed
  selectById: selectUserById,
  selectIds: selectUserIds, // also check lates if needed
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
