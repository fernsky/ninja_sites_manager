"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";
import { DataTable } from "@/components/shared/data-table/data-table";
import { FilterDrawer } from "@/components/shared/filters/filter-drawer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { ChevronLeft, ChevronRight, Loader2, Plus, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "react-responsive";
import { User } from "lucia";

export default function ListIndividuals({ user }: { user: User }) {
  const [filters, setFilters] = useState({
    wardNo: undefined as number | undefined,
    familyId: undefined as string | undefined,
    gender: undefined as string | undefined,
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const {
    data,
    isLoading,
    error: individualsError,
  } = api.individual.getAll.useQuery({
    limit: 10,
    offset: page * 10,
    filters: debouncedFilters,
  });

  const { data: stats, error: statsError } = api.individual.getStats.useQuery();

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

  if (individualsError || statsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {individualsError?.message ||
            statsError?.message ||
            "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

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

  const individualColumns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "gender",
      header: "Gender",
    },
    {
      accessorKey: "wardNo",
      header: "Ward No.",
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Link href={`/individuals/${row.original.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <ContentLayout title="Individuals">
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b p-4">
            <h2 className="text-lg font-medium">Overview</h2>
            <p className="text-sm text-muted-foreground">
              Manage and monitor all individuals information
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Individuals"
                value={stats?.totalIndividuals || 0}
              />
              <StatCard
                title="Average Age"
                value={
                  typeof stats?.averageAge === "number"
                    ? stats.averageAge.toFixed(1)
                    : "0.0"
                }
              />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Input
                placeholder="Search by name..."
                className="w-full sm:w-[400px] h-9"
                value={filters.familyId || ""}
                onChange={(e) => handleFilterChange("familyId", e.target.value)}
              />
            </div>

            {/* Data Table or Loading State */}
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="rounded-lg border">
                <DataTable
                  columns={individualColumns}
                  //@ts-ignore
                  data={data?.data || []}
                  isLoading={isLoading}
                />
              </div>
            )}

            {/* Pagination */}
            {data?.data.length ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground text-center">
                  Showing {currentDisplayCount} of {data.pagination.total}{" "}
                  individuals
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[100px] text-center font-medium">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                No individuals found
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
