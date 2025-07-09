"use client";

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MapPin,
  Globe,
  Clock,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  BarChart3,
  X,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { format } from "date-fns";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Safe date formatting function
function safeFormat(date: any, fmt: string) {
  try {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return format(d, fmt);
  } catch {
    return "N/A";
  }
}

const filterSchema = z.object({
  search: z.string().optional(),
  siteId: z.string().optional(),
  issueTypes: z
    .array(
      z.enum([
        "CSS_ERROR",
        "NOT_FOUND_404",
        "INTERNAL_SERVER_ERROR",
        "HACKED",
        "NOT_RESPONDING",
        "SSL_ERROR",
        "DATABASE_ERROR",
        "PERFORMANCE_ISSUE",
      ]),
    )
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  isSolved: z.boolean().optional(),
  dateRange: z
    .object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "priority", "isSolved"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const solveIssueSchema = z.object({
  whoSolved: z.string().min(1, "Solver name is required"),
  howSolved: z
    .string()
    .min(1, "Solution description is required")
    .max(2000, "Solution description too long"),
});

const updateIssueSchema = z.object({
  issueTypes: z
    .array(
      z.enum([
        "CSS_ERROR",
        "NOT_FOUND_404",
        "INTERNAL_SERVER_ERROR",
        "HACKED",
        "NOT_RESPONDING",
        "SSL_ERROR",
        "DATABASE_ERROR",
        "PERFORMANCE_ISSUE",
      ]),
    )
    .min(1, "At least one issue type is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description too long"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

type FilterFormData = z.infer<typeof filterSchema>;
type SolveIssueFormData = z.infer<typeof solveIssueSchema>;
type UpdateIssueFormData = z.infer<typeof updateIssueSchema>;

const issueTypeOptions = [
  {
    value: "CSS_ERROR",
    label: "CSS Error",
    color: "bg-blue-100 text-blue-800",
    icon: "🎨",
  },
  {
    value: "NOT_FOUND_404",
    label: "404 Not Found",
    color: "bg-yellow-100 text-yellow-800",
    icon: "🔍",
  },
  {
    value: "INTERNAL_SERVER_ERROR",
    label: "Internal Server Error",
    color: "bg-red-100 text-red-800",
    icon: "💥",
  },
  {
    value: "HACKED",
    label: "Hacked",
    color: "bg-red-100 text-red-800",
    icon: "🚨",
  },
  {
    value: "NOT_RESPONDING",
    label: "Not Responding",
    color: "bg-orange-100 text-orange-800",
    icon: "⏰",
  },
  {
    value: "SSL_ERROR",
    label: "SSL Error",
    color: "bg-purple-100 text-purple-800",
    icon: "🔒",
  },
  {
    value: "DATABASE_ERROR",
    label: "Database Error",
    color: "bg-red-100 text-red-800",
    icon: "🗄️",
  },
  {
    value: "PERFORMANCE_ISSUE",
    label: "Performance Issue",
    color: "bg-orange-100 text-orange-800",
    icon: "⚡",
  },
];

const priorityOptions = [
  { value: "LOW", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-100 text-red-800" },
];

const quickFilters = [
  { label: "All Issues", filters: { sortBy: "createdAt", sortOrder: "desc" } },
  {
    label: "Unsolved",
    filters: { isSolved: false, sortBy: "createdAt", sortOrder: "desc" },
  },
  {
    label: "Critical",
    filters: { priority: "CRITICAL", sortBy: "createdAt", sortOrder: "desc" },
  },
  {
    label: "This Week",
    filters: {
      dateRange: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  },
  {
    label: "Database Issues",
    filters: {
      issueTypes: ["DATABASE_ERROR"],
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  },
];

export default function IssuesPage() {
  const [filters, setFilters] = useState<FilterFormData>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [showSolveDialog, setShowSolveDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [solvingIssueId, setSolvingIssueId] = useState<string | null>(null);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const filterForm = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  const solveForm = useForm<SolveIssueFormData>({
    resolver: zodResolver(solveIssueSchema),
  });

  const editForm = useForm<UpdateIssueFormData>({
    resolver: zodResolver(updateIssueSchema),
  });

  // Real-time filtering - no need to click apply
  const watchFilters = filterForm.watch();

  // Debounced search to avoid too many API calls
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useMemo(() => {
    const timeoutId = setTimeout(() => {
      setSearchValue(watchFilters.search || "");
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [watchFilters.search]);

  // Fetch issues with filtering
  const {
    data: issuesData,
    isLoading,
    error,
    refetch,
  } = api.manager.getIssuesWithSite.useQuery({
    ...filters,
    search: searchValue,
    limit: 50,
    offset: 0,
    includeSolutions: true,
  });

  // Fetch sites for filter dropdown
  const { data: sites } = api.manager.getSites.useQuery({
    limit: 100,
    offset: 0,
  });

  // Fetch issue statistics
  const { data: issueStats } = api.manager.getIssueStatistics.useQuery({
    ...filters,
  });

  // Mutations
  const updateIssueMutation = api.manager.updateIssue.useMutation({
    onSuccess: () => {
      toast.success("Issue updated successfully!");
      refetch();
      setShowEditDialog(false);
      setEditingIssueId(null);
      editForm.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update issue");
    },
  });

  const solveIssueMutation = api.manager.solveIssue.useMutation({
    onSuccess: () => {
      toast.success("Issue marked as solved!");
      setShowSolveDialog(false);
      setSolvingIssueId(null);
      solveForm.reset();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to solve issue");
    },
  });

  const deleteIssueMutation = api.manager.deleteIssue.useMutation({
    onSuccess: () => {
      toast.success("Issue deleted successfully!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete issue");
    },
  });

  // Apply filters in real-time
  const applyFilters = useCallback(
    (newFilters: Partial<FilterFormData>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
    },
    [filters],
  );

  // Quick filter handlers
  const applyQuickFilter = (quickFilter: (typeof quickFilters)[0]) => {
    setFilters(quickFilter.filters as FilterFormData);
    filterForm.reset(quickFilter.filters as FilterFormData);
  };

  const clearFilter = (key: keyof FilterFormData) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
    filterForm.setValue(key, undefined);
  };

  const clearAllFilters = () => {
    setFilters({ sortBy: "createdAt", sortOrder: "desc" });
    filterForm.reset({ sortBy: "createdAt", sortOrder: "desc" });
  };

  const handleSolveIssue = (issueId: string) => {
    setSolvingIssueId(issueId);
    setShowSolveDialog(true);
  };

  const handleEditIssue = (issue: any) => {
    setEditingIssueId(issue.id);
    setSelectedIssue(issue);
    editForm.reset({
      issueTypes: issue.issueTypes,
      description: issue.description,
      priority: issue.priority,
    });
    setShowEditDialog(true);
  };

  const handleSolveSubmit = async (data: SolveIssueFormData) => {
    if (!solvingIssueId) return;
    await solveIssueMutation.mutateAsync({
      issueId: solvingIssueId,
      ...data,
    });
  };

  const handleEditSubmit = async (data: UpdateIssueFormData) => {
    if (!editingIssueId) return;
    await updateIssueMutation.mutateAsync({
      id: editingIssueId,
      ...data,
    });
  };

  const handleDeleteIssue = (issueId: string) => {
    deleteIssueMutation.mutate({ id: issueId });
  };

  const toggleIssueExpansion = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getIssueTypeLabel = (type: string) => {
    return issueTypeOptions.find((opt) => opt.value === type)?.label || type;
  };

  const getPriorityLabel = (priority: string) => {
    return (
      priorityOptions.find((opt) => opt.value === priority)?.label || priority
    );
  };

  const getPriorityColor = (priority: string) => {
    return priorityOptions.find((opt) => opt.value === priority)?.color || "";
  };

  // Active filters count
  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof FilterFormData] !== undefined &&
      filters[key as keyof FilterFormData] !== "",
  ).length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          Loading issues...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
              <p>Error loading issues: {error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const issues = (issuesData?.data as any[]) || [];

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Issues Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all site issues with comprehensive filtering
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {issueStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Issues
                  </p>
                  <p className="text-2xl font-bold">{issueStats.totalIssues}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Solved Issues
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {issueStats.solvedIssues}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Critical Issues
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {issueStats.issuesByPriority?.CRITICAL || 0}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Resolution
                  </p>
                  <p className="text-2xl font-bold">
                    {issueStats.averageResolutionTime
                      ? `${Math.round(issueStats.averageResolutionTime)}d`
                      : "N/A"}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Quick Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search issues by description..."
                  value={watchFilters.search || ""}
                  onChange={(e) =>
                    filterForm.setValue("search", e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={watchFilters.isSolved?.toString() || "all"}
                        onValueChange={(value) => {
                          if (value === "all") {
                            clearFilter("isSolved");
                          } else {
                            applyFilters({ isSolved: value === "true" });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="false">Unsolved</SelectItem>
                          <SelectItem value="true">Solved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={watchFilters.priority || "all"}
                        onValueChange={(value) => {
                          if (value === "all") {
                            clearFilter("priority");
                          } else {
                            applyFilters({ priority: value as any });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All priorities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All priorities</SelectItem>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Site</Label>
                      <Select
                        value={watchFilters.siteId || "all"}
                        onValueChange={(value) => {
                          if (value === "all") {
                            clearFilter("siteId");
                          } else {
                            applyFilters({ siteId: value });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All sites" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All sites</SelectItem>
                          {sites?.data?.map((site) => (
                            <SelectItem key={site.id} value={site.id}>
                              {site.nameOfAgency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Sort By</Label>
                      <div className="flex gap-2">
                        <Select
                          value={watchFilters.sortBy || "createdAt"}
                          onValueChange={(value) =>
                            applyFilters({ sortBy: value as any })
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="createdAt">
                              Created Date
                            </SelectItem>
                            <SelectItem value="updatedAt">
                              Updated Date
                            </SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="isSolved">Status</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            applyFilters({
                              sortOrder:
                                watchFilters.sortOrder === "asc"
                                  ? "desc"
                                  : "asc",
                            })
                          }
                        >
                          {watchFilters.sortOrder === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((quickFilter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => applyQuickFilter(quickFilter)}
                  className="text-xs"
                >
                  {quickFilter.label}
                </Button>
              ))}
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {filters.isSolved !== undefined && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {filters.isSolved ? "Solved" : "Unsolved"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter("isSolved")}
                    />
                  </Badge>
                )}
                {filters.priority && (
                  <Badge variant="secondary" className="gap-1">
                    Priority: {getPriorityLabel(filters.priority)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter("priority")}
                    />
                  </Badge>
                )}
                {filters.siteId && (
                  <Badge variant="secondary" className="gap-1">
                    Site:{" "}
                    {
                      sites?.data?.find((s) => s.id === filters.siteId)
                        ?.nameOfAgency
                    }
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter("siteId")}
                    />
                  </Badge>
                )}
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{filters.search}"
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => clearFilter("search")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {issues.length} issues
          {activeFiltersCount > 0 && ` (filtered)`}
        </p>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length > 0 ? (
          issues.map((issue: any) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    {/* Issue Header */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {issue.isSolved ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        )}
                        <h3 className="font-semibold text-lg">
                          Issue #{issue.id.slice(-8)}
                        </h3>
                      </div>

                      <Badge className={getPriorityColor(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>

                      <Badge
                        variant={issue.isSolved ? "default" : "destructive"}
                      >
                        {issue.isSolved ? "Solved" : "Unsolved"}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleIssueExpansion(issue.id)}
                      >
                        {expandedIssues.has(issue.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Site Information */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <Link
                          href={`/site/show/${issue.siteId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {issue.siteName}
                        </Link>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {issue.siteProvince}, {issue.siteDistrict}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {safeFormat(issue.createdAt, "MMM dd, yyyy")}
                      </div>
                    </div>

                    {/* Issue Types */}
                    <div className="flex flex-wrap gap-2">
                      {issue.issueTypes?.map((type: string) => (
                        <Badge key={type} variant="outline">
                          {getIssueTypeLabel(type)}
                        </Badge>
                      ))}
                    </div>

                    {/* Expanded Content */}
                    {expandedIssues.has(issue.id) && (
                      <div className="space-y-4 pt-4 border-t">
                        {/* Description */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Description
                          </Label>
                          <p className="text-sm text-muted-foreground leading-relaxed bg-gray-50 p-3 rounded-lg">
                            {issue.description}
                          </p>
                        </div>

                        {/* Solutions */}
                        {issue.solutions && issue.solutions.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Solutions
                            </Label>
                            <div className="space-y-2">
                              {issue.solutions.map(
                                (solution: any, index: number) => (
                                  <div
                                    key={solution.id}
                                    className="bg-green-50 p-3 rounded-lg border border-green-200"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <User className="h-4 w-4 text-green-600" />
                                      <span className="font-medium text-sm">
                                        {solution.whoSolved}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {safeFormat(
                                          solution.solvedAt,
                                          "MMM dd, yyyy HH:mm",
                                        )}
                                      </span>
                                    </div>
                                    <p className="text-sm text-green-800">
                                      {solution.howSolved}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {!issue.isSolved && (
                      <Dialog
                        open={showSolveDialog && solvingIssueId === issue.id}
                        onOpenChange={setShowSolveDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleSolveIssue(issue.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Solved
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mark Issue as Solved</DialogTitle>
                            <DialogDescription>
                              Provide details about how this issue was resolved.
                            </DialogDescription>
                          </DialogHeader>
                          <form
                            onSubmit={solveForm.handleSubmit(handleSolveSubmit)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="whoSolved">Solved By</Label>
                              <Input
                                id="whoSolved"
                                placeholder="Enter your name"
                                {...solveForm.register("whoSolved")}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="howSolved">
                                Solution Description
                              </Label>
                              <Textarea
                                id="howSolved"
                                placeholder="Describe how the issue was resolved..."
                                rows={4}
                                {...solveForm.register("howSolved")}
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                disabled={solveIssueMutation.isLoading}
                              >
                                {solveIssueMutation.isLoading
                                  ? "Saving..."
                                  : "Mark as Solved"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Dialog
                      open={showEditDialog && editingIssueId === issue.id}
                      onOpenChange={setShowEditDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditIssue(issue)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Issue</DialogTitle>
                          <DialogDescription>
                            Update the issue details and description.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={editForm.handleSubmit(handleEditSubmit)}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label>Issue Types</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {issueTypeOptions.map((type) => (
                                <div
                                  key={type.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`edit-${type.value}`}
                                    checked={
                                      editForm
                                        .watch("issueTypes")
                                        ?.includes(type.value as any) || false
                                    }
                                    onCheckedChange={(checked) => {
                                      const currentTypes =
                                        editForm.watch("issueTypes") || [];
                                      if (checked) {
                                        editForm.setValue("issueTypes", [
                                          ...currentTypes,
                                          type.value as any,
                                        ]);
                                      } else {
                                        editForm.setValue(
                                          "issueTypes",
                                          currentTypes.filter(
                                            (t) => t !== type.value,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                  <Label
                                    htmlFor={`edit-${type.value}`}
                                    className="text-sm"
                                  >
                                    {type.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-priority">Priority</Label>
                            <Select
                              value={editForm.watch("priority")}
                              onValueChange={(value) =>
                                editForm.setValue("priority", value as any)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {priorityOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-description">
                              Description
                            </Label>
                            <Textarea
                              id="edit-description"
                              placeholder="Describe the issue..."
                              rows={4}
                              {...editForm.register("description")}
                            />
                          </div>

                          <DialogFooter>
                            <Button
                              type="submit"
                              disabled={updateIssueMutation.isLoading}
                            >
                              {updateIssueMutation.isLoading
                                ? "Saving..."
                                : "Update Issue"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Link href={`/site/show/${issue.siteId}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Site
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this issue? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No issues found</p>
                <p className="text-sm">
                  {activeFiltersCount > 0
                    ? "No issues match your current filters. Try adjusting your search criteria."
                    : "No issues have been created yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
