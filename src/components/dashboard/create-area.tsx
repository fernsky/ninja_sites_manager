"use client";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { MapStateProvider, useMapContext } from "@/lib/map-state";
import React from "react";
import { LayerControl } from "../map/layer-control";
import { useLayerStore } from "@/store/use-layer-store";
import { api } from "@/trpc/react";
import { GeoJsonObject } from "geojson";
import { Button } from "@/components/ui/button";
import { MapIcon, MapPinned } from "lucide-react";
import { useMapViewStore } from "@/store/toggle-layer-store";
import { LayerControlWrapper } from "../map/layer-control-wrapper";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Map = dynamic(
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

const MapDrawer = dynamic(
  () => import("../map/map-drawer").then((mod) => mod.MapDrawer),
  { ssr: false },
);

interface CreateAreaMapProps {
  id: string;
  onGeometryChange: (geometry: any) => void;
}

const isValidGeoJSON = (geometry: any) => {
  // Add your validation logic here
  return true;
};

const CreateAreaMap = ({ onGeometryChange }: CreateAreaMapProps) => {
  const { geometry } = useMapContext();
  const { wards, areas, wardLayers } = useLayerStore();
  const { isStreetView, toggleView } = useMapViewStore();
  const [showPointRequests, setShowPointRequests] = React.useState(false);
  const [selectedWard, setSelectedWard] = React.useState<number | null>(null);

  interface PointRequest {
    id: string;
    coordinates: any;
    enumeratorName: string;
    status: string;
    message: string;
    createdAt: Date;
  }

  // Add query for point requests
  const pointRequests = api.area.getPointRequestsByWard.useQuery<
    PointRequest[]
  >(
    { wardNumber: selectedWard! },
    {
      enabled: !!selectedWard && showPointRequests,
    },
  );

  // Effect to set selected ward based on visible ward layers
  React.useEffect(() => {
    const visibleWard = Object.entries(wardLayers).find(
      ([_, value]) => value.visible,
    );
    if (visibleWard) {
      setSelectedWard(Number(visibleWard[0]));
    } else {
      setSelectedWard(null);
    }
  }, [wardLayers]);

  React.useEffect(() => {
    onGeometryChange(geometry);
  }, [geometry, onGeometryChange]);

  return (
    <>
      <LayerControlWrapper />
      <Card className="relative mt-4 min-h-[400px] h-[calc(100vh-400px)]">
        <div className="absolute top-5 left-10 z-[400] flex items-center gap-4">
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

          {/* Redesigned Toggle Button */}
          <Button
            variant="secondary"
            size="sm"
            className={`relative pl-9 transition-colors ${
              showPointRequests
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => setShowPointRequests(!showPointRequests)}
          >
            <MapPinned
              className={`h-4 w-4 absolute left-2.5 transition-colors ${
                showPointRequests ? "text-primary" : "text-muted-foreground"
              }`}
            />
            Area Requests
            <span
              className={`ml-2 rounded-full h-2 w-2 ${
                showPointRequests ? "bg-primary" : "bg-muted"
              }`}
            />
          </Button>
        </div>
        <Map
          center={[26.92632339689546, 87.37272328644147]}
          zoom={13}
          className="h-full w-full rounded-md"
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

          {/* Background Layers */}
          {wards.map((ward) => {
            if (!wardLayers[ward.wardNumber]?.visible || !ward.geometry)
              return null;
            if (!isValidGeoJSON(ward.geometry)) {
              console.warn(`Invalid geometry for ward ${ward.wardNumber}`);
              return null;
            }
            return (
              <GeoJSON
                key={`ward-${ward.wardNumber}`}
                data={ward.geometry as GeoJsonObject}
                style={{
                  fillColor: "#ff7800",
                  weight: 2,
                  opacity: 0.6,
                  color: "blue",
                  fillOpacity: 0.1,
                }}
              />
            );
          })}

          {areas.map((area) => {
            if (!wardLayers[area.wardNumber]?.areas[area.id] || !area.geometry)
              return null;
            if (!isValidGeoJSON(area.geometry)) {
              console.warn(`Invalid geometry for area ${area.id}`);
              return null;
            }
            return (
              <GeoJSON
                key={`area-${area.id}`}
                data={area.geometry as GeoJsonObject}
                style={{
                  fillColor: "#ffcccc",
                  weight: 1,
                  opacity: 0.6,
                  color: "red",
                  fillOpacity: 0.1,
                }}
              />
            );
          })}

          {/* Add Point Request Markers */}
          {showPointRequests &&
            selectedWard &&
            pointRequests.data?.map((request) => {
              if (!request.coordinates?.coordinates) return null;
              const [lng, lat] = request.coordinates.coordinates;

              return (
                <Marker
                  key={request.id}
                  position={[lat, lng]}
                  icon={L.divIcon({
                    className: "custom-div-icon",
                    html: `<div class="bg-yellow-500 w-3 h-3 rounded-full border-2 border-white shadow-md"></div>`,
                    iconSize: [12, 12],
                    iconAnchor: [6, 6],
                  })}
                >
                  <Popup>
                    <div className="space-y-2 p-1">
                      <p className="font-medium">Area Request</p>
                      <p className="text-sm text-muted-foreground">
                        Requested by: {request.enumeratorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status:{" "}
                        <span className="capitalize">{request.status}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Message: {request.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          {/* Drawing Layer - Always on top */}
          <MapDrawer zIndex={10000} />
        </Map>
      </Card>
    </>
  );
};

export { CreateAreaMap, MapStateProvider };
