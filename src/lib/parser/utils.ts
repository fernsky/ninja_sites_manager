/**
 * Represents a GeoJSON-like point location structure from ODK
 */
interface GeoPointLocation {
  type: "Point";
  coordinates: [number, number, number]; // [longitude, latitude, altitude]
  properties: {
    accuracy: number; // GPS accuracy in meters
  };
}

/**
 * Structure for processed GPS data
 */
interface ProcessedGPSData {
  gps: string | null;
  altitude: number | null;
  gpsAccuracy: number | null;
}

/**
 * Processes location data from different formats into a standardized GPS structure
 *
 * @param location - Location data either as WKT POINT string or GeoJSON object
 * @returns Processed GPS data with standardized format
 */
export function processGPSData(
  location: string | GeoPointLocation | null,
): ProcessedGPSData {
  const result: ProcessedGPSData = {
    gps: null,
    altitude: null,
    gpsAccuracy: null,
  };

  if (!location) return result;

  if (typeof location === "string") {
    // Parse WKT POINT string format: "POINT (longitude latitude altitude)"
    const matches = location.match(/POINT \(([^ ]+) ([^ ]+) ([^ ]+)\)/);
    if (matches) {
      const [_, longitude, latitude, alt] = matches;
      result.gps = `POINT(${longitude} ${latitude})`; // Convert to PostGIS format
      result.altitude = parseFloat(alt);
    }
  } else if (typeof location === "object") {
    // Handle GeoJSON-like object format from ODK
    const { coordinates, properties } = location;
    if (coordinates && coordinates.length >= 3) {
      const [longitude, latitude, alt] = coordinates;
      result.gps = `POINT(${longitude} ${latitude})`; // Convert to PostGIS format
      result.altitude = alt;
      result.gpsAccuracy = properties?.accuracy;
    }
  }

  return result;
}
