"use client";

import { useState } from "react";
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
import { CalendarIcon, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const formSchema = z.object({
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
      }),
    )
    .optional()
    .default([]),
});

type FormData = z.infer<typeof formSchema>;

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

export default function CreateSitePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isCpanel: false,
      isVm: false,
      hasTakenManualBackup: false,
      issues: [],
    },
  });

  const { watch, setValue } = form;
  const isCpanel = watch("isCpanel");
  const isVm = watch("isVm");
  const hasTakenManualBackup = watch("hasTakenManualBackup");
  const issues = watch("issues");

  const createSiteMutation = api.manager.createSite.useMutation({
    onSuccess: () => {
      toast.success("Site created successfully!");
      router.push("/site");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create site");
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await createSiteMutation.mutateAsync(data);
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Site</h1>
          <p className="text-muted-foreground">
            Add a new site to the management system
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about the site and agency
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameOfAgency">Agency Name *</Label>
                <Input
                  id="nameOfAgency"
                  {...form.register("nameOfAgency")}
                  placeholder="Enter agency name"
                />
                {form.formState.errors.nameOfAgency && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.nameOfAgency.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  {...form.register("url")}
                  placeholder="https://example.com"
                />
                {form.formState.errors.url && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.url.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input
                  id="province"
                  {...form.register("province")}
                  placeholder="Enter province"
                />
                {form.formState.errors.province && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.province.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  {...form.register("district")}
                  placeholder="Enter district"
                />
                {form.formState.errors.district && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.district.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* cPanel Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>cPanel Configuration</CardTitle>
            <CardDescription>
              Configure cPanel access if applicable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isCpanel"
                checked={isCpanel}
                onCheckedChange={(checked) => setValue("isCpanel", checked)}
              />
              <Label htmlFor="isCpanel">This site uses cPanel</Label>
            </div>

            {isCpanel && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpanelUsername">cPanel Username</Label>
                  <Input
                    id="cpanelUsername"
                    {...form.register("cpanelUsername")}
                    placeholder="Enter cPanel username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpanelPassword">cPanel Password</Label>
                  <Input
                    id="cpanelPassword"
                    type="password"
                    {...form.register("cpanelPassword")}
                    placeholder="Enter cPanel password"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* VM Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>VM Configuration</CardTitle>
            <CardDescription>Configure VM access if applicable</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isVm"
                checked={isVm}
                onCheckedChange={(checked) => setValue("isVm", checked)}
              />
              <Label htmlFor="isVm">This site uses VM</Label>
            </div>

            {isVm && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vpnUsername">VPN Username</Label>
                    <Input
                      id="vpnUsername"
                      {...form.register("vpnUsername")}
                      placeholder="Enter VPN username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vpnPassword">VPN Password</Label>
                    <Input
                      id="vpnPassword"
                      type="password"
                      {...form.register("vpnPassword")}
                      placeholder="Enter VPN password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vmIp">VM IP Address</Label>
                    <Input
                      id="vmIp"
                      {...form.register("vmIp")}
                      placeholder="Enter VM IP"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vmUsername">VM Username</Label>
                    <Input
                      id="vmUsername"
                      {...form.register("vmUsername")}
                      placeholder="Enter VM username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vmPassword">VM Password</Label>
                    <Input
                      id="vmPassword"
                      type="password"
                      {...form.register("vmPassword")}
                      placeholder="Enter VM password"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backup Information */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Information</CardTitle>
            <CardDescription>
              Configure backup settings and locations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hasTakenManualBackup"
                checked={hasTakenManualBackup}
                onCheckedChange={(checked) =>
                  setValue("hasTakenManualBackup", checked)
                }
              />
              <Label htmlFor="hasTakenManualBackup">
                Manual backup has been taken
              </Label>
            </div>

            {hasTakenManualBackup && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Last Manual Backup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("lastManualBackupDate") &&
                              "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("lastManualBackupDate") ? (
                            format(form.watch("lastManualBackupDate")!, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("lastManualBackupDate")}
                          onSelect={(date) =>
                            setValue("lastManualBackupDate", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Last Database Backup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !form.watch("lastDatabaseBackupDate") &&
                              "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {form.watch("lastDatabaseBackupDate") ? (
                            format(form.watch("lastDatabaseBackupDate")!, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={form.watch("lastDatabaseBackupDate")}
                          onSelect={(date) =>
                            setValue("lastDatabaseBackupDate", date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupLocation">Backup Location</Label>
                    <Select
                      value={form.watch("backupLocation")}
                      onValueChange={(value) =>
                        setValue("backupLocation", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select backup location" />
                      </SelectTrigger>
                      <SelectContent>
                        {backupLocationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issues Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Issues
            </CardTitle>
            <CardDescription>
              Add any known issues with the site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={addIssue}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Issue
            </Button>

            {issues && issues.length > 0 && (
              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Issue {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIssue(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {/* Issue Types */}
                      <div className="space-y-2">
                        <Label>Issue Types *</Label>
                        <div className="flex flex-wrap gap-2">
                          {issueTypeOptions.map((option) => (
                            <Badge
                              key={option.value}
                              variant={
                                issue.issueTypes?.includes(option.value as any)
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
                        {issue.issueTypes?.length === 0 && (
                          <p className="text-sm text-red-500">
                            At least one issue type is required
                          </p>
                        )}
                      </div>

                      {/* Priority */}
                      <div className="space-y-2">
                        <Label>Priority *</Label>
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
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                          value={issue.description}
                          onChange={(e) =>
                            updateIssue(index, "description", e.target.value)
                          }
                          placeholder="Describe the issue in detail..."
                          rows={3}
                        />
                        {issue.description.length > 1000 && (
                          <p className="text-sm text-red-500">
                            Description too long (max 1000 characters)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Site"}
          </Button>
        </div>
      </form>
    </div>
  );
}
