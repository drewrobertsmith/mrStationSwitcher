import { useAudio } from "@/providers/audio-provider";
import { Station } from "@/types/types";
import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type MiniPlayerProps = {
  activeStation?: Station | null;
  placement?: "inline" | "expanded" | "none";
};

const MINI_PLAYER_HEIGHT = 64;

export function MiniPlayer({ activeStation, placement }: MiniPlayerProps) {
  const isAndroid = Platform.OS === "android";
  const isInline = placement === "inline";
  const { currentTrack, status, player } = useAudio();

  const playPauseToggle = () => {
    return status.playing ? player.pause() : player.play();
  };

  return (
    <View
      style={[
        isAndroid && {
          position: "absolute",
          height: MINI_PLAYER_HEIGHT,
          left: 8,
          right: 8,
          bottom: 104 + 8, //I dislike this hardcoded 104, but for now it functions
          borderWidth: 1,
          borderRadius: 8,
          justifyContent: "center",
        },
        !isAndroid && {
          flex: 1,
          justifyContent: "center",
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
        }}
      >
        <Image
          style={{ width: 40, aspectRatio: "1", borderRadius: 8 }}
          source={currentTrack ? currentTrack?.artwork : null}
          contentFit="contain"
        />
        <Text>{currentTrack ? currentTrack?.title : "Moody Radio"}</Text>
        <Pressable
          hitSlop={12}
          onPress={() => {
            playPauseToggle();
          }}
        >
          <FontAwesome5
            name={status.playing ? "stop" : "play"}
            size={32}
            color="black"
          />
        </Pressable>
      </View>
    </View>
  );
}
