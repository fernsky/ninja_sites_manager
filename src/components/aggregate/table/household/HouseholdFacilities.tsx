import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdFacilities({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Facilities & Utilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium text-muted-foreground">
            House Ownership
          </div>
          <div>
            {household.house_ownership || "N/A"}
            {household.house_ownership_other
              ? ` (${household.house_ownership_other})`
              : ""}
          </div>

          <div className="font-medium text-muted-foreground">Water Source</div>
          <div>
            {Array.isArray(household.water_source)
              ? household.water_source.join(", ")
              : household.water_source || "N/A"}
            {household.water_source_other
              ? ` (${household.water_source_other})`
              : ""}
          </div>

          <div className="font-medium text-muted-foreground">
            Water Purification
          </div>
          <div>
            {Array.isArray(household.water_purification_methods)
              ? household.water_purification_methods.join(", ")
              : household.water_purification_methods || "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">Toilet Type</div>
          <div>{household.toilet_type || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Waste Management
          </div>
          <div>
            {household.solid_waste_management || "N/A"}
            {household.solid_waste_management_other
              ? ` (${household.solid_waste_management_other})`
              : ""}
          </div>

          <div className="font-medium text-muted-foreground">Cooking Fuel</div>
          <div>{household.primary_cooking_fuel || "N/A"}</div>

          <div className="font-medium text-muted-foreground">Energy Source</div>
          <div>
            {household.primary_energy_source || "N/A"}
            {household.primary_energy_source_other
              ? ` (${household.primary_energy_source_other})`
              : ""}
          </div>

          <div className="font-medium text-muted-foreground">
            Available Facilities
          </div>
          <div className="break-words">
            {Array.isArray(household.facilities)
              ? household.facilities.join(", ")
              : household.facilities || "N/A"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
