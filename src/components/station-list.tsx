import { Station } from "@/types/types";
import { useLocalStation } from "@/providers/local-station-provider";
import { useAudio } from "@/providers/audio-provider";
import { useTheme } from "@/providers/theme-provider";
import { stationAccentColor } from "@/utils/color";
import React, { useCallback, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import StationItem from "./station-item";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";

type StationListType = {
  data: Station[];
};

const keyExtractor = (item: Station) => item.tritonId;

const contentContainerStyle = { gap: 16 };

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
    <View style={{ padding: 8 }}>
      <Animated.Text
        style={[{ fontSize: 48, fontWeight: "600" }, animatedStyle]}
        className="text-primary"
      >
        {text}
      </Animated.Text>
    </View>
  );
}

function PinIcon({ color }: { color: string }) {
  return (
    <Text style={{ fontSize: 20, color, marginRight: 4 }}>
      {"\u{1F4CD}"}
    </Text>
  );
}

function ChevronDown({ color }: { color: string }) {
  return (
    <Text style={{ fontSize: 20, color, marginLeft: 4 }}>
      {"\u25BE"}
    </Text>
  );
}

function LocalStationHeader() {
  const { station, isLoading } = useLocalStation();
  const { state, actions } = useAudio();
  const { mode } = useTheme();

  if (isLoading || !station) {
    return <ShimmerText text="Finding nearest station" />;
  }

  const isSelected = state.currentTrack?.id === station.tritonId;
  const textColor = isSelected
    ? stationAccentColor(station.accentColor, mode)
    : undefined;
  const iconColor = (textColor as string) ?? "#888";

  return (
    <View
      style={{
        padding: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <PinIcon color={iconColor} />
      <Pressable
        onPress={() => actions.play(station)}
        onLongPress={() => actions.pause()}
        style={{ flex: 1, flexShrink: 1 }}
      >
        <Text
          style={[
            { fontSize: 48, fontWeight: "600" },
            textColor ? { color: textColor } : undefined,
          ]}
          className={textColor ? undefined : "text-primary"}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.5}
        >
          {station.name}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => router.push("/local-station-picker")}
        hitSlop={16}
        style={{ paddingLeft: 8, justifyContent: "center" }}
      >
        <ChevronDown color={iconColor} />
      </Pressable>
    </View>
  );
}

export default function StationList({ data }: StationListType) {
  const renderItem = useCallback(
    ({ item }: { item: Station }) => <StationItem item={item} />,
    []
  );

  return (
    <LegendList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      ListHeaderComponent={LocalStationHeader}
    />
  );
}
