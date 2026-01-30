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

interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
}

interface AudioActions {
  play: (station: Station) => void;
  pause: () => void;
  resume: () => void;
}

interface AudioMeta {
  player: AudioPlayer;
  status: AudioStatus;
}

interface AudioContextValue {
  state: AudioState;
  actions: AudioActions;
  meta: AudioMeta;
}

const Audio = createContext<AudioContextValue | null>(null);

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

  const resume = () => {
    player.play();
  };

  return (
    <Audio.Provider
      value={{
        state: {
          currentTrack,
          isPlaying: status.playing,
        },
        actions: {
          play,
          pause,
          resume,
        },
        meta: {
          player,
          status,
        },
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
