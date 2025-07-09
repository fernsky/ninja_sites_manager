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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function HouseholdMembers({ members }: { members: any[] }) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No household members found
      </div>
    );
  }

  return (
    <Card>
      <ScrollArea className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              {/* Basic Info */}
              <TableHead className="font-medium">Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Citizenship</TableHead>

              {/* Demographics */}
              <TableHead>Caste</TableHead>
              <TableHead>Religion</TableHead>
              <TableHead>Mother Tongue</TableHead>
              <TableHead>Ancestral Lang.</TableHead>

              {/* Marriage & Health */}
              <TableHead>Marital Status</TableHead>
              <TableHead>Married Age</TableHead>
              <TableHead>Health Status</TableHead>
              <TableHead>Disability</TableHead>

              {/* Education & Work */}
              <TableHead>Literacy</TableHead>
              <TableHead>Education Level</TableHead>
              <TableHead>Goes to School</TableHead>
              <TableHead>Primary Skill</TableHead>
              <TableHead>Occupation</TableHead>
              <TableHead>Months Worked</TableHead>

              {/* Fertility (for females) */}
              <TableHead>Fertility Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} className="hover:bg-muted/20">
                {/* Basic Info */}
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.gender}</TableCell>
                <TableCell>{member.age}</TableCell>
                <TableCell>
                  {member.citizen_of || "N/A"}
                  {member.citizen_of_other
                    ? ` (${member.citizen_of_other})`
                    : ""}
                </TableCell>

                {/* Demographics */}
                <TableCell>
                  {member.caste || "N/A"}
                  {member.caste_other ? ` (${member.caste_other})` : ""}
                </TableCell>
                <TableCell>
                  {member.religion || "N/A"}
                  {member.religion_other ? ` (${member.religion_other})` : ""}
                </TableCell>
                <TableCell>
                  {member.primary_mother_tongue || "N/A"}
                  {member.primary_mother_tongue_other
                    ? ` (${member.primary_mother_tongue_other})`
                    : ""}
                </TableCell>
                <TableCell>
                  {member.ancestral_language || "N/A"}
                  {member.ancestral_language_other
                    ? ` (${member.ancestral_language_other})`
                    : ""}
                </TableCell>

                {/* Marriage & Health */}
                <TableCell>{member.marital_status || "N/A"}</TableCell>
                <TableCell>{member.married_age || "N/A"}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {member.is_sanitized === "yes" && (
                      <Badge variant="default" className="text-xs">
                        Sanitized
                      </Badge>
                    )}
                    {member.has_chronic_disease === "yes" && (
                      <div>
                        <Badge variant="outline" className="text-xs">
                          Chronic
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {member.primary_chronic_disease || ""}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {member.is_disabled === "yes" ? (
                    <div>
                      <Badge variant="destructive" className="text-xs">
                        {member.disability_type || "Disabled"}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {member.disability_cause || ""}
                      </div>
                    </div>
                  ) : (
                    "No"
                  )}
                </TableCell>

                {/* Education & Work */}
                <TableCell>{member.literacy_status || "N/A"}</TableCell>
                <TableCell>{member.educational_level || "N/A"}</TableCell>
                <TableCell>{member.goes_school || "N/A"}</TableCell>
                <TableCell>{member.primary_skill || "N/A"}</TableCell>
                <TableCell>{member.primary_occupation || "N/A"}</TableCell>
                <TableCell>{member.months_worked || "N/A"}</TableCell>

                {/* Fertility (for females) */}
                <TableCell>
                  {member.gender === "Female" && member.gave_live_birth ? (
                    <div className="text-xs space-y-1">
                      <div>Total Born: {member.total_born_children || 0}</div>
                      <div>
                        Alive:{" "}
                        {parseInt(member.alive_sons || "0") +
                          parseInt(member.alive_daughters || "0") || 0}
                      </div>
                      <div>Recent Births: {member.recent_birth_total || 0}</div>
                      <div>Prenatal: {member.prenatal_checkup || "N/A"}</div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
}
