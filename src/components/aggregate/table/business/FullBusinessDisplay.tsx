import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { localizeNumber } from "@/lib/utils/localize-number";
import { MediaGallery } from "../MediaGallery";
import { BusinessBasicSection } from "./BusinessBasicSection";
import { BusinessEmployeeSection } from "./BusinessEmployeeSection";
import { BusinessAgricultureSection } from "./BusinessAgricultureSection";
import { BusinessLegalSection } from "./BusinessLegalSection";
import { Separator } from "@/components/ui/separator";

export function FullBusinessDisplay({ business }: { business: any }) {
  // Collect business media
  const businessMedia: {
    url: any;
    type: "audio" | "video" | "image";
    label: string;
  }[] = [];

  if (business.businessImage || business.business_image_key) {
    businessMedia.push({
      url: business.businessImage,
      type: "image" as const,
      label: "Business Image",
    });
  }

  if (business.enumeratorSelfie || business.business_enumerator_selfie_key) {
    businessMedia.push({
      url: business.enumeratorSelfie,
      type: "image" as const,
      label: "Enumerator Selfie",
    });
  }

  if (business.surveyAudioRecording || business.business_audio_recording_key) {
    businessMedia.push({
      url: business.surveyAudioRecording,
      type: "audio" as const,
      label: "Audio Recording",
    });
  }

  return (
    <Card className="overflow-hidden border-2 border-primary/10 shadow-sm">
      <CardHeader className="bg-muted/20 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {business.business_name}
            <Badge
              variant={
                business.registration_status === "registered"
                  ? "default"
                  : "outline"
              }
            >
              {business.registration_status || "N/A"}
            </Badge>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {business.business_survey_date
              ? `सर्वेक्षण मिति: ${formatDate(business.business_survey_date)}`
              : ""}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {/* First row with basic info and media */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <BusinessBasicSection business={business} />
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Media</CardTitle>
              </CardHeader>
              <CardContent>
                <MediaGallery media={businessMedia} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legal info section */}
        <BusinessLegalSection business={business} />

        {/* Employee section */}
        <BusinessEmployeeSection business={business} />

        {/* Agriculture section - only if relevant */}
        {business.agricultural_type && (
          <BusinessAgricultureSection business={business} />
        )}

        {/* Additional details if any */}
        {business.business_remarks && (
          <div className="mt-4">
            <Separator className="my-2" />
            <h3 className="text-lg font-medium mb-2">Remarks</h3>
            <div className="text-sm p-3 bg-muted/20 rounded-md">
              {business.business_remarks}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
