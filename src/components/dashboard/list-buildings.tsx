"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { buildingColumns as originalBuildingColumns } from "@/components/building/columns";
import { BuildingFilters } from "@/components/building/building-filters";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "react-responsive";
import { User } from "lucia";
import { InvalidBuildingsList } from "./invalid-buildings-list";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuildingsHeader } from "./buildings/buildings-header";
import { BuildingsActions } from "./buildings/buildings-actions";
import { BuildingsTable } from "./buildings/buildings-table";
import { PaginationControls } from "./invalid-buildings/pagination";
import Link from "next/link";
import { TabHeader } from "./buildings/tab-header";
import { motion, AnimatePresence } from "framer-motion";
import { BuildingsStats } from "./buildings/buildings-stats";
import { FileSpreadsheet, Download, Building2, Filter } from "lucide-react";
import { Badge } from "../ui/badge";

export default function ListBuildings({ user }: { user: User }) {
  const [filters, setFilters] = useState({
    wardNumber: undefined as number | undefined,
    areaCode: undefined as string | undefined,
    mapStatus: undefined as string | undefined,
  });
  const [sorting, setSorting] = useState<{
    sortBy: "tmp_ward_number";
    sortOrder: "asc" | "desc";
  }>({
    sortBy: "tmp_ward_number",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const [activeTab, setActiveTab] = useState("all");

  const {
    data,
    isLoading,
    error: buildingsError,
  } = api.building.getAll.useQuery({
    limit: 10,
    offset: page * 10,
    filters: debouncedFilters,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const { data: stats, error: statsError } = api.building.getStats.useQuery();

  const totalPages = Math.ceil((data?.pagination.total || 0) / 10);
  const currentDisplayCount = Math.min(
    (page + 1) * 10,
    data?.pagination.total || 0,
  );

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setPage(0);
  };

  const handleSort = (field: string) => {
    setSorting((prev) => ({
      sortBy: field as typeof sorting.sortBy,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handleNextPage = () => page < totalPages - 1 && setPage(page + 1);
  const handlePrevPage = () => page > 0 && setPage(page - 1);

  const buildingColumns = [
    ...originalBuildingColumns(handleSort),
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Link href={`/buildings/${row.original.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  if (buildingsError || statsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {buildingsError?.message ||
            statsError?.message ||
            "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ContentLayout title="Buildings">
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        {/* Main Card */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Buildings Management
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  View and manage all building records in the system
                </p>
              </div>
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
              <BuildingsStats
                totalBuildings={stats.totalBuildings}
                totalFamilies={stats.totalFamilies}
                avgBusinesses={stats.avgBusinesses}
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
                <BuildingFilters
                  {...filters}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>

            {/* Buildings Table/Grid */}
            <Card className="mt-6">
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Buildings List</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {data?.pagination.total || 0} Records
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <BuildingsTable
                  isLoading={isLoading}
                  isDesktop={isDesktop}
                  data={data?.data || []}
                  columns={buildingColumns}
                />
                {data?.data && data.data.length > 0 && (
                  <div className="mt-4">
                    <PaginationControls
                      currentPage={page}
                      totalItems={data.pagination.total}
                      pageSize={10}
                      currentDisplayCount={currentDisplayCount}
                      onPageChange={setPage}
                      hasMore={page < totalPages - 1}
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
