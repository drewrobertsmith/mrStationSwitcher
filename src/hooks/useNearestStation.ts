import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { LOCAL_STATION_DATA } from "@/api/local-stations";
import { Station } from "@/types/types";

const MILES_THRESHOLD = 50;
const EARTH_RADIUS_MILES = 3958.8;

const MB2_FALLBACK = LOCAL_STATION_DATA.find((s) => s.callLetters === "MDRN")!;

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearest(
  lat: number,
  lng: number,
): { station: Station; distance: number } | null {
  let best: { station: Station; distance: number } | null = null;

  for (const station of LOCAL_STATION_DATA) {
    if (station.lat == null || station.lng == null) continue;
    const d = haversineDistance(lat, lng, station.lat, station.lng);
    if (!best || d < best.distance) {
      best = { station, distance: d };
    }
  }
  console.log(best);
  return best;
}

export function useNearestStation() {
  const [station, setStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("[useNearestStation] permission status:", status);
      if (cancelled) return;

      if (status !== "granted") {
        console.log("[useNearestStation] permission denied, using MB2 fallback");
        setStation(MB2_FALLBACK);
        setIsLoading(false);
        return;
      }

      let location: Location.LocationObject | null = null;
      try {
        // Try cached location first — works reliably on Android emulators
        location = await Location.getLastKnownPositionAsync();
        console.log("[useNearestStation] lastKnown:", location?.coords);
        if (!location) {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
        }
      } catch (e) {
        console.log("[useNearestStation] location unavailable, using MB2 fallback", e);
        if (!cancelled) {
          setStation(MB2_FALLBACK);
          setIsLoading(false);
        }
        return;
      }
      if (!location) {
        console.log("[useNearestStation] no location available, using MB2 fallback");
        if (!cancelled) {
          setStation(MB2_FALLBACK);
          setIsLoading(false);
        }
        return;
      }
      if (cancelled) return;

      const { latitude, longitude } = location.coords;
      console.log("[useNearestStation] coords:", latitude, longitude);
      const nearest = findNearest(latitude, longitude);
      console.log(
        "[useNearestStation] nearest:",
        nearest?.station.name,
        "distance:",
        nearest?.distance.toFixed(1),
        "miles",
      );

      if (nearest && nearest.distance <= MILES_THRESHOLD) {
        setStation(nearest.station);
      } else {
        console.log("[useNearestStation] no station within 50mi, using MB2 fallback");
        setStation(MB2_FALLBACK);
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { station, isLoading };
}
