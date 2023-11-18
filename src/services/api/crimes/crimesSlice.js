import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";

const crimesAdapter = createEntityAdapter({
  selectId: (crime) => crime.crimes_id,
});
const initialState = crimesAdapter.getInitialState();

export const crimesSliceApi = judicialAppApi.injectEndpoints({
  tagTypes: ["crime", "hoghoughi", "judicialAuditRef"],
  endpoints: (builder) => ({
    getCrimesTypes: builder.query({
      query: () => ({
        url: `crimes/crimes-types`,
        method: "GET",
        credentials: "include",
      }),
    }),

    addCrime: builder.mutation({
      query: (crime) => ({
        url: `crimes/add-crime`,
        method: "POST",
        body: crime,
        credentials: "include",
      }),
      invalidatesTags: ["crime"],
    }),

    editCrime: builder.mutation({
      query: (crime) => ({
        url: `crimes/edit_crime`,
        method: "PATCH",
        body: crime,
        credentials: "include",
      }),
      invalidatesTags: ["crime"],
    }),

    findCrimes: builder.query({
      query: ({ page, pageSize, filterModel, sortModel }) => ({
        url: `crimes/crimes?page=${page}&pageSize=${pageSize}`,
        method: "POST",
        body: { filterModel, sortModel },
        credentials: "include",
      }),
      providesTags: ["crime"],
    }),

    updateCrimeStatus: builder.mutation({
      query: (crimeStatus) => ({
        url: `crimes/update_crime_status`,
        method: "PUT",
        body: crimeStatus,
        credentials: "include",
      }),
      invalidatesTags: ["crime"],
    }),

    deleteCrime: builder.mutation({
      query: (crimeId) => ({
        url: `crimes/delete_crime/${crimeId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["crime"],
    }),

    findCrime: builder.mutation({
      query: (crimeId) => ({
        url: `crimes/getcrime/${crimeId}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return crimesAdapter.setAll(initialState, responseData.data);
      },
    }),

    getHoghughiOrganizations: builder.query({
      query: () => ({
        url: `crimes/hoghughi-organizations`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["hoghoughi"],
    }),

    addHoghoughi: builder.mutation({
      query: (hoghoughi) => ({
        url: `crimes/add-hoghoughi`,
        method: "POST",
        body: hoghoughi,
        credentials: "include",
      }),
      invalidatesTags: ["hoghoughi"],
    }),

    updateHoghoughi: builder.mutation({
      query: (hoghoughi) => ({
        url: `crimes/edit-hoghoughi`,
        method: "PUT",
        body: hoghoughi,
        credentials: "include",
      }),
      invalidatesTags: ["hoghoughi"],
    }),

    deleteHoghoughi: builder.mutation({
      query: (id) => ({
        url: `crimes/delete-hoghoughi/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["hoghoughi"],
    }),

    getCrimesJudicialAuditReferee: builder.query({
      query: () => ({
        url: `crimes/crimes_judicial_audit_referee`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["judicialAuditRef"],
    }),

    addJudicialAuditRef: builder.mutation({
      query: (judicialAuditRef) => ({
        url: `crimes/add-judicial-auditRef`,
        method: "POST",
        body: judicialAuditRef,
        credentials: "include",
      }),
      invalidatesTags: ["judicialAuditRef"],
    }),

    updateJudicialAuditRef: builder.mutation({
      query: (judicialAuditRef) => ({
        url: `crimes/edit-judicial-audit-ref`,
        method: "PUT",
        body: judicialAuditRef,
        credentials: "include",
      }),
      invalidatesTags: ["judicialAuditRef"],
    }),

    deleteJudicialAuditRef: builder.mutation({
      query: (id) => ({
        url: `crimes/delete-judicial-auditRef/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["judicialAuditRef"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCrimesTypesQuery,
  useGetCrimesJudicialAuditRefereeQuery,
  useGetHoghughiOrganizationsQuery,
  useAddCrimeMutation,
  useFindCrimesQuery,
  useUpdateCrimeStatusMutation,
  useDeleteCrimeMutation,
  useFindCrimeMutation,
  useEditCrimeMutation,
  useAddHoghoughiMutation,
  useUpdateHoghoughiMutation,
  useDeleteHoghoughiMutation,
  useAddJudicialAuditRefMutation,
  useUpdateJudicialAuditRefMutation,
  useDeleteJudicialAuditRefMutation,
  usePrefetch,
} = crimesSliceApi;

// select Crime data in findCrime cache
export const selectCrimesResult = crimesSliceApi.endpoints.findCrimes.select();

const selectCrimesData = createSelector(
  selectCrimesResult,
  (crimeResult) => crimeResult.data,
);

export const {
  selectEntities: selectAllCrimesEntities,
  selectAll: selectAllCrimes,
  selectIds: selectCrimesIds,
  selectById: selectCrimesById,
} = crimesAdapter.getSelectors((state) => {
  return selectCrimesData(state) ?? initialState;
});
