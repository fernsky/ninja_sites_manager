"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { MapPin, Loader2, User } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const EnumeratorTrackPage = () => {
  const searchParams = useSearchParams();
  const wardFromUrl = searchParams.get("ward");
  const [selectedEnumerator, setSelectedEnumerator] = useState<string>("");

  // Fetch all areas with status
  const { data: areasWithStatus, isLoading: loadingAreas } =
    api.area.getAllAreasWithStatus.useQuery({
      wardNumber: wardFromUrl ? parseInt(wardFromUrl) : undefined,
    });

  // Get all unique enumerator names from the data
  const enumeratorNames = useMemo(() => {
    if (!areasWithStatus) return [];

    const assignedToNames = areasWithStatus
      .map((area) => area.assigned_to_name)
      .filter((name): name is string => name !== null);

    // Remove duplicates
    const uniqueNames = Array.from(new Set(assignedToNames));
    return uniqueNames.sort();
  }, [areasWithStatus]);

  // Filter areas for the selected enumerator
  const enumeratorAreas = useMemo(() => {
    if (!areasWithStatus || !selectedEnumerator) return null;

    return areasWithStatus.filter(
      (area) =>
        area.assigned_to_name === selectedEnumerator ||
        (area.areaStatus === "completed" &&
          area.completed_by_name === selectedEnumerator),
    );
  }, [areasWithStatus, selectedEnumerator]);

  // Group areas by status for summary
  const areaStatusSummary = useMemo(() => {
    if (!enumeratorAreas) return null;

    return {
      completed: enumeratorAreas.filter(
        (area) => area.areaStatus === "completed",
      ).length,
      active: enumeratorAreas.filter(
        (area) => area.areaStatus !== "completed" && area.assignedTo !== null,
      ).length,
      total: enumeratorAreas.length,
    };
  }, [enumeratorAreas]);

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing_survey":
        return "bg-blue-100 text-blue-800";
      case "revision":
        return "bg-amber-100 text-amber-800";
      case "asked_for_completion":
        return "bg-purple-100 text-purple-800";
      case "newly_assigned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to format status for display
  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <ContentLayout
      title={`Enumerator Area Tracking ${wardFromUrl ? `- Ward ${wardFromUrl}` : ""}`}
    >
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Selector Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center gap-4">
            <Select
              value={selectedEnumerator}
              onValueChange={setSelectedEnumerator}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select Enumerator" />
              </SelectTrigger>
              <SelectContent>
                {loadingAreas ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  enumeratorNames.map((name, index) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Enumerator Statistics Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {loadingAreas ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : selectedEnumerator && areaStatusSummary ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Enumerator Area Statistics
                </CardTitle>
                <CardDescription>
                  Area assignment and completion status for {selectedEnumerator}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 text-sm">Total Areas</p>
                    <p className="text-xl font-bold text-blue-700">
                      {areaStatusSummary.total}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 text-sm">Completed Areas</p>
                    <p className="text-xl font-bold text-green-700">
                      {areaStatusSummary.completed}
                    </p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-600 text-sm">Currently Assigned</p>
                    <p className="text-xl font-bold text-amber-700">
                      {areaStatusSummary.active}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4">
              <MapPin className="h-16 w-16 text-gray-400" />
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Select an Enumerator
                </h2>
                <p className="text-gray-500 max-w-md">
                  Choose an enumerator from the dropdown above to view their
                  assigned and completed areas.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Area Details Table */}
        {selectedEnumerator &&
          enumeratorAreas &&
          enumeratorAreas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Areas Details
                  </CardTitle>
                  <CardDescription>
                    Currently assigned and completed areas for{" "}
                    {selectedEnumerator}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Area Code</TableHead>
                          <TableHead>Ward Number</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Assignment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {enumeratorAreas.map((area) => (
                          <TableRow key={area.id}>
                            <TableCell className="font-medium">
                              {area.code}
                            </TableCell>
                            <TableCell>{area.wardNumber}</TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusBadgeColor(
                                  area.areaStatus ?? "unknown",
                                )}
                              >
                                {formatStatus(area.areaStatus ?? "unknown")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {area.areaStatus === "completed"
                                ? `Completed by ${area.completed_by_name}`
                                : `Assigned to ${area.assigned_to_name}`}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
      </div>
    </ContentLayout>
  );
};

export default EnumeratorTrackPage;
