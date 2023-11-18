import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const soldiersAdapter = createEntityAdapter();
const soldiersInitialState = soldiersAdapter.getInitialState();

const soldierAdapter = createEntityAdapter();
const soldierInitialState = soldierAdapter.getInitialState();

export const garrisonAppApi = createApi({
  reducerPath: "garrisonAppApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://172.20.8.14:8585/garrison/api/",
    baseUrl: `${process.env.REACT_APP_API_BASE_JUDICIAL_URL}`,
  }),
  refetchOnMountOrArgChange: 1,
  endpoints: (builder) => ({
    getSoldiers: builder.query({
      query: (soldier) => ({
        url: `soldiers.php`,
        method: "GET",
      }),
      transformResponse: (responseData) => {
        return soldiersAdapter.setAll(soldiersInitialState, responseData.data);
      },
    }),
    getSoldier: builder.mutation({
      query: (soldier) => ({
        url: `soldier.php?code=${soldier.code}`,
        method: "GET",
        // body: soldier,
        // credentials: "include",
      }),
      transformResponse: (responseData) => {
        return soldierAdapter.setAll(soldierInitialState, responseData.data);
      },
    }),
  }),
});

export const { useGetSoldiersQuery, useGetSoldierMutation } = garrisonAppApi;

// Soldiers Selector
export const selectsoldiersResult =
  garrisonAppApi.endpoints.getSoldiers.select();

const selectSoldiersData = createSelector(
  selectsoldiersResult,
  (soldiersResult) => soldiersResult.data,
);

export const {
  selectEntities: selectAllSoldiersEnts,
  selectAll: selectAllSoldiersData,
  selectIds: selectSoldiersIds,
  selectById: selectSoldiersById,
} = soldierAdapter.getSelectors((state) => {
  return selectSoldiersData(state) ?? soldierInitialState;
});

// Soldier Selector
export const selectsoldierResult = garrisonAppApi.endpoints.getSoldier.select();

const selectSoldierData = createSelector(
  selectsoldierResult,
  (soldierResult) => soldierResult.data,
);

export const {
  selectEntities: selectAllSoldiersEntities,
  selectAll: selectAllSoldiers,
  selectIds: selectSoldierIds,
  selectById: selectSoldierById,
} = soldierAdapter.getSelectors((state) => {
  return selectSoldierData(state) ?? soldierInitialState;
});
