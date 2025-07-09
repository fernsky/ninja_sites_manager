"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { Area } from "@/server/api/routers/areas/area.schema";
import L from "leaflet";
import { useMapViewStore } from "@/store/toggle-layer-store";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

export default function ViewAreaMap({ area }: { area: Area }) {
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  const { isStreetView, toggleView } = useMapViewStore();

  useEffect(() => {
    if (area.geometry) {
      const geoJsonLayer = L.geoJSON(area.geometry);
      setBounds(geoJsonLayer.getBounds());
    }
  }, [area]);

  if (!area.geometry || !bounds) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-3 left-10 z-[400]">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white"
          onClick={(e) => {
            e.preventDefault();
            toggleView();
          }}
        >
          <MapIcon className="h-4 w-4 mr-2" />
          {isStreetView ? "Satellite View" : "Street View"}
        </Button>
      </div>

      <MapContainer
        bounds={bounds}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        scrollWheelZoom={false}
        className="z-20"
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
        <GeoJSON
          data={area.geometry}
          style={{
            color: "#000",
            weight: 2,
            fillOpacity: 0.2,
          }}
        />
      </MapContainer>
    </div>
  );
}
