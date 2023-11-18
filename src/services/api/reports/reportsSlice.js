import { judicialAppApi } from "../judicialAppApi";

export const reportsSliceApi = judicialAppApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.mutation({
      query: (vals) => ({
        url: `reports/report`,
        method: "POST",
        body: vals,
        credentials: "include",
      }),
    }),
    getReportFilters: builder.query({
      query: () => ({
        url: `reports/report/report-filters`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getPersonalReport: builder.mutation({
      query: (personnel) => ({
        url: `reports/personnel-report`,
        method: "POST",
        body: personnel,
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetReportMutation,
  useGetReportsMutation,
  useGetReportFiltersQuery,
  useGetPersonalReportMutation,
} = reportsSliceApi;
