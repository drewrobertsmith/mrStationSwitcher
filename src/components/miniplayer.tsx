import { useAudio } from "@/providers/audio-provider";
import { useTheme } from "@/providers/theme-provider";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PlayButton } from "./play-button";

const MINI_PLAYER_HEIGHT = 64;

/**
 * React-Native-safe text morph fallback.
 * Fades out the old value then fades in the new one.
 * The crossfade keeps the layout stable (absolute overlay during transition).
 */
function CrossfadeText({
  children,
  style,
  numberOfLines,
}: {
  children: string;
  style?: object;
  numberOfLines?: number;
}) {
  const [displayed, setDisplayed] = useState(children);
  const opacity = useSharedValue(1);
  const prevChildren = useRef(children);

  useEffect(() => {
    if (children === prevChildren.current) return;
    prevChildren.current = children;

    // Fade out current text, swap, fade back in
    opacity.value = withTiming(0, { duration: 130 }, (finished) => {
      if (finished) {
        runOnJS(setDisplayed)(children);
        opacity.value = withTiming(1, { duration: 220 });
      }
    });
  }, [children]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text style={[style, animStyle]} numberOfLines={numberOfLines}>
      {displayed}
    </Animated.Text>
  );
}

function MiniPlayerContent() {
  const { state } = useAudio();
  const { currentTrack } = state;
  const { animatedColors } = useTheme();

  // Fade artwork out then in when track changes
  const artOpacity = useSharedValue(0);
  useEffect(() => {
    if (currentTrack) {
      artOpacity.value = withTiming(0, { duration: 100 }, () => {
        artOpacity.value = withTiming(1, { duration: 300 });
      });
    }
  }, [currentTrack?.id]);

  const artStyle = useAnimatedStyle(() => ({
    opacity: artOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: animatedColors.text.value,
    fontSize: 16,
    flexShrink: 1,
    flexGrow: 1,
    textAlign: "center",
  }));

  const title = currentTrack ? currentTrack.title : "Moody Radio";

  return (
    <View style={styles.row}>
      <Animated.View style={[styles.artwork, artStyle]}>
        <Image
          style={styles.artworkImage}
          source={currentTrack ? currentTrack.artwork : null}
          contentFit="contain"
        />
      </Animated.View>
      <CrossfadeText style={textStyle} numberOfLines={1}>
        {title}
      </CrossfadeText>
      <PlayButton />
    </View>
  );
}

export function InlineMiniPlayer() {
  const { animatedColors } = useTheme();

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedColors.surface.value,
  }));

  return (
    <Animated.View style={[{ flex: 1 }, bgStyle]}>
      <MiniPlayerContent />
    </Animated.View>
  );
}

export function FloatingMiniPlayer() {
  const { animatedColors } = useTheme();

  const translateY = useSharedValue(80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
    backgroundColor: animatedColors.surface.value,
  }));

  return (
    <Animated.View style={[styles.floatingPlayer, floatStyle]}>
      <MiniPlayerContent />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    gap: 8,
  },
  artwork: {
    height: "100%",
    aspectRatio: 1,
  },
  artworkImage: {
    flex: 1,
    borderRadius: 8,
  },
  floatingPlayer: {
    position: "absolute",
    height: MINI_PLAYER_HEIGHT,
    left: 8,
    right: 8,
    bottom: 104 + 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "hsla(0, 0%, 50%, 0.3)",
    justifyContent: "center",
  },
});
