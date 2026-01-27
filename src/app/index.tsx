import { STATION_DATA } from "@/api/stations";
import StationList from "@/components/station-list";
import { Station } from "@/types/types";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const inset = useSafeAreaInsets();
  const STATIONS = STATION_DATA;
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: activeStation
          ? activeStation.backgroundColor
          : "#ffffff",
        padding: 4,
        marginTop: inset.top,
      }}
    >
      <StationList
        data={STATIONS}
        activeStation={activeStation}
        setActiveStation={setActiveStation}
      />
    </View>
  );
}
