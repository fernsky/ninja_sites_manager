import React from "react";
import { HouseholdTable } from "./HouseholdTable";
import { BusinessTable } from "./BusinessTable";
import { MediaGallery } from "./MediaGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ChevronUp, MapPin, User } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { localizeNumber } from "@/lib/utils/localize-number";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomAudioPlayer } from "@/components/ui/audio-player";

export function BuildingRow({ building }: { building: any }) {
  const [expanded, setExpanded] = React.useState(true);

  // Collect all media related to this building
  const buildingMedia: {
    url: any;
    type: "audio" | "video" | "image";
    label: string;
  }[] = [];

  if (building.buildingImage) {
    buildingMedia.push({
      url: building.buildingImage,
      type: "image",
      label: "Building Image",
    });
  }

  if (building.enumeratorSelfie) {
    buildingMedia.push({
      url: building.enumeratorSelfie,
      type: "image",
      label: "Enumerator Selfie",
    });
  }

  if (building.surveyAudioRecording) {
    buildingMedia.push({
      url: building.surveyAudioRecording,
      type: "audio",
      label: "Audio Recording",
    });
  }

  return (
    <div className="py-6 px-4 border-b">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={
                building.map_status === "validated"
                  ? "default"
                  : building.map_status === "needs_review"
                    ? "destructive"
                    : "outline"
              }
            >
              {building.map_status
                ? building.map_status.replace(/_/g, " ")
                : "अनुगमन नभएको"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              स्वामित्व: {building.building_owner_name || "अज्ञात"}
              {building.building_owner_phone &&
                ` (${localizeNumber(building.building_owner_phone, "ne")})`}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              वडा {localizeNumber(building.ward_number, "ne")}, क्षेत्र{" "}
              {building.area_code} - {building.locality}
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {building.building_survey_date
                ? formatDate(building.building_survey_date)
                : "सर्वेक्षण मिति उपलब्ध छैन"}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" /> छोटो देखाउनुहोस्
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" /> विस्तृत देखाउनुहोस्
            </>
          )}
        </Button>
      </div>

      {expanded && (
        <>
          <Card className="mt-6 mb-8">
            <CardContent className="p-4 space-y-4">
              {/* Building Details Section - Now spans full width */}
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="mr-1">
                      मुख्य
                    </Badge>
                    निर्माण विवरण
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {building.enumerator_name && (
                      <span>सर्वेक्षक: {building.enumerator_name}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Construction Details */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground mb-1">
                      निर्माण सामग्री
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          जग:
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {building.building_base?.replace(/_/g, " ") ||
                            "अज्ञात"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          भित्ता:
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {building.building_outer_wall?.replace(/_/g, " ") ||
                            "अज्ञात"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          छत:
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {building.building_roof?.replace(/_/g, " ") ||
                            "अज्ञात"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          भुइँ:
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {building.building_floor?.replace(/_/g, " ") ||
                            "अज्ञात"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-muted-foreground">
                        स्वामित्व स्थिति:
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {building.building_ownership_status?.replace(
                          /_/g,
                          " ",
                        ) || "अज्ञात"}
                      </Badge>
                    </div>
                  </div>

                  {/* GPS & Location */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      स्थानीय विवरण
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          जिपिएस:
                        </span>
                        <span className="text-xs">
                          {building.building_gps_latitude
                            ?.toString()
                            .substring(0, 8)}
                          ,
                          {building.building_gps_longitude
                            ?.toString()
                            .substring(0, 8)}
                          {building.building_gps_accuracy &&
                            ` (${localizeNumber(building.building_gps_accuracy, "ne")} मि. सटीकता)`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">
                          सडकको स्थिति:
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {building.road_status?.replace(/_/g, " ") || "अज्ञात"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Access Times */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      पहुँचका समयहरू
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">बजारसम्म:</span>
                        <span>
                          {building.time_to_market
                            ? `${localizeNumber(building.time_to_market, "ne")} मिनेट`
                            : "अज्ञात"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">सडकसम्म:</span>
                        <span>
                          {building.time_to_active_road
                            ? `${localizeNumber(building.time_to_active_road, "ne")} मिनेट`
                            : "अज्ञात"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          स्वास्थ्य संस्थासम्म:
                        </span>
                        <span>
                          {building.time_to_health_organization
                            ? `${localizeNumber(building.time_to_health_organization, "ne")} मिनेट`
                            : "अज्ञात"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Occupancy Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      परिवारहरू
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {localizeNumber(building.total_families || 0, "ne")}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        परिवार(हरू) बस्दछन्
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      व्यवसायहरू
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">
                        {localizeNumber(building.total_businesses || 0, "ne")}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        व्यवसाय(हरू) संचालित छन्
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Gallery - Now displayed as flex row at the bottom */}
              {buildingMedia.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">मिडिया</h4>
                  <div className="flex flex-wrap gap-4">
                    {buildingMedia.map((item, index) => (
                      <div
                        key={index}
                        className="flex-1 min-w-[200px] max-w-[300px]"
                      >
                        {item.type === "image" ? (
                          <div className="border rounded-md overflow-hidden">
                            <div className="px-3 py-2 bg-muted/30 border-b">
                              <h5 className="text-sm font-medium">
                                {item.label}
                              </h5>
                            </div>
                            <div className="p-2">
                              <img
                                src={item.url}
                                alt={item.label}
                                className="w-full h-48 object-cover rounded"
                              />
                            </div>
                          </div>
                        ) : item.type === "audio" ? (
                          <div className="border rounded-md overflow-hidden">
                            <div className="px-3 py-2 bg-muted/30 border-b">
                              <h5 className="text-sm font-medium">
                                {item.label}
                              </h5>
                            </div>
                            <div className="p-2">
                              <CustomAudioPlayer src={item.url} />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Households */}
          {building.households?.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-lg mb-4 border-b pb-2">
                परिवारहरू ({localizeNumber(building.households.length, "ne")})
              </h4>
              <HouseholdTable households={building.households} />
            </div>
          )}

          {/* Businesses */}
          {building.businesses?.length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium text-lg mb-4 border-b pb-2">
                व्यवसायहरू ({localizeNumber(building.businesses.length, "ne")})
              </h4>
              <BusinessTable businesses={building.businesses} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
