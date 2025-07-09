"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  Eye,
  Globe,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Download,
  FileSpreadsheet,
  Building2,
  Cloud,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMediaQuery } from "@/hooks/use-media-query";
import { User } from "lucia";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/data-table/data-table";
import { PaginationControls } from "./invalid-buildings/pagination";
import Link from "next/link";

export default function ListSites({ user }: { user: User }) {
  const [filters, setFilters] = useState({
    province: undefined as string | undefined,
    district: undefined as string | undefined,
    hasIssues: undefined as boolean | undefined,
    isCpanel: undefined as boolean | undefined,
    isVm: undefined as boolean | undefined,
    hasTakenManualBackup: undefined as boolean | undefined,
    backupLocation: undefined as "LOCAL" | "AWS" | "TELEGRAM" | undefined,
  });
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<{
    sortBy:
      | "nameOfAgency"
      | "province"
      | "district"
      | "createdAt"
      | "updatedAt"
      | "hasIssues"
      | "hasTakenManualBackup";
    sortOrder: "asc" | "desc";
  }>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [page, setPage] = useState(0);
  const debouncedFilters = useDebounce(filters, 500);
  const debouncedSearch = useDebounce(search, 500);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const {
    data,
    isLoading,
    error: sitesError,
  } = api.manager.getSites.useQuery({
    ...debouncedFilters,
    search: debouncedSearch,
    limit: 10,
    offset: page * 10,
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder,
  });

  const { data: stats, error: statsError } =
    api.manager.getSiteStats.useQuery();
  const { data: provinces } = api.manager.getProvinces.useQuery();
  const { data: districts } = api.manager.getDistricts.useQuery({
    province: filters.province,
  });

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

  if (sitesError || statsError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>
          {sitesError?.message || statsError?.message || "An error occurred"}
        </AlertDescription>
      </Alert>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }: {
    title: string;
    value: string | number;
    icon: any;
    description?: string;
  }) => (
    <div className="rounded-lg border bg-card/50 p-4 shadow-sm transition-colors hover:bg-card">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
      {description && (
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      )}
    </div>
  );

  const getBackupLocationIcon = (location: string | null) => {
    switch (location) {
      case "LOCAL":
        return <HardDrive className="h-4 w-4" />;
      case "AWS":
        return <Cloud className="h-4 w-4" />;
      case "TELEGRAM":
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const siteColumns = [
    {
      accessorKey: "nameOfAgency",
      header: "Agency Name",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1">
            <Building2 className="h-3 w-3 text-primary" />
          </div>
          <div>
            <div className="font-medium">{row.original.nameOfAgency}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {row.original.url}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "province",
      header: "Location",
      cell: ({ row }: { row: any }) => (
        <div>
          <div className="font-medium">{row.original.province}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.district}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "serverType",
      header: "Server Type",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-1">
          {row.original.isCpanel && (
            <Badge variant="secondary" className="text-xs">
              <Server className="h-3 w-3 mr-1" />
              cPanel
            </Badge>
          )}
          {row.original.isVm && (
            <Badge variant="outline" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              VM
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "backupStatus",
      header: "Backup Status",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          {row.original.hasTakenManualBackup ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge
                variant="default"
                className="text-xs bg-green-100 text-green-800"
              >
                Backed Up
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <Badge variant="destructive" className="text-xs">
                No Backup
              </Badge>
            </div>
          )}
          {row.original.backupLocation && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getBackupLocationIcon(row.original.backupLocation)}
              {row.original.backupLocation.replace("_", " ")}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "hasIssues",
      header: "Issues",
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          {row.original.hasIssues ? (
            <div className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <Badge variant="destructive" className="text-xs">
                Has Issues
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <Badge
                variant="default"
                className="text-xs bg-green-100 text-green-800"
              >
                No Issues
              </Badge>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: { row: any }) => (
        <div className="text-sm">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => (
        <div className="flex gap-2">
          <Link href={`/sites/${row.original.id}`}>
            <Button size="sm" variant="outline">
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <ContentLayout title="Sites Management">
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
                    Sites Management
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage all agency sites, their backup status, and
                  issues
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <StatCard
                  title="Total Sites"
                  value={stats.totalSites}
                  icon={Building2}
                  description="All registered sites"
                />
                <StatCard
                  title="Sites with Issues"
                  value={stats.sitesWithIssues}
                  icon={AlertTriangle}
                  description="Requiring attention"
                />
                <StatCard
                  title="Sites with Backup"
                  value={stats.sitesWithBackup}
                  icon={Database}
                  description="Properly backed up"
                />
                <StatCard
                  title="cPanel Sites"
                  value={stats.cpanelSites}
                  icon={Server}
                  description="Using cPanel"
                />
              </div>
            )}

            {/* Filters Section */}
            <Card className="mb-6">
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Filter Sites</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by agency name, URL, or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Province Filter */}
                  <Select
                    value={filters.province || ""}
                    onValueChange={(value) =>
                      handleFilterChange("province", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Provinces</SelectItem>
                      {provinces?.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* District Filter */}
                  <Select
                    value={filters.district || ""}
                    onValueChange={(value) =>
                      handleFilterChange("district", value || undefined)
                    }
                    disabled={!filters.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Districts</SelectItem>
                      {districts?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {/* Issue Status */}
                  <Select
                    value={filters.hasIssues?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "hasIssues",
                        value === "true"
                          ? true
                          : value === "false"
                            ? false
                            : undefined,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Issue Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sites</SelectItem>
                      <SelectItem value="true">Has Issues</SelectItem>
                      <SelectItem value="false">No Issues</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Backup Status */}
                  <Select
                    value={filters.hasTakenManualBackup?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "hasTakenManualBackup",
                        value === "true"
                          ? true
                          : value === "false"
                            ? false
                            : undefined,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Backup Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sites</SelectItem>
                      <SelectItem value="true">Backed Up</SelectItem>
                      <SelectItem value="false">No Backup</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Server Type */}
                  <Select
                    value={filters.isCpanel?.toString() || ""}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "isCpanel",
                        value === "true"
                          ? true
                          : value === "false"
                            ? false
                            : undefined,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Server Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="true">cPanel</SelectItem>
                      <SelectItem value="false">Non-cPanel</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Backup Location */}
                  <Select
                    value={filters.backupLocation || ""}
                    onValueChange={(value) =>
                      handleFilterChange("backupLocation", value || undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Backup Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="LOCAL">Local</SelectItem>
                      <SelectItem value="AWS">AWS</SelectItem>
                      <SelectItem value="TELEGRAM">Telegram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sites Table */}
            <Card>
              <CardHeader className="border-b bg-muted/50 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Sites List</CardTitle>
                  </div>
                  <Badge variant="secondary">
                    {data?.pagination.total || 0} Sites
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <DataTable
                  columns={siteColumns}
                  data={data?.data || []}
                  isLoading={isLoading}
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
