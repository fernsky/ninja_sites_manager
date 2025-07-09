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
import { RefreshCw, FileImage, Building, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormPhotoGallery() {
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedFormType, setSelectedFormType] = useState<
    "building" | "family" | "all"
  >("all");

  const {
    data: photos,
    isLoading,
    error,
    refetch,
  } = api.enumerator.getFormPhotos.useQuery(
    {
      areaCode: selectedArea === "all" ? undefined : selectedArea,
      formType: selectedFormType === "all" ? undefined : selectedFormType,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const { data: areaStats } = api.enumerator.getFormPhotosByArea.useQuery({});

  const handleRefresh = () => {
    refetch();
  };

  // Get unique area codes from photos or stats
  const availableAreas = areaStats?.map((stat) => stat.areaCode) || [];

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load form photos: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Form Photo Archive</h3>
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

      {/* Area Statistics Summary */}
      {areaStats && areaStats.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Area Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {areaStats.map((stat) => (
              <div key={stat.areaCode} className="bg-white p-3 rounded border">
                <div className="font-medium">{stat.areaCode}</div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Building className="w-3 h-3 mr-1" />
                    {stat.buildingCount}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {stat.familyCount}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total: {stat.totalCount} photos
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by area" />
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
        <div className="flex-1">
          <Select
            value={selectedFormType}
            onValueChange={(value: "building" | "family" | "all") =>
              setSelectedFormType(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by form type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Form Types</SelectItem>
              <SelectItem value="building">Building Forms</SelectItem>
              <SelectItem value="family">Family Survey Forms</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Photo Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading photos...</p>
          </div>
        </div>
      ) : photos && photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.fileName}
              className="border rounded-lg overflow-hidden"
            >
              <img
                src={photo.url}
                alt={`Form photo ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <div className="flex gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
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
                {photo.description && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {photo.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {photo.uploadedAt
                    ? new Date(photo.uploadedAt).toLocaleString()
                    : "Unknown date"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Size: {photo.size ? Math.round(photo.size / 1024) : 0}KB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {selectedArea !== "all" || selectedFormType !== "all"
              ? "No photos found with the selected filters"
              : "No form photos uploaded yet"}
          </p>
        </div>
      )}
    </div>
  );
}
