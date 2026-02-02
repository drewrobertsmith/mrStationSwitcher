import React, { createContext, useContext, useState } from "react";
import { Station } from "@/types/types";
import { useNearestStation } from "@/hooks/useNearestStation";

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

  return (
    <LocalStationContext.Provider
      value={{ station, isLoading, setStation: setOverride }}
    >
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
