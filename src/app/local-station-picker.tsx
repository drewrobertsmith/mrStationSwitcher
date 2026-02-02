import { LOCAL_STATION_DATA } from "@/api/local-stations";
import { useLocalStation } from "@/providers/local-station-provider";
import { useTheme } from "@/providers/theme-provider";
import { Station } from "@/types/types";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function LocalStationPicker() {
  const { station: current, setStation } = useLocalStation();
  const { colors } = useTheme();

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
        {LOCAL_STATION_DATA.map((station, index) => {
          const isSelected = current?.tritonId === station.tritonId &&
            current?.callLetters === station.callLetters;

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
                {station.name}
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
