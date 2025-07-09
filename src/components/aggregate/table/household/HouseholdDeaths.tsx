import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdDeaths({ deaths }: { deaths: any[] }) {
  if (!deaths || deaths.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Deceased Family Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Cause</TableHead>
              <TableHead>Fertility Death Condition</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deaths.map((death) => (
              <TableRow key={death.id}>
                <TableCell className="font-medium">
                  {death.deceased_name}
                </TableCell>
                <TableCell>{death.deceased_gender}</TableCell>
                <TableCell>{death.deceased_age}</TableCell>
                <TableCell>{death.deceased_death_cause}</TableCell>
                <TableCell>
                  {death.deceased_fertility_death_condition || "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
