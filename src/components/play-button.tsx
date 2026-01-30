import { useAudio } from "@/providers/audio-provider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Pressable } from "react-native";
import { withUniwind } from "uniwind";

export function PlayButton() {
  const StyledIcon = withUniwind(FontAwesome5);

  const { state, actions } = useAudio();

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
      <StyledIcon
        className="text-primary"
        name={state.isPlaying ? "stop" : "play"}
        size={30}
      />
    </Pressable>
  );
}
