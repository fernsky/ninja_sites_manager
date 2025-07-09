import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function HouseholdEconomicSection({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">आर्थिक जानकारी</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">बीमा:</span>
            {household.has_insurance ? (
              <Badge variant="default" className="text-xs">
                छ
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                छैन
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">रेमिट्यान्स:</span>
            {household.has_remittance ? (
              <Badge variant="default" className="text-xs">
                छ
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                छैन
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              महिला सम्पत्ति:
            </span>
            <span className="text-sm font-medium">
              {household.female_properties || "N/A"}
            </span>
          </div>
        </div>

        {household.has_remittance &&
          Array.isArray(household.remittance_expenses) &&
          household.remittance_expenses.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground">
                रेमिट्यान्स खर्च:
              </div>
              <div className="text-xs flex flex-wrap gap-1 mt-1">
                {household.remittance_expenses.map(
                  (expense: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="font-normal"
                    >
                      {expense}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}

        <Separator />

        <div>
          <div className="text-xs text-muted-foreground mb-1">
            स्वास्थ्य संस्था
          </div>
          <div className="text-sm">
            {household.health_organization || "N/A"}
            {household.health_organization_other && (
              <span className="text-xs text-muted-foreground">
                {" "}
                ({household.health_organization_other})
              </span>
            )}
          </div>
        </div>

        <Separator />

        {Array.isArray(household.income_sources) &&
          household.income_sources.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                आय स्रोतहरू
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {household.income_sources.map((source: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {Array.isArray(household.financial_organizations) &&
          household.financial_organizations.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                वित्तीय संस्थाहरू
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {household.financial_organizations.map(
                  (org: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {org}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}

        {Array.isArray(household.loan_use) && household.loan_use.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">ऋण उपयोग</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {household.loan_use.map((use: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {use}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
