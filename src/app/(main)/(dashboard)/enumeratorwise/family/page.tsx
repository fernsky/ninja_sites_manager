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
import { Users, Loader2, User, MapPin } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const FamilyAnalysisPage = () => {
  const searchParams = useSearchParams();
  const wardFromUrl = searchParams.get("ward");
  const [selectedEnumerator, setSelectedEnumerator] = useState<string>();
  const router = useRouter();

  const { data: enumerators, isLoading: loadingEnumerators } =
    api.enumWise.family.getAllUniqueEnumerators.useQuery();

  const { data: familyStats, isLoading: loadingStats } =
    api.enumWise.family.getTotalFamilyByEnumerator.useQuery(
      {
        wardId: wardFromUrl ? parseInt(wardFromUrl) : undefined,
      },
      {
        enabled: true,
      },
    );

  const { data: areaWiseStats, isLoading: loadingAreaStats } =
    api.enumWise.family.getFamiliesByAreaCode.useQuery(
      {
        enumeratorName: selectedEnumerator,
        wardId: wardFromUrl ? parseInt(wardFromUrl) : undefined,
      },
      {
        enabled: !!selectedEnumerator,
      },
    );

  const selectedEnumeratorStats = familyStats?.find(
    (stat) => stat.enumeratorName === selectedEnumerator,
  );

  return (
    <ContentLayout
      title={`Family Analysis ${wardFromUrl ? `- Ward ${wardFromUrl}` : ""}`}
    >
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Navigation and Selector Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-sm space-y-4"
        >
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/enumeratorwise${wardFromUrl ? `?ward=${wardFromUrl}` : ""}`,
                )
              }
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Overview
            </Button>
            <Select
              value={selectedEnumerator}
              onValueChange={setSelectedEnumerator}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select Enumerator" />
              </SelectTrigger>
              <SelectContent>
                {loadingEnumerators ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  enumerators?.map((enum_, index) => (
                    <SelectItem key={index} value={enum_.enumeratorName ?? ""}>
                      {enum_.enumeratorName ?? ""}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Statistics Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {loadingStats ? (
            <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : selectedEnumerator ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Enumerator Statistics
                </CardTitle>
                <CardDescription>
                  Family survey details for selected enumerator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 text-sm">Enumerator Name</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {selectedEnumerator}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 text-sm">
                      Total Families Surveyed
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {selectedEnumeratorStats?.totalFamilies ?? 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4">
              <Users className="h-16 w-16 text-gray-400" />
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Select an Enumerator
                </h2>
                <p className="text-gray-500 max-w-md">
                  Choose an enumerator from the dropdown above to view their
                  family survey statistics.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Area-wise Family Statistics Table */}
        {selectedEnumerator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Area-wise Family Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of families surveyed in each area
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAreaStats ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : areaWiseStats && areaWiseStats.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Area Code</TableHead>
                          <TableHead className="text-right">
                            Families Surveyed
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {areaWiseStats.map((stat, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {stat.areaCode}
                            </TableCell>
                            <TableCell className="text-right">
                              {stat.totalFamilies}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50">
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">
                            {areaWiseStats.reduce(
                              (sum, stat) => sum + stat.totalFamilies,
                              0,
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No area-wise data available for this enumerator.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </ContentLayout>
  );
};

export default FamilyAnalysisPage;
