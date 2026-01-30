import { useAudio } from "@/providers/audio-provider";
import { Image } from "expo-image";
import { View, Text } from "react-native";
import { PlayButton } from "./play-button";

const MINI_PLAYER_HEIGHT = 64;

function MiniPlayerContent() {
  const { state } = useAudio();
  const { currentTrack } = state;

  return (
    <View className="flex-row items-center justify-between p-2">
      <Image
        style={{ height: "100%", aspectRatio: "1", borderRadius: 8 }}
        source={currentTrack ? currentTrack.artwork : null}
        contentFit="contain"
      />
      <Text className="text-primary text-base">
        {currentTrack ? currentTrack.title : "Moody Radio"}
      </Text>
      <PlayButton />
    </View>
  );
}

export function InlineMiniPlayer() {
  return (
    <View className="flex-1 bg-background-light border-border">
      <MiniPlayerContent />
    </View>
  );
}

export function FloatingMiniPlayer() {
  return (
    <View
      className="bg-background-light border-border"
      style={{
        position: "absolute",
        height: MINI_PLAYER_HEIGHT,
        left: 8,
        right: 8,
        bottom: 104 + 8, //I dislike this hardcoded 104, but for now it functions
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: "center",
      }}
    >
      <MiniPlayerContent />
    </View>
  );
}
