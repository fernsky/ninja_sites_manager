import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdDemographics({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Demographics & Origin</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium text-muted-foreground">Caste</div>
          <div>
            {household.caste || "N/A"}
            {household.caste_other ? ` (${household.caste_other})` : ""}
          </div>

          <div className="font-medium text-muted-foreground">Religion</div>
          <div>
            {household.religion || "N/A"}
            {household.religion_other ? ` (${household.religion_other})` : ""}
          </div>

          <div className="font-medium text-muted-foreground">Mother Tongue</div>
          <div>
            {household.primary_mother_tongue || "N/A"}
            {household.primary_mother_tongue_other
              ? ` (${household.primary_mother_tongue_other})`
              : ""}
          </div>

          <div className="font-medium text-muted-foreground">
            Ancestral Language
          </div>
          <div>
            {household.ancestral_language || "N/A"}
            {household.ancestral_language_other
              ? ` (${household.ancestral_language_other})`
              : ""}
          </div>

          <div className="col-span-2 mt-2 font-medium">
            Birthplace Information
          </div>

          <div className="font-medium text-muted-foreground">Birth Place</div>
          <div>{household.birth_place || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Birth Province
          </div>
          <div>{household.birth_province || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Birth District
          </div>
          <div>{household.birth_district || "N/A"}</div>

          <div className="font-medium text-muted-foreground">Birth Country</div>
          <div>{household.birth_country || "N/A"}</div>

          <div className="col-span-2 mt-2 font-medium">Prior Location</div>

          <div className="font-medium text-muted-foreground">
            Prior Location
          </div>
          <div>{household.prior_location || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Prior Province
          </div>
          <div>{household.prior_province || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Prior District
          </div>
          <div>{household.prior_district || "N/A"}</div>

          <div className="font-medium text-muted-foreground">Prior Country</div>
          <div>{household.prior_country || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Residence Reasons
          </div>
          <div>
            {Array.isArray(household.residence_reasons)
              ? household.residence_reasons.join(", ")
              : household.residence_reasons || "N/A"}
            {household.residence_reasons_other
              ? ` (${household.residence_reasons_other})`
              : ""}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
