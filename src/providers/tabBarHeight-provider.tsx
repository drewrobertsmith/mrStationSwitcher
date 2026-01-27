import { createContext, useContext, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabBarHeight = createContext(null);

export const TabBarHeightProvider = ({ children }) => {
  const insets = useSafeAreaInsets();

  // Default height to prevent layout thrashing
  // iOS = 49 standard
  // Android = 56 (Standard) or 80 (Material 3) - 56 is a safer bet for a default, at least for now
  const defaultTabHeight = Platform.select({ ios: 49, android: 56 });

  // Add bottom inset (mostly for iPhone X+, usually 0 for Android unless edge-to-edge)
  const initialHeight = defaultTabHeight + insets.bottom;

  const [tabBarHeight, setTabBarHeight] = useState(initialHeight);

  const value = useMemo(
    () => ({
      tabBarHeight,
      setTabBarHeight,
    }),
    [tabBarHeight], // Only recreate the object if tabBarHeight changes
  );

  return (
    <TabBarHeight.Provider value={value}>
      {/* This View with flex: 1 is crucial to prevent layout collapse */}
      <View style={{ flex: 1 }}>{children}</View>
    </TabBarHeight.Provider>
  );
};

export const useTabBarHeight = () => {
  const context = useContext(TabBarHeight);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
