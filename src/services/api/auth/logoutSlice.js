import { judicialAppApi } from "../judicialAppApi";

export const logoutApiSlice = judicialAppApi.injectEndpoints({
  endpoints: (builder) => ({
    logout: builder.mutation({
      query: () => ({
        url: `auth/logout`,
        method: `POST`,
        body: {},
        credentials: "include",
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLogoutMutation } = logoutApiSlice;
