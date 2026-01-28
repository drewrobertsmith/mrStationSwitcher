import { Station } from "@/types/types";
import React, { SetStateAction } from "react";
import { FlatList } from "react-native";
import StationItem from "./station-item";
import { Track } from "@/providers/audio-provider";

type StationListType = {
  data: Station[];
};

export default function StationList({ data }: StationListType) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.tritonId}
      renderItem={({ item }) => <StationItem item={item} />}
    />
  );
}
