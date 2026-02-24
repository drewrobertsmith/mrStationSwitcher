import { AudioProvider } from "@/providers/audio-provider";
import { LocalStationProvider } from "@/providers/local-station-provider";
import { SweepProvider } from "@/providers/sweep-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <AudioProvider>
      <ThemeProvider>
        <LocalStationProvider>
          <SweepProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="local-station-picker"
                options={{
                  presentation: "formSheet",
                  sheetGrabberVisible: true,
                  sheetAllowedDetents: [0.75],
                }}
              />
            </Stack>
          </SweepProvider>
        </LocalStationProvider>
      </ThemeProvider>
    </AudioProvider>
  );
}
