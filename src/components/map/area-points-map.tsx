"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMapViewStore } from "@/store/toggle-layer-store";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";
import { Polygon } from "react-leaflet";
import { useRouter } from "next/navigation";
import { cosineDistance } from "drizzle-orm";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false },
);

interface Point {
  id: string;
  name?: string | null; // This can be businessName or headName
  wardNo?: string | null;
  enumeratorName?: string | null; // Add this line
  type: "family" | "business" | "building"; // Add this line
  gpsPoint: {
    lat: number;
    lng: number;
    accuracy: number;
  } | null;
  [key: string]: any;
}

interface AreaPointsMapProps {
  points: Point[];
  boundaries: Array<
    (GeoJSON.Feature | GeoJSON.FeatureCollection) & { areaCode?: string }
  >;
}

export default function AreaPointsMap({
  points,
  boundaries, // Changed prop name
}: AreaPointsMapProps) {
  const router = useRouter();
  const { isStreetView, toggleView } = useMapViewStore();
  const [showAreaCodes, setShowAreaCodes] = useState(false);

  const validPoints = useMemo(
    () =>
      points.filter(
        (p): p is Point & { gpsPoint: NonNullable<Point["gpsPoint"]> } =>
          p.gpsPoint !== null,
      ),
    [points],
  );

  console.log(boundaries);

  // New bounds calculation that includes both points and boundaries
  const bounds = useMemo(() => {
    const allLatLngs: [number, number][] = [];

    // Add points to bounds calculation
    validPoints.forEach((p) =>
      allLatLngs.push([p.gpsPoint.lat, p.gpsPoint.lng]),
    );

    // Add boundary coordinates to bounds calculation
    boundaries.forEach((boundary) => {
      const coords =
        boundary.type === "Feature"
          ? (boundary.geometry as GeoJSON.Polygon).coordinates[0]
          : (boundary as unknown as GeoJSON.Polygon).coordinates[0];

      coords.forEach((coord) => {
        allLatLngs.push([coord[1], coord[0]]);
      });
    });

    return allLatLngs.length > 0 ? L.latLngBounds(allLatLngs) : null;
  }, [validPoints, boundaries]);

  const handleMarkerClick = (point: Point) => {
    console.log("Marker clicked", point.type);
    switch (point.type) {
      case "family":
        router.push(`/families/${point.id}`);
        break;
      case "business":
        router.push(`/businesses/${point.id}`);
        break;
      case "building":
        router.push(`/buildings/${point.id}`);
        break;
    }
  };

  if (!bounds || validPoints.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        No valid GPS points. No Submissions for this area.
      </div>
    );
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-[400] flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white/95 text-xs"
          onClick={() => setShowAreaCodes(!showAreaCodes)}
        >
          {showAreaCodes ? "Hide Area Codes" : "Show Area Codes"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white/95 text-xs"
          onClick={toggleView}
        >
          <MapIcon className="h-3 w-3 mr-1.5" />
          {isStreetView ? "Satellite" : "Street"}
        </Button>
      </div>
      <MapContainer
        bounds={bounds || undefined}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          key={isStreetView ? "street" : "satellite"}
          attribution={
            isStreetView ? "© OpenStreetMap contributors" : "© Google"
          }
          url={
            isStreetView
              ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              : "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}"
          }
        />
        {validPoints.map((point) => (
          <Marker
            key={point.id}
            position={[point.gpsPoint.lat, point.gpsPoint.lng]}
            icon={L.divIcon({
              className:
                "bg-blue-500 w-2 h-2 rounded-full border border-white cursor-pointer",
              iconSize: [8, 8],
            })}
            eventHandlers={{
              click: () => handleMarkerClick(point),
            }}
          >
            <Tooltip permanent={false} direction="top" offset={[0, -5]}>
              <div className="px-2 py-1 text-xs bg-white rounded shadow space-y-0.5">
                {/* <div>ID: {point.id}</div> */}
                {point.name && <div>Name: {point.name}</div>}
                {point.gpsPoint && (
                  <div>GPS Accuracy: {point.gpsPoint.accuracy || 0}m</div>
                )}
                {point.enumeratorName && (
                  <div>Enumerator: {point.enumeratorName}</div>
                )}
                {point.familyHeadName && (
                  <div>Family Head Name: {point.familyHeadName}</div>
                )}
                {point.wardNo && <div>Ward: {point.wardNo}</div>}
              </div>
            </Tooltip>
          </Marker>
        ))}
        {boundaries.map((boundary, index) => {
          // Calculate center of the polygon for label placement
          const coords =
            boundary.type === "Feature"
              ? (boundary.geometry as GeoJSON.Polygon).coordinates[0]
              : (boundary as unknown as GeoJSON.Polygon).coordinates[0];

          const center = coords.reduce(
            (acc, coord) => ({
              lat: acc.lat + coord[1],
              lng: acc.lng + coord[0],
            }),
            { lat: 0, lng: 0 },
          );

          center.lat /= coords.length;
          center.lng /= coords.length;

          return (
            <div key={index}>
              <Polygon
                positions={(boundary.type === "Feature"
                  ? (boundary.geometry as GeoJSON.Polygon).coordinates[0]
                  : (boundary as unknown as GeoJSON.Polygon).coordinates[0]
                ).map((coord: number[]) => [coord[1], coord[0]])}
                pathOptions={{
                  color: `hsl(${(index * 137) % 360}, 70%, 50%)`,
                  weight: 2,
                }}
              >
                {showAreaCodes && (
                  <Tooltip permanent direction="center" offset={[0, 0]}>
                    <div className="px-2 py-1 font-semibold bg-white/90 backdrop-blur-sm rounded shadow">
                      Area {boundary.areaCode}
                    </div>
                  </Tooltip>
                )}
              </Polygon>
            </div>
          );
        })}
      </MapContainer>
    </>
  );
}
