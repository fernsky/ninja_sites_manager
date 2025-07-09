"use client";

import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  MapIcon,
  AlertTriangle,
  ArrowDownCircle,
  Building2,
  CheckSquare,
  MapPin,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useMapViewStore } from "@/store/toggle-layer-store";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject } from "geojson";

// Import only Leaflet types for TypeScript support, not the actual library
import type { LatLngBounds, LatLng } from "leaflet";

// Dynamic imports for all Leaflet/react-leaflet components with ssr: false
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

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false },
);

// Helper component to fit map bounds to areas, ward boundary, and GPS points
const MapUpdater = dynamic(
  () =>
    Promise.resolve(
      ({
        areas,
        wardGeometry,
        gpsPoints,
      }: {
        areas: any[];
        wardGeometry?: GeoJsonObject;
        gpsPoints?: any[];
      }) => {
        // Only import and use useMap inside this component
        const useMapHook = require("react-leaflet").useMap;
        const map = useMapHook();
        const L = require("leaflet");

        useEffect(() => {
          try {
            const bounds = new L.LatLngBounds([]);
            let hasValidBounds = false;

            // Process ward geometry if available
            if (wardGeometry) {
              try {
                // Handle different types of GeoJSON geometries
                if (
                  wardGeometry.type === "Feature" &&
                  (wardGeometry as any).geometry
                ) {
                  const geometry = (wardGeometry as any).geometry;
                  const coordinates =
                    geometry.type === "Polygon"
                      ? geometry.coordinates[0]
                      : geometry.type === "MultiPolygon"
                        ? geometry.coordinates.flat(1)
                        : null;

                  if (coordinates) {
                    coordinates.forEach((coord: number[]) => {
                      if (Array.isArray(coord) && coord.length >= 2) {
                        bounds.extend(new L.LatLng(coord[1], coord[0]));
                        hasValidBounds = true;
                      }
                    });
                  }
                } else if (wardGeometry.type === "Polygon") {
                  const coordinates = (wardGeometry as any).coordinates?.[0];
                  if (coordinates) {
                    coordinates.forEach((coord: number[]) => {
                      if (Array.isArray(coord) && coord.length >= 2) {
                        bounds.extend(new L.LatLng(coord[1], coord[0]));
                        hasValidBounds = true;
                      }
                    });
                  }
                } else if (wardGeometry.type === "MultiPolygon") {
                  const allCoords = (wardGeometry as any).coordinates?.flat(1);
                  if (allCoords) {
                    allCoords.forEach((coord: number[]) => {
                      if (Array.isArray(coord) && coord.length >= 2) {
                        bounds.extend(new L.LatLng(coord[1], coord[0]));
                        hasValidBounds = true;
                      }
                    });
                  }
                }
              } catch (error) {
                console.error("Error processing ward geometry:", error);
              }
            }

            // Process area geometries if available
            if (Array.isArray(areas) && areas.length > 0) {
              areas.forEach((area) => {
                if (!area?.geometry) return;

                try {
                  // For GeoJSON polygons/multipolygons, get all coordinates
                  const coordinates =
                    area.geometry.type === "Polygon"
                      ? area.geometry.coordinates[0]
                      : area.geometry.type === "MultiPolygon"
                        ? area.geometry.coordinates.flat(1)
                        : null;

                  if (coordinates) {
                    coordinates.forEach((coord: number[]) => {
                      if (Array.isArray(coord) && coord.length >= 2) {
                        bounds.extend(new L.LatLng(coord[1], coord[0]));
                        hasValidBounds = true;
                      }
                    });
                  }
                } catch (err) {
                  console.error(
                    `Error processing area geometry for area ${area.id}:`,
                    err,
                  );
                }
              });
            }

            // Process GPS points if available
            if (Array.isArray(gpsPoints) && gpsPoints.length > 0) {
              gpsPoints.forEach((point) => {
                if (
                  point.gpsPoint &&
                  point.gpsPoint.lat &&
                  point.gpsPoint.lng
                ) {
                  bounds.extend(
                    new L.LatLng(point.gpsPoint.lat, point.gpsPoint.lng),
                  );
                  hasValidBounds = true;
                }
              });
            }

            // Fit map to bounds with some padding if we have valid bounds
            if (hasValidBounds && bounds.isValid()) {
              map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
              });
            } else {
              // Fallback to a default view of Nepal if no valid bounds
              map.setView([26.72069444681497, 88.04840072844279], 13);
            }
          } catch (error) {
            console.error("Error in MapUpdater:", error);
            // Set default view as fallback
            map.setView([26.72069444681497, 88.04840072844279], 13);
          }
        }, [areas, wardGeometry, gpsPoints, map]);

        return null;
      },
    ),
  { ssr: false },
);

// Function to determine area color based on status
const getAreaStyleByStatus = (status: string | null) => {
  switch (status) {
    case "completed":
      return {
        color: "#047857", // darker green for boundary
        fillColor: "#10b981",
        weight: 3,
        opacity: 0.9,
        fillOpacity: 0.4,
      };
    case "ongoing_survey":
      return {
        color: "#1e40af", // darker blue for boundary
        fillColor: "#3b82f6",
        weight: 2.5,
        opacity: 0.8,
        fillOpacity: 0.3,
      };
    case "asked_for_completion":
      return {
        color: "#b45309", // darker amber for boundary
        fillColor: "#f59e0b",
        weight: 2.5,
        opacity: 0.8,
        fillOpacity: 0.3,
      };
    case "revision":
      return {
        color: "#b91c1c", // darker red for boundary
        fillColor: "#ef4444",
        weight: 2.5,
        opacity: 0.8,
        fillOpacity: 0.3,
      };
    case "newly_assigned":
      return {
        color: "#6d28d9", // darker purple for boundary
        fillColor: "#8b5cf6",
        weight: 2.5,
        opacity: 0.8,
        fillOpacity: 0.3,
      };
    default:
      // For unassigned/remaining areas - use reddish alert color
      return {
        color: "#dc2626", // red boundary for remaining areas
        fillColor: "#fee2e2", // light red fill
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3,
        dashArray: "3",
      };
  }
};

// Function to get marker icon based on submission type
const getMarkerIcon = (type: string) => {
  const L = require("leaflet");

  const iconSize = [25, 25];

  // Define icon options based on submission type
  let iconUrl;
  let iconColor;

  switch (type) {
    case "building":
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png";
      iconColor = "#ef4444";
      break;
    case "family":
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png";
      iconColor = "#3b82f6";
      break;
    case "business":
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png";
      iconColor = "#10b981";
      break;
    default:
      iconUrl =
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png";
      iconColor = "#000000";
  }

  return {
    icon: new L.Icon({
      iconUrl,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: iconSize,
      iconAnchor: [12, 25],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    }),
    color: iconColor,
  };
};

// Component for rendering the map section
const MapSection = dynamic(
  () =>
    Promise.resolve(
      ({
        areasForMap,
        wardGeometry,
        buildingGpsPoints,
        isLoading,
        isStreetView,
        toggleView,
      }: {
        areasForMap: any[];
        wardGeometry: any;
        buildingGpsPoints: any[] | undefined;
        isLoading: boolean;
        isStreetView: boolean;
        toggleView: () => void;
      }) => {
        return (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-[500px] md:h-[600px] w-full relative rounded-xl overflow-hidden bg-white shadow-sm"
          >
            {isLoading ? (
              <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            ) : (
              <>
                <MapContainer
                  className="h-full w-full"
                  center={[26.72069444681497, 88.04840072844279]}
                  zoom={13}
                  scrollWheelZoom={true}
                >
                  {/* Fit map to areas, ward boundary and GPS points */}
                  <MapUpdater
                    areas={areasForMap || []}
                    wardGeometry={wardGeometry as unknown as GeoJsonObject}
                    gpsPoints={buildingGpsPoints || []}
                  />

                  {/* Base map tile layer */}
                  <TileLayer
                    key={isStreetView ? "street" : "satellite"}
                    attribution={
                      isStreetView
                        ? "© OpenStreetMap contributors"
                        : "© Google"
                    }
                    url={
                      isStreetView
                        ? "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        : "https://mt1.google.com/vt/lyrs=y,h&x={x}&y={y}&z={z}"
                    }
                  />

                  {/* Ward Boundary - Show in red */}
                  {wardGeometry && (
                    <GeoJSON
                      data={wardGeometry as unknown as GeoJsonObject}
                      style={{
                        color: "#991b1b", // darker red color
                        weight: 4,
                        opacity: 0.9,
                        fillColor: "#fee2e2",
                        fillOpacity: 0.1,
                        dashArray: "5, 5",
                      }}
                    />
                  )}

                  {/* Map View Toggle */}
                  <div className="absolute top-2 right-2 z-[1000] leaflet-control">
                    <div
                      className="bg-white px-2 py-1 rounded-md shadow-md cursor-pointer text-sm"
                      onClick={toggleView}
                    >
                      {isStreetView ? "Satellite View" : "Street View"}
                    </div>
                  </div>

                  {/* Area Polygons */}
                  {areasForMap?.map(
                    (area) =>
                      area.geometry && (
                        <GeoJSON
                          key={area.id}
                          data={area.geometry as GeoJsonObject}
                          style={{
                            color:
                              area.areaStatus === "completed"
                                ? "#047857"
                                : "#dc2626",
                            fillColor:
                              area.areaStatus === "completed"
                                ? "#10b981"
                                : "#fee2e2",
                            weight: 3,
                            opacity: 0.9,
                            fillOpacity:
                              area.areaStatus === "completed" ? 0.4 : 0.3,
                            dashArray:
                              area.areaStatus === "completed" ? undefined : "3",
                          }}
                        >
                          <Popup>
                            <div className="p-2 w-48">
                              <div className="font-medium text-sm mb-1">
                                Area {area.code}
                              </div>
                              <div className="text-xs mb-2">
                                Ward {area.wardNumber}
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    Status:
                                  </span>
                                  <span className="text-xs font-medium">
                                    {area.areaStatus
                                      ? area.areaStatus
                                          .replace(/_/g, " ")
                                          .toUpperCase()
                                      : "Unassigned"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-500">
                                    Assigned to:
                                  </span>
                                  <span className="text-xs font-medium">
                                    {area.assignedToName || "Not assigned"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Popup>
                        </GeoJSON>
                      ),
                  )}

                  {/* Building GPS Points as blue dots */}
                  {buildingGpsPoints?.map((point) => {
                    if (
                      !point.gpsPoint ||
                      !point.gpsPoint.lat ||
                      !point.gpsPoint.lng
                    )
                      return null;

                    return (
                      <CircleMarker
                        key={`building-${point.id}`}
                        center={[point.gpsPoint.lat, point.gpsPoint.lng]}
                        radius={2}
                        pathOptions={{
                          color: "#1e40af", // Border color (darker blue)
                          weight: 1,
                          fillColor: "#3b82f6", // Fill color (blue)
                          fillOpacity: 0.8,
                        }}
                      >
                        <Popup>
                          <div className="p-2 w-48">
                            <div className="font-medium text-sm mb-1 text-blue-600">
                              Building Location
                            </div>
                            <div className="text-xs mb-1">
                              Area: {point.areaCode || "Unknown"}
                            </div>
                            {point.locality && (
                              <div className="text-xs">
                                Locality: {point.locality}
                              </div>
                            )}
                            {point.enumeratorName && (
                              <div className="text-xs mt-1">
                                Enumerator: {point.enumeratorName}
                              </div>
                            )}
                          </div>
                        </Popup>
                      </CircleMarker>
                    );
                  })}
                </MapContainer>
              </>
            )}
          </motion.div>
        );
      },
    ),
  { ssr: false },
);

export default function RemainingLocationsPage() {
  const [selectedWard, setSelectedWard] = useState<string>();
  const { isStreetView, toggleView } = useMapViewStore();

  // Fetch ward boundary data
  const { data: wardData, isLoading: isWardLoading } =
    api.ward.getWardByNumber.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : 0 },
      { enabled: !!selectedWard },
    );

  // Fetch areas with status for the selected ward
  const { data: areasWithStatus, isLoading: isAreasLoading } =
    api.area.getAllAreasWithStatus.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  // Fetch area boundaries for map display
  const { data: allLayerAreas } = api.area.getLayerAreas.useQuery(undefined, {
    enabled: !!selectedWard,
  });

  // Fetch GPS points by ward for buildings only
  const { data: buildingGpsPoints, isLoading: isBuildingGpsLoading } =
    api.building.getGpsByWard.useQuery(
      { wardNumber: selectedWard || "0" },
      { enabled: !!selectedWard },
    );

  // Filter layer areas by ward
  const filteredLayerAreas = allLayerAreas?.filter(
    (area) => selectedWard && area.wardNumber === parseInt(selectedWard),
  );

  // Process areas data to include status
  const areasForMap = filteredLayerAreas?.map((area) => {
    const areaWithStatusInfo = areasWithStatus?.find((a) => a.id === area.id);
    return {
      ...area,
      areaStatus: areaWithStatusInfo?.areaStatus || null,
      assignedTo: areaWithStatusInfo?.assignedTo || null,
      assignedToName: areaWithStatusInfo?.assigned_to_name || null,
    };
  });

  // Calculate area status counts
  const statusCounts = {
    total: areasWithStatus?.length || 0,
    completed:
      areasWithStatus?.filter((a) => a.areaStatus === "completed").length || 0,
    ongoing:
      areasWithStatus?.filter((a) => a.areaStatus === "ongoing_survey")
        .length || 0,
    unassigned: areasWithStatus?.filter((a) => !a.assignedTo).length || 0,
  };

  // Building GPS point count
  const buildingCount = buildingGpsPoints?.length || 0;

  const isLoading = isWardLoading || isAreasLoading || isBuildingGpsLoading;

  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: any;
    title: string;
    value: string | number;
    color?: string;
  }) => (
    <Card className={`flex items-center space-x-4 p-4 ${color}`}>
      <div className="rounded-full bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  );

  return (
    <ContentLayout title="">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6"
      >
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Ward Selection Dropdown */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col gap-4 bg-white p-3 md:p-4 rounded-lg shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedWard} onValueChange={setSelectedWard}>
                <SelectTrigger className="w-[200px] border-gray-200">
                  <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((ward) => (
                    <SelectItem key={ward} value={ward.toString()}>
                      Ward {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Placeholder message when no ward is selected */}
          {!selectedWard ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm space-y-4 text-center"
            >
              <MapIcon className="w-16 h-16 text-gray-400" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Remaining Locations
                </h2>
                <p className="text-gray-500 max-w-md">
                  View areas that still need to be covered. Start by selecting a
                  ward from the dropdown above.
                </p>
              </div>
              <ArrowDownCircle className="w-6 h-6 text-blue-500 animate-bounce mt-4" />
            </motion.div>
          ) : (
            <>
              {/* Statistics Grid */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <StatCard
                  icon={Building2}
                  title="Total Areas"
                  value={statusCounts.total}
                />
                <StatCard
                  icon={CheckSquare}
                  title="Completed"
                  value={statusCounts.completed}
                />
                <StatCard
                  icon={MapPin}
                  title="Building Points"
                  value={buildingCount}
                />
                <StatCard
                  icon={AlertTriangle}
                  title="Unassigned"
                  value={statusCounts.unassigned}
                />
              </motion.div>

              {/* Map Section - Uses client-side only component */}
              {typeof window !== "undefined" && (
                <MapSection
                  areasForMap={areasForMap || []}
                  wardGeometry={wardData?.geometry}
                  buildingGpsPoints={buildingGpsPoints}
                  isLoading={isLoading}
                  isStreetView={isStreetView}
                  toggleView={toggleView}
                />
              )}

              {/* Legend for the map */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-medium text-sm mb-3">Map Legend</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-700 bg-red-100 rounded-sm"></div>
                    <span className="text-xs">Ward Boundary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-800 bg-green-500 rounded-sm"></div>
                    <span className="text-xs">Completed Areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-red-600 bg-red-100 rounded-sm"></div>
                    <span className="text-xs">Remaining Areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Building Location</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </ContentLayout>
  );
}
