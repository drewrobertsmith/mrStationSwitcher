import { useAudio } from "@/providers/audio-provider";
import { Station } from "@/types/types";
import React from "react";
import { Pressable, Text, View } from "react-native";

type StationItemType = {
  item: Station;
};

export default function StationItem({ item }: StationItemType) {
  const { actions } = useAudio();

  return (
    <Pressable
      onPress={() => {
        actions.play(item);
      }}
      onLongPress={() => {
        actions.pause();
      }}
    >
      <View className="p-2">
        <Text className="text-5xl font-semibold text-primary">{item.name}</Text>
      </View>
    </Pressable>
  );
}
