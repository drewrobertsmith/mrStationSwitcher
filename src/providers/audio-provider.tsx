import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AudioPlayer,
  AudioStatus,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Station } from "@/types/types";
import { ColorValue } from "react-native";

export interface Track {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  isLiveStream: boolean;
  accentColor: ColorValue;
  backgroundColor: ColorValue;
}

interface AudioProviderType {
  player: AudioPlayer;
  status: AudioStatus;
  play: (item: Station) => void;
  pause: () => void;
  currentTrack: Track | null;
}

const Audio = createContext<AudioProviderType | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const stationToTrack = (item: Station): Track => {
    return {
      id: item.tritonId,
      url: item.fallbackstream,
      title: item.name,
      artist: item.callLetters,
      artwork: item.logo,
      isLiveStream: true,
      backgroundColor: item.backgroundColor,
      accentColor: item.accentColor,
    };
  };

  useEffect(() => {
    player.updateLockScreenMetadata({
      title: currentTrack?.title,
      artist: currentTrack?.artist,
    });
  }, [player, currentTrack]);

  const play = (station: Station) => {
    const item = stationToTrack(station);
    setCurrentTrack(item);
    player.replace({
      uri: item.url,
    });
    player.play();
  };

  const pause = () => {
    player.pause();
  };

  return (
    <Audio.Provider
      value={{
        player,
        status,
        play,
        pause,
        currentTrack,
      }}
    >
      {children}
    </Audio.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(Audio);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
