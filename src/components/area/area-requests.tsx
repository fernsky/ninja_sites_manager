"use client";

import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  User2,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "leaflet/dist/leaflet.css";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FilterDrawer } from "@/components/shared/filters/filter-drawer";
import { AreaRequestFilters } from "@/components/area-requests/area-request-filters";
import { useMediaQuery } from "react-responsive";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import dynamic from "next/dynamic";

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

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
} as const;

export default function RequestedAreas() {
  const [filters, setFilters] = useState({
    code: undefined as number | undefined,
    wardNumber: undefined as number | undefined,
    enumeratorId: undefined as string | undefined,
    status: undefined as "pending" | "approved" | "rejected" | undefined,
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const {
    data: requests,
    isLoading,
    error,
    refetch: refetchRequests,
  } = api.area.getAllAreaRequests.useQuery({
    limit: 10,
    offset: page * 10,
    filters: debouncedFilters,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(0);
  };

  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = api.area.updateAreaRequestStatus.useMutation({
    onSuccess: () => {
      toast("The area request status has been updated.");
      setUpdating(null);
      refetchRequests();
    },
    onError: (error) => {
      toast(`Error updating status ${error.message}`);
      setUpdating(null);
    },
  });

  useEffect(() => {
    return () => {
      const containers = document.querySelectorAll(".leaflet-container");
      containers.forEach((container) => {
        // @ts-ignore
        container._leaflet_id = null;
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">
            Loading area requests...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading area requests: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 pt-1">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Manage area access requests from enumerators
        </p>

        {/* Compact Filter Section */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by area code..."
              className="w-full pl-9 h-9"
              value={filters.code || ""}
              onChange={(e) =>
                handleFilterChange(
                  "code",
                  e.target.value ? parseInt(e.target.value) : undefined,
                )
              }
            />
          </div>

          {!isDesktop ? (
            <FilterDrawer title="Filters">
              <AreaRequestFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </FilterDrawer>
          ) : (
            <AreaRequestFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}
        </div>
      </div>

      {requests?.data.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-muted-foreground">No area requests found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {requests?.data.map((request) => (
            <Card
              key={`${request.request.areaId}-${request.request.userId}`}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              {request.area?.geometry! && (
                <div className="h-[140px] w-full">
                  <MapContainer
                    className="h-full w-full z-[20]"
                    zoom={15}
                    scrollWheelZoom={false}
                    center={(() => {
                      const geojson = JSON.parse(
                        request.area.geometry as string,
                      );
                      const bounds = L.geoJSON(geojson).getBounds();
                      return bounds.getCenter();
                    })()}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON
                      data={JSON.parse(request.area.geometry as string)}
                      style={{
                        color: "#2563eb",
                        weight: 2,
                        opacity: 0.6,
                        fillColor: "#3b82f6",
                        fillOpacity: 0.1,
                      }}
                    />
                  </MapContainer>
                </div>
              )}

              <CardContent className="p-4">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Area {request.area?.code}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(request.request.createdAt),
                          {
                            addSuffix: true,
                          },
                        )}
                      </p>
                    </div>
                    <Badge variant="outline">
                      Ward {request.area?.wardNumber}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User2 className="h-4 w-4" />
                      <span>{request.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{request.user?.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Ward {request.user?.wardNumber}</span>
                    </div>
                    {request.request.message && (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mt-0.5" />
                        <p className="text-xs italic flex-1">
                          "{request.request.message}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {request.request.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-800"
                      disabled={!!updating}
                      onClick={() => {
                        setUpdating(
                          `${request.request.areaId}-${request.request.userId}`,
                        );
                        updateStatus.mutate({
                          areaId: request.request.areaId,
                          userId: request.request.userId,
                          status: "approved",
                        });
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-800"
                      disabled={!!updating}
                      onClick={() => {
                        setUpdating(
                          `${request.request.areaId}-${request.request.userId}`,
                        );
                        updateStatus.mutate({
                          areaId: request.request.areaId,
                          userId: request.request.userId,
                          status: "rejected",
                        });
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <Badge
                    className={`w-full justify-center ${
                      statusColors[
                        request.request.status as keyof typeof statusColors
                      ]
                    }`}
                  >
                    {request?.request?.status
                      ? request.request.status.charAt(0).toUpperCase() +
                        request.request.status.slice(1)
                      : ""}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {requests?.data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground text-center">
            Showing {Math.min((page + 1) * 10, requests.pagination.total)} of{" "}
            {requests.pagination.total} requests
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[100px] text-center font-medium">
              Page {page + 1} of{" "}
              {Math.ceil(
                requests.pagination.total / requests.pagination.pageSize,
              )}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage(
                  Math.min(
                    Math.ceil(
                      requests.pagination.total / requests.pagination.pageSize,
                    ) - 1,
                    page + 1,
                  ),
                )
              }
              disabled={
                page >=
                Math.ceil(
                  requests.pagination.total / requests.pagination.pageSize,
                ) -
                  1
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
