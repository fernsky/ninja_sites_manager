import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HouseholdEconomic({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Economic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="font-medium text-muted-foreground">
            Female Properties
          </div>
          <div>{household.female_properties || "N/A"}</div>

          <div className="font-medium text-muted-foreground">
            Loaned Organizations
          </div>
          <div>
            {Array.isArray(household.loaned_organizations)
              ? household.loaned_organizations.join(", ")
              : household.loaned_organizations || "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">Loan Use</div>
          <div>
            {Array.isArray(household.loan_use)
              ? household.loan_use.join(", ")
              : household.loan_use || "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">
            Financial Organizations
          </div>
          <div>
            {Array.isArray(household.financial_organizations)
              ? household.financial_organizations.join(", ")
              : household.financial_organizations || "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">Has Insurance</div>
          <div>{household.has_insurance ? "Yes" : "No"}</div>

          <div className="font-medium text-muted-foreground">
            Health Organization
          </div>
          <div>
            {household.health_organization || "N/A"}
            {household.health_organization_other
              ? ` (${household.health_organization_other})`
              : ""}
          </div>

          <div className="font-medium text-muted-foreground">
            Income Sources
          </div>
          <div>
            {Array.isArray(household.income_sources)
              ? household.income_sources.join(", ")
              : household.income_sources || "N/A"}
          </div>

          <div className="font-medium text-muted-foreground">
            Has Remittance
          </div>
          <div>{household.has_remittance ? "Yes" : "No"}</div>

          {household.has_remittance && (
            <>
              <div className="font-medium text-muted-foreground">
                Remittance Expenses
              </div>
              <div>
                {Array.isArray(household.remittance_expenses)
                  ? household.remittance_expenses.join(", ")
                  : household.remittance_expenses || "N/A"}
              </div>
            </>
          )}

          <div className="font-medium text-muted-foreground">
            Municipal Suggestions
          </div>
          <div>
            {Array.isArray(household.municipal_suggestions)
              ? household.municipal_suggestions.join(", ")
              : household.municipal_suggestions || "N/A"}
            {household.municipal_suggestions_other
              ? ` (${household.municipal_suggestions_other})`
              : ""}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
