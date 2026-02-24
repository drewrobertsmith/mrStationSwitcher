import { LOCAL_STATION_DATA } from "@/api/local-stations";
import { useLocalStation } from "@/providers/local-station-provider";
import { useTheme } from "@/providers/theme-provider";
import { Station } from "@/types/types";
import { parseFrequency } from "@/utils/station";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type SortMode = "frequency" | "name" | "callLetters";

const SORT_LABELS: Record<SortMode, string> = {
  frequency: "Frequency",
  name: "Name",
  callLetters: "Call Letters",
};

const SORT_MODES = Object.keys(SORT_LABELS) as SortMode[];

// Animated sliding pill background
function SortPill({
  modes,
  active,
  onSelect,
  colors,
}: {
  modes: SortMode[];
  active: SortMode;
  onSelect: (m: SortMode) => void;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const pillLayouts = useRef<Record<string, { x: number; width: number }>>({});
  const pillX = useSharedValue(0);
  const pillWidth = useSharedValue(80);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillX.value }],
    width: pillWidth.value,
  }));

  const onLayout = (mode: SortMode, x: number, width: number) => {
    pillLayouts.current[mode] = { x, width };
    // Set initial position for active
    if (mode === active) {
      pillX.value = x;
      pillWidth.value = width;
    }
  };

  const handleSelect = (mode: SortMode) => {
    const layout = pillLayouts.current[mode];
    if (layout) {
      pillX.value = withSpring(layout.x, { damping: 22, stiffness: 300 });
      pillWidth.value = withSpring(layout.width, {
        damping: 22,
        stiffness: 300,
      });
    }
    onSelect(mode);
  };

  return (
    <View style={styles.sortContainer}>
      {/* Sliding background pill */}
      <Animated.View
        style={[
          styles.activePill,
          { backgroundColor: colors.accent },
          pillStyle,
        ]}
        pointerEvents="none"
      />
      {modes.map((mode) => (
        <Pressable
          key={mode}
          onLayout={(e) => {
            const { x, width } = e.nativeEvent.layout;
            onLayout(mode, x, width);
          }}
          onPress={() => handleSelect(mode)}
          style={styles.sortButton}
        >
          <Text
            style={[
              styles.sortButtonText,
              {
                color:
                  active === mode ? colors.background : colors.text,
              },
            ]}
          >
            {SORT_LABELS[mode]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function LocalStationPicker() {
  const { station: current, setStation } = useLocalStation();
  const { colors } = useTheme();
  const [sortMode, setSortMode] = useState<SortMode>("frequency");

  const sortedStations = useMemo(() => {
    return [...LOCAL_STATION_DATA].sort((a, b) => {
      if (sortMode === "frequency") {
        return parseFrequency(a.frequency) - parseFrequency(b.frequency);
      }
      if (sortMode === "name") {
        return a.name.localeCompare(b.name);
      }
      return a.callLetters.localeCompare(b.callLetters);
    });
  }, [sortMode]);

  const handleSelect = useCallback(
    (station: Station) => {
      setStation(station);
      router.back();
    },
    [setStation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Station; index: number }) => {
      const isSelected =
        current?.tritonId === item.tritonId &&
        current?.callLetters === item.callLetters;
      const displayName = item.frequency
        ? `${item.frequency} - ${item.name}`
        : item.name;

      return (
        <Animated.View entering={FadeInDown.delay(index * 25).duration(300)}>
          <Pressable
            key={`${item.tritonId}-${item.callLetters}`}
            onPress={() => handleSelect(item)}
            style={({ pressed }) => [
              styles.stationItem,
              {
                backgroundColor: pressed ? colors.surface : "transparent",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.stationName,
                {
                  color: isSelected ? colors.accent : colors.text,
                  fontWeight: isSelected ? "700" : "500",
                },
              ]}
            >
              {displayName}
            </Text>
            <Text style={[styles.callLetters, { color: colors.text }]}>
              {item.callLetters}
            </Text>
          </Pressable>
        </Animated.View>
      );
    },
    [current, colors, handleSelect],
  );

  const Header = useMemo(
    () => (
      <View>
        {/* Title + dismiss */}
        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: colors.text }]}>
            Choose Your Station
          </Text>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.dismissButton}
          >
            <FontAwesome5 name="times" size={16} color={colors.text} />
          </Pressable>
        </View>
        <SortPill
          modes={SORT_MODES}
          active={sortMode}
          onSelect={setSortMode}
          colors={colors}
        />
      </View>
    ),
    [sortMode, colors],
  );

  return (
    <LegendList
      data={sortedStations}
      keyExtractor={(item) => `${item.tritonId}-${item.frequency}`}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.content,
        { backgroundColor: colors.background },
      ]}
      ListHeaderComponent={Header}
      estimatedItemSize={80}
      scrollToOverflowEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  dismissButton: {
    padding: 4,
  },
  sortContainer: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 16,
    position: "relative",
  },
  activePill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 20,
    zIndex: 0,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  stationItem: {
    padding: 16,
    borderRadius: 12,
  },
  stationName: {
    fontSize: 24,
  },
  callLetters: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
});
