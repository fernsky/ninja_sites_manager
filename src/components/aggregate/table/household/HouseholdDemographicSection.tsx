import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function HouseholdDemographicSection({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">जनसांख्यिकी र उत्पत्ति</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">जात:</div>
            <Badge variant="outline">
              {household.caste || "N/A"}
              {household.caste_other && ` (${household.caste_other})`}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">धर्म:</div>
            <Badge variant="outline">
              {household.religion || "N/A"}
              {household.religion_other && ` (${household.religion_other})`}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-1">भाषा</div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">मातृभाषा:</div>
              <div>
                {household.primary_mother_tongue || "N/A"}
                {household.primary_mother_tongue_other && 
                  <span className="text-xs text-muted-foreground"> ({household.primary_mother_tongue_other})</span>}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="text-muted-foreground">पुर्ख्यौली:</div>
              <div>
                {household.ancestral_language || "N/A"}
                {household.ancestral_language_other && 
                  <span className="text-xs text-muted-foreground"> ({household.ancestral_language_other})</span>}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-1">जन्म र बसाईं</div>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-muted-foreground">जन्मस्थान:</div>
              <div>{household.birth_place || "N/A"}</div>
              {household.birth_province && (
                <div className="text-xs text-muted-foreground">
                  {household.birth_province}, {household.birth_district || ""}
                  {household.birth_country && household.birth_country !== "Nepal" ? 
                    ` (${household.birth_country})` : ""}
                </div>
              )}
            </div>

            <div>
              <div className="text-muted-foreground">पहिलेको स्थान:</div>
              <div>{household.prior_location || "N/A"}</div>
              {household.prior_province && (
                <div className="text-xs text-muted-foreground">
                  {household.prior_province}, {household.prior_district || ""}
                  {household.prior_country && household.prior_country !== "Nepal" ? 
                    ` (${household.prior_country})` : ""}
                </div>
              )}
            </div>

            {Array.isArray(household.residence_reasons) && household.residence_reasons.length > 0 && (
              <div>
                <div className="text-muted-foreground">बसाई कारण:</div>
                <div className="text-xs">
                  {household.residence_reasons.join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
