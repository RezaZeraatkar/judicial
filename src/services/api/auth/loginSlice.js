import { judicialAppApi } from "../judicialAppApi";

export const loginApiSlice = judicialAppApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `auth/login`,
        method: `POST`,
        body: data,
        credentials: "include",
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginMutation } = loginApiSlice;
