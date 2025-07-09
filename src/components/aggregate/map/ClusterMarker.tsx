import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useAggregateStore } from "@/hooks/use-aggregate-store";

// Create a custom icon for clusters
const createClusterIcon = (count: number) => {
  const size = Math.min(Math.max(30, 10 + count * 0.4), 50); // Size based on count with min/max
  return L.divIcon({
    html: `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${size}px;
      height: ${size}px;
      background-color: rgba(59, 130, 246, 0.8);
      border: 2px solid #fff;
      border-radius: 50%;
      color: #fff;
      font-weight: bold;
      font-size: ${size / 3}px;
    ">${count}</div>`,
    className: "",
    iconSize: [size, size],
  });
};

type ClusterMarkerProps = {
  cluster: {
    id: string;
    position: {
      lat: number;
      lng: number;
    };
    count: number;
    buildingCount: number;
    householdCount: number;
    businessCount: number;
    wardNumbers: number[];
  };
  onClick: () => void;
};

export function ClusterMarker({ cluster, onClick }: ClusterMarkerProps) {
  const { map, toggleClusterExpansion } = useAggregateStore();
  const isExpanded = map?.clusterExpansion?.has(cluster.id) || false;

  const handleClick = () => {
    toggleClusterExpansion(cluster.id);
    onClick();
  };

  return (
    <Marker
      position={[cluster.position.lat, cluster.position.lng]}
      icon={createClusterIcon(cluster.count)}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <div className="text-xs">
          <div className="font-semibold">{cluster.count} Buildings</div>
          {cluster.householdCount > 0 && (
            <div>{cluster.householdCount} Households</div>
          )}
          {cluster.businessCount > 0 && (
            <div>{cluster.businessCount} Businesses</div>
          )}
          <div>
            {cluster.wardNumbers.length === 1
              ? `Ward ${cluster.wardNumbers[0]}`
              : `${cluster.wardNumbers.length} Wards`}
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
}
