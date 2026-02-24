import {
  stationAccentColor,
  stationBackgroundColor,
  stationSurfaceColor,
} from "@/utils/color";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useColorScheme } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useAudio } from "./audio-provider";

interface ThemeColors {
  background: string;
  surface: string;
  accent: string;
  text: string;
}

/** Raw (JS-thread) string colors — used for things that can't use animated styles */
interface ThemeContextValue {
  mode: "light" | "dark";
  colors: ThemeColors;
  /** Reanimated shared values for each color — all animate together at 400ms */
  animatedColors: {
    background: ReturnType<typeof useSharedValue<string>>;
    surface: ReturnType<typeof useSharedValue<string>>;
    accent: ReturnType<typeof useSharedValue<string>>;
    text: ReturnType<typeof useSharedValue<string>>;
  };
}

const DEFAULTS = {
  dark: {
    background: "hsl(0, 0%, 0%)",
    surface: "hsl(0, 0%, 10%)",
    accent: "hsl(0, 0%, 95%)",
    text: "hsl(0, 0%, 95%)",
  },
  light: {
    background: "hsl(0, 0%, 90%)",
    surface: "hsl(0, 0%, 100%)",
    accent: "hsl(0, 0%, 5%)",
    text: "hsl(0, 0%, 5%)",
  },
} as const;

const DURATION = 400;

const Theme = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAudio();
  const colorScheme = useColorScheme();
  const mode = colorScheme === "light" ? "light" : "dark";
  const track = state.currentTrack;

  // Derive target JS-thread colors
  const colors: ThemeColors = useMemo(() => {
    if (!track) return DEFAULTS[mode];
    return {
      background: stationBackgroundColor(track.backgroundColor, mode),
      surface: stationSurfaceColor(track.backgroundColor, mode),
      accent: stationAccentColor(track.accentColor, mode),
      text: DEFAULTS[mode].text,
    };
  }, [track, mode]);

  // Shared values — initialised with the same defaults once
  const sv = {
    background: useSharedValue(colors.background),
    surface: useSharedValue(colors.surface),
    accent: useSharedValue(colors.accent),
    text: useSharedValue(colors.text),
  };

  // Keep a stable ref so we can animate inside effects without deps issues
  const svRef = useRef(sv);
  svRef.current = sv;

  // Animate all four colors together whenever they change
  useEffect(() => {
    const timing = { duration: DURATION };
    svRef.current.background.value = withTiming(colors.background, timing);
    svRef.current.surface.value = withTiming(colors.surface, timing);
    svRef.current.accent.value = withTiming(colors.accent, timing);
    svRef.current.text.value = withTiming(colors.text, timing);
  }, [colors.background, colors.surface, colors.accent, colors.text]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors,
      animatedColors: svRef.current,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colors, mode],
  );

  return <Theme.Provider value={value}>{children}</Theme.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(Theme);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
