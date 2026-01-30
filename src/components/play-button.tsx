import { useAudio } from "@/providers/audio-provider";
import { useTheme } from "@/providers/theme-provider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable } from "react-native";

export function PlayButton() {
  const { state, actions } = useAudio();
  const { colors } = useTheme();

  const playPauseToggle = () => {
    return state.isPlaying ? actions.pause() : actions.resume();
  };

  return (
    <Pressable
      hitSlop={14}
      onPress={() => {
        playPauseToggle();
      }}
    >
      <FontAwesome5
        name={state.isPlaying ? "stop" : "play"}
        size={30}
        color={state.currentTrack ? colors.accent : colors.text}
      />
    </Pressable>
  );
}
