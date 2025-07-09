import React from "react";
import { useAggregateStore } from "@/hooks/use-aggregate-store";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { BuildingRow } from "./BuildingRow";

export function AggregateTableView() {
  const { filters, pagination, sorting, setPagination, setSorting } =
    useAggregateStore();

  // Use the comprehensive data query to get all nested data
  const { data: buildingsData, isLoading } =
    api.aggregate.getAggregatedBuildingData.useQuery(
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

  // Get buildings data
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

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ))}
          </div>
        ) : buildings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No buildings found matching your filters
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="divide-y">
            {buildings.map((building) => (
              <BuildingRow key={building.id} building={building} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPages > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {pagination.offset + 1}-
              {Math.min(pagination.offset + pagination.limit, totalItems)} of{" "}
              {totalItems} buildings
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
        )}
      </Card>
    </div>
  );
}
