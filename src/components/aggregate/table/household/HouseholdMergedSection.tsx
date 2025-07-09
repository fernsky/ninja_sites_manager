import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function HouseholdMergedSection({ household }: { household: any }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">घरपरिवार विवरण</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* BASIC INFORMATION */}
        <div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div className="text-xs text-muted-foreground">
                फोन: {localizeNumber(household.head_phone, "ne")} • कुल सदस्य:{" "}
                <span className="font-semibold">
                  {localizeNumber(household.total_members, "ne")}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm">
                {household.household_locality || "N/A"}
              </div>
              <div className="text-xs mt-1">
                {household.household_token &&
                  `टोकन: ${household.household_token}`}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">जिपिएस</div>
              <div className="text-xs">
                {household.household_gps_latitude
                  ? `${localizeNumber(household.household_gps_latitude, "ne")}, ${localizeNumber(household.household_gps_longitude, "ne")}`
                  : "N/A"}
                {household.household_gps_accuracy && (
                  <span className="text-muted-foreground ml-1">
                    (सटीकता:{" "}
                    {localizeNumber(household.household_gps_accuracy, "ne")}{" "}
                    मि.)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* DEMOGRAPHICS & CULTURAL */}
        <div className="space-y-4">
          {/* Identity & Language */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5 items-center">
              <div className="text-xs text-muted-foreground">पहिचान:</div>
              <Badge variant="secondary" className="text-xs">
                {household.caste || "N/A"}
                {household.caste_other && ` (${household.caste_other})`}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {household.religion || "N/A"}
                {household.religion_other && ` (${household.religion_other})`}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="text-xs">
                <span className="text-muted-foreground">मातृभाषा:</span>{" "}
                <span className="font-medium">
                  {household.primary_mother_tongue || "N/A"}
                  {household.primary_mother_tongue_other &&
                    ` (${household.primary_mother_tongue_other})`}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">पुर्ख्यौली भाषा:</span>{" "}
                <span className="font-medium">
                  {household.ancestral_language || "N/A"}
                  {household.ancestral_language_other &&
                    ` (${household.ancestral_language_other})`}
                </span>
              </div>
            </div>
          </div>

          {/* Housing & Utilities */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                आवास स्वामित्व
              </div>
              <Badge variant="outline" className="text-xs">
                {household.house_ownership || "N/A"}
                {household.house_ownership_other &&
                  ` (${household.house_ownership_other})`}
              </Badge>
            </div>

            {Array.isArray(household.primary_energy_source) &&
              household.primary_energy_source.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    ऊर्जा स्रोत
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {household.primary_energy_source.map(
                      (source: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {source}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

            {Array.isArray(household.water_source) &&
              household.water_source.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    पानीको स्रोत
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {household.water_source.map(
                      (source: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {source}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}

            {Array.isArray(household.primary_cooking_fuel) &&
              household.primary_cooking_fuel.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    खाना पकाउने इन्धन
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {household.primary_cooking_fuel.map(
                      (fuel: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {fuel}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* Financial & Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {Array.isArray(household.income_sources) &&
                household.income_sources.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      आय स्रोतहरू
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {household.income_sources.map(
                        (source: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {source}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {Array.isArray(household.remittance_expenses) &&
                household.remittance_expenses.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      रेमिट्यान्स खर्च
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {household.remittance_expenses.map(
                        (remittance: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {remittance}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="space-y-2">
              {Array.isArray(household.has_insurance) &&
              household.has_insurance.length > 0 ? (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    बीमा प्रकार
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {household.has_insurance.map(
                      (insurance: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {insurance}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">बीमा:</span>
                  <Badge variant="outline" className="text-xs">
                    छैन
                  </Badge>
                </div>
              )}

              {Array.isArray(household.water_purification_methods) &&
                household.water_purification_methods.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      पानी शुद्धिकरण विधि
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {household.water_purification_methods.map(
                        (method: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {method}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        <Separator />

        {/* AGRICULTURE & MIGRATION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    कृषि भूमि:
                  </span>
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
                <div className="flex items-center gap-1">
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
              </div>

              {household.is_farmer && (
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div>
                    पुरुष:{" "}
                    <span className="font-medium">
                      {localizeNumber(household.total_male_farmers || 0, "ne")}
                    </span>
                  </div>
                  <div>
                    महिला:{" "}
                    <span className="font-medium">
                      {localizeNumber(
                        household.total_female_farmers || 0,
                        "ne",
                      )}
                    </span>
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    धान्न सकिने:{" "}
                    {localizeNumber(
                      household.months_sustained_from_agriculture || 0,
                      "ne",
                    )}{" "}
                    महिना
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    पशुपालन:
                  </span>
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
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    माछापालन:
                  </span>
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
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    मौरीपालन:
                  </span>
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
              </div>

              {household.has_animal_husbandry &&
                Array.isArray(household.animal_types) &&
                household.animal_types.length > 0 && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">पशु प्रकार: </span>
                    {household.animal_types.join(", ")}
                  </div>
                )}

              {household.has_aquaculture && (
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-muted-foreground">
                      पोखरी संख्या:{" "}
                    </span>
                    {household.pond_count
                      ? localizeNumber(household.pond_count, "ne")
                      : "N/A"}
                  </div>
                  {household.pond_area && (
                    <div>
                      <span className="text-muted-foreground">
                        पोखरी क्षेत्रफल:{" "}
                      </span>
                      {localizeNumber(household.pond_area, "ne")}
                    </div>
                  )}
                  {household.fish_production && (
                    <div>
                      <span className="text-muted-foreground">
                        माछा उत्पादन:{" "}
                      </span>
                      {localizeNumber(household.fish_production, "ne")} के.जी.
                    </div>
                  )}
                </div>
              )}

              {household.has_apiculture && (
                <div className="text-xs space-y-1">
                  <div>
                    <span className="text-muted-foreground">
                      मौरीघार संख्या:{" "}
                    </span>
                    {household.hive_count
                      ? localizeNumber(household.hive_count, "ne")
                      : "N/A"}
                  </div>
                  {household.honey_production && (
                    <div>
                      <span className="text-muted-foreground">
                        मह उत्पादन:{" "}
                      </span>
                      {localizeNumber(household.honey_production, "ne")} के.जी.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-muted-foreground">जन्मस्थान: </span>
                {household.birth_place || "N/A"}
                {household.birth_province && (
                  <div className="text-[10px] text-muted-foreground pl-2">
                    {household.birth_province}, {household.birth_district || ""}
                    {household.birth_country &&
                    household.birth_country !== "Nepal"
                      ? ` (${household.birth_country})`
                      : ""}
                  </div>
                )}
              </div>

              {Array.isArray(household.residence_reasons) &&
                household.residence_reasons.length > 0 && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">बसाई कारण: </span>
                    {household.residence_reasons.join(", ")}
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* ADDITIONAL INFO ROWS - Only display if data exists */}
        {Array.isArray(household.facilities) &&
          household.facilities.length > 0 && (
            <div className="mt-1">
              <div className="text-xs text-muted-foreground mb-1">
                उपलब्ध सुविधाहरू
              </div>
              <div className="flex flex-wrap gap-1">
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
          )}
      </CardContent>
    </Card>
  );
}
