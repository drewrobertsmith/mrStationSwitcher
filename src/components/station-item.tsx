import { Track, useAudio } from "@/providers/audio-provider";
import { Station } from "@/types/types";
import React, { SetStateAction } from "react";
import { Pressable, Text, View } from "react-native";

type StationItemType = {
  item: Station;
};

export default function StationItem({ item }: StationItemType) {
  const { play, pause, currentTrack } = useAudio();

  return (
    <Pressable
      onPress={() => {
        play(item);
      }}
      onLongPress={() => {
        pause();
      }}
    >
      <View
        style={{
          paddingVertical: 8,
        }}
      >
        <Text
          style={[
            {
              fontSize: 48,
              fontWeight: "600",
              color: currentTrack?.id === item.tritonId ? "#ffffff" : "black",
            },
          ]}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
}
