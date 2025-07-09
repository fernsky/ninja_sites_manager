"use client";

import { useMapViewStore } from "@/store/toggle-layer-store";
import { api } from "@/trpc/react";
import { Map, AlertTriangle, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject } from "geojson";
import { useMap, useMapEvents } from "react-leaflet";
import { LatLngBounds, LatLng } from "leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import * as turf from "@turf/turf";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";
import { Label } from "recharts";
import { LoadingButton } from "../loading-button";

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

// Dynamic imports
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const GeoJSON = dynamic(
  () => import("react-leaflet").then((mod) => mod.GeoJSON),
  { ssr: false },
);

interface MapUpdaterProps {
  wardBoundary: any;
  areas: any[];
}

const MapUpdater = ({ wardBoundary, areas }: MapUpdaterProps) => {
  const map = useMap();

  useEffect(() => {
    if (wardBoundary?.geometry) {
      const bounds = new LatLngBounds([]);
      const wardCoords =
        wardBoundary.geometry.type === "Polygon"
          ? wardBoundary.geometry.coordinates[0]
          : wardBoundary.geometry.coordinates.flat(1);

      wardCoords.forEach((coord: number[]) => {
        bounds.extend(new LatLng(coord[1], coord[0]));
      });

      areas?.forEach((area) => {
        const coordinates =
          area.geometry.type === "Polygon"
            ? area.geometry.coordinates[0]
            : area.geometry.coordinates.flat(1);

        coordinates.forEach((coord: number[]) => {
          bounds.extend(new LatLng(coord[1], coord[0]));
        });
      });

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [wardBoundary, areas, map]);

  return null;
};

const RequestPointMap = () => {
  const { isStreetView, toggleView } = useMapViewStore();
  const [selectedPoint, setSelectedPoint] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wardBoundary = api.ward.getWardByNumber.useQuery(
    { wardNumber: selectedWard! },
    { enabled: !!selectedWard },
  );

  const areas = api.area.getAreasByWardforRequest.useQuery(
    { wardNumber: selectedWard! },
    { enabled: !!selectedWard },
  );

  interface PointRequest {
    id: string;
    coordinates: any;
    enumeratorName: string;
    status: string;
    message: string;
    createdAt: Date;
  }

  const pointRequests = api.area.getPointRequestsByWard.useQuery<
    PointRequest[]
  >({ wardNumber: selectedWard! }, { enabled: !!selectedWard });

  const createPointRequest = api.area.createPointRequest.useMutation({
    onSuccess: () => {
      toast.success("Area request submitted successfully");
      setSelectedPoint(null);
      setMessage("");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit request");
    },
  });

  const handleMapClick = (e: LeafletMouseEvent) => {
    if (!selectedWard) return;

    const clickPoint = turf.point([e.latlng.lng, e.latlng.lat]);
    const isInsideExistingArea = areas.data?.some((area) => {
      if (!area.geometry) return false;
      try {
        return turf.booleanPointInPolygon(clickPoint, area.geometry);
      } catch (error) {
        return false;
      }
    });

    if (isInsideExistingArea) {
      toast.error("Cannot request area here - area already exists");
      return;
    }

    setSelectedPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
  };

  const MapEvents = () => {
    useMapEvents({ click: handleMapClick });
    return null;
  };

  const handleRequestConfirm = async () => {
    if (!selectedPoint || !message.trim() || !selectedWard) return;

    setIsSubmitting(true);
    try {
      await createPointRequest.mutateAsync({
        wardNumber: selectedWard,
        coordinates: { lat: selectedPoint.lat, lng: selectedPoint.lng },
        message: message.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 px-2 lg:px-10">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b bg-muted/50 p-4">
          <div className="rounded-md bg-primary/10 p-2">
            <Map className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Select Ward</h3>
            <p className="text-xs text-muted-foreground">
              Choose a ward to view existing areas
            </p>
          </div>
        </div>
        <div className="p-4">
          <Select onValueChange={(value) => setSelectedWard(Number(value))}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  Ward {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b bg-muted/50 p-4">
          <div className="rounded-md bg-primary/10 p-2">
            <Map className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Select Point on Map</h3>
            <p className="text-xs text-muted-foreground">
              Click anywhere to request an area
            </p>
          </div>
        </div>
        <div className="relative h-[600px]">
          {selectedWard ? (
            <>
              <div className="absolute right-2 top-2 z-[400]">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white"
                  onClick={toggleView}
                >
                  <Map className="mr-2 h-4 w-4" />
                  {isStreetView ? "Satellite View" : "Street View"}
                </Button>
              </div>
              <MapContainer
                center={[26.72069444681497, 88.04840072844279]}
                zoom={13}
                className="h-full w-full z-10"
              >
                <MapEvents />
                {wardBoundary.data && (
                  <MapUpdater
                    wardBoundary={wardBoundary.data}
                    areas={areas.data || []}
                  />
                )}

                {/* Map Layers */}
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

                {/* Ward Boundary */}
                {wardBoundary.data?.geometry && (
                  <GeoJSON
                    data={wardBoundary.data.geometry as GeoJsonObject}
                    style={{
                      color: "#6b7280",
                      weight: 3,
                      opacity: 0.8,
                      fillColor: "#6b7280",
                      fillOpacity: 0.1,
                    }}
                  />
                )}

                {/* Existing Areas */}
                {areas.data?.map((area) => (
                  <GeoJSON
                    key={area.code}
                    data={area.geometry as GeoJsonObject}
                    style={{
                      color:
                        area.areaStatus === "completed"
                          ? "#dc2626"
                          : area.assignedTo
                            ? "#9ca3af"
                            : "#2563eb",
                      weight: 2,
                      opacity: 0.6,
                      fillColor:
                        area.areaStatus === "completed"
                          ? "#ef4444"
                          : area.assignedTo
                            ? "#d1d5db"
                            : "#3b82f6",
                      fillOpacity: area.areaStatus === "completed" ? 0.3 : 0.1,
                    }}
                  />
                ))}

                {/* Point Requests */}
                {pointRequests.data?.map((request) => {
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

                {/* Selected Point */}
                {selectedPoint && (
                  <Marker position={[selectedPoint.lat, selectedPoint.lng]}>
                    <Popup>
                      <div className="w-64 p-2">
                        <h3 className="font-medium mb-2">
                          Request Area in this Region?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          GPS: {selectedPoint.lat.toFixed(6)},{" "}
                          {selectedPoint.lng.toFixed(6)}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => setIsDialogOpen(true)}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            Request Area
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedPoint(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-muted/10">
              <div className="text-center space-y-2">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">
                  Please select a ward to view the map
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request New Area</DialogTitle>
          </DialogHeader>
          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Submitting your request...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea
                    placeholder="Describe why you need an area here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  GPS: {selectedPoint?.lat.toFixed(6)},{" "}
                  {selectedPoint?.lng.toFixed(6)}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRequestConfirm}
                  disabled={isSubmitting || !message.trim()}
                >
                  Submit Request
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestPointMap;
