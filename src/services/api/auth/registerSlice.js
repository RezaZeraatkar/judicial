import { judicialAppApi } from "../judicialAppApi";

export const registerApiSlice = judicialAppApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `auth/register`,
        method: `POST`,
        body: data,
        credentials: "include",
      }),
    }),
    registerUpdate: builder.mutation({
      query: (data) => ({
        url: `auth/edit-register`,
        method: `PATCH`,
        body: data,
        credentials: "include",
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useRegisterMutation, useRegisterUpdateMutation } =
  registerApiSlice;
