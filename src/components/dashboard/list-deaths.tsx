"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import Link from "next/link";
import { DataTable } from "@/components/shared/data-table/data-table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "react-responsive";
import { User } from "lucia";

export default function ListDeaths({ user }: { user: User }) {
  const [filters, setFilters] = useState({
    wardNo: undefined as number | undefined,
    deceasedName: undefined as string | undefined,
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const {
    data,
    isLoading,
    error: deathsError,
  } = api.death.getAll.useQuery({
    limit: 10,
    offset: page * 10,
    filters: debouncedFilters,
  });

  const { data: stats, error: statsError } = api.death.getStats.useQuery();

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

  if (deathsError || statsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {deathsError?.message || statsError?.message || "An error occurred"}
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

  const deathColumns = [
    {
      accessorKey: "deceasedName",
      header: "Name",
    },
    {
      accessorKey: "deceasedAge",
      header: "Age",
    },
    {
      accessorKey: "deceasedGender",
      header: "Gender",
    },
    {
      accessorKey: "wardNo",
      header: "Ward No.",
    },
    {
      accessorKey: "deceasedDeathCause",
      header: "Cause of Death",
    },
    {
      id: "actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Link href={`/families/${row.original.famliyId}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-2 h-4 w-4" /> View Family
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <ContentLayout title="Deaths">
      <div className="mx-auto max-w-7xl space-y-6 p-4">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="border-b p-4">
            <h2 className="text-lg font-medium">Deaths Overview</h2>
            <p className="text-sm text-muted-foreground">
              View and manage death records
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Deaths"
                value={data?.pagination.total || 0}
              />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Input
                placeholder="Search by name..."
                className="w-full sm:w-[400px] h-9"
                value={filters.deceasedName || ""}
                onChange={(e) =>
                  handleFilterChange("deceasedName", e.target.value)
                }
              />
            </div>

            {/* Data Table */}
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="rounded-lg border">
                <DataTable
                  columns={deathColumns}
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
                  deaths
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
                No death records found
              </div>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}
