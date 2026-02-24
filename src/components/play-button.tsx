import { useAudio } from "@/providers/audio-provider";
import { useTheme } from "@/providers/theme-provider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedIcon({
  playing,
  color,
}: {
  playing: boolean;
  color: string;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const prevPlaying = useSharedValue(playing);

  useEffect(() => {
    if (prevPlaying.value !== playing) {
      // Quick out then in — icon "pops" on change
      opacity.value = withTiming(0, { duration: 100 }, () => {
        scale.value = 0.7;
        opacity.value = withTiming(1, { duration: 180 });
        scale.value = withSpring(1, { damping: 12, stiffness: 280 });
      });
      prevPlaying.value = playing;
    }
  }, [playing]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <FontAwesome5
        name={playing ? "stop" : "play"}
        size={30}
        color={color}
      />
    </Animated.View>
  );
}

export function PlayButton() {
  const { state, actions } = useAudio();
  const { colors } = useTheme();

  const iconColor = state.currentTrack ? colors.accent : colors.text;
  const isLoading =
    state.isBuffering && !state.isPlaying && !!state.currentTrack;

  const pressScale = useSharedValue(1);

  const pressableStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const playPauseToggle = () => {
    return state.isPlaying ? actions.pause() : actions.resume();
  };

  return (
    <AnimatedPressable
      hitSlop={14}
      style={pressableStyle}
      onPressIn={() => {
        pressScale.value = withSpring(0.82, { damping: 15, stiffness: 400 });
      }}
      onPressOut={() => {
        pressScale.value = withSpring(1, { damping: 12, stiffness: 300 });
      }}
      onPress={() => {
        playPauseToggle();
      }}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <AnimatedIcon playing={state.isPlaying} color={iconColor} />
      )}
    </AnimatedPressable>
  );
}
