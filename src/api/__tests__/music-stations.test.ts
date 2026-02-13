import { STATION_DATA } from "../music-stations";

describe("STATION_DATA", () => {
  it("contains stations", () => {
    expect(STATION_DATA.length).toBeGreaterThan(0);
  });

  it("every station has a non-empty tritonId", () => {
    for (const station of STATION_DATA) {
      expect(station.tritonId).toBeTruthy();
    }
  });

  it("every station has a non-empty name", () => {
    for (const station of STATION_DATA) {
      expect(station.name).toBeTruthy();
    }
  });

  it("every station has valid stream URLs", () => {
    for (const station of STATION_DATA) {
      expect(station.stream).toMatch(/^https:\/\//);
      expect(station.fallbackstream).toMatch(/^https:\/\//);
    }
  });

  it("every station has color values", () => {
    for (const station of STATION_DATA) {
      expect(station.backgroundColor).toBeTruthy();
      expect(station.accentColor).toBeTruthy();
    }
  });

  it("music stations are internet-only (no frequency)", () => {
    for (const station of STATION_DATA) {
      expect(station.frequency).toBe("");
    }
  });

  it("music stations have no geo-coordinates", () => {
    for (const station of STATION_DATA) {
      expect(station.lat).toBeUndefined();
      expect(station.lng).toBeUndefined();
    }
  });

  it("every station has a logo URL", () => {
    for (const station of STATION_DATA) {
      expect(station.logo).toMatch(/^https:\/\//);
    }
  });

  it("has unique tritonIds", () => {
    const ids = STATION_DATA.map((s) => s.tritonId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
