import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function HouseholdBasicInfo({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium text-muted-foreground">ID</div>
          <div>{household.id}</div>

          <div className="font-medium text-muted-foreground">Survey Date</div>
          <div>
            {household.household_survey_date
              ? formatDate(household.household_survey_date)
              : "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">
            Submission Date
          </div>
          <div>
            {household.household_submission_date
              ? formatDate(household.household_submission_date)
              : "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">Token</div>
          <div>{household.household_token}</div>

          <div className="font-medium text-muted-foreground">Ward Number</div>
          <div>{household.ward_number}</div>

          <div className="font-medium text-muted-foreground">Area Code</div>
          <div>{household.area_code}</div>

          <div className="font-medium text-muted-foreground">Locality</div>
          <div>{household.household_locality}</div>

          <div className="font-medium text-muted-foreground">
            Development Org
          </div>
          <div>{household.household_development_organization || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            GPS Coordinates
          </div>
          <div>
            {household.household_gps_latitude
              ? `${household.household_gps_latitude}, ${household.household_gps_longitude}`
              : "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">GPS Accuracy</div>
          <div>{household.household_gps_accuracy} m</div>

          <div className="font-medium text-muted-foreground">Head Name</div>
          <div className="font-semibold">{household.head_name}</div>

          <div className="font-medium text-muted-foreground">Head Phone</div>
          <div>{household.head_phone}</div>

          <div className="font-medium text-muted-foreground">Total Members</div>
          <div>{household.total_members}</div>

          <div className="font-medium text-muted-foreground">Is Sanitized</div>
          <div>{household.is_sanitized ? "Yes" : "No"}</div>

          <div className="font-medium text-muted-foreground">Feels Safe</div>
          <div>{household.feels_safe ? "Yes" : "No"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
