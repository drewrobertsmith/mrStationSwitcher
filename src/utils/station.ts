import { Station } from "@/types/types";
import { Track } from "@/providers/audio-provider";

export function stationToTrack(item: Station): Track {
  return {
    id: item.tritonId,
    url: item.stream,
    fallbackUrl: item.fallbackstream,
    title: item.frequency ? `${item.frequency} - ${item.name}` : item.name,
    artist: item.callLetters,
    artwork: item.logo,
    isLiveStream: true,
    backgroundColor: item.backgroundColor,
    accentColor: item.accentColor,
  };
}

export function parseFrequency(freq: string): number {
  const num = parseFloat(freq);
  return isNaN(num) ? Infinity : num;
}
