import { judicialAppApi } from "../judicialAppApi";

export const remarksSliceApi = judicialAppApi.injectEndpoints({
  tagTypes: ["remark"],
  endpoints: (builder) => ({
    getTahsilat: builder.query({
      query: () => ({
        url: `selectors/tahsilat`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getJensiat: builder.query({
      query: () => ({
        url: `selectors/jensiat`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getOzviatType: builder.query({
      query: () => ({
        url: `selectors/ozviat`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getVahed: builder.query({
      query: () => ({
        url: `selectors/vahed`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getRank: builder.query({
      query: () => ({
        url: `selectors/rank`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getJaygah: builder.query({
      query: () => ({
        url: `selectors/jaygah`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getRaste: builder.query({
      query: () => ({
        url: `selectors/raste`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getVaziatKhedmat: builder.query({
      query: () => ({
        url: `selectors/vaziat-khedmat`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getVaziatJesmani: builder.query({
      query: () => ({
        url: `selectors/jesmani`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getVaziatRavani: builder.query({
      query: () => ({
        url: `selectors/ravani`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getMarigStatus: builder.query({
      query: () => ({
        url: `selectors/marig`,
        method: "GET",
        credentials: "include",
      }),
    }),

    employeeForm: builder.query({
      query: () => ({
        url: `selectors/employee-form`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTahsilatQuery,
  useGetJensiatQuery,
  useGetOzviatTypeQuery,
  useGetVahedQuery,
  useGetRankQuery,
  useGetJaygahQuery,
  useGetRasteQuery,
  useGetVaziatKhedmatQuery,
  useGetVaziatJesmaniQuery,
  useGetVaziatRavaniQuery,
  useGetMarigStatusQuery,
  useEmployeeFormQuery,
} = remarksSliceApi;
