"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/trpc/react";
import {
  Building2,
  Globe,
  Server,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Cloud,
  HardDrive,
  ExternalLink,
  Calendar,
  Plus,
  Trash2,
  Filter,
  Search,
  X,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner";

interface SiteFilters {
  search: string;
  province: string;
  district: string;
  hasIssues: string;
  isCpanel: string;
  isVm: string;
  hasTakenManualBackup: string;
  backupLocation: string;
}

export function SitesList() {
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);
  const [filters, setFilters] = useState<SiteFilters>({
    search: "",
    province: "all",
    district: "all",
    hasIssues: "all",
    isCpanel: "all",
    isVm: "all",
    hasTakenManualBackup: "all",
    backupLocation: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get provinces and districts for filter options
  const { data: provinces } = api.manager.getProvinces.useQuery();
  const { data: districts } = api.manager.getDistricts.useQuery({
    province: filters.province !== "all" ? filters.province : undefined,
  });

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      limit: 50,
      offset: 0,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    if (filters.search) params.search = filters.search;
    if (filters.province !== "all") params.province = filters.province;
    if (filters.district !== "all") params.district = filters.district;
    if (filters.hasIssues !== "all")
      params.hasIssues = filters.hasIssues === "true";
    if (filters.isCpanel !== "all")
      params.isCpanel = filters.isCpanel === "true";
    if (filters.isVm !== "all") params.isVm = filters.isVm === "true";
    if (filters.hasTakenManualBackup !== "all")
      params.hasTakenManualBackup = filters.hasTakenManualBackup === "true";
    if (filters.backupLocation !== "all")
      params.backupLocation = filters.backupLocation;

    return params;
  }, [filters]);

  const {
    data: sites,
    isLoading,
    error,
    refetch,
  } = api.manager.getSites.useQuery(queryParams);

  const deleteSiteMutation = api.manager.deleteSite.useMutation({
    onSuccess: () => {
      toast.success("Site deleted successfully!");
      setDeletingSiteId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete site");
      setDeletingSiteId(null);
    },
  });

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();

  const handleRowClick = (siteId: string, event: React.MouseEvent) => {
    const isActionClick = (event.target as HTMLElement).closest("a, button");
    if (!isActionClick) {
      router.push(`/site/show/${siteId}`);
    }
  };

  const handleDeleteSite = (siteId: string) => {
    setDeletingSiteId(siteId);
    deleteSiteMutation.mutate({ id: siteId });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      province: "all",
      district: "all",
      hasIssues: "all",
      isCpanel: "all",
      isVm: "all",
      hasTakenManualBackup: "all",
      backupLocation: "all",
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.province !== "all") count++;
    if (filters.district !== "all") count++;
    if (filters.hasIssues !== "all") count++;
    if (filters.isCpanel !== "all") count++;
    if (filters.isVm !== "all") count++;
    if (filters.hasTakenManualBackup !== "all") count++;
    if (filters.backupLocation !== "all") count++;
    return count;
  };

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

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        Loading sites...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading sites: {error.message}
      </div>
    );
  }

  if (!sites?.data?.length) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">No sites found</p>
        <p className="text-sm">
          {getActiveFilterCount() > 0
            ? "No sites match your current filters. Try adjusting your search criteria."
            : "No sites have been registered yet."}
        </p>
        {getActiveFilterCount() > 0 && (
          <Button onClick={clearFilters} variant="outline" className="mt-4">
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  const FilterPanel = () => (
    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filter Sites</SheetTitle>
          <SheetDescription>
            Apply filters to find specific sites
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by agency name, URL, province, district..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Province */}
          <div className="space-y-2">
            <Label htmlFor="province">Province</Label>
            <Select
              value={filters.province}
              onValueChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  province: value,
                  district: "all", // Reset district when province changes
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Provinces</SelectItem>
                {provinces?.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-2">
            <Label htmlFor="district">District</Label>
            <Select
              value={filters.district}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, district: value }))
              }
              disabled={filters.province === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts?.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Issues Status */}
          <div className="space-y-2">
            <Label>Issues Status</Label>
            <Select
              value={filters.hasIssues}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, hasIssues: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issues status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="true">Has Issues</SelectItem>
                <SelectItem value="false">No Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Server Type */}
          <div className="space-y-2">
            <Label>Server Type</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cpanel"
                  checked={filters.isCpanel === "true"}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      isCpanel: checked ? "true" : "all",
                    }))
                  }
                />
                <Label htmlFor="cpanel">cPanel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vm"
                  checked={filters.isVm === "true"}
                  onCheckedChange={(checked) =>
                    setFilters((prev) => ({
                      ...prev,
                      isVm: checked ? "true" : "all",
                    }))
                  }
                />
                <Label htmlFor="vm">VM</Label>
              </div>
            </div>
          </div>

          {/* Backup Status */}
          <div className="space-y-2">
            <Label>Backup Status</Label>
            <Select
              value={filters.hasTakenManualBackup}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, hasTakenManualBackup: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select backup status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                <SelectItem value="true">Backed Up</SelectItem>
                <SelectItem value="false">No Backup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Backup Location */}
          <div className="space-y-2">
            <Label>Backup Location</Label>
            <Select
              value={filters.backupLocation}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, backupLocation: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select backup location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="LOCAL">Local</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
                <SelectItem value="TELEGRAM">Telegram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={clearFilters} variant="outline" className="flex-1">
              Clear All
            </Button>
            <Button onClick={() => setIsFilterOpen(false)} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const FilterChips = () => {
    const chips = [];

    if (filters.search) {
      chips.push(
        <Badge key="search" variant="secondary" className="gap-1">
          Search: {filters.search}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
          />
        </Badge>,
      );
    }

    if (filters.province !== "all") {
      chips.push(
        <Badge key="province" variant="secondary" className="gap-1">
          Province: {filters.province}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                province: "all",
                district: "all",
              }))
            }
          />
        </Badge>,
      );
    }

    if (filters.district !== "all") {
      chips.push(
        <Badge key="district" variant="secondary" className="gap-1">
          District: {filters.district}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setFilters((prev) => ({ ...prev, district: "all" }))}
          />
        </Badge>,
      );
    }

    if (filters.hasIssues !== "all") {
      chips.push(
        <Badge key="issues" variant="secondary" className="gap-1">
          Issues: {filters.hasIssues === "true" ? "Has Issues" : "No Issues"}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              setFilters((prev) => ({ ...prev, hasIssues: "all" }))
            }
          />
        </Badge>,
      );
    }

    if (filters.isCpanel === "true") {
      chips.push(
        <Badge key="cpanel" variant="secondary" className="gap-1">
          cPanel
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setFilters((prev) => ({ ...prev, isCpanel: "all" }))}
          />
        </Badge>,
      );
    }

    if (filters.isVm === "true") {
      chips.push(
        <Badge key="vm" variant="secondary" className="gap-1">
          VM
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => setFilters((prev) => ({ ...prev, isVm: "all" }))}
          />
        </Badge>,
      );
    }

    if (filters.hasTakenManualBackup !== "all") {
      chips.push(
        <Badge key="backup" variant="secondary" className="gap-1">
          Backup:{" "}
          {filters.hasTakenManualBackup === "true" ? "Backed Up" : "No Backup"}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              setFilters((prev) => ({ ...prev, hasTakenManualBackup: "all" }))
            }
          />
        </Badge>,
      );
    }

    if (filters.backupLocation !== "all") {
      chips.push(
        <Badge key="location" variant="secondary" className="gap-1">
          Location: {filters.backupLocation}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              setFilters((prev) => ({ ...prev, backupLocation: "all" }))
            }
          />
        </Badge>,
      );
    }

    if (chips.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {chips}
        <Button
          onClick={clearFilters}
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
        >
          Clear All
        </Button>
      </div>
    );
  };

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Sites</h2>
            <Badge variant="secondary">{sites.data.length}</Badge>
          </div>
          <div className="flex gap-2">
            <FilterPanel />
            <Link href="/site/create">
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sites..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Chips */}
        <FilterChips />

        {/* Mobile Site Cards */}
        {sites.data.map((site) => (
          <Card
            key={site.id}
            className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 border-l-primary bg-gradient-to-r from-white to-gray-50"
            onClick={(e) => handleRowClick(site.id, e)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-700">
                    {site.nameOfAgency}
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  {site.hasIssues ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Issues
                    </Badge>
                  ) : (
                    <Badge
                      variant="default"
                      className="text-xs bg-green-100 text-green-800"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* URL */}
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-gray-600 truncate">{site.url}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">
                  {site.province}, {site.district}
                </span>
              </div>

              {/* Server Type */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Server:</span>
                <div className="flex gap-1">
                  {site.isCpanel && (
                    <Badge variant="secondary" className="text-xs">
                      <Server className="h-3 w-3 mr-1" />
                      cPanel
                    </Badge>
                  )}
                  {site.isVm && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      VM
                    </Badge>
                  )}
                </div>
              </div>

              {/* Backup Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Backup:</span>
                  {site.hasTakenManualBackup ? (
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
                </div>
                {site.backupLocation && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {getBackupLocationIcon(site.backupLocation)}
                    {site.backupLocation.replace("_", " ")}
                  </div>
                )}
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created: {new Date(site.createdAt).toLocaleDateString()}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <Link href={`/site/show/${site.id}`} className="flex-1">
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingSiteId === site.id}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Site</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{site.nameOfAgency}"?
                        This action cannot be undone and will also delete all
                        associated issues.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSite(site.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-lg p-6 bg-white">
      {/* Desktop Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">
            Sites Overview
          </h2>
          <Badge variant="secondary" className="text-sm">
            {sites.data.length} Sites
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <FilterPanel />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/site/create">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sites by agency name, URL, province, district..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          className="pl-10"
        />
      </div>

      {/* Desktop Filter Chips */}
      <FilterChips />

      {/* Desktop Table */}
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-primary/5">
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Agency
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Location
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Server Type
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Backup Status
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Issues
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Created
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.data.map((site) => (
            <TableRow
              key={site.id}
              className="hover:bg-muted/50 transition-colors cursor-pointer border-b"
              onClick={(e) => handleRowClick(site.id, e)}
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {site.nameOfAgency}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {site.url}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div>
                  <div className="font-medium text-gray-900">
                    {site.province}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {site.district}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex gap-1">
                  {site.isCpanel && (
                    <Badge variant="secondary" className="text-xs">
                      <Server className="h-3 w-3 mr-1" />
                      cPanel
                    </Badge>
                  )}
                  {site.isVm && (
                    <Badge variant="outline" className="text-xs">
                      <Database className="h-3 w-3 mr-1" />
                      VM
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  {site.hasTakenManualBackup ? (
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
                  {site.backupLocation && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getBackupLocationIcon(site.backupLocation)}
                      {site.backupLocation.replace("_", " ")}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                {site.hasIssues ? (
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
              </TableCell>
              <TableCell className="py-4 text-sm text-muted-foreground">
                {new Date(site.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex gap-2">
                  <Link href={`/site/show/${site.id}`}>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingSiteId === site.id}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Site</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{site.nameOfAgency}"?
                          This action cannot be undone and will also delete all
                          associated issues.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSite(site.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
