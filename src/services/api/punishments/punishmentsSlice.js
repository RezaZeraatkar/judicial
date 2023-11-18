import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";

const punishmentsAdapter = createEntityAdapter({
  selectId: (punishment) => punishment.id,
});
const initialState = punishmentsAdapter.getInitialState();

const citationsAdapter = createEntityAdapter();
const citationsInitialState = citationsAdapter.getInitialState();

export const punishmentsSliceApi = judicialAppApi.injectEndpoints({
  tagTypes: ["punishment", "punishmentWrongDoings", "punishmentType"],
  endpoints: (builder) => ({
    getPunishmentsTypes: builder.query({
      query: () => ({
        url: `punishments/punishments-types`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["punishmentType"],
    }),

    getPunishmentWrongdoings: builder.query({
      query: () => ({
        url: `punishments/punishment-wrongdoings`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["punishmentWrongDoings"],
    }),

    getPunishmentDisciplinaryCitations: builder.query({
      query: () => ({
        url: `punishments/punishment-disciplinary-citations`,
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

    addPunishment: builder.mutation({
      query: (punishments) => ({
        url: `punishments/add-punishments`,
        method: "POST",
        body: punishments,
        credentials: "include",
      }),
      invalidatesTags: ["punishment"],
    }),

    editPunishment: builder.mutation({
      query: (punishments) => ({
        url: `punishments/edit_punishment`,
        method: "PATCH",
        body: punishments,
        credentials: "include",
      }),
      invalidatesTags: ["punishment"],
    }),

    findPunishments: builder.query({
      query: ({ page, pageSize, filterModel, sortModel }) => ({
        url: `punishments/punishments?page=${page}&pageSize=${pageSize}`,
        method: "POST",
        body: { filterModel, sortModel },
        credentials: "include",
      }),
      providesTags: ["punishment"],
    }),

    updatePunishmentStatus: builder.mutation({
      query: (punishmentStatus) => ({
        url: `punishments/update_punishment_status`,
        method: "PUT",
        body: punishmentStatus,
        credentials: "include",
      }),
      invalidatesTags: ["punishment"],
    }),

    deletePunishment: builder.mutation({
      query: (punishmentId) => ({
        url: `punishments/delete_punishment/${punishmentId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["punishment"],
    }),

    findPunishment: builder.mutation({
      query: (punishmentId) => ({
        url: `punishments/getpunishment/${punishmentId}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return punishmentsAdapter.setAll(initialState, responseData.data);
      },
    }),

    addPunishmentWrongDoing: builder.mutation({
      query: (punishmentWrongDoing) => ({
        url: `punishments/add-punishment-wrongdoing`,
        method: "POST",
        body: punishmentWrongDoing,
        credentials: "include",
      }),
      invalidatesTags: ["punishmentWrongDoings"],
    }),

    deletePunishmentWrongDoing: builder.mutation({
      query: (id) => ({
        url: `punishments/delete-punishment-wrongdoing`,
        method: "DELETE",
        body: { id },
        credentials: "include",
      }),
      invalidatesTags: ["punishmentWrongDoings"],
    }),

    updatePunishmentWrongDoing: builder.mutation({
      query: (newRecord) => ({
        url: `punishments/update-punishment-wrongdoing`,
        method: "PUT",
        body: newRecord,
        credentials: "include",
      }),
      invalidatesTags: ["punishmentWrongDoings"],
    }),

    addPunishmentTypes: builder.mutation({
      query: (punishmentType) => ({
        url: `punishments/add-punishment-type`,
        method: "POST",
        body: punishmentType,
        credentials: "include",
      }),
      invalidatesTags: ["punishmentType"],
      // transformResponse: (responseData) => {
      //   return applausesAdapter.setAll(initialState, responseData.data);
      // },
    }),

    updatePunishmentType: builder.mutation({
      query: (punishmentType) => ({
        url: `punishments/update-punishment-type`,
        method: "PUT",
        body: punishmentType,
        credentials: "include",
      }),
      invalidatesTags: ["punishmentType"],
      // transformResponse: (responseData) => {
      //   return applausesAdapter.setAll(initialState, responseData.data);
      // },
    }),

    deletePunishmentType: builder.mutation({
      query: (id) => ({
        url: `punishments/delete-punishment-type`,
        method: "DELETE",
        body: { id },
        credentials: "include",
      }),
      invalidatesTags: ["punishmentType"],
      // transformResponse: (responseData) => {
      //   return applausesAdapter.setAll(initialState, responseData.data);
      // },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPunishmentsTypesQuery,
  useGetPunishmentWrongdoingsQuery,
  useGetPunishmentDisciplinaryCitationsQuery,
  useAddPunishmentMutation,
  useFindPunishmentsQuery,
  useUpdatePunishmentStatusMutation,
  useDeletePunishmentMutation,
  useFindPunishmentMutation,
  useEditPunishmentMutation,
  useAddPunishmentWrongDoingMutation,
  useDeletePunishmentWrongDoingMutation,
  useUpdatePunishmentWrongDoingMutation,
  useAddPunishmentTypesMutation,
  useDeletePunishmentTypeMutation,
  useUpdatePunishmentTypeMutation,
  usePrefetch,
} = punishmentsSliceApi;

// select punishment data in findpunishment cache
export const selectpunishmentResult =
  punishmentsSliceApi.endpoints.findPunishment.select();

const selectPunishmentData = createSelector(
  selectpunishmentResult,
  (punishmentResult) => punishmentResult.data,
);

export const {
  selectEntities: selectPunishmentEntities,
  // selectAll: selectAllpunishments,
  selectIds: selectPunishmentIds,
  selectById: selectPunishmentById,
} = punishmentsAdapter.getSelectors((state) => {
  return selectPunishmentData(state) ?? initialState;
});

// Disciplinary Citations Selector
export const selectDisciplinaryCitationsResult =
  punishmentsSliceApi.endpoints.getPunishmentDisciplinaryCitations.select();

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
