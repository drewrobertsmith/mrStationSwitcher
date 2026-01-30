import { STATION_DATA } from "@/api/stations";
import StationList from "@/components/station-list";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const inset = useSafeAreaInsets();
  const STATIONS = STATION_DATA;

  return (
    <View
      className="flex-1 bg-background-dark p-1"
      style={{
        marginTop: inset.top,
      }}
    >
      <StationList data={STATIONS} />
    </View>
  );
}
