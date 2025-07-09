"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  useState,
} from "react";
import { Card } from "@/components/ui/card";
import {
  Building2,
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  MapIcon,
  ArrowDownCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AreaPointsMap = dynamic(
  () => import("@/components/map/area-points-map"),
  {
    ssr: false,
  },
);

interface Point {
  id: string;
  name: string | null;
  wardNo: string | null;
  gpsPoint: {
    lat: number;
    lng: number;
    accuracy: number;
  } | null;
  [key: string]: any; // for other properties
}

interface Boundary {
  type: string;
  coordinates: number[][][];
}

// Add this helper function outside the component
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

export default function SubmissionsPage() {
  const [filterType, setFilterType] = useState<"area" | "enumerator">("area");
  const [selectedWard, setSelectedWard] = useState<string>();
  const [selectedArea, setSelectedArea] = useState<string>();
  const [selectedType, setSelectedType] = useState<string>("building");
  const [selectedEnumerator, setSelectedEnumerator] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Modify enumerator names query to use correct procedure based on type
  const queryProcedureForEnumerators =
    selectedType === "family"
      ? api.family.getEnumeratorNames
      : selectedType === "business"
        ? api.business.getEnumeratorNames
        : api.building.getEnumeratorNames;

  //@ts-ignore
  const { data: enumeratorNames } = queryProcedureForEnumerators.useQuery(
    undefined,
    {
      enabled: filterType === "enumerator",
    },
  );

  // Filter enumerator names based on search query
  const filteredEnumeratorNames = enumeratorNames
    ?.filter((name: string | null): name is string => name !== null)
    .filter((name: string) =>
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  // Reset filters when switching filter type
  const handleFilterTypeChange = (value: "area" | "enumerator") => {
    setFilterType(value);
    setSelectedWard(undefined);
    setSelectedArea(undefined);
    setSelectedEnumerator("");
  };

  // Reset enumerator when type changes
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setSelectedEnumerator("");
  };

  // Fetch areas for selected ward
  const { data: areas } = api.area.getAreas.useQuery(
    { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
    { enabled: !!selectedWard },
  );

  // Modify the query to handle enumerator-based filtering
  const queryProcedure =
    filterType === "area"
      ? selectedType === "family"
        ? api.family.getByAreaCode
        : selectedType === "business"
          ? api.business.getByAreaCode
          : api.building.getByAreaCode
      : selectedType === "family"
        ? api.family.getByEnumeratorName
        : selectedType === "business"
          ? api.business.getByEnumeratorName
          : api.building.getByEnumeratorName;

  //@ts-ignore
  const { data: points, isLoading: pointsLoading } = queryProcedure.useQuery(
    filterType === "area"
      ? { areaCode: selectedArea ?? "" }
      : { enumeratorName: selectedEnumerator },
    {
      enabled:
        (filterType === "area" && !!selectedArea) ||
        (filterType === "enumerator" && !!selectedEnumerator),
      retry: 1,
    },
  );

  // Modify area codes query to use correct procedure based on type
  const areaCodesQuery =
    selectedType === "family"
      ? api.family.getAreaCodesByEnumeratorName
      : selectedType === "business"
        ? api.business.getAreaCodesByEnumeratorName
        : api.building.getAreaCodesByEnumeratorName;

  //@ts-ignore
  const { data: areaCodes } = areaCodesQuery.useQuery(
    { enumeratorName: selectedEnumerator },
    {
      enabled: !!selectedEnumerator && filterType === "enumerator",
    },
  );

  console.log(areaCodes);

  const { data: areaBoundaries } = api.area.getAreaBoundariesByCodes.useQuery({
    codes: (areaCodes ?? [])
      .filter((code: string | null): code is string => code !== null)
      .map((code: string) => parseInt(code)),
  });

  // Fetch boundary for selected area
  const { data: boundary } = api.area.getAreaBoundaryByCode.useQuery<{
    boundary: Boundary;
  }>({ code: parseInt(selectedArea ?? "0") }, { enabled: !!selectedArea });

  // Get unique enumerators and count
  const pointCount = points?.length ?? 0;

  // Add this before the return statement
  const mapCenter = boundary?.boundary
    ? calculatePolygonCenter(boundary.boundary.coordinates)
    : undefined;

  return (
    <ContentLayout title={""}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6" // reduced padding
      >
        <div className="flex flex-col gap-4 md:gap-6">
          {" "}
          {/* reduced gap */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex flex-col gap-4 bg-white p-3 md:p-4 rounded-lg shadow-sm"
          >
            <RadioGroup
              defaultValue="area"
              value={filterType}
              onValueChange={(value: "area" | "enumerator") =>
                handleFilterTypeChange(value)
              }
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="area" id="area" />
                <Label htmlFor="area">Filter by Area</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enumerator" id="enumerator" />
                <Label htmlFor="enumerator">Filter by Enumerator</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-wrap items-center gap-3">
              {filterType === "area" ? (
                <>
                  <Select value={selectedWard} onValueChange={setSelectedWard}>
                    <SelectTrigger className="w-[200px] border-gray-200">
                      <SelectValue placeholder="Select Ward" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (ward) => (
                          <SelectItem key={ward} value={ward.toString()}>
                            Ward {ward}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedArea}
                    onValueChange={setSelectedArea}
                    disabled={!selectedWard}
                  >
                    <SelectTrigger className="w-[200px] border-gray-200">
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas?.map((area) => (
                        <SelectItem key={area.id} value={area.code.toString()}>
                          Area {area.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div className="flex flex-col gap-2 w-[200px] relative">
                  <Input
                    type="text"
                    placeholder="Search enumerator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      // Delay hiding recommendations to allow clicking
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                    className="border-gray-200"
                  />
                  {isSearchFocused &&
                    searchQuery &&
                    filteredEnumeratorNames?.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[200px] overflow-y-auto">
                        {filteredEnumeratorNames.map((name: string) => (
                          <div
                            key={name}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedEnumerator(name);
                              setSearchQuery(name);
                              setIsSearchFocused(false);
                            }}
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                  <Select
                    value={selectedEnumerator}
                    onValueChange={(value) => {
                      setSelectedEnumerator(value);
                      setSearchQuery(value);
                    }}
                  >
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select Enumerator" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredEnumeratorNames?.map((name: string) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Select value={selectedType} onValueChange={handleTypeChange}>
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
          {/* Content Section */}
          {!selectedWard && filterType === "area" && !selectedEnumerator ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm space-y-4 text-center"
            >
              <MapIcon className="w-16 h-16 text-gray-400" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Welcome to Area Submissions
                </h2>
                <p className="text-gray-500 max-w-md">
                  View and analyze data submissions across different wards and
                  areas. Start by selecting a ward from the dropdown above.
                </p>
              </div>
              <ArrowDownCircle className="w-6 h-6 text-blue-500 animate-bounce mt-4" />
            </motion.div>
          ) : !selectedArea && filterType === "area" && !selectedEnumerator ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm space-y-4 text-center"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-gray-700">
                  Ward {selectedWard} Selected
                </h2>
                <p className="text-gray-500">
                  Now select an area to view detailed submissions data and map
                  visualization.
                </p>
              </div>
            </motion.div>
          ) : filterType === "enumerator" && !selectedEnumerator ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-sm space-y-4 text-center"
            >
              <UsersIcon className="w-16 h-16 text-gray-400" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Enumerator Submissions
                </h2>
                <p className="text-gray-500 max-w-md">
                  Select an enumerator to view their submissions across
                  different areas.
                </p>
              </div>
              <ArrowDownCircle className="w-6 h-6 text-blue-500 animate-bounce mt-4" />
            </motion.div>
          ) : (
            <>
              {pointsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-24 w-full" /> {/* reduced height */}
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : points ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
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
                        <p
                          className={cn(
                            "text-xs font-medium mb-0.5",
                            selectedType === "family" && "text-blue-600",
                            selectedType === "business" && "text-green-600",
                            selectedType === "building" && "text-purple-600",
                          )}
                        >
                          {selectedType === "family"
                            ? "Total Families"
                            : selectedType === "business"
                              ? "Total Businesses"
                              : "Total Buildings"}
                        </p>
                        <p
                          className={cn(
                            "text-2xl font-bold leading-none",
                            selectedType === "family" && "text-blue-700",
                            selectedType === "business" && "text-green-700",
                            selectedType === "building" && "text-purple-700",
                          )}
                        >
                          {pointCount}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <HomeIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium mb-1 text-purple-600">
                          {filterType === "area"
                            ? "Selected Area"
                            : "Areas Covered"}
                        </p>
                        {filterType === "area" ? (
                          <p className="text-2xl font-bold leading-none text-purple-700">
                            {selectedArea ? `Area ${selectedArea}` : "None"}
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {areaCodes?.length ? (
                              areaCodes
                                .filter(
                                  (code: any): code is string =>
                                    typeof code === "string",
                                )
                                .map((code: string) => (
                                  <span
                                    key={code}
                                    className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-sm font-medium"
                                  >
                                    Area {code}
                                  </span>
                                ))
                            ) : (
                              <p className="text-sm text-purple-700">
                                No areas assigned
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : selectedArea ? (
                <Alert variant="destructive" className="py-2">
                  {" "}
                  {/* reduced padding */}
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load data. Please try again.
                  </AlertDescription>
                </Alert>
              ) : null}

              {/* Map Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-[400px] md:h-[600px] w-full relative rounded-xl overflow-hidden bg-white shadow-sm"
              >
                {points &&
                (filterType === "area" ? boundary : areaBoundaries) ? (
                  <AreaPointsMap
                    //@ts-ignore
                    points={points.map((point) => ({
                      ...point,
                      name: point.name || undefined,
                      wardNo: point.wardNo || undefined,
                      gpsPoint: point.gpsPoint || undefined,
                    }))}
                    boundaries={
                      filterType === "area"
                        ? boundary?.boundary
                          ? [{ ...boundary.boundary, areaCode: selectedArea }]
                          : []
                        : (areaBoundaries?.map((area, index) => ({
                            ...area.boundary,
                            areaCode: areaCodes?.[index] ?? "",
                          })) ?? [])
                    }
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
}
