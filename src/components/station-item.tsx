import { Station } from "@/types/types";
import React, { SetStateAction } from "react";
import { Pressable, Text, View } from "react-native";

type StationItemType = {
  item: Station;
  activeStation: Station | null;
  setActiveStation: React.Dispatch<SetStateAction<Station>>;
};

export default function StationItem({
  item,
  activeStation,
  setActiveStation,
}: StationItemType) {
  return (
    <Pressable
      onPress={() => {
        setActiveStation(item);
      }}
    >
      <View
        style={{
          paddingVertical: 8,
        }}
      >
        <Text
          style={[
            {
              fontSize: 48,
              fontWeight: "600",
              color:
                activeStation?.tritonId === item.tritonId ? "#ffffff" : "black",
            },
          ]}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
}
