"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { ClipboardList, Loader2, MapPin, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const EnumeratorwisePage = () => {
  const [selectedWard, setSelectedWard] = useState<string>();
  const router = useRouter();

  const { data: enumerators, isLoading } =
    api.enumWise.buildings.getUniqueEnumeratorsWardWise.useQuery(
      {
        wardId: selectedWard ? parseInt(selectedWard) : undefined,
      },
      {
        enabled: !!selectedWard,
      },
    );

  return (
    <ContentLayout
      title={`Enumerator Analysis ${selectedWard ? `- Ward ${selectedWard}` : ""}`}
    >
      <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {/* Ward Selector */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 sm:p-4 rounded-lg shadow-sm space-y-4"
        >
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

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/enumeratorwise/buildings")}
            >
              Go to Building Analysis
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/enumeratorwise/business")}
            >
              Go to Business Analysis
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/enumeratorwise/family")}
            >
              Go to Family Analysis
            </Button>
          </div>
        </motion.div>

        {!selectedWard ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4"
          >
            <Users className="h-16 w-16 text-gray-400" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-700">
                Enumerator Analysis
              </h2>
              <p className="text-gray-500 max-w-md">
                Select a ward from the dropdown above to view enumerator details
                and their assigned areas.
              </p>
            </div>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="text-gray-500">Loading enumerator data...</p>
          </motion.div>
        ) : enumerators && enumerators.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Ward {selectedWard} Summary
                </CardTitle>
                <CardDescription>
                  Overview of enumerators and their assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 text-sm">Total Enumerators</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {enumerators.length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 text-sm">
                      Total Areas Covered
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {enumerators.reduce(
                        (sum, enum_) => sum + enum_.areaCodes.length,
                        0,
                      )}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-600 text-sm">Total Records</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {enumerators.reduce((sum, enum_) => sum + enum_.count, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enumerators Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Enumerator Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Enumerator Name</TableHead>
                        <TableHead>Assigned Areas</TableHead>
                        <TableHead className="text-right">Records</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enumerators.map((enumerator, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {enumerator.enumeratorName}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {enumerator.areaCodes.map((code, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                  {code}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {enumerator.count}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-sm space-y-4"
          >
            <ClipboardList className="h-16 w-16 text-gray-400" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-gray-700">
                No Enumerators Found
              </h2>
              <p className="text-gray-500 max-w-md">
                There are no enumerators assigned to Ward {selectedWard}.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </ContentLayout>
  );
};

export default EnumeratorwisePage;
