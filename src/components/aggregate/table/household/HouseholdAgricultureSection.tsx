import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Separator } from "@/components/ui/separator";

export function HouseholdAgricultureSection({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">कृषि सारांश</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">कृषि भूमि:</span>
            {household.has_agricultural_land ? (
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
            <span className="text-xs text-muted-foreground">किसान:</span>
            {household.is_farmer ? (
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
            <span className="text-xs text-muted-foreground">पशुपालन:</span>
            {household.has_animal_husbandry ? (
              <Badge variant="default" className="text-xs">
                छ
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                छैन
              </Badge>
            )}
          </div>
        </div>

        {household.is_farmer && (
          <>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground">पुरुष किसान</div>
                <div className="text-lg font-semibold">
                  {localizeNumber(household.total_male_farmers || 0, "ne")}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">महिला किसान</div>
                <div className="text-lg font-semibold">
                  {localizeNumber(household.total_female_farmers || 0, "ne")}
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  धान्न सकिने महिना
                </div>
                <div className="text-sm">
                  {localizeNumber(
                    household.months_sustained_from_agriculture || 0,
                    "ne",
                  )}{" "}
                  महिना
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">
                  संलग्न महिना
                </div>
                <div className="text-sm">
                  {localizeNumber(
                    household.months_involved_in_agriculture || 0,
                    "ne",
                  )}{" "}
                  महिना
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">मौरीपालन:</span>
            {household.has_apiculture ? (
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
            <span className="text-xs text-muted-foreground">जलकृषि:</span>
            {household.has_aquaculture ? (
              <Badge variant="default" className="text-xs">
                छ
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                छैन
              </Badge>
            )}
          </div>
        </div>

        {household.has_agricultural_land &&
          Array.isArray(household.agricultural_land_ownership_types) &&
          household.agricultural_land_ownership_types.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                भूमिको स्वामित्व
              </div>
              <div className="flex flex-wrap gap-1">
                {household.agricultural_land_ownership_types.map(
                  (type: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {type}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}

        {household.has_animal_husbandry &&
          Array.isArray(household.animal_types) &&
          household.animal_types.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                पशु प्रकार
              </div>
              <div className="flex flex-wrap gap-1">
                {household.animal_types.map((type: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs font-normal"
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          )}

        {Array.isArray(household.agricultural_machinery) &&
          household.agricultural_machinery.length > 0 && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                कृषि उपकरण
              </div>
              <div className="flex flex-wrap gap-1">
                {household.agricultural_machinery.map(
                  (machine: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {machine}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}
      </CardContent>
    </Card>
  );
}
