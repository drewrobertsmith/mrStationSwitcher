import { Station } from "@/types/types";
import { useNearestStation } from "@/hooks/useNearestStation";
import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import StationItem from "./station-item";
import { LegendList } from "@legendapp/list";

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

function LocalStationHeader() {
  const { station, isLoading } = useNearestStation();

  if (isLoading || !station) {
    return <ShimmerText text="Finding nearest station" />;
  }

  return <StationItem item={station} />;
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
