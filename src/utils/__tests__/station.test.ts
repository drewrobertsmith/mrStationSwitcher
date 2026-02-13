import { stationToTrack, parseFrequency } from "../station";
import { Station } from "@/types/types";

const makeStation = (overrides: Partial<Station> = {}): Station => ({
  tritonId: "WMBIFM",
  frequency: "90.1 FM",
  name: "Chicago",
  callLetters: "WMBI",
  logo: "https://example.com/logo.png",
  backgroundColor: "#74a433",
  accentColor: "#003B5C",
  stream: "https://example.com/stream.aac",
  fallbackstream: "https://example.com/stream.mp3",
  ...overrides,
});

describe("stationToTrack", () => {
  it("formats title as 'frequency - name' for local stations", () => {
    const track = stationToTrack(makeStation());
    expect(track.title).toBe("90.1 FM - Chicago");
  });

  it("uses just the name when frequency is empty", () => {
    const track = stationToTrack(
      makeStation({ frequency: "", name: "Praise and Worship" }),
    );
    expect(track.title).toBe("Praise and Worship");
  });

  it("maps tritonId to track id", () => {
    const track = stationToTrack(makeStation({ tritonId: "IM_1" }));
    expect(track.id).toBe("IM_1");
  });

  it("maps stream URLs correctly", () => {
    const track = stationToTrack(makeStation());
    expect(track.url).toBe("https://example.com/stream.aac");
    expect(track.fallbackUrl).toBe("https://example.com/stream.mp3");
  });

  it("maps call letters to artist", () => {
    const track = stationToTrack(makeStation({ callLetters: "WCRF" }));
    expect(track.artist).toBe("WCRF");
  });

  it("maps logo to artwork", () => {
    const track = stationToTrack(makeStation({ logo: "https://cdn.com/art.png" }));
    expect(track.artwork).toBe("https://cdn.com/art.png");
  });

  it("always marks tracks as live streams", () => {
    const track = stationToTrack(makeStation());
    expect(track.isLiveStream).toBe(true);
  });

  it("passes through color values", () => {
    const track = stationToTrack(
      makeStation({ backgroundColor: "#111", accentColor: "#222" }),
    );
    expect(track.backgroundColor).toBe("#111");
    expect(track.accentColor).toBe("#222");
  });
});

describe("parseFrequency", () => {
  it("parses FM frequency", () => {
    expect(parseFrequency("90.1 FM")).toBe(90.1);
  });

  it("parses AM frequency", () => {
    expect(parseFrequency("950 AM")).toBe(950);
  });

  it("parses bare number", () => {
    expect(parseFrequency("103.3")).toBe(103.3);
  });

  it("returns Infinity for empty string", () => {
    expect(parseFrequency("")).toBe(Infinity);
  });

  it("returns Infinity for non-numeric string", () => {
    expect(parseFrequency("Network")).toBe(Infinity);
  });

  it("sorts correctly: FM < AM < non-numeric", () => {
    const freqs = ["950 AM", "90.1 FM", "", "103.3 FM"];
    const sorted = freqs.sort((a, b) => parseFrequency(a) - parseFrequency(b));
    expect(sorted).toEqual(["90.1 FM", "103.3 FM", "950 AM", ""]);
  });
});
