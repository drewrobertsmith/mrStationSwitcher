import { LOCAL_STATION_DATA } from "@/api/local-stations";
import { useLocalStation } from "@/providers/local-station-provider";
import { useTheme } from "@/providers/theme-provider";
import { Station } from "@/types/types";
import { parseFrequency } from "@/utils/station";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type SortMode = "frequency" | "name";

export default function LocalStationPicker() {
  const { station: current, setStation } = useLocalStation();
  const { colors } = useTheme();
  const [sortMode, setSortMode] = useState<SortMode>("frequency");

  const sortedStations = useMemo(() => {
    const list = [...LOCAL_STATION_DATA];
    if (sortMode === "frequency") {
      list.sort((a, b) => parseFrequency(a.frequency) - parseFrequency(b.frequency));
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [sortMode]);

  const handleSelect = (station: Station) => {
    setStation(station);
    router.back();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View style={{ padding: 16, gap: 8 }}>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          {(["frequency", "name"] as const).map((mode) => {
            const active = sortMode === mode;
            return (
              <Pressable
                key={mode}
                onPress={() => setSortMode(mode)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: active ? colors.accent : colors.surface,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: active ? colors.background : colors.text,
                  }}
                >
                  {mode === "frequency" ? "Frequency" : "Name"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {sortedStations.map((station, index) => {
          const isSelected = current?.tritonId === station.tritonId &&
            current?.callLetters === station.callLetters;
          const displayName = station.frequency
            ? `${station.frequency} - ${station.name}`
            : station.name;

          return (
            <Pressable
              key={`${station.callLetters}-${index}`}
              onPress={() => handleSelect(station)}
              style={({ pressed }) => ({
                padding: 16,
                borderRadius: 12,
                backgroundColor: pressed ? colors.surface : "transparent",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? colors.accent : colors.text,
                }}
              >
                {displayName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.text,
                  opacity: 0.6,
                  marginTop: 2,
                }}
              >
                {station.callLetters}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
