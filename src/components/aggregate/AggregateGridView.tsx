import React from "react";
import { useAggregateStore } from "@/hooks/use-aggregate-store";
import { api } from "@/trpc/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Building,
  Calendar,
  Home,
  MapPin,
  Store,
  User,
  ChevronRight,
  Loader2,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { KerabariAggregateBuilding } from "@/server/db/schema/aggregate-building";

export function AggregateGridView() {
  const {
    filters,
    pagination,
    sorting,
    setPagination,
    view,
    setSelectedBuilding,
  } = useAggregateStore();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Standard query for paginated data
  const { data: buildingsData, isLoading } =
    api.aggregate.getAllBuildingsInfinite.useQuery(
      {
        limit: pagination.limit,
        offset: pagination.offset,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
        filters,
      },
      {
        keepPreviousData: true,
      },
    );

  // Make sure we have the data
  const buildings = buildingsData?.data ?? [];
  const totalItems = buildingsData?.pagination?.total || 0;
  const totalPages = Math.ceil((totalItems || 0) / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination({
      offset: (page - 1) * pagination.limit,
    });
  };

  // Generate pagination range
  const getPaginationRange = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Define the number of columns based on screen size
  const cols = isDesktop
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    : "grid-cols-1";

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className={`grid ${cols} gap-4`}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : buildings.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-2">
            No buildings found matching your filters
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reset filters
          </Button>
        </Card>
      ) : (
        <>
          <div className={`grid ${cols} gap-4`}>
            {buildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                onClick={() => setSelectedBuilding(building.id)}
                isSelected={view.selectedBuildingId === building.id}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {pagination.offset + 1}-
                  {Math.min(pagination.offset + pagination.limit, totalItems)}{" "}
                  of {totalItems} buildings
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  {getPaginationRange().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          disabled={currentPage === page}
                          className="w-9 p-0"
                        >
                          {page}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

interface BuildingCardProps {
  building: any;
  onClick: () => void;
  isSelected: boolean;
}

function BuildingCard({ building, onClick, isSelected }: BuildingCardProps) {
  const { data: buildingDetails, isLoading } =
    api.aggregate.getBuildingById.useQuery(
      { id: building.id, includeHouseholds: false, includeBusinesses: false },
      {
        enabled: isSelected,
        keepPreviousData: true,
      },
    );

  // Fetch building media
  const { data: mediaData } = api.aggregate.getMediaPresignedUrls.useQuery(
    { dataId: building.id, mediaTypes: ["building_image"] },
    {
      enabled: isSelected && !!buildingDetails,
      keepPreviousData: true,
    },
  );

  return (
    <Card
      className={`overflow-hidden ${isSelected ? "ring-2 ring-primary" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium">
              {building.locality || "Building"}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              ID: {building.buildingId}
            </p>
          </div>
          <Badge
            variant={
              building.mapStatus === "validated"
                ? "default"
                : building.mapStatus === "needs_review"
                  ? "outline"
                  : "default"
            }
          >
            {building.mapStatus
              ? building.mapStatus.replace("_", " ")
              : "unverified"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        {isSelected && isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {isSelected && mediaData?.mediaUrls.building_image && (
              <div className="aspect-video w-full rounded-md overflow-hidden mb-3">
                <img
                  src={mediaData.mediaUrls.building_image}
                  alt={building.locality || "Building"}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">
                    {building.ownerName || "Unknown owner"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>
                    Ward {building.wardNumber}, Area {building.areaCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>
                    {building.surveyed_at
                      ? formatDate(building.surveyed_at)
                      : "No date"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span>{building.totalFamilies || 0} households</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span>{building.totalBusinesses || 0} businesses</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClick}>
            {isSelected ? "Hide details" : "Show details"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open(`/aggregate/buildings/${building.id}`, "_blank")
            }
          >
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
