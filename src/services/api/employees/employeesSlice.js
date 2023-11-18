// import { createEntityAdapter } from "@reduxjs/toolkit";
import { judicialAppApi } from "../judicialAppApi";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";

const employeeAdapter = createEntityAdapter();
const employeeInitialState = employeeAdapter.getInitialState();

const employeesAdapter = createEntityAdapter();
const employeesInitialState = employeesAdapter.getInitialState();

export const employeesSlice = judicialAppApi.injectEndpoints({
  tagTypes: ["employees"],
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => ({
        url: `employees/employees`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return employeesAdapter.setAll(
          employeesInitialState,
          responseData.data,
        );
      },
      providesTags: ["employees"],
    }),

    addEmployee: builder.mutation({
      query: (employee) => ({
        url: `employees/add-employee`,
        method: "POST",
        body: employee,
        credentials: "include",
      }),
      invalidatesTags: ["employees"],
    }),

    editEmployee: builder.mutation({
      query: (employee) => ({
        url: `employees/edit-employee`,
        method: "PUT",
        body: employee,
        credentials: "include",
      }),
      invalidatesTags: ["employees"],
    }),

    updateEmployeeMasoliat: builder.mutation({
      query: (employee) => ({
        url: `employees/employee`,
        method: "PUT",
        body: employee,
        credentials: "include",
      }),
      // invalidatesTags: ["employees"],
    }),

    getEmployee: builder.mutation({
      query: (employee) => ({
        url: `employees/employee`,
        method: "POST",
        body: employee,
        credentials: "include",
      }),
      transformResponse: (responseData) => {
        return employeeAdapter.setAll(employeeInitialState, responseData.data);
      },
    }),

    checkEmployeePasdariCode: builder.mutation({
      query: (pasdari_code) => ({
        url: `employees/check-employee-pasdaricode/${pasdari_code}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    checkEmployeeParvandeCode: builder.mutation({
      query: (parvande_code) => ({
        url: `employees/check-employee-parvandecode/${parvande_code}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    checkEmployeeNationalityCode: builder.mutation({
      query: (nationality_code) => ({
        url: `employees/check-employee-nationalitycode/${nationality_code}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});
// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeMasoliatMutation,
  useAddEmployeeMutation,
  useEditEmployeeMutation,
  useCheckEmployeePasdariCodeMutation,
  useCheckEmployeeParvandeCodeMutation,
  useCheckEmployeeNationalityCodeMutation,
} = employeesSlice;

// employees Selector
export const selectEmployeesResult =
  judicialAppApi.endpoints.getEmployees.select();

const selectEmployeesData = createSelector(
  selectEmployeesResult,
  (employeesResult) => employeesResult.data,
);

export const {
  selectEntities: selectAllEmployeesEnt,
  selectAll: selectAllEmpls,
  selectIds: selectEmplsIds,
  selectById: selectEmplById,
} = employeesAdapter.getSelectors((state) => {
  return selectEmployeesData(state) ?? employeesInitialState;
});

// employee Selector
export const selectEmployeeResult =
  judicialAppApi.endpoints.getEmployee.select();

const selectEmployeeData = createSelector(
  selectEmployeeResult,
  (employeeResult) => employeeResult.data,
);

export const {
  selectEntities: selectAllEmployeesEntities,
  selectAll: selectAllEmployees,
  selectIds: selectEmployeesIds,
  selectById: selectEmployeeById,
} = employeeAdapter.getSelectors((state) => {
  return selectEmployeeData(state) ?? employeeInitialState;
});
