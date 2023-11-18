import { createSelector } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";

export const getUserAuthApiSlice = judicialAppApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserAuth: builder.query({
      query: () => ({
        url: `pages/getusercredentials`,
        method: `GET`,
        credentials: "include",
      }),
    }),
  }),
});
// selectors
export const selectUserResult =
  getUserAuthApiSlice.endpoints.getUserAuth.select();
const user = [];
export const selectUser = createSelector(
  selectUserResult,
  (userResult) => userResult?.data ?? user,
);

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserAuthQuery } = getUserAuthApiSlice;
