import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";

const remarksAdapter = createEntityAdapter({
  selectId: (remark) => remark.remark_id,
});
const initialState = remarksAdapter.getInitialState();

const citationsAdapter = createEntityAdapter();
const citationsInitialState = citationsAdapter.getInitialState();

export const remarksSliceApi = judicialAppApi.injectEndpoints({
  tagTypes: ["remark", "remark_types"],
  endpoints: (builder) => ({
    getRemarkWrongdoings: builder.query({
      query: () => ({
        url: `remarks/remark-wrongdoings`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getRemarkDisciplinaryCitations: builder.query({
      query: () => ({
        url: `remarks/remark-disciplinary-citations`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return citationsAdapter.setAll(
          citationsInitialState,
          responseData.data,
        );
      },
    }),

    addRemark: builder.mutation({
      query: (remarks) => ({
        url: `remarks/add-remarks`,
        method: "POST",
        body: remarks,
        credentials: "include",
      }),
      invalidatesTags: ["remark"],
    }),

    editRemark: builder.mutation({
      query: (remarks) => ({
        url: `remarks/edit-remark`,
        method: "PATCH",
        body: remarks,
        credentials: "include",
      }),
      invalidatesTags: ["remark"],
    }),

    findRemarks: builder.query({
      query: ({ page, pageSize, filterModel, sortModel }) => ({
        url: `remarks/remarks?page=${page}&pageSize=${pageSize}`,
        method: "POST",
        body: { filterModel, sortModel },
        credentials: "include",
      }),
      providesTags: ["remark"],
    }),

    updateRemarkStatus: builder.mutation({
      query: (remarkStatus) => ({
        url: `remarks/update-remark-status`,
        method: "PUT",
        body: remarkStatus,
        credentials: "include",
      }),
      invalidatesTags: ["remark"],
    }),

    deleteRemark: builder.mutation({
      query: (remarkId) => ({
        url: `remarks/delete-remark/${remarkId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["remark"],
    }),

    findRemark: builder.mutation({
      query: (remarkId) => ({
        url: `remarks/get-remark/${remarkId}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return remarksAdapter.setAll(initialState, responseData.data);
      },
    }),

    getRemarksTypes: builder.query({
      query: () => ({
        url: `remarks/remarks-types`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["remark_types"],
    }),

    addRemarkTypes: builder.mutation({
      query: (remarkType) => ({
        url: `remarks/add-remarks-type`,
        method: "POST",
        body: remarkType,
        credentials: "include",
      }),
      invalidatesTags: ["remark_types"],
    }),

    updateRemarkType: builder.mutation({
      query: (remarkType) => ({
        url: `remarks/edit-remarks-type`,
        method: "PUT",
        body: remarkType,
        credentials: "include",
      }),
      invalidatesTags: ["remark_types"],
    }),

    deleteRemarkType: builder.mutation({
      query: (id) => ({
        url: `remarks/delete-remarks-type/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["remark_types"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRemarksTypesQuery,
  useGetRemarkWrongdoingsQuery,
  useGetRemarkDisciplinaryCitationsQuery,
  useAddRemarkMutation,
  useFindRemarksQuery,
  useUpdateRemarkStatusMutation,
  useDeleteRemarkMutation,
  useFindRemarkMutation,
  useEditRemarkMutation,
  useAddRemarkTypesMutation,
  useUpdateRemarkTypeMutation,
  useDeleteRemarkTypeMutation,
  usePrefetch,
} = remarksSliceApi;

// select remark data in findremark cache
export const selectRemarkResult = remarksSliceApi.endpoints.findRemark.select();

const selectRemarkData = createSelector(
  selectRemarkResult,
  (remarkResult) => remarkResult.data,
);

export const {
  selectEntities: selectRemarkEntities,
  // selectAll: selectAllremarks,
  selectIds: selectRemarkIds,
  selectById: selectRemarkById,
} = remarksAdapter.getSelectors((state) => {
  return selectRemarkData(state) ?? initialState;
});

// Disciplinary Citations Selector
export const selectDisciplinaryCitationsResult =
  remarksSliceApi.endpoints.getRemarkDisciplinaryCitations.select();

const selectDisciplinaryCitationsData = createSelector(
  selectDisciplinaryCitationsResult,
  (notoriousResult) => notoriousResult.data,
);

export const {
  selectEntities: selectAllDisciplinaryCitationsEntities,
  selectAll: selectAllDisciplinaryCitations,
  selectIds: selectDisciplinaryCitationsIds,
  selectById: selectDisciplinaryCitationsById,
} = citationsAdapter.getSelectors((state) => {
  return selectDisciplinaryCitationsData(state) ?? citationsInitialState;
});
