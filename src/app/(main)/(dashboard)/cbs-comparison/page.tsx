"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { useState, useMemo } from "react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Loader2, MapIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CBSComparisonPage = () => {
  const [selectedWard, setSelectedWard] = useState<string | undefined>();

  // Fetch CBS data
  const { data: cbsHouseholds, isLoading: isLoadingCbsHouseholds } =
    api.cbsHousehold.getAll.useQuery();

  const { data: cbsPopulation, isLoading: isLoadingCbsPopulation } =
    api.cbsPopulation.getAll.useQuery();

  // Fetch analytics data
  const { data: familiesByWard, isLoading: isLoadingFamiliesByWard } =
    api.analytics.getFamiliesByWard.useQuery();

  const { data: buildingsByWard, isLoading: isLoadingBuildingsByWard } =
    api.analytics.getBuildingsByWard.useQuery();

  // If a ward is selected, fetch specific ward data
  const { data: wardGenderData, isLoading: isLoadingWardGenderData } =
    api.analytics.getGenderDistribution.useQuery(
      {
        wardNumber:
          selectedWard && selectedWard !== "all"
            ? parseInt(selectedWard)
            : undefined,
      },
      { enabled: !!selectedWard && selectedWard !== "all" },
    );

  const {
    data: selectedWardCbsHousehold,
    isLoading: isLoadingSelectedWardCbsHousehold,
  } = api.cbsHousehold.getByWard.useQuery(
    {
      wardNo:
        selectedWard && selectedWard !== "all" ? parseInt(selectedWard) : 1,
    },
    { enabled: !!selectedWard && selectedWard !== "all" },
  );

  const {
    data: selectedWardCbsPopulation,
    isLoading: isLoadingSelectedWardCbsPopulation,
  } = api.cbsPopulation.getByWard.useQuery(
    {
      wardNo:
        selectedWard && selectedWard !== "all" ? parseInt(selectedWard) : 1,
    },
    { enabled: !!selectedWard && selectedWard !== "all" },
  );

  const isLoading =
    isLoadingCbsHouseholds ||
    isLoadingCbsPopulation ||
    isLoadingFamiliesByWard ||
    isLoadingBuildingsByWard ||
    (selectedWard &&
      (isLoadingWardGenderData ||
        isLoadingSelectedWardCbsHousehold ||
        isLoadingSelectedWardCbsPopulation));

  // Process comparison data for all wards
  const comparisonData = useMemo(() => {
    if (
      !cbsHouseholds ||
      !cbsPopulation ||
      !familiesByWard ||
      !buildingsByWard
    ) {
      return [];
    }

    // Create a map for CBS household data
    const cbsHouseholdMap = new Map(
      cbsHouseholds.map((item) => [item.wardNo, item.totalHouseholds || 0]),
    );

    // Create a map for CBS population data
    const cbsPopulationMap = new Map(
      cbsPopulation
        .filter((item) => item.wardNo !== null) // Filter out total record
        .map((item) => [
          item.wardNo,
          {
            total: item.totalPopulation || 0,
            male: item.totalMale || 0,
            female: item.totalFemale || 0,
          },
        ]),
    );

    // Create a map for analytics household/building data
    const buildingMap = new Map(
      buildingsByWard.map((item) => [
        item.wardNumber,
        {
          buildings: item.totalBuildings,
          families: item.totalFamilies,
        },
      ]),
    );

    // Create a map for analytics family data
    const familyMap = new Map(
      familiesByWard.map((item) => [
        item.wardNumber,
        {
          families: item.totalFamilies,
          members: item.totalMembers,
        },
      ]),
    );

    // Combine the data for comparison
    const wardNumbers = Array.from(
      new Set([
        ...Array.from(cbsHouseholdMap.keys()),
        ...Array.from(buildingMap.keys()),
      ]),
    ).filter((w) => w !== null) as number[];

    return wardNumbers
      .map((wardNo) => {
        const cbsHouseholdCount = cbsHouseholdMap.get(wardNo) || 0;
        const cbsPopulationData = cbsPopulationMap.get(wardNo) || {
          total: 0,
          male: 0,
          female: 0,
        };

        const buildingData = buildingMap.get(wardNo) || {
          buildings: 0,
          families: 0,
        };
        const familyData = familyMap.get(wardNo) || { families: 0, members: 0 };

        // Calculate differences
        const householdDiff = cbsHouseholdCount - buildingData.buildings;
        const populationDiff = cbsPopulationData.total - familyData.members;

        return {
          wardNo,
          cbsHouseholds: cbsHouseholdCount,
          surveyBuildings: buildingData.buildings,
          householdDiff,
          householdPercentComplete:
            cbsHouseholdCount > 0
              ? Math.min(
                  100,
                  (buildingData.buildings / cbsHouseholdCount) * 100,
                )
              : 100,
          householdAlert: householdDiff > 0,

          cbsPopulation: cbsPopulationData.total,
          surveyPopulation: familyData.members,
          populationDiff,
          populationPercentComplete:
            cbsPopulationData.total > 0
              ? Math.min(
                  100,
                  (familyData.members / cbsPopulationData.total) * 100,
                )
              : 100,
          populationAlert: populationDiff > 0,
        };
      })
      .sort((a, b) => a.wardNo - b.wardNo);
  }, [cbsHouseholds, cbsPopulation, familiesByWard, buildingsByWard]);

  // Prepare summary data
  const summaryData = useMemo(() => {
    if (!comparisonData.length) return null;

    const totalCbsHouseholds = comparisonData.reduce(
      (sum, item) => sum + item.cbsHouseholds,
      0,
    );
    const totalSurveyBuildings = comparisonData.reduce(
      (sum, item) => sum + item.surveyBuildings,
      0,
    );
    const totalCbsPopulation = comparisonData.reduce(
      (sum, item) => sum + item.cbsPopulation,
      0,
    );
    const totalSurveyPopulation = comparisonData.reduce(
      (sum, item) => sum + item.surveyPopulation,
      0,
    );

    const householdDiff = totalCbsHouseholds - totalSurveyBuildings;
    const populationDiff = totalCbsPopulation - totalSurveyPopulation;

    return {
      totalCbsHouseholds,
      totalSurveyBuildings,
      householdDiff,
      householdPercentComplete:
        totalCbsHouseholds > 0
          ? Math.min(100, (totalSurveyBuildings / totalCbsHouseholds) * 100)
          : 100,
      householdAlert: householdDiff > 0,

      totalCbsPopulation,
      totalSurveyPopulation,
      populationDiff,
      populationPercentComplete:
        totalCbsPopulation > 0
          ? Math.min(100, (totalSurveyPopulation / totalCbsPopulation) * 100)
          : 100,
      populationAlert: populationDiff > 0,
    };
  }, [comparisonData]);

  // Calculate ward-specific comparison if a ward is selected
  const selectedWardData = useMemo(() => {
    if (
      !selectedWard ||
      selectedWard === "all" ||
      !selectedWardCbsHousehold ||
      !selectedWardCbsPopulation ||
      !wardGenderData
    ) {
      return null;
    }

    // Calculate total population from gender data
    const surveyPopulation = wardGenderData.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    // Extract gender counts
    const surveyMale =
      wardGenderData.find(
        (item) =>
          item.gender.toLowerCase().trim() === "पुरुष" ||
          item.gender.toLowerCase().trim() === "m",
      )?.count || 0;

    const surveyFemale =
      wardGenderData.find(
        (item) =>
          item.gender.toLowerCase().trim() === "महिला" ||
          item.gender.toLowerCase().trim() === "f",
      )?.count || 0;

    // Calculate differences
    const householdDiff =
      (selectedWardCbsHousehold.totalHouseholds || 0) -
      (comparisonData.find((w) => w.wardNo === parseInt(selectedWard))
        ?.surveyBuildings || 0);

    const populationDiff =
      (selectedWardCbsPopulation.totalPopulation || 0) - surveyPopulation;
    const maleDiff = (selectedWardCbsPopulation.totalMale || 0) - surveyMale;
    const femaleDiff =
      (selectedWardCbsPopulation.totalFemale || 0) - surveyFemale;

    return {
      households: {
        cbs: selectedWardCbsHousehold.totalHouseholds || 0,
        survey:
          comparisonData.find((w) => w.wardNo === parseInt(selectedWard))
            ?.surveyBuildings || 0,
        difference: householdDiff,
        percentComplete:
          (selectedWardCbsHousehold.totalHouseholds || 0) > 0
            ? Math.min(
                100,
                ((comparisonData.find(
                  (w) => w.wardNo === parseInt(selectedWard),
                )?.surveyBuildings || 0) /
                  (selectedWardCbsHousehold.totalHouseholds || 1)) *
                  100,
              )
            : 100,
        alert: householdDiff > 0,
      },
      population: {
        cbs: selectedWardCbsPopulation.totalPopulation || 0,
        survey: surveyPopulation,
        difference: populationDiff,
        percentComplete:
          (selectedWardCbsPopulation.totalPopulation || 0) > 0
            ? Math.min(
                100,
                (surveyPopulation /
                  (selectedWardCbsPopulation.totalPopulation || 1)) *
                  100,
              )
            : 100,
        alert: populationDiff > 0,
      },
      male: {
        cbs: selectedWardCbsPopulation.totalMale || 0,
        survey: surveyMale,
        difference: maleDiff,
        percentComplete:
          (selectedWardCbsPopulation.totalMale || 0) > 0
            ? Math.min(
                100,
                (surveyMale / (selectedWardCbsPopulation.totalMale || 1)) * 100,
              )
            : 100,
        alert: maleDiff > 0,
      },
      female: {
        cbs: selectedWardCbsPopulation.totalFemale || 0,
        survey: surveyFemale,
        difference: femaleDiff,
        percentComplete:
          (selectedWardCbsPopulation.totalFemale || 0) > 0
            ? Math.min(
                100,
                (surveyFemale / (selectedWardCbsPopulation.totalFemale || 1)) *
                  100,
              )
            : 100,
        alert: femaleDiff > 0,
      },
    };
  }, [
    selectedWard,
    selectedWardCbsHousehold,
    selectedWardCbsPopulation,
    wardGenderData,
    comparisonData,
  ]);

  const renderProgressBar = (percentage: number, alert: boolean) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${
          percentage >= 100
            ? "bg-green-500"
            : percentage >= 75
              ? "bg-yellow-500"
              : "bg-red-500"
        }`}
        style={{ width: `${Math.min(100, percentage)}%` }}
      ></div>
    </div>
  );

  const renderStatus = (percentage: number, alert: boolean) => {
    if (percentage >= 100) {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Complete</span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-red-600">
        <AlertTriangle className="h-4 w-4 mr-1" />
        <span>{alert ? "Incomplete" : "On track"}</span>
      </div>
    );
  };

  // Component to display summary cards
  const SummaryCards = () => {
    if (!summaryData) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={
            summaryData.householdAlert ? "border-red-500 border-2" : ""
          }
        >
          <CardHeader className="bg-blue-50 pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Household Comparison</span>
              {summaryData.householdAlert && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Alert
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">CBS Target:</span>
                <span className="font-medium">
                  {summaryData.totalCbsHouseholds.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Survey Count:</span>
                <span className="font-medium">
                  {summaryData.totalSurveyBuildings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Difference:</span>
                <span
                  className={`font-medium ${summaryData.householdAlert ? "text-red-600" : "text-green-600"}`}
                >
                  {summaryData.householdDiff > 0
                    ? `+${summaryData.householdDiff.toLocaleString()}`
                    : 0}
                </span>
              </div>
              <div className="space-y-1">
                {renderProgressBar(
                  summaryData.householdPercentComplete,
                  summaryData.householdAlert,
                )}
                <div className="flex justify-between text-xs">
                  <span>
                    Progress: {summaryData.householdPercentComplete.toFixed(1)}%
                  </span>
                  {renderStatus(
                    summaryData.householdPercentComplete,
                    summaryData.householdAlert,
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={
            summaryData.populationAlert ? "border-red-500 border-2" : ""
          }
        >
          <CardHeader className="bg-green-50 pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>Population Comparison</span>
              {summaryData.populationAlert && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Alert
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">CBS Target:</span>
                <span className="font-medium">
                  {summaryData.totalCbsPopulation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Survey Count:</span>
                <span className="font-medium">
                  {summaryData.totalSurveyPopulation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Difference:</span>
                <span
                  className={`font-medium ${summaryData.populationAlert ? "text-red-600" : "text-green-600"}`}
                >
                  {summaryData.populationDiff > 0
                    ? `+${summaryData.populationDiff.toLocaleString()}`
                    : 0}
                </span>
              </div>
              <div className="space-y-1">
                {renderProgressBar(
                  summaryData.populationPercentComplete,
                  summaryData.populationAlert,
                )}
                <div className="flex justify-between text-xs">
                  <span>
                    Progress: {summaryData.populationPercentComplete.toFixed(1)}
                    %
                  </span>
                  {renderStatus(
                    summaryData.populationPercentComplete,
                    summaryData.populationAlert,
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Component to display ward-specific details
  const WardDetails = () => {
    if (!selectedWard || !selectedWardData) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <MapIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-500">
            Select a ward to view detailed comparison
          </p>
        </div>
      );
    }

    const { households, population, male, female } = selectedWardData;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Ward {selectedWard} - Detailed Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={households.alert ? "border-red-500 border-2" : ""}>
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Households</span>
                {households.alert && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Alert
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>CBS Target:</span>
                  <span className="font-medium">{households.cbs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Survey Count:</span>
                  <span className="font-medium">{households.survey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difference:</span>
                  <span
                    className={`font-medium ${households.alert ? "text-red-600" : "text-green-600"}`}
                  >
                    {households.difference > 0
                      ? `+${households.difference}`
                      : 0}
                  </span>
                </div>
                <div className="space-y-1">
                  {renderProgressBar(
                    households.percentComplete,
                    households.alert,
                  )}
                  <div className="flex justify-between text-xs">
                    <span>
                      {households.percentComplete.toFixed(1)}% Complete
                    </span>
                    {renderStatus(households.percentComplete, households.alert)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={population.alert ? "border-red-500 border-2" : ""}>
            <CardHeader className="bg-green-50 pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Population</span>
                {population.alert && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Alert
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>CBS Target:</span>
                  <span className="font-medium">{population.cbs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Survey Count:</span>
                  <span className="font-medium">{population.survey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difference:</span>
                  <span
                    className={`font-medium ${population.alert ? "text-red-600" : "text-green-600"}`}
                  >
                    {population.difference > 0
                      ? `+${population.difference}`
                      : 0}
                  </span>
                </div>
                <div className="space-y-1">
                  {renderProgressBar(
                    population.percentComplete,
                    population.alert,
                  )}
                  <div className="flex justify-between text-xs">
                    <span>
                      {population.percentComplete.toFixed(1)}% Complete
                    </span>
                    {renderStatus(population.percentComplete, population.alert)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className={male.alert ? "border-red-500 border-2" : ""}>
            <CardHeader className="bg-blue-50 pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Male Population</span>
                {male.alert && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Alert
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>CBS Target:</span>
                  <span className="font-medium">{male.cbs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Survey Count:</span>
                  <span className="font-medium">{male.survey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difference:</span>
                  <span
                    className={`font-medium ${male.alert ? "text-red-600" : "text-green-600"}`}
                  >
                    {male.difference > 0 ? `+${male.difference}` : 0}
                  </span>
                </div>
                <div className="space-y-1">
                  {renderProgressBar(male.percentComplete, male.alert)}
                  <div className="flex justify-between text-xs">
                    <span>{male.percentComplete.toFixed(1)}% Complete</span>
                    {renderStatus(male.percentComplete, male.alert)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={female.alert ? "border-red-500 border-2" : ""}>
            <CardHeader className="bg-pink-50 pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Female Population</span>
                {female.alert && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Alert
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>CBS Target:</span>
                  <span className="font-medium">{female.cbs}</span>
                </div>
                <div className="flex justify-between">
                  <span>Survey Count:</span>
                  <span className="font-medium">{female.survey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Difference:</span>
                  <span
                    className={`font-medium ${female.alert ? "text-red-600" : "text-green-600"}`}
                  >
                    {female.difference > 0 ? `+${female.difference}` : 0}
                  </span>
                </div>
                <div className="space-y-1">
                  {renderProgressBar(female.percentComplete, female.alert)}
                  <div className="flex justify-between text-xs">
                    <span>{female.percentComplete.toFixed(1)}% Complete</span>
                    {renderStatus(female.percentComplete, female.alert)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Ward {selectedWard} - Visual Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Households",
                      CBS: households.cbs,
                      Survey: households.survey,
                    },
                    {
                      name: "Population",
                      CBS: population.cbs,
                      Survey: population.survey,
                    },
                    { name: "Male", CBS: male.cbs, Survey: male.survey },
                    { name: "Female", CBS: female.cbs, Survey: female.survey },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="CBS" fill="#8884d8" name="CBS Data" />
                  <Bar dataKey="Survey" fill="#82ca9d" name="Survey Data" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Component to display table of comparison data
  const ComparisonTable = () => {
    if (!comparisonData.length) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ward</TableHead>
              <TableHead>CBS Households</TableHead>
              <TableHead>Survey Households</TableHead>
              <TableHead>Household Diff</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>CBS Population</TableHead>
              <TableHead>Survey Population</TableHead>
              <TableHead>Population Diff</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisonData.map((ward) => (
              <TableRow
                key={ward.wardNo}
                className={`${ward.householdAlert || ward.populationAlert ? "bg-red-50" : ""} 
                           cursor-pointer hover:bg-gray-100`}
                onClick={() => setSelectedWard(ward.wardNo.toString())}
              >
                <TableCell className="font-medium">
                  Ward {ward.wardNo}
                </TableCell>
                <TableCell>{ward.cbsHouseholds}</TableCell>
                <TableCell>{ward.surveyBuildings}</TableCell>
                <TableCell
                  className={
                    ward.householdDiff > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  {ward.householdDiff > 0
                    ? `+${ward.householdDiff}`
                    : ward.householdDiff}
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        ward.householdPercentComplete >= 100
                          ? "bg-green-500"
                          : ward.householdPercentComplete >= 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(100, ward.householdPercentComplete)}%`,
                      }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell>{ward.cbsPopulation}</TableCell>
                <TableCell>{ward.surveyPopulation}</TableCell>
                <TableCell
                  className={
                    ward.populationDiff > 0 ? "text-red-600" : "text-green-600"
                  }
                >
                  {ward.populationDiff > 0
                    ? `+${ward.populationDiff}`
                    : ward.populationDiff}
                </TableCell>
                <TableCell>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        ward.populationPercentComplete >= 100
                          ? "bg-green-500"
                          : ward.populationPercentComplete >= 75
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(100, ward.populationPercentComplete)}%`,
                      }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell>
                  {ward.householdAlert || ward.populationAlert ? (
                    <div className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Incomplete
                    </div>
                  ) : (
                    <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <ContentLayout title="CBS vs Survey Comparison">
      <div className="container mx-auto p-4 space-y-6">
        {/* Ward selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h2 className="text-lg font-medium">
              CBS vs Survey Data Comparison
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Compare Central Bureau of Statistics data with current survey
              progress
            </p>
          </div>

          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((ward) => (
                <SelectItem key={ward} value={ward.toString()}>
                  Ward {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  Overall Progress Summary
                </h2>
              </div>
              <SummaryCards />
            </motion.div>

            {/* Ward-specific details or table */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              {selectedWard ? (
                <WardDetails />
              ) : (
                <>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">
                      Ward-wise Comparison
                    </h2>
                    <p className="text-sm text-gray-500">
                      Click on a row to see detailed ward information
                    </p>
                  </div>
                  <ComparisonTable />
                </>
              )}
            </motion.div>
          </>
        )}
      </div>
    </ContentLayout>
  );
};

export default CBSComparisonPage;
