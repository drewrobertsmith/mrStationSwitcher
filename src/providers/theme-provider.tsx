import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { useAudio } from "./audio-provider";
import {
  stationBackgroundColor,
  stationSurfaceColor,
  stationAccentColor,
} from "@/utils/color";

interface ThemeColors {
  background: string;
  surface: string;
  accent: string;
  text: string;
}

interface ThemeContextValue {
  mode: "light" | "dark";
  colors: ThemeColors;
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

const Theme = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAudio();
  const colorScheme = useColorScheme();
  const mode = colorScheme === "light" ? "light" : "dark";
  const track = state.currentTrack;

  const value = useMemo<ThemeContextValue>(() => {
    if (!track) {
      return { mode, colors: DEFAULTS[mode] };
    }

    return {
      mode,
      colors: {
        background: stationBackgroundColor(track.backgroundColor, mode),
        surface: stationSurfaceColor(track.backgroundColor, mode),
        accent: stationAccentColor(track.accentColor, mode),
        text: DEFAULTS[mode].text,
      },
    };
  }, [track, mode]);

  return <Theme.Provider value={value}>{children}</Theme.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(Theme);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
