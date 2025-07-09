"use client";

import { api } from "@/trpc/react";
import { AreaFilters } from "../area/area-filters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaTableView } from "../area/area-table-view";
import { AreaCardView } from "../area/area-card-view";
import { useMediaQuery } from "react-responsive";
import { Input } from "@/components/ui/input";
import { FilterDrawer } from "@/components/shared/filters/filter-drawer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export function AreaList() {
  const [filters, setFilters] = useState({
    wardNumber: undefined as number | undefined,
    code: undefined as number | undefined,
    status: undefined as
      | "unassigned"
      | "newly_assigned"
      | "ongoing_survey"
      | "revision"
      | "asked_for_completion"
      | "asked_for_revision_completion"
      | "asked_for_withdrawl"
      | undefined,
    assignedTo: undefined as string | undefined,
  });
  const [page, setPage] = useState(0);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const { data, isLoading, error } = api.area.getAreas.useQuery(filters);

  const utils = api.useContext();

  const { mutate: updateAreaStatus } =
    api.area.updateAreaRequestStatus.useMutation({
      onSuccess: () => {
        utils.area.getAreas.invalidate();
      },
    });

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {error?.message || "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(0);
  };

  const handleAction = (
    areaId: string,
    currentStatus: string,
    action: "approve" | "reject",
  ) => {
    updateAreaStatus({
      areaId,
      status: action === "approve" ? "approved" : "rejected",
      userId: "user_id",
    });
  };

  const StatCard = ({
    title,
    value,
  }: {
    title: string;
    value: string | number;
  }) => (
    <div className="rounded-lg border bg-card/50 p-4 shadow-sm transition-colors hover:bg-card">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-0 sm:space-y-6 sm:p-2">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="border-b p-2 sm:p-4">
          <h2 className="text-lg font-medium">Overview</h2>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all area assignments
          </p>
        </div>

        <div className="space-y-4 p-2 sm:space-y-6 sm:p-6">
          {/* Actions Bar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {!isDesktop && (
                <FilterDrawer title="Filters">
                  <AreaFilters
                    {...filters}
                    onFilterChange={handleFilterChange}
                  />
                </FilterDrawer>
              )}
              <Input
                placeholder="Search by code..."
                className="h-9 w-full sm:w-[400px]"
                value={filters.code || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "code",
                    parseInt(e.target.value) || undefined,
                  )
                }
              />
            </div>
          </div>

          {/* Desktop Filters */}
          {isDesktop && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <AreaFilters {...filters} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Data Display */}
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : isDesktop ? (
            //@ts-ignore
            <AreaTableView data={data || []} onAction={handleAction} />
          ) : (
            //@ts-ignore
            <AreaCardView data={data || []} onAction={handleAction} />
          )}

          {/* Pagination */}
          {data && data.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground text-center">
                Showing {data.length} areas
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={data.length < 10}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
