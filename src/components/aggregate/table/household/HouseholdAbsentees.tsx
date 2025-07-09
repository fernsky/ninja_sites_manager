import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HouseholdAbsentees({ absentees }: { absentees: any[] }) {
  if (!absentees || absentees.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No absentee data available
      </div>
    );
  }

  return (
    <Card>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Education</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Sends Remittance</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {absentees.map((absentee) => (
              <TableRow key={absentee.id}>
                <TableCell className="font-medium">
                  {absentee.absentee_name}
                </TableCell>
                <TableCell>{absentee.gender}</TableCell>
                <TableCell>{absentee.age}</TableCell>
                <TableCell>{absentee.education_level}</TableCell>
                <TableCell>{absentee.absence_reason}</TableCell>
                <TableCell>
                  <div>
                    {absentee.location}
                    {absentee.district && ", "}
                    {absentee.district}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {absentee.province}
                    {absentee.country && `, ${absentee.country}`}
                  </div>
                </TableCell>
                <TableCell>
                  {absentee.sends_remittance ? (
                    <Badge variant="default">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {absentee.remittance_amount
                    ? `Rs. ${absentee.remittance_amount}`
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
