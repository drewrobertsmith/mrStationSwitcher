import { Stack } from "expo-router";
import { AudioProvider } from "@/providers/audio-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { LocalStationProvider } from "@/providers/local-station-provider";
import "../global.css";

export default function RootLayout() {
  return (
    <AudioProvider>
      <ThemeProvider>
        <LocalStationProvider>
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
        </LocalStationProvider>
      </ThemeProvider>
    </AudioProvider>
  );
}
