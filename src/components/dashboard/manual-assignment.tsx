"use client";

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  Map as MapIcon,
  Info,
  Square,
  Users,
  Building2,
  CheckSquare,
  AlertTriangle,
  Map,
  Link,
  Plus,
} from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "leaflet/dist/leaflet.css";
import type { GeoJsonObject } from "geojson";
import type { Session, User } from "lucia";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useMapViewStore } from "@/store/toggle-layer-store";
import { useMap } from "react-leaflet";
import { LatLngBounds, LatLng } from "leaflet";

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

// Add this component before the main RequestArea component
const MapUpdater = ({ areas }: { areas: any[] }) => {
  const map = useMap();

  useEffect(() => {
    if (areas && areas.length > 0) {
      const bounds = new LatLngBounds([]);

      areas.forEach((area) => {
        // For GeoJSON polygons/multipolygons, get all coordinates
        const coordinates =
          area.geometry.type === "Polygon"
            ? area.geometry.coordinates[0]
            : area.geometry.coordinates.flat(1);

        coordinates.forEach((coord: number[]) => {
          // GeoJSON uses [longitude, latitude]
          bounds.extend(new LatLng(coord[1], coord[0]));
        });
      });

      // Fit map to bounds with some padding
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
      });
    }
  }, [areas, map]);

  return null;
};

export default function ManualAssign({ user }: { user: User }) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(
    user.wardNumber,
  );
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const areas = api.area.getAreasByWardforRequest.useQuery(
    { wardNumber: selectedWard! },
    { enabled: !!selectedWard },
  );

  const assignArea = api.area.manualAssignAreaToEnumerator.useMutation({
    onSuccess: () => {
      toast.success(`Area assigned to ${user.name} successfully`);
      setSelectedArea(null);
      setMessage("");
      areas.refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async () => {
    if (!selectedArea) return;
    setIsSubmitting(true);
    try {
      await assignArea.mutateAsync({
        id: selectedArea,
        enumeratorId: user.id,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(areas);

  const { isStreetView, toggleView } = useMapViewStore();

  const StatCard = ({
    icon: Icon,
    title,
    value,
  }: {
    icon: any;
    title: string;
    value: string | number;
  }) => (
    <div className="flex items-center space-x-4 rounded-lg border bg-card p-4">
      <div className="rounded-full bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );

  const InfoCard = ({
    title,
    icon: Icon,
    children,
  }: {
    title: string;
    icon: any;
    children: React.ReactNode;
  }) => (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/50 p-4">
        <div className="rounded-md bg-primary/10 p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">Area Information</p>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  return (
    <ContentLayout
      title="Manual Area Assignment"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>
      }
    >
      <div className="space-y-6 lg:px-10 px-2">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={MapPin}
            title="Total Areas"
            value={areas.data?.length || 0}
          />
          <StatCard
            icon={CheckSquare}
            title="Available Areas"
            value={areas.data?.filter((a) => !a.assignedTo).length || 0}
          />
          <StatCard
            icon={Building2}
            title="Selected Ward"
            value={selectedWard || "Not Selected"}
          />
        </div>

        {/* Ward Selection Card */}
        <InfoCard title="Ward Selection" icon={MapIcon}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select a ward to view available areas for survey requests. Areas
              shown in blue are available for request, while grey areas are
              already assigned.
            </p>
            <Select
              onValueChange={(value) => setSelectedWard(Number(value))}
              //@ts-ignore
            >
              <SelectTrigger className="w-[280px]">
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

            {/* <Button
              variant="link"
              className="text-primary flex items-center gap-2 mt-2"
              onClick={() => router.push("/area/request/request-point")}
            >
              <Plus className="h-4 w-4" />
              No Required Area? Request by Point
            </Button> */}
          </div>
        </InfoCard>

        {/* Map Container */}
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b bg-muted/50 p-4">
            <div className="rounded-md bg-primary/10 p-2">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Area Map</h3>
              <p className="text-xs text-muted-foreground">
                Click on an area to request it
              </p>
            </div>
          </div>
          <div className="h-[600px] relative">
            {selectedWard ? (
              <>
                <div className="absolute top-2 right-2 z-[400]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleView();
                    }}
                  >
                    <Map className="h-4 w-4 mr-2" />
                    {isStreetView ? "Satellite View" : "Street View"}
                  </Button>
                </div>
                <MapContainer
                  className="h-full w-full z-10"
                  center={[26.72069444681497, 88.04840072844279]}
                  zoom={13}
                  scrollWheelZoom={false}
                >
                  {/* Add MapUpdater component here */}
                  {areas.data && <MapUpdater areas={areas.data} />}
                  <TileLayer
                    key={isStreetView ? "street" : "satellite"} // Add this key prop
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
                  {areas.data?.map((area) => (
                    <GeoJSON
                      key={area.code}
                      data={area.geometry as GeoJsonObject}
                      eventHandlers={{
                        click: (e) => {
                          console.log(area);
                          if (area.areaStatus === "completed") {
                            e.originalEvent.stopPropagation();
                            return;
                          }
                        },
                      }}
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
                        fillOpacity:
                          area.areaStatus === "completed" ? 0.3 : 0.1,
                      }}
                    >
                      <Popup className="z-[10000]">
                        <div className="w-64 overflow-hidden rounded-lg bg-white shadow-sm">
                          <div className="border-b bg-muted/50 p-2">
                            <div className="rounded-md bg-primary/10 p-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <h3 className="font-medium text-[14px]">
                                  Area Details
                                </h3>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Code: {area.code}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-3">
                          {area.areaStatus === "completed" ? (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Area is completed</span>
                            </div>
                          ) : !area.assignedTo ? (
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() => setSelectedArea(area.id)}
                            >
                              <MapPin className="mr-2 h-4 w-4" />
                              Assign Area
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>Already assigned</span>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </GeoJSON>
                  ))}
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
        <Dialog
          open={!!selectedArea}
          onOpenChange={() => setSelectedArea(null)}
        >
          <DialogContent className="max-w-[600px] rounded-xl p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-2.5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    Request Area{" "}
                    {areas.data?.find((area) => area.id === selectedArea)?.code}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5">
                    Submit a request to survey this geographical area
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Request Message</span>
                </div>
                <Textarea
                  placeholder="Note why assigned to this enumerator"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] resize-none text-base focus-visible:ring-primary"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-3"></div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your request will be reviewed by administrators. Make sure to
                  provide clear and specific details about your survey plans.
                </p>
              </div>
            </div>

            <DialogFooter className="px-6 py-4 bg-muted/30 border-t">
              <div className="flex justify-end gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setSelectedArea(null)}
                  disabled={isSubmitting}
                  className="px-5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckSquare className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
