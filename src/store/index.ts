import { configureStore } from "@reduxjs/toolkit";
import { dashboardApi } from "./dashboardApi";

export function makeStore() {
  return configureStore({
    reducer: {
      [dashboardApi.reducerPath]: dashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(dashboardApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;

let clientStore: AppStore | undefined;

export function getClientStore(): AppStore {
  if (!clientStore) clientStore = makeStore();
  return clientStore;
}
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
