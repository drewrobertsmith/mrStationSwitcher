import { STATION_DATA } from "@/api/stations";
import StationList from "@/components/station-list";
import { useAudio } from "@/providers/audio-provider";
import { Station } from "@/types/types";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const inset = useSafeAreaInsets();
  const STATIONS = STATION_DATA;
  const { currentTrack } = useAudio();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: currentTrack ? currentTrack.accentColor : "#ffffff",
        padding: 4,
        marginTop: inset.top,
      }}
    >
      <StationList data={STATIONS} />
    </View>
  );
}
