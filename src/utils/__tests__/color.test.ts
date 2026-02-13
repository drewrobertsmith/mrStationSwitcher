import {
  hexToHSL,
  stationBackgroundColor,
  stationSurfaceColor,
  stationAccentColor,
} from "../color";

describe("hexToHSL", () => {
  it("converts pure red", () => {
    const { h, s, l } = hexToHSL("#FF0000");
    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(1);
    expect(l).toBeCloseTo(0.5);
  });

  it("converts pure green", () => {
    const { h, s, l } = hexToHSL("#00FF00");
    expect(h).toBeCloseTo(120);
    expect(s).toBeCloseTo(1);
    expect(l).toBeCloseTo(0.5);
  });

  it("converts pure blue", () => {
    const { h, s, l } = hexToHSL("#0000FF");
    expect(h).toBeCloseTo(240);
    expect(s).toBeCloseTo(1);
    expect(l).toBeCloseTo(0.5);
  });

  it("converts white to zero saturation", () => {
    const { h, s, l } = hexToHSL("#FFFFFF");
    expect(s).toBe(0);
    expect(l).toBeCloseTo(1);
  });

  it("converts black to zero saturation and lightness", () => {
    const { h, s, l } = hexToHSL("#000000");
    expect(s).toBe(0);
    expect(l).toBe(0);
  });

  it("handles hex without hash prefix", () => {
    const { h, s, l } = hexToHSL("FF0000");
    expect(h).toBeCloseTo(0);
    expect(s).toBeCloseTo(1);
    expect(l).toBeCloseTo(0.5);
  });

  it("converts a real station color (#46a147)", () => {
    const { h, s, l } = hexToHSL("#46a147");
    // green-ish hue, moderate saturation/lightness
    expect(h).toBeGreaterThan(100);
    expect(h).toBeLessThan(130);
    expect(s).toBeGreaterThan(0.3);
    expect(l).toBeGreaterThan(0.2);
    expect(l).toBeLessThan(0.6);
  });
});

describe("stationBackgroundColor", () => {
  it("produces dark mode background at 18% lightness", () => {
    const result = stationBackgroundColor("#46a147", "dark");
    expect(result).toMatch(/^hsl\(.+, \d+%, 18%\)$/);
  });

  it("produces light mode background at 85% lightness", () => {
    const result = stationBackgroundColor("#46a147", "light");
    expect(result).toMatch(/^hsl\(.+, \d+%, 85%\)$/);
  });

  it("uses lower saturation multiplier in light mode", () => {
    // dark uses s*100, light uses s*70 — light should have lower saturation
    const dark = stationBackgroundColor("#46a147", "dark");
    const light = stationBackgroundColor("#46a147", "light");
    const darkSat = parseInt(dark.match(/(\d+)%,/)![1]);
    const lightSat = parseInt(light.match(/(\d+)%,/)![1]);
    expect(lightSat).toBeLessThanOrEqual(darkSat);
  });
});

describe("stationSurfaceColor", () => {
  it("produces dark mode surface at 24% lightness", () => {
    const result = stationSurfaceColor("#66bac4", "dark");
    expect(result).toMatch(/^hsl\(.+, \d+%, 24%\)$/);
  });

  it("produces light mode surface at 78% lightness", () => {
    const result = stationSurfaceColor("#66bac4", "light");
    expect(result).toMatch(/^hsl\(.+, \d+%, 78%\)$/);
  });
});

describe("stationAccentColor", () => {
  it("produces dark mode accent at 55% lightness", () => {
    const result = stationAccentColor("#003B5C", "dark");
    expect(result).toMatch(/^hsl\(.+, \d+%, 55%\)$/);
  });

  it("produces light mode accent at 35% lightness", () => {
    const result = stationAccentColor("#003B5C", "light");
    expect(result).toMatch(/^hsl\(.+, \d+%, 35%\)$/);
  });

  it("preserves hue across modes", () => {
    const dark = stationAccentColor("#a84e20", "dark");
    const light = stationAccentColor("#a84e20", "light");
    const darkHue = parseFloat(dark.match(/hsl\(([^,]+),/)![1]);
    const lightHue = parseFloat(light.match(/hsl\(([^,]+),/)![1]);
    expect(darkHue).toBeCloseTo(lightHue);
  });
});
