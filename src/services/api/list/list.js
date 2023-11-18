// import { createEntityAdapter } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const usersAdapter = createEntityAdapter();
const usersInitialState = usersAdapter.getInitialState();

export const listSlice = judicialAppApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `list/users`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return usersAdapter.setAll(usersInitialState, responseData.data);
      },
    }),

    updateUser: builder.mutation({
      query: (user) => ({
        url: `list/user`,
        method: "POST",
        body: user,
        credentials: "include",
      }),
      // transformResponse: (responseData) => {
      //   return usersAdapter.setAll(usersInitialState, responseData.data);
      // },
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUsersQuery, useUpdateUserMutation } = listSlice;

// users Selector
export const selectUsersResult = judicialAppApi.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data,
);

export const {
  selectEntities: selectAllUsersEntities,
  selectAll: selectAllUsers,
  selectIds: selectUsersIds,
  selectById: selectUsersById,
} = usersAdapter.getSelectors((state) => {
  return selectUsersData(state) ?? usersInitialState;
});
