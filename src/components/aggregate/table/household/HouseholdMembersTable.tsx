import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { localizeNumber } from "@/lib/utils/localize-number";

export function HouseholdMembersTable({ members }: { members: any[] }) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No members found in this household.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full overflow-auto max-h-[500px]">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="w-[180px]">नाम</TableHead>
                <TableHead>लिङ्ग/उमेर</TableHead>
                <TableHead>शिक्षा</TableHead>
                <TableHead>पेशा</TableHead>
                <TableHead>स्वास्थ्य</TableHead>
                <TableHead>वैवाहिक स्थिति</TableHead>
                <TableHead>नागरिकता</TableHead>
                <TableHead>जनसांख्यिकी</TableHead>
                <TableHead>अनुपस्थित</TableHead>
                <TableHead>प्रजनन</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>

                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline">{member.gender}</Badge>
                      <span className="font-medium">
                        {localizeNumber(member.age, "ne")}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {member.literacy_status && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">
                            {member.literacy_status}
                          </span>
                        </div>
                      )}
                      <div className="font-medium">
                        {member.educational_level}
                      </div>
                      {member.goes_school == "छैन" && member.school_barrier && (
                        <div className="text-xs text-muted-foreground">
                          <span className="text-muted-foreground/60">
                            विद्यालय:
                          </span>{" "}
                          <span className="font-medium">
                            {member.goes_school}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {member.primary_skill && (
                        <div className="text-xs text-muted-foreground">
                          <span className="text-muted-foreground/60">सीप:</span>{" "}
                          <span className="font-medium">
                            {member.primary_skill}
                          </span>
                        </div>
                      )}
                      {member.has_training && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">
                            {member.has_training === "छैन"
                              ? "तालिम नलिएको"
                              : "तालिम लिएको"}
                          </span>
                        </div>
                      )}
                      {member.months_worked && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium font-semibold">
                            {localizeNumber(member.months_worked, "ne")}
                          </span>
                        </div>
                      )}
                      <div className="font-medium">
                        {member.primary_occupation}
                      </div>
                      {member.work_barrier && (
                        <span className="font-medium">
                          {member.work_barrier}
                        </span>
                      )}
                      {member.work_availability && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">
                            {member.work_availability === "थिएन"
                              ? "काम नखोजेको"
                              : "काम खोजेको"}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-xs">
                      {member.is_disabled === "yes" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="destructive"
                                className="cursor-help"
                              >
                                {member.disability_type || "Disabled"}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Cause: {member.disability_cause || "Unknown"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {member.has_chronic_disease === "yes" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="cursor-help">
                                Chronic
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {member.primary_chronic_disease ||
                                  "Chronic illness"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {member.is_sanitized === "yes" && (
                        <div className="text-muted-foreground">Sanitized</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {member.married_age &&
                        member.marital_status !== "विवाह नभएको" && (
                          <div className="text-xs text-muted-foreground">
                            {localizeNumber(member.married_age, "ne")} वर्षमा{" "}
                            {member.marital_status}
                          </div>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>{member.citizen_of || "N/A"}</div>
                      {member.citizen_of_other && (
                        <div className="text-muted-foreground">
                          {member.citizen_of_other}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-xs">
                      {member.caste && (
                        <div className="text-muted-foreground">
                          {member.caste}
                          {member.caste_other && ` (${member.caste_other})`}
                        </div>
                      )}

                      {member.religion && (
                        <div className="text-muted-foreground">
                          {member.religion}
                          {member.religion_other &&
                            ` (${member.religion_other})`}
                        </div>
                      )}

                      {member.primary_mother_tongue && (
                        <div className="text-muted-foreground">
                          {member.primary_mother_tongue}
                          {member.primary_mother_tongue_other &&
                            ` (${member.primary_mother_tongue_other})`}{" "}
                          भाषा
                        </div>
                      )}

                      {member.ancestral_language && (
                        <div className="text-muted-foreground">
                          {member.ancestral_language}
                          {member.ancestral_language_other &&
                            ` (${member.ancestral_language_other})`}{" "}
                          पुर्ख्यौली भाषा
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-xs">
                      {member.absence_reason && (
                        <div className="font-medium">
                          {member.absence_reason}
                        </div>
                      )}

                      {member.absence_location && (
                        <div className="text-muted-foreground">
                          {member.absence_location}
                          {member.absence_country && (
                            <span>/{member.absence_country}</span>
                          )}
                          {member.absence_province && (
                            <span>/{member.absence_province}</span>
                          )}
                          {member.absence_district && (
                            <span>/{member.absence_district}</span>
                          )}
                        </div>
                      )}

                      {member.sends_remittance && (
                        <div className="text-muted-foreground">
                          {member.remittance_amount &&
                            `रु.${localizeNumber(member.remittance_amount, "ne")}`}
                        </div>
                      )}

                      {member.education_level && (
                        <div className="text-muted-foreground">
                          शिक्षा: {member.education_level}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 text-xs">
                      {(member.alive_sons > 0 ||
                        member.alive_daughters > 0) && (
                        <div className="text-muted-foreground">
                          {member.alive_sons > 0 &&
                            `${localizeNumber(member.alive_sons, "ne")} छोरा`}
                          {member.alive_sons > 0 &&
                            member.alive_daughters > 0 &&
                            ", "}
                          {member.alive_daughters > 0 &&
                            `${localizeNumber(member.alive_daughters, "ne")} छोरी`}
                        </div>
                      )}

                      {(member.dead_sons > 0 || member.dead_daughters > 0) && (
                        <div className="text-muted-foreground">
                          {member.dead_sons > 0 &&
                            `${localizeNumber(member.dead_sons, "ne")} छोरा को मृत्यु`}
                          {member.dead_sons > 0 &&
                            member.dead_daughters > 0 &&
                            ", "}
                          {member.dead_daughters > 0 &&
                            `${localizeNumber(member.dead_daughters, "ne")} छोरी को मृत्यु`}
                        </div>
                      )}

                      {member.recent_birth_location && (
                        <div className="text-muted-foreground">
                          {member.recent_birth_location} मा सुत्केरी गराएको
                          {member.prenatal_checkup &&
                            ` (${member.prenatal_checkup})`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
