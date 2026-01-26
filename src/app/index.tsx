import { STATION_DATA } from "@/api/stations";
import { Station } from "@/types/types";
import React, { SetStateAction, useState } from "react";
import { Text, View, StyleSheet, FlatList, Pressable } from "react-native";

type StationItemType = {
  item: Station;
  activeStation: Station | null;
  setActiveStation: React.Dispatch<SetStateAction<Station>>;
};

function StationItem({
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
                activeStation?.tritonId === item.tritonId ? "green" : "black",
            },
          ]}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
}

function StationList({ data }: { data: Station[] }) {
  const [activeStation, setActiveStation] = useState<Station | null>(null);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.tritonId}
      renderItem={({ item }) => (
        <StationItem
          item={item}
          activeStation={activeStation}
          setActiveStation={setActiveStation}
        />
      )}
    />
  );
}

export default function Index() {
  const STATIONS = STATION_DATA;

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StationList data={STATIONS} />
    </View>
  );
}
