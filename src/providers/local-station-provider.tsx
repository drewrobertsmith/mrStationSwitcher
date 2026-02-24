import { useNearestStation } from "@/hooks/useNearestStation";
import { Station } from "@/types/types";
import React, { createContext, useContext, useMemo, useState } from "react";

interface LocalStationContextValue {
  station: Station | null;
  isLoading: boolean;
  setStation: (station: Station) => void;
}

const LocalStationContext = createContext<LocalStationContextValue | null>(null);

export function LocalStationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const nearest = useNearestStation();
  const [override, setOverride] = useState<Station | null>(null);

  const station = override ?? nearest.station;
  const isLoading = !override && nearest.isLoading;

  const value = useMemo(
    () => ({ station, isLoading, setStation: setOverride }),
    [station, isLoading],
  );

  return (
    <LocalStationContext.Provider value={value}>
      {children}
    </LocalStationContext.Provider>
  );
}

export function useLocalStation(): LocalStationContextValue {
  const context = useContext(LocalStationContext);
  if (!context) {
    throw new Error(
      "useLocalStation must be used within a LocalStationProvider",
    );
  }
  return context;
}
