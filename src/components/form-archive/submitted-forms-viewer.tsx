"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  FileImage,
  Building,
  Users,
  MapPin,
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubmittedFormsViewer() {
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const {
    data: formData,
    isLoading,
    error,
    refetch,
  } = api.enumerator.getFormPhotosByWard.useQuery(
    {
      wardNumber: selectedWard === "all" ? undefined : selectedWard,
      areaCode: selectedArea === "all" ? undefined : selectedArea,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const handleRefresh = () => {
    refetch();
  };

  // Get available areas for the selected ward
  const availableAreas =
    selectedWard === "all"
      ? Array.from(
          new Set(formData?.photos.map((p) => p.areaCode).filter(Boolean)),
        ).sort()
      : formData?.wardStats.find((w) => w.wardNumber === selectedWard)
          ?.areaCodes || [];

  // Reset area selection when ward changes
  const handleWardChange = (ward: string) => {
    setSelectedWard(ward);
    setSelectedArea("all");
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load submitted forms: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ward Statistics Overview */}
      {formData?.wardStats && formData.wardStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Ward Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {formData.wardStats.map((ward) => (
                <div
                  key={ward.wardNumber}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="font-semibold text-lg mb-2">
                    Ward {ward.wardNumber}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Areas:</span>
                      <span className="font-medium">
                        {ward.areaCodes.length}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Building className="w-3 h-3 mr-1" />
                        {ward.buildingCount}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {ward.familyCount}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total: {ward.totalCount} submissions
                    </div>
                    {ward.lastUpload && (
                      <div className="text-xs text-muted-foreground">
                        Last: {new Date(ward.lastUpload).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Photo Gallery */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Form Submissions</CardTitle>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Select value={selectedWard} onValueChange={handleWardChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Wards</SelectItem>
                  {formData?.wardStats.map((ward) => (
                    <SelectItem key={ward.wardNumber} value={ward.wardNumber}>
                      Ward {ward.wardNumber} ({ward.totalCount} submissions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {availableAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          {formData?.photos && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium">
                Showing {formData.photos.length} submissions
                {selectedWard !== "all" && ` from Ward ${selectedWard}`}
                {selectedArea !== "all" && ` in area ${selectedArea}`}
              </p>
            </div>
          )}

          {/* Photo Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Loading submissions...
                </p>
              </div>
            </div>
          ) : formData?.photos && formData.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {formData.photos.map((photo, index) => (
                <div
                  key={photo.fileName}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={photo.url}
                    alt={`Form submission ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {photo.wardNumber && (
                        <Badge variant="secondary" className="text-xs">
                          Ward {photo.wardNumber}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {photo.areaCode}
                      </Badge>
                      <Badge
                        variant={
                          photo.formType === "building" ? "default" : "outline"
                        }
                        className="text-xs"
                      >
                        {photo.formType === "building" ? (
                          <>
                            <Building className="w-3 h-3 mr-1" />
                            Building
                          </>
                        ) : (
                          <>
                            <Users className="w-3 h-3 mr-1" />
                            Family
                          </>
                        )}
                      </Badge>
                      {photo.pageNumber && (
                        <Badge variant="outline" className="text-xs">
                          Page {photo.pageNumber}
                        </Badge>
                      )}
                    </div>

                    {photo.enumeratorName && (
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <User className="w-3 h-3 mr-1" />
                        {photo.enumeratorName}
                      </div>
                    )}

                    {photo.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {photo.description}
                      </p>
                    )}

                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>
                        {photo.uploadedAt
                          ? new Date(photo.uploadedAt).toLocaleString()
                          : "Unknown date"}
                      </div>
                      <div>
                        Size: {photo.size ? Math.round(photo.size / 1024) : 0}KB
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No submissions found
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedWard !== "all" || selectedArea !== "all"
                  ? "Try adjusting your filters to see more results"
                  : "No form submissions have been uploaded yet"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
