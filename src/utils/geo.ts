import { Station } from "@/types/types";

const EARTH_RADIUS_MILES = 3958.8;

export function haversineDistance(
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

export function findNearestStation(
  lat: number,
  lng: number,
  stations: Station[],
): { station: Station; distance: number } | null {
  let best: { station: Station; distance: number } | null = null;

  for (const station of stations) {
    if (station.lat == null || station.lng == null) continue;
    const d = haversineDistance(lat, lng, station.lat, station.lng);
    if (!best || d < best.distance) {
      best = { station, distance: d };
    }
  }
  return best;
}
