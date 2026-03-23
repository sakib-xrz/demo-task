"use client";

import { useMemo } from "react";
import { Provider } from "react-redux";
import { getClientStore } from "@/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => getClientStore(), []);
  return <Provider store={store}>{children}</Provider>;
}
