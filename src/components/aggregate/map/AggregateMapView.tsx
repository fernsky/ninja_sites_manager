import React, { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useAggregateStore } from "@/hooks/use-aggregate-store";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClusterMarker } from "./ClusterMarker";
import { EntityMarker } from "./EntityMarker";
import { InfoWindow } from "./InfoWindow";

// Map event handler component to capture map movements
function MapEventHandler() {
  const { map, setMapCenter, setMapZoom, setMapBounds } = useAggregateStore();
  const leafletMap = useMap();

  useMapEvents({
    moveend: () => {
      const center = leafletMap.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
      setMapZoom(leafletMap.getZoom());

      const bounds = leafletMap.getBounds();
      setMapBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  // Initialize the map with stored state on first render
  useEffect(() => {
    leafletMap.setView([map.center.lat, map.center.lng], map.zoom);
  }, []);

  return null;
}

export function AggregateMapView() {
  const { filters, map } = useAggregateStore();
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<
    "building" | "household" | "business" | null
  >(null);

  // Fetch map entities based on the current bounds
  const { data: mapData, isLoading: isMapLoading } =
    api.aggregate.getMapEntities.useQuery(
      {
        north: map.bounds?.north ?? 90,
        south: map.bounds?.south ?? -90,
        east: map.bounds?.east ?? 180,
        west: map.bounds?.west ?? -180,
        zoom: map.zoom,
        wardId: filters.wardId,
        areaCode: filters.areaCode,
        enumeratorId: filters.enumeratorId,
        mapStatus: filters.mapStatus,
        includeBuildings: true,
        includeHouseholds: true,
        includeBusinesses: true,
        limit: 500,
      },
      {
        enabled: !!map.bounds,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      },
    );

  // Fetch entity details when an entity is selected
  const { data: selectedEntityData, isLoading: isEntityLoading } =
    api.aggregate.getMapEntityById.useQuery(
      {
        id: selectedEntityId!,
        type: selectedEntityType!,
      },
      {
        enabled: !!selectedEntityId && !!selectedEntityType,
        refetchOnWindowFocus: false,
      },
    );

  // Handle marker click
  const handleMarkerClick = (
    id: string,
    type: "building" | "household" | "business",
  ) => {
    setSelectedEntityId(id);
    setSelectedEntityType(type);
  };

  // Handle cluster click
  const handleClusterClick = (clusterId: string) => {
    // Optionally, you can zoom in or expand the cluster
    // For now, let's fetch and display the points in the cluster
    console.log(`Cluster clicked: ${clusterId}`);
  };

  return (
    <div className="relative w-full h-[calc(100vh-180px)]">
      {isMapLoading && (
        <div className="absolute top-4 right-4 z-10">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      <MapContainer
        center={[map.center.lat, map.center.lng]}
        zoom={map.zoom}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventHandler />

        {mapData?.clusters.map((cluster) => (
          <ClusterMarker
            key={cluster.id}
            cluster={cluster}
            onClick={() => handleClusterClick(cluster.id)}
          />
        ))}

        {mapData?.entities.map((entity) => (
          <EntityMarker
            key={entity.id}
            entity={entity}
            onClick={() =>
              handleMarkerClick(entity.id, entity.type as "building")
            }
            isSelected={entity.id === selectedEntityId}
          />
        ))}

        {selectedEntityData && (
          <InfoWindow
            entity={selectedEntityData}
            onClose={() => {
              setSelectedEntityId(null);
              setSelectedEntityType(null);
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
