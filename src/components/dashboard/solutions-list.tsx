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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CheckCircle,
  User,
  Calendar,
  Search,
  Filter,
  X,
  RefreshCw,
  Eye,
  Clock,
  Award,
  FileText,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useState, useMemo } from "react";
import { toast } from "sonner";

interface SolutionFilters {
  search: string;
  issueId: string;
  whoSolved: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export function SolutionsList() {
  const [filters, setFilters] = useState<SolutionFilters>({
    search: "",
    issueId: "all",
    whoSolved: "all",
    dateRange: {
      startDate: "",
      endDate: "",
    },
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get solvers for filter options
  const { data: solvers } = api.manager.getSolvers.useQuery();

  // Build query parameters
  const queryParams = useMemo(() => {
    const params: any = {
      limit: 50,
      offset: 0,
      sortBy: "solvedAt",
      sortOrder: "desc",
    };

    if (filters.search) params.search = filters.search;
    if (filters.issueId !== "all") params.issueId = filters.issueId;
    if (filters.whoSolved !== "all") params.whoSolved = filters.whoSolved;

    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      params.dateRange = {};
      if (filters.dateRange.startDate) {
        params.dateRange.startDate = new Date(filters.dateRange.startDate);
      }
      if (filters.dateRange.endDate) {
        params.dateRange.endDate = new Date(filters.dateRange.endDate);
      }
    }

    return params;
  }, [filters]);

  const {
    data: solutions,
    isLoading,
    error,
    refetch,
  } = api.manager.getSolutions.useQuery(queryParams);

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const clearFilters = () => {
    setFilters({
      search: "",
      issueId: "all",
      whoSolved: "all",
      dateRange: {
        startDate: "",
        endDate: "",
      },
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.issueId !== "all") count++;
    if (filters.whoSolved !== "all") count++;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        Loading solutions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        Error loading solutions: {error.message}
      </div>
    );
  }

  if (!solutions?.data?.length) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
        <p className="text-lg font-medium">No solutions found</p>
        <p className="text-sm">
          {getActiveFilterCount() > 0
            ? "No solutions match your current filters. Try adjusting your search criteria."
            : "No solutions have been implemented yet."}
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
          <SheetTitle>Filter Solutions</SheetTitle>
          <SheetDescription>
            Apply filters to find specific solutions
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
                placeholder="Search by solver name or solution description..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Who Solved */}
          <div className="space-y-2">
            <Label htmlFor="whoSolved">Solved By</Label>
            <Select
              value={filters.whoSolved}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, whoSolved: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select solver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Solvers</SelectItem>
                {solvers?.map((solver) => (
                  <SelectItem key={solver} value={solver}>
                    {solver}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startDate" className="text-xs">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.dateRange.startDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        startDate: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="text-xs">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.dateRange.endDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, endDate: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
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

    if (filters.whoSolved !== "all") {
      chips.push(
        <Badge key="solver" variant="secondary" className="gap-1">
          Solver: {filters.whoSolved}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              setFilters((prev) => ({ ...prev, whoSolved: "all" }))
            }
          />
        </Badge>,
      );
    }

    if (filters.dateRange.startDate || filters.dateRange.endDate) {
      chips.push(
        <Badge key="dateRange" variant="secondary" className="gap-1">
          Date Range: {filters.dateRange.startDate || "Any"} -{" "}
          {filters.dateRange.endDate || "Any"}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                dateRange: { startDate: "", endDate: "" },
              }))
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
            <CheckCircle className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">Solutions</h2>
            <Badge variant="secondary">{solutions.data.length}</Badge>
          </div>
          <div className="flex gap-2">
            <FilterPanel />
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search solutions..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Chips */}
        <FilterChips />

        {/* Mobile Solution Cards */}
        {solutions.data.map((solution) => (
          <Card
            key={solution.id}
            className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-700">
                    Solution #{solution.id.slice(-6)}
                  </CardTitle>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <Award className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Solver */}
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-gray-600">
                  <span className="text-muted-foreground">Solved by:</span>{" "}
                  {solution.whoSolved}
                </span>
              </div>

              {/* Issue ID */}
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-gray-600">
                  <span className="text-muted-foreground">Issue ID:</span>{" "}
                  {solution.issueId.slice(-6)}
                </span>
              </div>

              {/* Solution Description */}
              <div className="text-sm">
                <span className="text-muted-foreground">Solution:</span>
                <p className="text-gray-700 mt-1 line-clamp-3">
                  {solution.howSolved}
                </p>
              </div>

              {/* Solved Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Solved: {new Date(solution.solvedAt).toLocaleDateString()}
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Created: {new Date(solution.createdAt).toLocaleDateString()}
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
          <CheckCircle className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">
            Solutions Overview
          </h2>
          <Badge variant="secondary" className="text-sm">
            {solutions.data.length} Solutions
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <FilterPanel />
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search solutions by solver name or description..."
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
              Solution ID
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Issue ID
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Solved By
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Solution Description
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Solved Date
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Created Date
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold text-gray-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solutions.data.map((solution) => (
            <TableRow
              key={solution.id}
              className="hover:bg-muted/50 transition-colors border-b"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="font-medium text-gray-900">
                    #{solution.id.slice(-6)}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge variant="outline" className="text-xs">
                  #{solution.issueId.slice(-6)}
                </Badge>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-gray-900">
                    {solution.whoSolved}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="max-w-xs">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {solution.howSolved}
                  </p>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(solution.solvedAt).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell className="py-4 text-sm text-muted-foreground">
                {new Date(solution.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Issue
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
