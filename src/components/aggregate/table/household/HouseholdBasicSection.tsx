import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function HouseholdBasicSection({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">आधारभूत जानकारी</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="font-medium text-base">{household.head_name}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">वडा</span>
              <Badge variant="outline">
                {localizeNumber(household.ward_number, "ne")}
              </Badge>
              <span className="text-muted-foreground">क्षेत्र</span>
              <Badge variant="outline">{household.area_code}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">पेश मिति</div>
            <div className="text-xs">
              {household.household_submission_date
                ? formatDate(household.household_submission_date)
                : "N/A"}
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">टोकन</div>
            <div>{household.household_token}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">स्थान</div>
            <div>{household.household_locality}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground text-xs">फोन</div>
            <div>{localizeNumber(household.head_phone, "ne")}</div>
          </div>
          
          <div>
            <div className="text-muted-foreground text-xs">कुल सदस्य</div>
            <div className="font-semibold">
              {localizeNumber(household.total_members, "ne")}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="text-muted-foreground text-xs mb-1">जिपिएस</div>
          <div className="text-xs">
            {household.household_gps_latitude
              ? `${localizeNumber(household.household_gps_latitude, "ne")}, ${localizeNumber(household.household_gps_longitude, "ne")}`
              : "N/A"}
            {household.household_gps_accuracy && 
              <span className="ml-1 text-muted-foreground">
                (सटीकता: {localizeNumber(household.household_gps_accuracy, "ne")} मि.)
              </span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
