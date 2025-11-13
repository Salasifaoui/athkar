/**
 * Calculate Qibla direction (bearing) from user's location to Kaaba
 * Kaaba coordinates: 21.4225° N, 39.8262° E
 * 
 * @param latitude User's latitude in degrees
 * @param longitude User's longitude in degrees
 * @returns Qibla bearing in degrees (0-360, where 0 is North)
 */
export function calculateQiblaDirection(
  latitude: number,
  longitude: number
): number {
  // Kaaba coordinates
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

  // Convert to radians
  const lat1 = (latitude * Math.PI) / 180;
  const lon1 = (longitude * Math.PI) / 180;
  const lat2 = (kaabaLat * Math.PI) / 180;
  const lon2 = (kaabaLon * Math.PI) / 180;

  // Calculate bearing using the formula
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  // Calculate bearing in degrees
  let bearing = (Math.atan2(y, x) * 180) / Math.PI;

  // Normalize to 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
}

