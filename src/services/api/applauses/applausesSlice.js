import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";

const applauseAdapter = createEntityAdapter({
  selectId: (applause) => applause.id,
});
const initialState = applauseAdapter.getInitialState();

const notoriousServicesAdapter = createEntityAdapter();
const initialNotoriousServicesState =
  notoriousServicesAdapter.getInitialState();

const citationsAdapter = createEntityAdapter();
const citationsInitialState = citationsAdapter.getInitialState();

export const applausesSliceApi = judicialAppApi.injectEndpoints({
  tagTypes: ["applause", "applauseType", "notoriousServices"],
  endpoints: (builder) => ({
    createApplauseType: builder.mutation({
      query: (applauseType) => ({
        url: `applauses/create-applause-types`,
        method: "POST",
        body: applauseType,
        credentials: "include",
      }),
      invalidatesTags: ["applauseType"],
      transformResponse: (responseData) => {
        return {
          rows: applauseAdapter.setAll(initialState, responseData.data.rows),
          rowCount: responseData.data.rowCount,
        };
      },
    }),

    getApplausesTypes: builder.query({
      query: () => ({
        url: `applauses/applause-types`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["applauseType"],
    }),

    updateApplauseType: builder.mutation({
      query: (applauseType) => ({
        url: `applauses/update-applause-types`,
        method: "PUT",
        body: applauseType,
        credentials: "include",
      }),
      invalidatesTags: ["applauseType"],
    }),

    deleteApplausesTypes: builder.mutation({
      query: (id) => ({
        url: `applauses/delete-applause-types/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["applauseType"],
    }),

    getNotoriousServices: builder.query({
      query: () => ({
        url: `applauses/notorious-services`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return notoriousServicesAdapter.setAll(
          initialNotoriousServicesState,
          responseData.data,
        );
      },
      providesTags: ["notoriousServices"],
    }),

    getDisciplinaryCitations: builder.query({
      query: () => ({
        url: `applauses/disciplinary-citations`,
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

    addApplauses: builder.mutation({
      query: (applauses) => ({
        url: `applauses/add-applauses`,
        method: "POST",
        body: applauses,
        credentials: "include",
      }),
      invalidatesTags: ["applause"],
    }),

    editApplause: builder.mutation({
      query: (applauses) => ({
        url: `applauses/edit_applause`,
        method: "PATCH",
        body: applauses,
        credentials: "include",
      }),
      invalidatesTags: ["applause"],
    }),

    findApplauses: builder.query({
      query: ({ page, pageSize, filterModel, sortModel }) => ({
        url: `applauses/applauses?page=${page}&pageSize=${pageSize}`,
        method: "POST",
        body: { filterModel, sortModel },
        credentials: "include",
      }),
      providesTags: ["applause"],
    }),

    updateApplauseStatus: builder.mutation({
      query: (updateApplauseStatus) => ({
        url: `applauses/update_applause_status`,
        method: "PUT",
        body: updateApplauseStatus,
        credentials: "include",
      }),
      invalidatesTags: ["applause"],
    }),

    deleteApplause: builder.mutation({
      query: (applauseId) => ({
        url: `applauses/delete_applause/${applauseId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["applause"],
    }),

    findApplause: builder.mutation({
      query: (applauseId) => ({
        url: `applauses/getapplause/${applauseId}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return applauseAdapter.setAll(initialState, responseData.data);
      },
    }),

    addNotoriousService: builder.mutation({
      query: (notoriousService) => ({
        url: `applauses/notorious-services`,
        method: "POST",
        body: notoriousService,
        credentials: "include",
      }),
      invalidatesTags: ["notoriousServices"],
      // transformResponse: (responseData) => {
      //   return usersAdapter.setAll(usersInitialState, responseData.data);
      // },
    }),

    editNotoriousService: builder.mutation({
      query: (notoriousService) => ({
        url: `applauses/notorious-services`,
        method: "PUT",
        body: notoriousService,
        credentials: "include",
      }),
      invalidatesTags: ["notoriousServices"],
      // transformResponse: (responseData) => {
      //   return usersAdapter.setAll(usersInitialState, responseData.data);
      // },
    }),

    deleteNotoriousService: builder.mutation({
      query: (id) => ({
        url: `applauses/notorious-services`,
        method: "DELETE",
        body: { id },
        credentials: "include",
      }),
      invalidatesTags: ["notoriousServices"],
      // transformResponse: (responseData) => {
      //   return usersAdapter.setAll(usersInitialState, responseData.data);
      // },
    }),

    printApplause: builder.mutation({
      query: (applauseId) => ({
        url: `applauses/printapplause/${applauseId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateApplauseTypeMutation,
  useGetApplausesTypesQuery,
  useDeleteApplausesTypesMutation,
  useGetNotoriousServicesQuery,
  useGetDisciplinaryCitationsQuery,
  useAddApplausesMutation,
  useFindApplausesQuery,
  useUpdateApplauseStatusMutation,
  useDeleteApplauseMutation,
  useFindApplauseMutation,
  useEditApplauseMutation,
  usePrintApplauseMutation,
  useAddNotoriousServiceMutation,
  useEditNotoriousServiceMutation,
  useDeleteNotoriousServiceMutation,
  useUpdateApplauseTypeMutation,
  usePrefetch,
} = applausesSliceApi;

// select applause data in findApplause cache
export const selectApplauseResult =
  applausesSliceApi.endpoints.findApplause.select();

const selectApplauseData = createSelector(
  selectApplauseResult,
  (applauseResult) => applauseResult.data,
);

export const {
  selectEntities: selectApplauseEntities,
  // selectAll: selectAllApplauses,
  // selectIds: selectApplauseId,
  selectById: selectApplauseById,
} = applauseAdapter.getSelectors((state) => {
  return selectApplauseData(state) ?? initialState;
});

// Disciplinary Citations Selector
export const selectDisciplinaryCitationsResult =
  applausesSliceApi.endpoints.getDisciplinaryCitations.select();

const selectDisciplinaryCitationsData = createSelector(
  selectDisciplinaryCitationsResult,
  (citeResult) => citeResult.data,
);

export const {
  selectEntities: selectAllDisciplinaryCitationsEntities,
  selectAll: selectAllDisciplinaryCitations,
  selectIds: selectDisciplinaryCitationsIds,
  selectById: selectDisciplinaryCitationsById,
} = citationsAdapter.getSelectors((state) => {
  return selectDisciplinaryCitationsData(state) ?? citationsInitialState;
});

// Notorious Services Selector
export const selectNotoriousServicesResult =
  applausesSliceApi.endpoints.getNotoriousServices.select();

const selectNotoriousServicesData = createSelector(
  selectNotoriousServicesResult,
  (notoriousResult) => notoriousResult.data,
);

export const {
  selectEntities: selectAllNotoriousServicesEntities,
  selectAll: selectAllNotoriousServices,
  selectIds: selectNotoriousServicesIds,
  selectById: selectNotoriousServicesById,
} = citationsAdapter.getSelectors((state) => {
  return selectNotoriousServicesData(state) ?? citationsInitialState;
});
