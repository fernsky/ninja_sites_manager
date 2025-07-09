import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function HouseholdUtilitiesSection({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">उपयोगिता र सुविधाहरू</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              घरको स्वामित्व:
            </span>
            <Badge variant="outline">
              {household.house_ownership || "N/A"}
              {household.house_ownership_other &&
                ` (${household.house_ownership_other})`}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">शौचालय:</span>
            <Badge variant="outline">{household.toilet_type || "N/A"}</Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-1">पानी</div>
          <div className="space-y-1">
            <div>
              <div className="text-sm text-muted-foreground">स्रोत:</div>
              <div className="text-xs">
                {Array.isArray(household.water_source)
                  ? household.water_source.join(", ")
                  : household.water_source || "N/A"}
              </div>
            </div>

            {Array.isArray(household.water_purification_methods) &&
              household.water_purification_methods.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    शुद्धिकरण:
                  </div>
                  <div className="text-xs">
                    {household.water_purification_methods.join(", ")}
                  </div>
                </div>
              )}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-1">
            ऊर्जा र फोहोर
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">खाना ऊर्जा:</div>
              <div>{household.primary_cooking_fuel || "N/A"}</div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">विद्युत स्रोत:</div>
              <div>
                {household.primary_energy_source || "N/A"}
                {household.primary_energy_source_other && (
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    ({household.primary_energy_source_other})
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">फोहोर:</div>
              <div>
                {household.solid_waste_management || "N/A"}
                {household.solid_waste_management_other && (
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    ({household.solid_waste_management_other})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {Array.isArray(household.facilities) &&
          household.facilities.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  उपलब्ध सुविधाहरू
                </div>
                <div className="flex flex-wrap gap-1 text-xs">
                  {household.facilities.map((facility: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
      </CardContent>
    </Card>
  );
}
