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
} from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SitesList() {
  const [deletingSiteId, setDeletingSiteId] = useState<string | null>(null);

  const {
    data: sites,
    isLoading,
    error,
  } = api.manager.getSites.useQuery({
    limit: 50,
    offset: 0,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const deleteSiteMutation = api.manager.deleteSite.useMutation({
    onSuccess: () => {
      toast.success("Site deleted successfully!");
      setDeletingSiteId(null);
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
        <p className="text-sm">No sites have been registered yet.</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-gray-800">
            Sites Overview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {sites.data.length} Sites
          </Badge>
          <Link href="/site/create">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Site
            </Button>
          </Link>
        </div>
      </div>

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
