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
import { api } from "@/trpc/react";
import { Edit3 } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";

export function WardsList() {
  const [wards] = api.useQueries((t) => [t.ward.getWards()]);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();

  const handleRowClick = (wardNumber: number, event: React.MouseEvent) => {
    const isEditClick = (event.target as HTMLElement).closest("a");
    if (!isEditClick) {
      router.push(`/ward/show/${wardNumber}`);
    }
  };

  if (!wards.data?.length) {
    return (
      <div className="text-center text-muted-foreground mt-20">
        No wards found
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        {wards.data.map((ward) => (
          <Card
            key={ward.wardNumber}
            className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border-l-4 border-l-primary bg-gradient-to-r from-white to-gray-50"
            onClick={(e) => handleRowClick(ward.wardNumber, e)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold  text-gray-700">
                  Ward {ward.wardNumber}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600">
                  Area Code:
                </span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {ward.wardAreaCode}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border shadow-lg p-6 bg-white">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-primary/5">
            <TableHead className="py-4 text-left text-sm font-semibold  text-gray-700">
              Ward Number
            </TableHead>
            <TableHead className="py-4 text-left text-sm font-semibold  text-gray-700">
              Area Code
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wards.data.map((ward) => (
            <TableRow
              key={ward.wardNumber}
              className="hover:bg-muted/50 transition-colors cursor-pointer border-b"
              onClick={(e) => handleRowClick(ward.wardNumber, e)}
            >
              <TableCell className="py-4 text-sm font-medium  text-gray-700">
                Ward {ward.wardNumber}
              </TableCell>
              <TableCell className="py-4">
                <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                  {ward.wardAreaCode}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
