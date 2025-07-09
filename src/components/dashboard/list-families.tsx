"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { familyColumns } from "@/components/family/columns";
import { FamilyFilters } from "@/components/family/family-filters";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { FileSpreadsheet, Download, Filter, Users2, Store } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "react-responsive";
import { User } from "lucia";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table/data-table";
import { PaginationControls } from "./invalid-buildings/pagination";

export function ListFamilies({ user }: { user: User }) {
  const [filters, setFilters] = useState({
    wardNo: undefined as number | undefined,
    locality: undefined as string | undefined,
    headName: undefined as string | undefined,
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [sorting, setSorting] = useState({
    sortBy: "ward_no" as const,
    sortOrder: "desc" as "asc" | "desc",
  });

  const handleSort = (field: string) => {
    setSorting((prev) => ({
      sortBy: field as typeof prev.sortBy,
      sortOrder:
        prev.sortBy === field && prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const {
    data,
    isLoading,
    error: familiesError,
  } = api.family.getAll.useQuery({
    limit: 10,
    offset: page * 10,
    filters: debouncedFilters,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const { data: stats, error: statsError } = api.family.getStats.useQuery();

  // ...existing pagination logic...

  const FamiliesHeader = () => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2">
          <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Families Management
        </h2>
      </div>
      <p className="text-sm text-muted-foreground">
        View and manage family records in the system
      </p>
    </div>
  );

  const FamiliesStats = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard title="Total Families" value={stats?.totalFamilies || 0} />
      <StatCard title="Total Members" value={stats?.totalMembers || 0} />
      <StatCard
        title="Average Family Size"
        value={Number(stats?.avgMembersPerFamily || 0).toFixed(1)}
      />
    </div>
  );

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

  if (familiesError || statsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {familiesError?.message || statsError?.message || "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  function handleFilterChange(key: string, value: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ContentLayout title="Families">
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <FamiliesHeader />
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
            <FamiliesStats />

            {/* Filters Section */}
            <Card className="mt-6">
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Filter Records</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <FamilyFilters
                  {...filters}
                  onFilterChange={handleFilterChange}
                />
              </CardContent>
            </Card>

            {/* Families Table */}
            <Card className="mt-6">
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Families List</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {data?.pagination.total || 0} Records
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <DataTable
                  columns={familyColumns(handleSort)}
                  data={data?.data || []}
                  isLoading={isLoading}
                />
                {data?.data && data.data.length > 0 && (
                  <div className="mt-4">
                    <PaginationControls
                      currentPage={page}
                      totalItems={data?.pagination.total || 0}
                      pageSize={10}
                      currentDisplayCount={Math.min(
                        (page + 1) * 10,
                        data.pagination.total,
                      )}
                      onPageChange={setPage}
                      hasMore={page < Math.ceil(data.pagination.total / 10) - 1}
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

export default ListFamilies;
