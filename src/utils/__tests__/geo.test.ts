import { haversineDistance, findNearestStation } from "../geo";
import { Station } from "@/types/types";

const makeStation = (overrides: Partial<Station> = {}): Station => ({
  tritonId: "TEST",
  frequency: "90.1 FM",
  name: "Test Station",
  callLetters: "TEST",
  logo: "",
  backgroundColor: "#000000",
  accentColor: "#000000",
  stream: "https://example.com/stream.aac",
  fallbackstream: "https://example.com/stream.mp3",
  ...overrides,
});

describe("haversineDistance", () => {
  it("returns 0 for the same point", () => {
    expect(haversineDistance(41.0, -87.0, 41.0, -87.0)).toBe(0);
  });

  it("calculates Chicago to Cleveland (~308 miles)", () => {
    // Chicago (41.88, -87.63) to Cleveland (41.50, -81.69)
    const distance = haversineDistance(41.88, -87.63, 41.50, -81.69);
    expect(distance).toBeGreaterThan(290);
    expect(distance).toBeLessThan(330);
  });

  it("calculates New York to Los Angeles (~2445 miles)", () => {
    const distance = haversineDistance(40.71, -74.01, 34.05, -118.24);
    expect(distance).toBeGreaterThan(2400);
    expect(distance).toBeLessThan(2500);
  });

  it("is symmetric (A→B equals B→A)", () => {
    const ab = haversineDistance(41.88, -87.63, 34.05, -118.24);
    const ba = haversineDistance(34.05, -118.24, 41.88, -87.63);
    expect(ab).toBeCloseTo(ba);
  });

  it("handles cross-hemisphere distances", () => {
    // New York to London (~3459 miles)
    const distance = haversineDistance(40.71, -74.01, 51.51, -0.13);
    expect(distance).toBeGreaterThan(3400);
    expect(distance).toBeLessThan(3500);
  });
});

describe("findNearestStation", () => {
  it("returns null for an empty station list", () => {
    expect(findNearestStation(41.0, -87.0, [])).toBeNull();
  });

  it("returns null when no stations have coordinates", () => {
    const stations = [makeStation({ lat: undefined, lng: undefined })];
    expect(findNearestStation(41.0, -87.0, stations)).toBeNull();
  });

  it("finds the closest station", () => {
    const chicago = makeStation({
      name: "Chicago",
      callLetters: "WMBI",
      lat: 41.9278,
      lng: -88.00695,
    });
    const cleveland = makeStation({
      name: "Cleveland",
      callLetters: "WCRF",
      lat: 41.29679,
      lng: -81.65726,
    });
    const spokane = makeStation({
      name: "Spokane",
      callLetters: "KMBI",
      lat: 47.57051,
      lng: -117.08334,
    });

    // User in downtown Chicago
    const result = findNearestStation(41.88, -87.63, [
      chicago,
      cleveland,
      spokane,
    ]);
    expect(result).not.toBeNull();
    expect(result!.station.name).toBe("Chicago");
  });

  it("returns the distance along with the station", () => {
    const station = makeStation({ lat: 41.9278, lng: -88.00695 });
    // User very close to the station
    const result = findNearestStation(41.93, -88.01, [station]);
    expect(result!.distance).toBeLessThan(1); // less than 1 mile
  });

  it("skips stations without coordinates", () => {
    const withCoords = makeStation({
      name: "Has Coords",
      lat: 41.0,
      lng: -87.0,
    });
    const withoutCoords = makeStation({
      name: "No Coords",
      lat: undefined,
      lng: undefined,
    });

    const result = findNearestStation(41.0, -87.0, [withoutCoords, withCoords]);
    expect(result!.station.name).toBe("Has Coords");
  });
});
