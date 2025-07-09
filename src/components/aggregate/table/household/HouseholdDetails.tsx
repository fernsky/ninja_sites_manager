import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HouseholdBasicInfo } from "./HouseholdBasicInfo";
import { HouseholdFacilities } from "./HouseholdFacilities";
import { HouseholdEconomic } from "./HouseholdEconomic";
import { HouseholdDemographics } from "./HouseholdDemographics";
import { HouseholdMembers } from "./HouseholdMembers";
import { HouseholdAgricultural } from "./HouseholdAgricultural";
import { HouseholdMedia } from "./HouseholdMedia";
import { HouseholdDeaths } from "./HouseholdDeaths";

export function HouseholdDetails({ household }: { household: any }) {
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
    <Tabs defaultValue="basic">
      <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="members">
          Members ({household.household_members?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
        <TabsTrigger value="absentees">
          Absentees ({household.absentees?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HouseholdBasicInfo household={household} />
          <HouseholdDemographics household={household} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HouseholdFacilities household={household} />
          <HouseholdEconomic household={household} />
        </div>
        {household.deaths?.length > 0 && (
          <HouseholdDeaths deaths={household.deaths} />
        )}
      </TabsContent>

      <TabsContent value="members">
        <HouseholdMembers members={household.household_members} />
      </TabsContent>

      <TabsContent value="agriculture">
        <HouseholdAgricultural household={household} />
      </TabsContent>

      <TabsContent value="media">
        <HouseholdMedia media={householdMedia} />
      </TabsContent>
    </Tabs>
  );
}
