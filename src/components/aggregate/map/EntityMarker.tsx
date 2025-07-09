import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import { Building, Home, Store } from "lucide-react";

// Create custom icons for each entity type
const buildingIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: rgba(239, 68, 68, 0.8);
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
  "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></div>`,
  className: "",
  iconSize: [30, 30],
});

const householdIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: rgba(16, 185, 129, 0.8);
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
  "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
  className: "",
  iconSize: [30, 30],
});

const businessIcon = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background-color: rgba(79, 70, 229, 0.8);
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
  "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"/></svg></div>`,
  className: "",
  iconSize: [30, 30],
});

// Create selected versions of icons with different border
const buildingIconSelected = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    background-color: rgba(239, 68, 68, 0.8);
    border: 3px solid #fbbf24;
    border-radius: 50%;
    color: #fff;
  "><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg></div>`,
  className: "",
  iconSize: [34, 34],
});

const householdIconSelected = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    background-color: rgba(16, 185, 129, 0.8);
    border: 3px solid #fbbf24;
    border-radius: 50%;
    color: #fff;
  "><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>`,
  className: "",
  iconSize: [34, 34],
});

const businessIconSelected = L.divIcon({
  html: `<div style="
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    background-color: rgba(79, 70, 229, 0.8);
    border: 3px solid #fbbf24;
    border-radius: 50%;
    color: #fff;
  "><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7"/></svg></div>`,
  className: "",
  iconSize: [34, 34],
});

// Get the icon based on entity type and selection state
const getEntityIcon = (type: string, isSelected: boolean) => {
  switch (type) {
    case "building":
      return isSelected ? buildingIconSelected : buildingIcon;
    case "household":
      return isSelected ? householdIconSelected : householdIcon;
    case "business":
      return isSelected ? businessIconSelected : businessIcon;
    default:
      return buildingIcon;
  }
};

// Get an appropriate title for the tooltip
const getEntityTitle = (entity: any) => {
  const { properties, type } = entity;

  switch (type) {
    case "building":
      return properties.title || "Building";
    case "household":
      return properties.headName || "Household";
    case "business":
      return properties.businessName || "Business";
    default:
      return "Entity";
  }
};

// Get a subtitle for the tooltip
const getEntitySubtitle = (entity: any) => {
  const { properties, type } = entity;

  switch (type) {
    case "building":
      return `Ward ${properties.wardNumber || "?"}, Area ${properties.areaCode || "?"}`;
    case "household":
      return `${properties.totalMembers || 0} members`;
    case "business":
      return properties.businessType || "";
    default:
      return "";
  }
};

type EntityMarkerProps = {
  entity: {
    id: string;
    type: string;
    position: {
      lat: number;
      lng: number;
    };
    properties: Record<string, any>;
  };
  onClick: () => void;
  isSelected: boolean;
};

export function EntityMarker({
  entity,
  onClick,
  isSelected,
}: EntityMarkerProps) {
  const icon = getEntityIcon(entity.type, isSelected);
  const title = getEntityTitle(entity);
  const subtitle = getEntitySubtitle(entity);

  return (
    <Marker
      position={[entity.position.lat, entity.position.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Tooltip direction="top" offset={[0, -15]} opacity={1}>
        <div className="text-xs">
          <div className="font-semibold">{title}</div>
          <div>{subtitle}</div>
        </div>
      </Tooltip>
    </Marker>
  );
}
