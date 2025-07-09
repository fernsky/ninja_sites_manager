"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { businessColumns } from "@/components/business/columns";
import { BusinessFilters } from "@/components/business/business-filters";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FileSpreadsheet, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "react-responsive";
import { User } from "lucia";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessesHeader } from "./businesses/businesses-header";
import { BusinessesTable } from "./businesses/businesses-table";
import { BusinessesStats } from "./businesses/businesses-stats";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "./invalid-buildings/pagination";

export function ListBusinesses({ user }: { user: User }) {
  const [filters, setFilters] = useState({
    wardNo: undefined as number | undefined,
    areaCode: undefined as string | undefined,
    enumeratorId: undefined as string | undefined,
    status: undefined as
      | "pending"
      | "approved"
      | "rejected"
      | "requested_for_edit"
      | undefined,
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [sorting, setSorting] = useState({
    sortBy: "ward_id" as const,
    sortOrder: "desc" as "asc" | "desc",
  });

  const {
    data,
    isLoading,
    error: businessesError,
  } = api.business.getAll.useQuery({
    limit: 10,
    offset: page * 10,
    filters: debouncedFilters,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const { data: stats, error: statsError } = api.business.getStats.useQuery();

  const totalPages = Math.ceil((data?.pagination.total || 0) / 10);
  const currentDisplayCount = Math.min(
    (page + 1) * 10,
    data?.pagination.total || 0,
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(0);
  };

  const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);
  const handlePrevPage = () => page > 0 && setPage(page - 1);

  const handleSort = (field: string) => {
    setSorting((prev) => ({
      sortBy: field as typeof prev.sortBy,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  if (businessesError || statsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {businessesError?.message ||
            statsError?.message ||
            "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ContentLayout title="Businesses">
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <BusinessesHeader />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Stats Section */}
            {stats && (
              <BusinessesStats
                totalBusinesses={stats.totalBusinesses}
                totalEmployees={stats.totalEmployees}
                avgInvestmentAmount={stats.avgInvestmentAmount}
              />
            )}

            {/* Filters Section */}
            <Card className="mt-6">
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Filter Records</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <BusinessFilters
                  {...filters}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>

            {/* Businesses Table */}
            <Card className="mt-6">
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Businesses List</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {data?.pagination.total || 0} Records
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <BusinessesTable
                  isLoading={isLoading}
                  isDesktop={isDesktop}
                  data={data?.data || []}
                  columns={businessColumns(handleSort)}
                />
                {data?.data && data.data.length > 0 && (
                  <div className="mt-4">
                    <PaginationControls
                      currentPage={page}
                      totalItems={data.pagination.total}
                      pageSize={10}
                      currentDisplayCount={currentDisplayCount}
                      onPageChange={setPage}
                      hasMore={
                        page < Math.ceil((data?.pagination.total || 0) / 10) - 1
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}

export default ListBusinesses;
