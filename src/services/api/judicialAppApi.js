import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const judicialAppApi = createApi({
  reducerPath: "judicialAppApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "http://172.20.8.149:8081/api/" }),
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_JUDICIAL_URL}/api/`,
  }),
  refetchOnMountOrArgChange: 30,
  endpoints: (builder) => ({}),
});
