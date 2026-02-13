import { LOCAL_STATION_DATA } from "../local-stations";

describe("LOCAL_STATION_DATA", () => {
  it("contains stations", () => {
    expect(LOCAL_STATION_DATA.length).toBeGreaterThan(0);
  });

  it("every station has a non-empty tritonId", () => {
    for (const station of LOCAL_STATION_DATA) {
      expect(station.tritonId).toBeTruthy();
    }
  });

  it("every station has a non-empty name", () => {
    for (const station of LOCAL_STATION_DATA) {
      expect(station.name).toBeTruthy();
    }
  });

  it("every station has a non-empty callLetters", () => {
    for (const station of LOCAL_STATION_DATA) {
      expect(station.callLetters).toBeTruthy();
    }
  });

  it("every station has valid stream URLs", () => {
    for (const station of LOCAL_STATION_DATA) {
      expect(station.stream).toMatch(/^https:\/\//);
      expect(station.fallbackstream).toMatch(/^https:\/\//);
    }
  });

  it("every station has color values", () => {
    for (const station of LOCAL_STATION_DATA) {
      expect(station.backgroundColor).toBeTruthy();
      expect(station.accentColor).toBeTruthy();
    }
  });

  it("contains the MB2 fallback station (MDRN)", () => {
    const mb2 = LOCAL_STATION_DATA.find((s) => s.callLetters === "MDRN");
    expect(mb2).toBeDefined();
    expect(mb2!.tritonId).toBe("MB2");
  });

  it("MB2 fallback has no coordinates (network-wide, not geo-located)", () => {
    const mb2 = LOCAL_STATION_DATA.find((s) => s.callLetters === "MDRN");
    expect(mb2!.lat).toBeUndefined();
    expect(mb2!.lng).toBeUndefined();
  });

  it("geo-located stations have both lat and lng", () => {
    const geoStations = LOCAL_STATION_DATA.filter(
      (s) => s.lat !== undefined || s.lng !== undefined,
    );
    for (const station of geoStations) {
      expect(station.lat).toBeDefined();
      expect(station.lng).toBeDefined();
      expect(typeof station.lat).toBe("number");
      expect(typeof station.lng).toBe("number");
    }
  });

  it("geo-located stations have coordinates in valid ranges", () => {
    const geoStations = LOCAL_STATION_DATA.filter(
      (s) => s.lat != null && s.lng != null,
    );
    for (const station of geoStations) {
      // Continental US ranges
      expect(station.lat!).toBeGreaterThan(24);
      expect(station.lat!).toBeLessThan(50);
      expect(station.lng!).toBeGreaterThan(-125);
      expect(station.lng!).toBeLessThan(-65);
    }
  });
});
