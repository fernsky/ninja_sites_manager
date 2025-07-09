"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState } from "react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapIcon, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChartIcon, PieChartIcon } from "lucide-react";

const COLORS = [
  "#FF6B6B", // Bright red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky blue
  "#96CEB4", // Sage green
  "#FFEEAD", // Light yellow
  "#D4A5A5", // Dusty rose
  "#9B5DE5", // Purple
  "#F15BB5", // Pink
  "#00BBF9", // Bright blue
  "#00F5D4", // Mint
  "#FF9F1C", // Orange
  "#2EC4B6", // Teal
  "#E71D36", // Bright coral
  "#662E9B", // Deep purple
  "#43AA8B", // Sea green
];

const WardwisePage = () => {
  const [selectedWard, setSelectedWard] = useState<string>();
  const [selectedCategory, setSelectedCategory] =
    useState<string>("individual");

  // Add all analytics queries
  const { data: genderData, isLoading: isLoadingGender } =
    api.analytics.getGenderDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: mainFamilyData, isLoading: isLoadingMainFamily } =
    api.analytics.getFamilyStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: ageData, isLoading: isLoadingAge } =
    api.analytics.getAgeDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: casteData, isLoading: isLoadingCaste } =
    api.analytics.getCasteDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: religionData, isLoading: isLoadingReligion } =
    api.analytics.getReligionDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: maritalData, isLoading: isLoadingMarital } =
    api.analytics.getMaritalStatusDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: marriageAgeData, isLoading: isLoadingMarriageAge } =
    api.analytics.getMarriageAgeDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: motherTongueData, isLoading: isLoadingMotherTongue } =
    api.analytics.getMotherTongueDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: ancestorLanguageData, isLoading: isLoadingAncestorLanguage } =
    api.analytics.getAncestorLanguageDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  const { data: disabilityData, isLoading: isLoadingDisability } =
    api.analytics.getDisabilityDistribution.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard },
    );

  // Add agricultural analytics queries
  const { data: agricultureOverview, isLoading: isLoadingAgricultureOverview } =
    api.analytics.getAgricultureOverview.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "agriculture" },
    );

  const { data: landStats, isLoading: isLoadingLandStats } =
    api.analytics.getAgriculturalLandStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "agriculture" },
    );

  const { data: irrigationStats, isLoading: isLoadingIrrigationStats } =
    api.analytics.getIrrigationStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "agriculture" },
    );

  const { data: cropStats, isLoading: isLoadingCropStats } =
    api.analytics.getCropStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "agriculture" },
    );

  const { data: animalStats, isLoading: isLoadingAnimalStats } =
    api.analytics.getAnimalStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "agriculture" },
    );

  const { data: animalProductStats, isLoading: isLoadingAnimalProductStats } =
    api.analytics.getAnimalProductStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "agriculture" },
    );

  // Add building queries after existing queries
  const { data: buildingStats, isLoading: isLoadingBuildingStats } =
    api.analytics.getBuildingStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "buildings" },
    );

  const { data: emptyBuildingsStats, isLoading: isLoadingEmptyBuildings } =
    api.analytics.getEmptyBuildingsStats.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "buildings" },
    );

  const { data: buildingsByStatus, isLoading: isLoadingBuildingStatus } =
    api.analytics.getBuildingsByStatus.useQuery(
      { wardNumber: selectedWard ? parseInt(selectedWard) : undefined },
      { enabled: !!selectedWard && selectedCategory === "buildings" },
    );

  const TableComponent = ({
    data,
    nameKey,
  }: {
    data: any[];
    nameKey: string;
  }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
      <div className="w-full h-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {nameKey.charAt(0).toUpperCase() + nameKey.slice(1)}
              </TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item[nameKey]}</TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>
                  {((item.count / total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const ChartCard = ({
    title,
    data,
    isLoading,
    nameKey,
  }: {
    title: string;
    data: any[];
    isLoading: boolean;
    nameKey: string;
  }) => {
    // Force bar chart for Crop Distribution
    const [chartType, setChartType] = useState<"pie" | "bar">(
      title === "Crop Distribution" ? "bar" : "pie",
    );

    const ChartView = () =>
      chartType === "pie" ? (
        <PieChartComponent data={data} nameKey={nameKey} />
      ) : (
        <BarChartComponent data={data} dataKey={nameKey} />
      );

    return (
      <Card className="w-full min-h-[400px] lg:h-[400px]">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              {title}
            </CardTitle>
            {!isLoading && data && title !== "Crop Distribution" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setChartType((prev) => (prev === "pie" ? "bar" : "pie"))
                }
                className="flex items-center gap-2"
              >
                {chartType === "pie" ? (
                  <>
                    <BarChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Bar Chart</span>
                  </>
                ) : (
                  <>
                    <PieChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Pie Chart</span>
                  </>
                )}
              </Button>
            )}
          </div>
          {!isLoading && data && (
            <Tabs
              defaultValue={title === "Crop Distribution" ? "table" : "chart"}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="h-[280px]">
                <ChartView />
              </TabsContent>
              <TabsContent value="table" className="h-[280px] overflow-auto">
                <TableComponent data={data} nameKey={nameKey} />
              </TabsContent>
            </Tabs>
          )}
        </CardHeader>
        <CardContent className="h-[320px] flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <p className="text-sm text-gray-500">Loading data...</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const PieChartComponent = ({
    data,
    nameKey,
  }: {
    data: any[];
    nameKey: string;
  }) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false} // Remove the label line
          label={false} // Remove the permanent label
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
          nameKey={nameKey}
        >
          {data?.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [
            `${value} (${((Number(value) / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`,
            name,
          ]}
        />
        <Legend
          formatter={(value) => <span style={{ color: "#000" }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const BarChartComponent = ({
    data,
    dataKey,
  }: {
    data: any[];
    dataKey: string;
  }) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={dataKey}
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => [
            `${value} (${((Number(value) / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%)`,
            "Count",
          ]}
        />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );

  const PopulationStats = () => {
    if (isLoadingGender) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      );
    }

    if (!genderData) return null;

    // Log the data to see what we're getting
    console.log("Gender Data:", genderData);

    const total = genderData.reduce((sum, item) => sum + item.count, 0);
    const maleCount =
      genderData.find(
        (item) =>
          item.gender.toLowerCase().trim() === "पुरुष" ||
          item.gender.toLowerCase().trim() === "m",
      )?.count || 0;
    const femaleCount =
      genderData.find(
        (item) =>
          item.gender.toLowerCase().trim() === "महिला" ||
          item.gender.toLowerCase().trim() === "f",
      )?.count || 0;
    const othersCount =
      genderData.find(
        (item) =>
          item.gender.toLowerCase().trim() === "अन्य" ||
          item.gender.toLowerCase().trim() === "o",
      )?.count || 0;

    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Ward {selectedWard} Population Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Total Population</p>
            <p className="text-2xl font-bold text-blue-700">{total}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Male Population</p>
            <p className="text-2xl font-bold text-green-700">{maleCount}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600">Female Population</p>
            <p className="text-2xl font-bold text-purple-700">{femaleCount}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600">Others Population</p>
            <p className="text-2xl font-bold text-orange-700">{othersCount}</p>
          </div>
        </div>
      </div>
    );
  };

  // Add Agricultural Overview component
  const AgricultureOverview = () => {
    if (isLoadingAgricultureOverview) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      );
    }

    if (!agricultureOverview) return null;

    const { crops, animals, animalProducts } = agricultureOverview;

    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Ward {selectedWard} Agricultural Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg space-y-2">
            <p className="text-sm text-green-600">Crop Statistics</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-700">
                {Number(crops.total_households).toString()} Households
              </p>
              <p className="text-sm text-green-600">
                Area: {(crops.total_area as number)?.toFixed(2) || 0} Hectares
              </p>
              <p className="text-sm text-green-600">
                Revenue: Rs. {((crops.total_revenue as number) || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg space-y-2">
            <p className="text-sm text-blue-600">Animal Husbandry</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-700">
                {Number(animals.total_households).toString()} Households
              </p>
              <p className="text-sm text-blue-600">
                Total Animals: {Number(animals.total_count || 0).toString()}
              </p>
              <p className="text-sm text-blue-600">
                Revenue: Rs. {Number(animals.total_revenue || 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg space-y-2">
            <p className="text-sm text-purple-600">Animal Products</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-700">
                {Number(animalProducts.total_households || 0).toString()}{" "}
                Households
              </p>
              <p className="text-sm text-purple-600">
                Revenue: Rs.{" "}
                {Number(animalProducts.total_revenue || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Replace the BuildingOverview component with this updated version
  const BuildingOverview = () => {
    if (
      isLoadingBuildingStats ||
      isLoadingEmptyBuildings ||
      isLoadingBuildingStatus
    ) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      );
    }

    if (!buildingStats || !emptyBuildingsStats || !buildingsByStatus)
      return null;

    const statusCounts = buildingsByStatus.reduce(
      (acc, item) => {
        if (item.status) {
          acc[item.status] = item.count;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Ward {selectedWard} Building Statistics
        </h2>

        {/* Main statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-lg text-blue-600 mb-2">Total Buildings</p>
            <p className="text-4xl font-bold text-blue-700">
              {buildingStats.totalBuildings}
            </p>
            <p className="mt-2 text-sm text-blue-500">
              Registered structures in Ward {selectedWard}
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg">
            <p className="text-lg text-green-600 mb-2">Total Families</p>
            <p className="text-4xl font-bold text-green-700">
              {mainFamilyData?.totalFamilies}
            </p>
            <p className="mt-2 text-sm text-green-500">
              Average{" "}
              {(
                buildingStats.totalFamilies / buildingStats.totalBuildings
              ).toFixed(1)}{" "}
              families per building
            </p>
          </div>

          <div className="p-6 bg-purple-50 rounded-lg">
            <p className="text-lg text-purple-600 mb-2">Total Businesses</p>
            <p className="text-4xl font-bold text-purple-700">
              {buildingStats.totalBusinesses}
            </p>
            <p className="mt-2 text-sm text-purple-500">
              Average{" "}
              {(
                buildingStats.totalBusinesses / buildingStats.totalBuildings
              ).toFixed(1)}{" "}
              businesses per building
            </p>
          </div>

          <div className="p-6 bg-orange-50 rounded-lg">
            <p className="text-lg text-orange-600 mb-2">Empty Buildings</p>
            <p className="text-4xl font-bold text-orange-700">
              {emptyBuildingsStats.emptyBuildings}
            </p>
            <p className="mt-2 text-sm text-orange-500">
              {(
                (emptyBuildingsStats.emptyBuildings /
                  buildingStats.totalBuildings) *
                100
              ).toFixed(1)}
              % of total buildings
            </p>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Building Status Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 capitalize">
                  {status.replace(/_/g, " ")}
                </p>
                <p className="text-2xl font-semibold text-gray-800">{count}</p>
                <p className="text-sm text-gray-500">
                  {((count / buildingStats.totalBuildings) * 100).toFixed(1)}%
                  of total
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ContentLayout
      title={`Ward Analysis ${selectedWard ? `- Ward ${selectedWard}` : ""}`}
    >
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Category and Ward Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-sm flex flex-col sm:flex-row gap-4"
        >
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] sm:w-[200px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="buildings">Buildings and Family</SelectItem>
              <SelectItem value="family" disabled>
                Family (Coming Soon)
              </SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-[180px] sm:w-[200px]">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((ward) => (
                <SelectItem key={ward} value={ward.toString()}>
                  Ward {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {!selectedWard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4"
          >
            <MapIcon className="h-16 w-16 text-gray-400" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-700">
                Welcome to Ward Analysis
              </h2>
              <p className="text-gray-500 max-w-md">
                Select a ward from the dropdown above to view detailed
                demographic analytics with interactive visualizations.
              </p>
            </div>
          </motion.div>
        ) : // Only show data if category is individual for now
        selectedCategory === "individual" ? (
          <>
            {/* Population Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <PopulationStats />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            >
              <ChartCard
                title="Gender Distribution"
                isLoading={isLoadingGender}
                data={genderData || []}
                nameKey="gender"
              />

              <ChartCard
                title="Age Distribution"
                isLoading={isLoadingAge}
                data={ageData || []}
                nameKey="age_group"
              />

              <ChartCard
                title="Caste Distribution"
                isLoading={isLoadingCaste}
                data={casteData || []}
                nameKey="caste"
              />

              <ChartCard
                title="Religion Distribution"
                isLoading={isLoadingReligion}
                data={religionData || []}
                nameKey="religion"
              />

              <ChartCard
                title="Marital Status"
                isLoading={isLoadingMarital}
                data={maritalData || []}
                nameKey="status"
              />

              <ChartCard
                title="Marriage Age"
                isLoading={isLoadingMarriageAge}
                data={marriageAgeData || []}
                nameKey="age_group"
              />

              <ChartCard
                title="Mother Tongue Distribution"
                isLoading={isLoadingMotherTongue}
                data={motherTongueData || []}
                nameKey="language"
              />

              <ChartCard
                title="Ancestor Language"
                isLoading={isLoadingAncestorLanguage}
                data={ancestorLanguageData || []}
                nameKey="language"
              />

              <ChartCard
                title="Disability Distribution"
                isLoading={isLoadingDisability}
                data={disabilityData || []}
                nameKey="isDisabled"
              />
            </motion.div>
          </>
        ) : selectedCategory === "buildings" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg shadow-sm"
          >
            <BuildingOverview />
          </motion.div>
        ) : selectedCategory === "agriculture" ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <AgricultureOverview />
            </motion.div>

            {/* First grid with other charts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
            >
              <ChartCard
                title="Land Ownership Distribution"
                isLoading={isLoadingLandStats}
                data={
                  landStats?.map((item) => ({
                    type: item.ownershipType,
                    count: item.count,
                    area: item.totalArea,
                  })) || []
                }
                nameKey="type"
              />

              <ChartCard
                title="Irrigation Status"
                isLoading={isLoadingIrrigationStats}
                data={
                  irrigationStats?.map((item) => ({
                    status: item.isIrrigated ? "Irrigated" : "Non-Irrigated",
                    count: item.count,
                    area: item.totalArea,
                  })) || []
                }
                nameKey="status"
              />

              <ChartCard
                title="Animal Distribution"
                isLoading={isLoadingAnimalStats}
                data={
                  animalStats?.map((item) => ({
                    name: item.animalName,
                    count: item.totalCount,
                    households: item.householdCount,
                    revenue: item.totalRevenue,
                  })) || []
                }
                nameKey="name"
              />

              <ChartCard
                title="Animal Products"
                isLoading={isLoadingAnimalProductStats}
                data={
                  animalProductStats?.map((item) => ({
                    name: `${item.productName} (${item.unit})`,
                    count: item.householdCount,
                    production: item.totalProduction,
                    revenue: item.totalRevenue,
                  })) || []
                }
                nameKey="name"
              />
            </motion.div>

            {/* Separate full-width Crop Distribution chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <ChartCard
                title="Crop Distribution"
                isLoading={isLoadingCropStats}
                data={
                  cropStats?.map((item) => ({
                    name: `${item.cropName} (${item.cropType})`,
                    count: item.count,
                    area: item.totalArea,
                    production: item.totalProduction,
                    revenue: item.totalRevenue,
                  })) || []
                }
                nameKey="name"
              />
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4"
          >
            <Loader2 className="h-16 w-16 text-gray-400" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-700">
                Coming Soon
              </h2>
              <p className="text-gray-500 max-w-md">
                {selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1)}{" "}
                analytics are currently under development.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </ContentLayout>
  );
};

export default WardwisePage;
