import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function BusinessEmployeeSection({ business }: { business: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">कर्मचारी र सहभागी जानकारी</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Partners */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">साझेदारहरू</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm">साझेदारहरू छन्:</div>
                <Badge
                  variant={business.has_partners ? "default" : "outline"}
                  className="text-xs"
                >
                  {business.has_partners || "छैन"}
                </Badge>
              </div>

              {business.has_partners && (
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">जम्मा:</div>
                    <div className="text-sm font-medium">
                      {business.total_partners || 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      नेपाली पुरुष:
                    </div>
                    <div className="text-sm">
                      {business.nepali_male_partners || 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      नेपाली महिला:
                    </div>
                    <div className="text-sm">
                      {business.nepali_female_partners || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Family Members */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">
              परिवारका सदस्यहरू
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm">परिवार संलग्न:</div>
                <Badge
                  variant={business.has_involved_family ? "default" : "outline"}
                  className="text-xs"
                >
                  {business.has_involved_family || "छैन"}
                </Badge>
              </div>

              {business.has_involved_family && (
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">जम्मा:</div>
                    <div className="text-sm font-medium">
                      {business.total_involved_family || 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">पुरुष:</div>
                    <div className="text-sm">
                      {business.male_involved_family || 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">महिला:</div>
                    <div className="text-sm">
                      {business.female_involved_family || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Employees Summary */}
          <div>
            <div className="text-xs text-muted-foreground mb-2">
              कर्मचारी सारांश
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">स्थायी:</div>
                <div className="text-lg font-medium">
                  {business.total_permanent_employees || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">अस्थायी:</div>
                <div className="text-lg font-medium">
                  {business.total_temporary_employees || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Detailed Employee Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Permanent Employees */}
          <div>
            <div className="text-sm font-medium mb-2">स्थायी कर्मचारीहरू</div>
            {business.has_permanent_employees ? (
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">जम्मा:</div>
                    <div className="text-sm font-medium">
                      {business.total_permanent_employees || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      नेपाली पुरुष:
                    </div>
                    <div className="text-sm">
                      {business.nepali_male_permanent_employees || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      नेपाली महिला:
                    </div>
                    <div className="text-sm">
                      {business.nepali_female_permanent_employees || 0}
                    </div>
                  </div>
                  {business.foreign_male_permanent_employees > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        विदेशी पुरुष:
                      </div>
                      <div className="text-sm">
                        {business.foreign_male_permanent_employees}
                      </div>
                    </div>
                  )}
                  {business.foreign_female_permanent_employees > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        विदेशी महिला:
                      </div>
                      <div className="text-sm">
                        {business.foreign_female_permanent_employees}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                स्थायी कर्मचारी छैनन्
              </div>
            )}
          </div>

          {/* Temporary Employees */}
          <div>
            <div className="text-sm font-medium mb-2">अस्थायी कर्मचारीहरू</div>
            {business.has_temporary_employees ? (
              <div className="bg-muted/20 p-3 rounded-md">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">जम्मा:</div>
                    <div className="text-sm font-medium">
                      {business.total_temporary_employees || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      नेपाली पुरुष:
                    </div>
                    <div className="text-sm">
                      {business.nepali_male_temporary_employees || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      नेपाली महिला:
                    </div>
                    <div className="text-sm">
                      {business.nepali_female_temporary_employees || 0}
                    </div>
                  </div>
                  {business.foreign_male_temporary_employees > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        विदेशी पुरुष:
                      </div>
                      <div className="text-sm">
                        {business.foreign_male_temporary_employees}
                      </div>
                    </div>
                  )}
                  {business.foreign_female_temporary_employees > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground">
                        विदेशी महिला:
                      </div>
                      <div className="text-sm">
                        {business.foreign_female_temporary_employees}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                अस्थायी कर्मचारी छैनन्
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
