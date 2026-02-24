import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabBarHeightContextType = {
  tabBarHeight: number;
  setTabBarHeight: React.Dispatch<React.SetStateAction<number>>;
};

const TabBarHeight = createContext<TabBarHeightContextType | null>(null);

export const TabBarHeightProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const defaultTabHeight = Platform.select({ ios: 49, android: 56, default: 0 });
  const initialHeight = defaultTabHeight + insets.bottom;
  const [tabBarHeight, setTabBarHeight] = useState(initialHeight);

  const value = useMemo(
    () => ({
      tabBarHeight,
      setTabBarHeight,
    }),
    [tabBarHeight],
  );

  return (
    <TabBarHeight.Provider value={value}>
      <View style={{ flex: 1 }}>{children}</View>
    </TabBarHeight.Provider>
  );
};

export const useTabBarHeight = () => {
  const context = useContext(TabBarHeight);
  if (!context) {
    throw new Error(
      "useTabBarHeight must be used within a TabBarHeightProvider",
    );
  }
  return context;
};
