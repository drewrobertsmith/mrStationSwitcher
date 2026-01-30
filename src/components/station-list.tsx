import { Station } from "@/types/types";
import React, { useCallback } from "react";
import StationItem from "./station-item";
import { LegendList } from "@legendapp/list";

type StationListType = {
  data: Station[];
};

const keyExtractor = (item: Station) => item.tritonId;

const contentContainerStyle = { gap: 16 };

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
    />
  );
}
