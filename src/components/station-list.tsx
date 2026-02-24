import { useAudio } from "@/providers/audio-provider";
import { useLocalStation } from "@/providers/local-station-provider";
import { useSweep } from "@/providers/sweep-provider";
import { useTheme } from "@/providers/theme-provider";
import { Station } from "@/types/types";
import { stationAccentColor } from "@/utils/color";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import StationItem from "./station-item";

type StationListType = {
  data: Station[];
};

const keyExtractor = (item: Station) => item.tritonId + item.frequency;

function ShimmerText({ text }: { text: string }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 }),
      ),
      -1,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={styles.shimmerContainer}>
      <Animated.Text
        style={[styles.bigText, animatedStyle]}
        className="text-primary"
      >
        {text}
      </Animated.Text>
    </Animated.View>
  );
}

function PinButton({ colorProgress, neutralColor, accentColor }: {
  colorProgress: ReturnType<typeof useSharedValue<number>>;
  neutralColor: string;
  accentColor: string;
}) {
  const pressScale = useSharedValue(1);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  // Animate the icon/text color along with the header's selection progress
  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(colorProgress.value, [0, 1], [neutralColor, accentColor]),
    fontSize: 10,
    marginTop: 2,
  }));

  const iconColor = interpolateColor(colorProgress.value, [0, 1], [neutralColor, accentColor]);

  return (
    <Animated.View style={scaleStyle}>
      <Pressable
        onPress={() => router.push("/local-station-picker")}
        onPressIn={() => {
          pressScale.value = withSpring(0.82, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 12, stiffness: 300 });
        }}
        hitSlop={24}
        style={styles.pinButton}
      >
        {/* Icon color can't be animated directly via Reanimated, so we drive it from JS */}
        <FontAwesome5
          name="location-arrow"
          size={16}
          color={accentColor}
        />
        <Animated.Text style={textStyle}>change</Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function LocalStationHeader() {
  const { station, isLoading } = useLocalStation();
  const { state, actions } = useAudio();
  const { mode, colors } = useTheme();
  const { triggerSweep } = useSweep();

  const viewRef = useRef<View>(null);

  const isSelected = station ? state.currentTrack?.id === station.tritonId : false;

  const accentColor = station?.accentColor
    ? stationAccentColor(station.accentColor, mode)
    : colors.accent;

  // 0 = neutral, 1 = accent (same pattern as StationItem)
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);
  // Fade-in when station resolves from loading
  const nameOpacity = useSharedValue(station && !isLoading ? 1 : 0);
  // Press scale
  const pressScale = useSharedValue(1);

  useEffect(() => {
    if (!isLoading && station) {
      nameOpacity.value = withTiming(1, { duration: 350 });
    } else {
      nameOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isLoading, station]);

  useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, { duration: 400 });
    if (isSelected) {
      pressScale.value = withSpring(1.02, { damping: 12, stiffness: 280 }, () => {
        pressScale.value = withSpring(1, { damping: 14, stiffness: 200 });
      });
    }
  }, [isSelected]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    opacity: nameOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectionProgress.value,
      [0, 1],
      [colors.text, accentColor as string],
    ),
  }));

  const handlePress = () => {
    if (!station) return;
    viewRef.current?.measure((_x, _y, _w, h, _pageX, pageY) => {
      triggerSweep(pageY + h / 2, accentColor as string);
    });
    actions.play(station);
  };

  if (isLoading || !station) {
    return <ShimmerText text="Finding nearest station" />;
  }

  const displayName = station.frequency
    ? `${station.frequency} - ${station.name}`
    : station.name;

  return (
    <Animated.View style={styles.headerContainer}>
      <AnimatedPressable
        onPress={handlePress}
        onLongPress={() => actions.pause()}
        onPressIn={() => {
          pressScale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1, { damping: 12, stiffness: 300 });
        }}
        style={[styles.headerPressable, containerStyle]}
      >
        <View ref={viewRef} collapsable={false}>
          <Animated.Text
            style={[styles.bigText, textStyle]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {displayName}
          </Animated.Text>
        </View>
      </AnimatedPressable>
      <PinButton
        colorProgress={selectionProgress}
        neutralColor="#888"
        accentColor={accentColor as string}
      />
    </Animated.View>
  );
}

export default function StationList({ data }: StationListType) {
  const renderItem = useCallback(
    ({ item }: { item: Station }) => <StationItem item={item} />,
    [],
  );

  return (
    <LegendList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={LocalStationHeader}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 16,
  },
  shimmerContainer: {
    padding: 8,
  },
  bigText: {
    fontSize: 48,
    fontWeight: "600",
  },
  pinButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  headerContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerPressable: {
    flex: 1,
    flexShrink: 1,
  },
});
