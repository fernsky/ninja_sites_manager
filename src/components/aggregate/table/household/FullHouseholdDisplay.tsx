import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";
import { HouseholdMergedSection } from "./HouseholdMergedSection";
import { HouseholdMembersTable } from "./HouseholdMembersTable";
import { HouseholdMedia } from "./HouseholdMedia";
import { HouseholdAdditionalTables } from "./HouseholdAdditionalTables";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export function FullHouseholdDisplay({ household }: { household: any }) {
  // Collect household media
  const householdMedia: {
    url: any;
    type: "image" | "audio" | "video";
    label: string;
  }[] = [];

  if (household.familyImage || household.household_image_key) {
    householdMedia.push({
      url: household.familyImage,
      type: "image" as const,
      label: "Family Image",
    });
  }

  if (household.enumeratorSelfie || household.household_enumerator_selfie_key) {
    householdMedia.push({
      url: household.enumeratorSelfie,
      type: "image" as const,
      label: "Enumerator Selfie",
    });
  }

  if (
    household.surveyAudioRecording ||
    household.household_audio_recording_key
  ) {
    householdMedia.push({
      url: household.surveyAudioRecording,
      type: "audio" as const,
      label: "Audio Recording",
    });
  }

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-muted/30 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            {household.head_name}
            <Badge variant="outline">
              {localizeNumber(household.total_members, "ne")} सदस्य
            </Badge>
            {household.household_token && (
              <span className="text-sm text-muted-foreground font-normal">
                ({household.household_token})
              </span>
            )}
          </CardTitle>
          <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
            {household.enumerator_name && (
              <span>सर्वेक्षक: {household.enumerator_name}</span>
            )}
            {household.household_survey_date && (
              <span>मिति: {formatDate(household.household_survey_date)}</span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {/* First row with merged info and media */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <HouseholdMergedSection household={household} />
          </div>
          <div className="md:col-span-1">
            <HouseholdMedia media={householdMedia} />
          </div>
        </div>

        {/* Members section (always displayed) */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-md font-semibold border-b pb-1 flex items-center gap-2">
              <Badge variant="outline">सदस्य</Badge>
              घरपरिवारका सदस्यहरू
              {household.household_members?.length > 0 && (
                <Badge variant="secondary" className="ml-1 font-normal">
                  {localizeNumber(household.household_members.length, "ne")}
                </Badge>
              )}
            </h3>
          </div>
          <HouseholdMembersTable members={household.household_members || []} />
        </div>

        {/* Additional data tables (only show if there's data) */}
        {(household.agricultural_lands?.length > 0 ||
          household.crops?.length > 0 ||
          household.animals?.length > 0 ||
          household.animal_products?.length > 0 ||
          household.deaths?.length > 0 ||
          (household.municipal_suggestions &&
            household.municipal_suggestions.length > 0)) && (
          <>
            <Separator className="my-6" />
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-md font-semibold border-b pb-1">
                  अतिरिक्त विवरणहरू
                </h3>
              </div>
              <HouseholdAdditionalTables household={household} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
