import { useAudio } from "@/providers/audio-provider";
import { useTheme } from "@/providers/theme-provider";
import { Image } from "expo-image";
import { View, Text } from "react-native";
import { PlayButton } from "./play-button";

const MINI_PLAYER_HEIGHT = 64;

function MiniPlayerContent() {
  const { state } = useAudio();
  const { currentTrack } = state;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 8 }}>
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
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <MiniPlayerContent />
    </View>
  );
}

export function FloatingMiniPlayer() {
  const { colors } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        height: MINI_PLAYER_HEIGHT,
        left: 8,
        right: 8,
        bottom: 104 + 8, //I dislike this hardcoded 104, but for now it functions
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "hsla(0, 0%, 50%, 0.3)",
        justifyContent: "center",
        backgroundColor: colors.surface,
      }}
    >
      <MiniPlayerContent />
    </View>
  );
}
