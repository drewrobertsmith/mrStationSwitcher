import { Station } from "@/types/types";
import React, { SetStateAction } from "react";
import { FlatList } from "react-native";
import StationItem from "./station-item";

type StationListType = {
  data: Station[];
  activeStation: Station | null;
  setActiveStation: React.Dispatch<SetStateAction<Station>>;
};

export default function StationList({
  data,
  activeStation,
  setActiveStation,
}: StationListType) {
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
