import { Station } from "@/types/types";
import React, { SetStateAction } from "react";
import StationItem from "./station-item";
import { LegendList } from "@legendapp/list";

type StationListType = {
  data: Station[];
};

export default function StationList({ data }: StationListType) {
  return (
    <LegendList
      data={data}
      keyExtractor={(item) => item.tritonId}
      renderItem={({ item }) => <StationItem item={item} />}
    />
  );
}
