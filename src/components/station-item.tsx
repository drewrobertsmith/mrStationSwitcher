import { useAudio } from "@/providers/audio-provider";
import { useTheme } from "@/providers/theme-provider";
import { stationAccentColor } from "@/utils/color";
import { Station } from "@/types/types";
import React from "react";
import { Pressable, Text, View } from "react-native";

type StationItemType = {
  item: Station;
};

export default function StationItem({ item }: StationItemType) {
  const { state, actions } = useAudio();
  const { mode } = useTheme();

  const isSelected = state.currentTrack?.id === item.tritonId;
  const textColor = isSelected
    ? stationAccentColor(item.accentColor, mode)
    : undefined;

  return (
    <Pressable
      onPress={() => {
        actions.play(item);
      }}
      onLongPress={() => {
        actions.pause();
      }}
    >
      <View style={{ padding: 8 }}>
        <Text
          style={[
            { fontSize: 48, fontWeight: "600" },
            textColor ? { color: textColor } : undefined,
          ]}
          className={textColor ? undefined : "text-primary"}
        >
          {item.frequency ? `${item.frequency} - ${item.name}` : item.name}
        </Text>
      </View>
    </Pressable>
  );
}
