import { ColorValue } from "react-native";

interface HSL {
  h: number;
  s: number;
  l: number;
}

export function hexToHSL(hex: string): HSL {
  const raw = hex.replace("#", "");
  const r = parseInt(raw.substring(0, 2), 16) / 255;
  const g = parseInt(raw.substring(2, 4), 16) / 255;
  const b = parseInt(raw.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
      break;
  }

  return { h: h * 360, s, l };
}

export function stationBackgroundColor(
  hex: ColorValue,
  mode: "light" | "dark"
): string {
  const { h, s } = hexToHSL(String(hex));

  if (mode === "dark") {
    return `hsl(${h}, ${Math.round(s * 100)}%, 18%)`;
  }

  return `hsl(${h}, ${Math.round(s * 70)}%, 85%)`;
}

export function stationSurfaceColor(
  hex: ColorValue,
  mode: "light" | "dark"
): string {
  const { h, s } = hexToHSL(String(hex));

  if (mode === "dark") {
    return `hsl(${h}, ${Math.round(s * 80)}%, 24%)`;
  }

  return `hsl(${h}, ${Math.round(s * 55)}%, 78%)`;
}

export function stationAccentColor(
  hex: ColorValue,
  mode: "light" | "dark"
): string {
  const { h, s } = hexToHSL(String(hex));

  if (mode === "dark") {
    return `hsl(${h}, ${Math.round(s * 100)}%, 55%)`;
  }

  return `hsl(${h}, ${Math.round(s * 100)}%, 35%)`;
}
