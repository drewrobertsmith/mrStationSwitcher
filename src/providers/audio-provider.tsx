import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AudioPlayer,
  AudioStatus,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { Station } from "@/types/types";
import { ColorValue } from "react-native";

export interface Track {
  id: string;
  url: string;
  fallbackUrl: string;
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
  isBuffering: boolean;
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

const STALL_TIMEOUT_MS = 10_000;

const Audio = createContext<AudioContextValue | null>(null);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const retryCount = useRef(0);
  const stallTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Configure audio session on mount
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  const stationToTrack = (item: Station): Track => {
    return {
      id: item.tritonId,
      url: item.stream,
      fallbackUrl: item.fallbackstream,
      title: item.name,
      artist: item.callLetters,
      artwork: item.logo,
      isLiveStream: true,
      backgroundColor: item.backgroundColor,
      accentColor: item.accentColor,
    };
  };

  // Update lock screen metadata (including artwork)
  useEffect(() => {
    player.updateLockScreenMetadata({
      title: currentTrack?.title,
      artist: currentTrack?.artist,
      artworkUrl: currentTrack?.artwork,
    });
  }, [player, currentTrack]);

  // Stall detection and retry logic
  useEffect(() => {
    if (!currentTrack) return;

    const isStalled =
      status.isBuffering && !status.playing;

    if (isStalled) {
      // Start stall timer if not already running
      if (!stallTimer.current) {
        stallTimer.current = setTimeout(() => {
          stallTimer.current = null;

          if (retryCount.current === 0) {
            // First retry: same URL (transient network blip)
            console.log("[audio] Stall detected, retrying same URL");
            player.replace({ uri: currentTrack.url });
            player.play();
            retryCount.current = 1;
          } else if (retryCount.current === 1) {
            // Second retry: fallback URL
            console.log("[audio] Retrying with fallback URL");
            player.replace({ uri: currentTrack.fallbackUrl });
            player.play();
            retryCount.current = 2;
          } else {
            // Give up
            console.log("[audio] Max retries reached, stopping");
            player.pause();
          }
        }, STALL_TIMEOUT_MS);
      }
    } else if (status.playing) {
      // Playback recovered — clear stall timer and reset retries
      if (stallTimer.current) {
        clearTimeout(stallTimer.current);
        stallTimer.current = null;
      }
      retryCount.current = 0;
    }

    return () => {
      if (stallTimer.current) {
        clearTimeout(stallTimer.current);
        stallTimer.current = null;
      }
    };
  }, [status.isBuffering, status.playing, currentTrack, player]);

  const play = (station: Station) => {
    const item = stationToTrack(station);
    setCurrentTrack(item);
    retryCount.current = 0;
    // Try AAC stream first
    player.replace({ uri: item.url });
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
          isBuffering: status.isBuffering,
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
