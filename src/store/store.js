import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { judicialAppApi } from "../services/api/judicialAppApi";
import { garrisonAppApi } from "../services/api/garrisonAppApi";

const store = configureStore({
  reducer: {
    [judicialAppApi.reducerPath]: judicialAppApi.reducer,
    [garrisonAppApi.reducerPath]: garrisonAppApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(judicialAppApi.middleware),
});
setupListeners(store.dispatch);
export default store;
