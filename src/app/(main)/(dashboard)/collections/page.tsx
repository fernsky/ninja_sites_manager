"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { useUserStore } from "@/store/user";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Building2, BriefcaseIcon, UsersIcon, MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AreaPointsMap = dynamic(
  () => import("@/components/map/area-points-map"),
  {
    ssr: false,
  },
);

const CollectionsPage = () => {
  const user = useUserStore((state) => state.user);
  const [selectedArea, setSelectedArea] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>("building");

  // Fetch user's assigned area codes
  const { data: areaCodes } = api.area.getAreaCodesByUserId.useQuery(
    { userId: user?.id ?? "" },
    { enabled: !!user?.id },
  );

  // Fetch boundary for selected area
  const { data: boundary } = api.area.getAreaBoundaryByCode.useQuery(
    { code: parseInt(selectedArea ?? "0") },
    { enabled: !!selectedArea },
  );

  // Fetch points based on selected type and area
  const queryProcedure =
    selectedType === "family"
      ? api.family.getByAreaCode
      : selectedType === "business"
        ? api.business.getByAreaCode
        : api.building.getByAreaCode;
  //@ts-ignore
  const { data: points, isLoading: pointsLoading } = queryProcedure.useQuery(
    { areaCode: selectedArea ?? "" },
    { enabled: !!selectedArea },
  );

  // Calculate point counts
  const pointCount = points?.length ?? 0;

  // Calculate map center from boundary
  const calculatePolygonCenter = (coordinates: number[][][]) => {
    let totalLat = 0;
    let totalLng = 0;
    let pointCount = 0;

    coordinates[0].forEach((point) => {
      totalLat += point[1];
      totalLng += point[0];
      pointCount++;
    });

    return {
      lat: totalLat / pointCount,
      lng: totalLng / pointCount,
    };
  };

  const mapCenter = boundary?.boundary
    ? calculatePolygonCenter(boundary.boundary.coordinates)
    : undefined;

  return (
    <ContentLayout title="My Collections">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6"
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col gap-4 bg-white p-3 md:p-4 rounded-lg shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-[200px] border-gray-200">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {areaCodes?.map((code) => (
                    <SelectItem key={code} value={code.toString()}>
                      Area {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger
                  className={cn(
                    "w-[200px] border-gray-200",
                    selectedType === "family" && "text-blue-600",
                    selectedType === "business" && "text-green-600",
                    selectedType === "building" && "text-purple-600",
                  )}
                >
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="building">Buildings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {!selectedArea ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm space-y-4 text-center"
            >
              <MapIcon className="w-16 h-16 text-gray-400" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Your Assigned Areas
                </h2>
                <p className="text-gray-500 max-w-md">
                  Select an area to view your submissions data and map
                  visualization.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {pointsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-none shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {selectedType === "family" && (
                          <UsersIcon className="w-6 h-6 text-blue-600" />
                        )}
                        {selectedType === "business" && (
                          <BriefcaseIcon className="w-6 h-6 text-green-600" />
                        )}
                        {selectedType === "building" && (
                          <Building2 className="w-6 h-6 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-0.5 text-gray-600">
                          Total{" "}
                          {selectedType === "family"
                            ? "Families"
                            : selectedType === "business"
                              ? "Businesses"
                              : "Buildings"}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {pointCount}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <MapIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium mb-0.5 text-purple-600">
                          Selected Area
                        </p>
                        <p className="text-2xl font-bold text-purple-700">
                          Area {selectedArea}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-[400px] md:h-[600px] w-full relative rounded-xl overflow-hidden bg-white shadow-sm"
              >
                {points && boundary ? (
                  <AreaPointsMap
                    points={points.map((point: any) => ({
                      ...point,
                      name: point.name || undefined,
                      wardNo: point.wardNo || undefined,
                      gpsPoint: point.gpsPoint || undefined,
                    }))}
                    boundaries={[
                      { ...boundary.boundary, areaCode: selectedArea },
                    ]}
                    //@ts-ignore
                    center={mapCenter}
                    defaultZoom={15}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </ContentLayout>
  );
};

export default CollectionsPage;
