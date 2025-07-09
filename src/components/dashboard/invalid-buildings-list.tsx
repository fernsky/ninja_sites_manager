"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  Loader2,
  AlertTriangle,
  Filter,
  Building2,
  FileDown,
  ArrowDownToLine,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InvalidBuildingsFilters } from "./invalid-buildings/filters";
import { PaginationControls } from "./invalid-buildings/pagination";
import { BuildingCard } from "./invalid-buildings/building-card";
import { SortingState } from "@tanstack/react-table";
import { SummaryStats } from "./invalid-buildings/summary-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Filters {
  wardNumber?: number;
  areaCode?: number;
  enumeratorId?: string;
}

interface InvalidBuilding {
  id: string;
  locality: string | null;
  tmpWardNumber?: number;
  tmpAreaCode?: string;
  tmpEnumeratorId?: string;
  tmpBuildingToken?: string;
  isWardValid: boolean;
  isAreaValid: boolean;
  isEnumeratorValid: boolean;
  isBuildingTokenValid: boolean;
  enumeratorName?: string;
  areaId?: string;
}

export function InvalidBuildingsList() {
  const [filters, setFilters] = useState<Filters>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "locality", desc: false },
  ]);
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);

  const { data, isLoading, error } = api.building.getInvalidBuildings.useQuery({
    filters: debouncedFilters,
    limit: 10,
    offset: page * 10,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const currentDisplayCount = Math.min(
    (page + 1) * 10,
    data?.pagination.total || 0,
  );

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const invalidBuildings = data?.data.map(
    (building): InvalidBuilding => ({
      ...building,
      locality: building.locality ?? "Unknown Location",
      tmpWardNumber: building.tmpWardNumber ?? undefined,
      tmpAreaCode: building.tmpAreaCode ?? undefined,
      tmpEnumeratorId: building.tmpEnumeratorId ?? undefined,
      tmpBuildingToken: building.tmpBuildingToken ?? undefined,
      enumeratorName: building.enumeratorName ?? undefined,
      areaId: building.areaId ?? undefined,
      isWardValid: building.isWardValid ?? false,
      isAreaValid: building.isAreaValid ?? false,
      isEnumeratorValid: building.isEnumeratorValid ?? false,
      isBuildingTokenValid: building.isBuildingTokenValid ?? false,
    }),
  );

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/50 px-4 py-4 sm:px-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-destructive/10 p-1.5 sm:p-2">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                </div>
                <CardTitle className="text-base sm:text-lg">
                  Invalid Buildings
                </CardTitle>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage and fix validation issues in building records
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto gap-2 text-xs sm:text-sm h-8 sm:h-9"
              >
                <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Export List
              </Button>
              <Button
                size="sm"
                className="w-full sm:w-auto gap-2 text-xs sm:text-sm h-8 sm:h-9"
              >
                <ArrowDownToLine className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <div className="p-4 sm:p-6">
          {data?.summary && <SummaryStats summary={data.summary} />}
        </div>
      </Card>

      {/* Filters Section */}
      <Card>
        <CardHeader className="border-b bg-muted/50 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-base sm:text-lg">
              Filter Records
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <InvalidBuildingsFilters
            {...filters}
            //@ts-ignore
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      {/* Buildings List */}
      <Card>
        <CardHeader className="border-b bg-muted/50 px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <CardTitle className="text-base sm:text-lg">Buildings</CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="w-fit text-xs sm:text-sm px-2 py-1"
            >
              {data?.pagination.total || 0} Records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="text-center space-y-2">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-primary" />
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Loading records...
                </p>
              </div>
            </div>
          ) : (
            <>
              {invalidBuildings?.length ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {invalidBuildings?.map((building) => (
                      //@ts-ignore
                      <BuildingCard key={building.id} building={building} />
                    ))}
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <PaginationControls
                      currentPage={page}
                      totalItems={data.pagination.total}
                      pageSize={10}
                      currentDisplayCount={currentDisplayCount}
                      onPageChange={setPage}
                      hasMore={(invalidBuildings?.length ?? 0) === 10}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">
                    No Invalid Buildings
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-[15rem] sm:max-w-sm mx-auto">
                    There are no buildings with validation issues at the moment.
                    Check back later or adjust your filters.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
