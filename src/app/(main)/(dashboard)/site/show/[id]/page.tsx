"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  Plus,
  Trash2,
  AlertTriangle,
  X,
  Edit3,
  Save,
  ArrowLeft,
  Globe,
  Server,
  Database,
  Shield,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Cloud,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import React from "react";

const updateSiteSchema = z.object({
  nameOfAgency: z.string().min(1, "Agency name is required"),
  url: z.string().url("Valid URL is required"),
  isCpanel: z.boolean().default(false),
  cpanelUsername: z.string().optional(),
  cpanelPassword: z.string().optional(),
  isVm: z.boolean().default(false),
  vpnUsername: z.string().optional(),
  vpnPassword: z.string().optional(),
  vmIp: z.string().optional(),
  vmUsername: z.string().optional(),
  vmPassword: z.string().optional(),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  hasTakenManualBackup: z.boolean().default(false),
  lastManualBackupDate: z.date().optional(),
  lastDatabaseBackupDate: z.date().optional(),
  backupLocation: z.enum(["LOCAL", "AWS", "TELEGRAM"]).optional(),
  issues: z
    .array(
      z.object({
        id: z.string().optional(), // Optional for new issues
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
        isSolved: z.boolean().default(false),
      }),
    )
    .optional()
    .default([]),
});

type UpdateFormData = z.infer<typeof updateSiteSchema>;

const issueTypeOptions = [
  { value: "CSS_ERROR", label: "CSS Error" },
  { value: "NOT_FOUND_404", label: "404 Not Found" },
  { value: "INTERNAL_SERVER_ERROR", label: "Internal Server Error" },
  { value: "HACKED", label: "Hacked" },
  { value: "NOT_RESPONDING", label: "Not Responding" },
  { value: "SSL_ERROR", label: "SSL Error" },
  { value: "DATABASE_ERROR", label: "Database Error" },
  { value: "PERFORMANCE_ISSUE", label: "Performance Issue" },
];

const priorityOptions = [
  { value: "LOW", label: "Low", color: "bg-blue-100 text-blue-800" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-100 text-red-800" },
];

const backupLocationOptions = [
  { value: "LOCAL", label: "Local" },
  { value: "AWS", label: "AWS" },
  { value: "TELEGRAM", label: "Telegram" },
];

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch site data with issues
  const {
    data: siteWithIssues,
    isLoading,
    error,
  } = api.manager.getSiteWithIssuesById.useQuery({ id: siteId });

  const site = siteWithIssues;
  const issuesData = siteWithIssues
    ? { data: siteWithIssues.issues }
    : undefined;

  const form = useForm<UpdateFormData>({
    resolver: zodResolver(updateSiteSchema),
    defaultValues: {
      isCpanel: false,
      isVm: false,
      hasTakenManualBackup: false,
      issues: [],
    },
  });

  const { watch, setValue, reset } = form;
  const isCpanel = watch("isCpanel");
  const isVm = watch("isVm");
  const hasTakenManualBackup = watch("hasTakenManualBackup");
  const issues = watch("issues");

  const updateSiteMutation = api.manager.updateSite.useMutation({
    onSuccess: () => {
      toast.success("Site updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update site");
    },
  });

  // Update form when site data loads
  React.useEffect(() => {
    if (site) {
      reset({
        nameOfAgency: site.nameOfAgency,
        url: site.url,
        isCpanel: site.isCpanel,
        cpanelUsername: site.cpanelUsername || "",
        cpanelPassword: site.cpanelPassword || "",
        isVm: site.isVm,
        vpnUsername: site.vpnUsername || "",
        vpnPassword: site.vpnPassword || "",
        vmIp: site.vmIp || "",
        vmUsername: site.vmUsername || "",
        vmPassword: site.vmPassword || "",
        province: site.province,
        district: site.district,
        hasTakenManualBackup: site.hasTakenManualBackup,
        lastManualBackupDate: site.lastManualBackupDate || undefined,
        lastDatabaseBackupDate: site.lastDatabaseBackupDate || undefined,
        backupLocation: site.backupLocation || undefined,
        issues: site.issues || [],
      });
    }
  }, [site, reset]);

  const onSubmit = async (data: UpdateFormData) => {
    setIsSubmitting(true);
    try {
      await updateSiteMutation.mutateAsync({
        id: siteId,
        ...data,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addIssue = () => {
    const newIssues = [
      ...(issues || []),
      {
        issueTypes: [],
        description: "",
        priority: "LOW" as const,
        isSolved: false,
      },
    ];
    setValue("issues", newIssues);
  };

  const removeIssue = (index: number) => {
    const newIssues = issues?.filter((_, i) => i !== index) || [];
    setValue("issues", newIssues);
  };

  const updateIssue = (index: number, field: string, value: any) => {
    const newIssues = [...(issues || [])];
    newIssues[index] = { ...newIssues[index], [field]: value };
    setValue("issues", newIssues);
  };

  const toggleIssueType = (issueIndex: number, issueType: string) => {
    const currentIssue = issues?.[issueIndex];
    if (!currentIssue) return;

    const currentTypes = currentIssue.issueTypes || [];
    const newTypes = currentTypes.includes(issueType as any)
      ? currentTypes.filter((t) => t !== issueType)
      : [...currentTypes, issueType as any];

    updateIssue(issueIndex, "issueTypes", newTypes);
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
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          Loading site details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading site: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>Site not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {site.nameOfAgency}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {site.url}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel Edit
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Site
            </>
          )}
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameOfAgency">Agency Name</Label>
                    {isEditing ? (
                      <Input
                        id="nameOfAgency"
                        {...form.register("nameOfAgency")}
                      />
                    ) : (
                      <p className="text-sm font-medium">{site.nameOfAgency}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    {isEditing ? (
                      <Input id="url" {...form.register("url")} />
                    ) : (
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {site.url}
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="province">Province</Label>
                      {isEditing ? (
                        <Input id="province" {...form.register("province")} />
                      ) : (
                        <p className="text-sm font-medium">{site.province}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      {isEditing ? (
                        <Input id="district" {...form.register("district")} />
                      ) : (
                        <p className="text-sm font-medium">{site.district}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Type</span>
                    <div className="flex gap-2">
                      {site.isCpanel && (
                        <Badge variant="secondary">
                          <Server className="h-3 w-3 mr-1" />
                          cPanel
                        </Badge>
                      )}
                      {site.isVm && (
                        <Badge variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          VM
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    {site.hasTakenManualBackup ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Backed Up
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        No Backup
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Issues</span>
                    {site.hasIssues ? (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Has Issues
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        No Issues
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Created</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(site.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Backup Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Backup Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {site.backupLocation && (
                    <div className="flex items-center gap-2">
                      {getBackupLocationIcon(site.backupLocation || null)}
                      <span className="text-sm font-medium">
                        {site.backupLocation}
                      </span>
                    </div>
                  )}

                  {site.lastManualBackupDate && (
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Last Manual Backup
                      </span>
                      <p className="text-sm font-medium">
                        {format(
                          new Date(site.lastManualBackupDate),
                          "MMM dd, yyyy",
                        )}
                      </p>
                    </div>
                  )}

                  {site.lastDatabaseBackupDate && (
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">
                        Last Database Backup
                      </span>
                      <p className="text-sm font-medium">
                        {format(
                          new Date(site.lastDatabaseBackupDate),
                          "MMM dd, yyyy",
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* cPanel Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    cPanel Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isCpanel"
                      checked={isCpanel}
                      onCheckedChange={(checked) =>
                        setValue("isCpanel", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="isCpanel">This site uses cPanel</Label>
                  </div>

                  {isCpanel && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cpanelUsername">cPanel Username</Label>
                        {isEditing ? (
                          <Input
                            id="cpanelUsername"
                            {...form.register("cpanelUsername")}
                          />
                        ) : (
                          <p className="text-sm font-medium">
                            {site.cpanelUsername || "Not set"}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cpanelPassword">cPanel Password</Label>
                        {isEditing ? (
                          <Input
                            id="cpanelPassword"
                            type="password"
                            {...form.register("cpanelPassword")}
                          />
                        ) : (
                          <p className="text-sm font-medium">
                            {site.cpanelPassword ? "••••••••" : "Not set"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* VM Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    VM Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isVm"
                      checked={isVm}
                      onCheckedChange={(checked) => setValue("isVm", checked)}
                      disabled={!isEditing}
                    />
                    <Label htmlFor="isVm">This site uses VM</Label>
                  </div>

                  {isVm && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vpnUsername">VPN Username</Label>
                          {isEditing ? (
                            <Input
                              id="vpnUsername"
                              {...form.register("vpnUsername")}
                            />
                          ) : (
                            <p className="text-sm font-medium">
                              {site.vpnUsername || "Not set"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="vpnPassword">VPN Password</Label>
                          {isEditing ? (
                            <Input
                              id="vpnPassword"
                              type="password"
                              {...form.register("vpnPassword")}
                            />
                          ) : (
                            <p className="text-sm font-medium">
                              {site.vpnPassword ? "••••••••" : "Not set"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vmIp">VM IP Address</Label>
                          {isEditing ? (
                            <Input id="vmIp" {...form.register("vmIp")} />
                          ) : (
                            <p className="text-sm font-medium">
                              {site.vmIp || "Not set"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="vmUsername">VM Username</Label>
                          {isEditing ? (
                            <Input
                              id="vmUsername"
                              {...form.register("vmUsername")}
                            />
                          ) : (
                            <p className="text-sm font-medium">
                              {site.vmUsername || "Not set"}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="vmPassword">VM Password</Label>
                          {isEditing ? (
                            <Input
                              id="vmPassword"
                              type="password"
                              {...form.register("vmPassword")}
                            />
                          ) : (
                            <p className="text-sm font-medium">
                              {site.vmPassword ? "••••••••" : "Not set"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hasTakenManualBackup"
                    checked={hasTakenManualBackup}
                    onCheckedChange={(checked) =>
                      setValue("hasTakenManualBackup", checked)
                    }
                    disabled={!isEditing}
                  />
                  <Label htmlFor="hasTakenManualBackup">
                    Manual backup has been taken
                  </Label>
                </div>

                {hasTakenManualBackup && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Last Manual Backup Date</Label>
                      {isEditing ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !watch("lastManualBackupDate") &&
                                  "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {watch("lastManualBackupDate") ? (
                                format(watch("lastManualBackupDate")!, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={watch("lastManualBackupDate")}
                              onSelect={(date) =>
                                setValue("lastManualBackupDate", date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <p className="text-sm font-medium">
                          {site.lastManualBackupDate
                            ? format(
                                new Date(site.lastManualBackupDate),
                                "MMM dd, yyyy",
                              )
                            : "Not set"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Last Database Backup Date</Label>
                      {isEditing ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !watch("lastDatabaseBackupDate") &&
                                  "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {watch("lastDatabaseBackupDate") ? (
                                format(watch("lastDatabaseBackupDate")!, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={watch("lastDatabaseBackupDate")}
                              onSelect={(date) =>
                                setValue("lastDatabaseBackupDate", date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <p className="text-sm font-medium">
                          {site.lastDatabaseBackupDate
                            ? format(
                                new Date(site.lastDatabaseBackupDate),
                                "MMM dd, yyyy",
                              )
                            : "Not set"}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backupLocation">Backup Location</Label>
                      {isEditing ? (
                        <Select
                          value={watch("backupLocation")}
                          onValueChange={(value) =>
                            setValue("backupLocation", value as any)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select backup location" />
                          </SelectTrigger>
                          <SelectContent>
                            {backupLocationOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getBackupLocationIcon(site.backupLocation || null)}
                          <span className="text-sm font-medium">
                            {site.backupLocation || "Not set"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Issues
                </CardTitle>
                <CardDescription>
                  Manage issues associated with this site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addIssue}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Issue
                  </Button>
                )}

                {issues && issues.length > 0 ? (
                  <div className="space-y-4">
                    {issues.map((issue, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Issue {index + 1}</h4>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeIssue(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-4">
                          {/* Issue Types */}
                          <div className="space-y-2">
                            <Label>Issue Types</Label>
                            {isEditing ? (
                              <div className="flex flex-wrap gap-2">
                                {issueTypeOptions.map((option) => (
                                  <Badge
                                    key={option.value}
                                    variant={
                                      issue.issueTypes?.includes(
                                        option.value as any,
                                      )
                                        ? "default"
                                        : "outline"
                                    }
                                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                    onClick={() =>
                                      toggleIssueType(index, option.value)
                                    }
                                  >
                                    {option.label}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {issue.issueTypes?.map((type) => (
                                  <Badge key={type} variant="outline">
                                    {issueTypeOptions.find(
                                      (opt) => opt.value === type,
                                    )?.label || type}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Priority */}
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            {isEditing ? (
                              <Select
                                value={issue.priority}
                                onValueChange={(value) =>
                                  updateIssue(index, "priority", value)
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
                                      <div className="flex items-center gap-2">
                                        <Badge className={option.color}>
                                          {option.label}
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge
                                className={
                                  priorityOptions.find(
                                    (opt) => opt.value === issue.priority,
                                  )?.color
                                }
                              >
                                {
                                  priorityOptions.find(
                                    (opt) => opt.value === issue.priority,
                                  )?.label
                                }
                              </Badge>
                            )}
                          </div>

                          {/* Status */}
                          <div className="space-y-2">
                            <Label>Status</Label>
                            {isEditing ? (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={issue.isSolved}
                                  onCheckedChange={(checked) =>
                                    updateIssue(index, "isSolved", checked)
                                  }
                                />
                                <Label>
                                  {issue.isSolved ? "Solved" : "Unsolved"}
                                </Label>
                              </div>
                            ) : (
                              <Badge
                                variant={
                                  issue.isSolved ? "default" : "destructive"
                                }
                              >
                                {issue.isSolved ? "Solved" : "Unsolved"}
                              </Badge>
                            )}
                          </div>

                          {/* Description */}
                          <div className="space-y-2">
                            <Label>Description</Label>
                            {isEditing ? (
                              <Textarea
                                value={issue.description}
                                onChange={(e) =>
                                  updateIssue(
                                    index,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Describe the issue in detail..."
                                rows={3}
                              />
                            ) : (
                              <p className="text-sm">{issue.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No issues found for this site</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        {isEditing && (
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
