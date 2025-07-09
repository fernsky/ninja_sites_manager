"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { BuildingLoadingState } from "@/components/building/building-loading-state";
import { BuildingStatsGrid } from "@/components/building/building-stats-grid";
import { BuildingInfoGrid } from "@/components/building/building-info-grid";
import { BuildingMediaSection } from "@/components/building/building-media-section";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { BuildingActions } from "@/components/building/building-actions";
import { z } from "zod";
import { CustomAudioPlayer } from "@/components/ui/audio-player";
import { BuildingInvalidSection } from "@/components/building/building-invalid-section";

const gpsSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
});

export default function BuildingDetails({
  params,
}: {
  params: { id: string };
}) {
  const decodedId = decodeURIComponent(params.id);
  const {
    data: building,
    isLoading,
    error,
    refetch: buildingRefetch,
  } = api.building.getById.useQuery({ id: decodedId });

  if (error) {
    return (
      <ContentLayout title="Error">
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Building Details"
      actions={
        <div className="flex gap-2">
          <Link href={`/buildings`}>
            <Button size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Buildings
            </Button>
          </Link>
          <Link href={`/buildings/edit/${params.id}`}>
            <Button size="sm" variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </Link>
          <Button size="sm" variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      }
    >
      {isLoading ? (
        <BuildingLoadingState />
      ) : (
        <div className="space-y-6 lg:px-10 px-2">
          {/* Main Grid Layout */}
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            {/* Left Column - Audio and Stats */}
            <div className="space-y-4">
              {building?.surveyAudioRecording && (
                <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="border-b bg-muted/50 px-4 py-3">
                    <h3 className="text-sm font-medium">Audio Monitoring</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Survey recording for verification
                    </p>
                  </div>
                  <div className="p-4">
                    <CustomAudioPlayer src={building.surveyAudioRecording} />
                  </div>
                </div>
              )}

              <BuildingStatsGrid
                totalFamilies={building?.totalFamilies ?? 0}
                totalBusinesses={building?.totalBusinesses ?? 0}
                wardNumber={building?.wardId ?? 0}
              />
            </div>

            {/* Right Column - Verification Status */}
            <div className="h-full">
              <BuildingActions
                buildingId={building.id}
                currentStatus={building.status ?? "pending"}
                onStatusChange={buildingRefetch}
              />
            </div>
          </div>

          {/* @ts-ignore */}
          <BuildingInvalidSection building={building} />

          {/* Media Section */}
          {(building?.buildingImage || building?.enumeratorSelfie) && (
            <div className="grid grid-cols-1 lg:grid-cols-[3fr,1fr] gap-6">
              {building?.buildingImage && (
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold">Building Photo</h3>
                    <p className="text-xs text-muted-foreground">
                      Main photo of the surveyed building
                    </p>
                  </div>
                  <div className="aspect-video relative">
                    <Image
                      src={building.buildingImage}
                      alt="Building"
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                </div>
              )}
              {building?.enumeratorSelfie && (
                <BuildingMediaSection
                  selfieUrl={building.enumeratorSelfie}
                  compact
                />
              )}
            </div>
          )}

          {/* Combined Info Grid and Location */}
          <BuildingInfoGrid
            building={building}
            locationDetails={
              building?.gps && gpsSchema.safeParse(building.gps).success
                ? {
                    coordinates: [
                      building.gps.coordinates[1],
                      building.gps.coordinates[0],
                    ],
                    gpsAccuracy: building.gpsAccuracy ?? undefined,
                    altitude: building.altitude ?? undefined,
                  }
                : undefined
            }
          />
        </div>
      )}
    </ContentLayout>
  );
}
