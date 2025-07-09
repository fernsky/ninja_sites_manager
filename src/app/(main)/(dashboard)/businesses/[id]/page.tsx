"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { BusinessLoadingState } from "@/components/business/business-loading-state";
import { BusinessStatsGrid } from "@/components/business/business-stats-grid";
import { BusinessInfoGrid } from "@/components/business/business-info-grid";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { BusinessActions } from "@/components/business/business-actions";
import { z } from "zod";
import Image from "next/image";
import { BusinessDetailsSection } from "@/components/business/business-details-section";
import { CustomAudioPlayer } from "@/components/ui/audio-player";
import { BusinessInvalidSection } from "@/components/business/business-invalid-section";

const gpsSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
});

export default function BusinessDetails({
  params,
}: {
  params: { id: string };
}) {
  const decodedId = decodeURIComponent(params.id);
  const {
    data: business,
    isLoading,
    error,
    refetch: businessRefetch,
  } = api.business.getById.useQuery({ id: decodedId });

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
      title="Business Details"
      actions={
        <div className="flex gap-2">
          <Link href={`/businesses`}>
            <Button size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Businesses
            </Button>
          </Link>
          <Link href={`/businesses/edit/${params.id}`}>
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
        <BusinessLoadingState />
      ) : (
        <div className="space-y-6 lg:px-10 px-2">
          {/* Main Grid Layout */}
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            {/* Left Column - Audio and Stats */}
            <div className="space-y-4">
              {business?.surveyAudioRecording && (
                <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="border-b bg-muted/50 px-4 py-3">
                    <h3 className="text-sm font-medium">Audio Monitoring</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Survey recording for verification
                    </p>
                  </div>
                  <div className="p-4">
                    <CustomAudioPlayer src={business.surveyAudioRecording} />
                  </div>
                </div>
              )}

              <BusinessStatsGrid
                totalEmployees={
                  (business?.totalPermanentEmployees ?? 0) +
                  (business?.totalTemporaryEmployees ?? 0)
                }
                totalPartners={business?.totalPartners ?? 0}
                wardNumber={
                  business?.tmpWardNumber ??
                  business?.wardNo ??
                  business?.wardId ??
                  0
                }
              />
            </div>

            {/* Right Column - Verification Status */}
            <div className="h-full">
              <BusinessActions
                businessId={business.id}
                currentStatus={business.status ?? "pending"}
                onStatusChange={businessRefetch}
              />
            </div>
          </div>

          {/* @ts-ignore */}
          <BusinessInvalidSection business={business} />

          {/* Media Section */}
          {(business?.businessImage || business?.enumeratorSelfie) && (
            <div className="grid grid-cols-1 lg:grid-cols-[3fr,1fr] gap-6">
              {business?.businessImage && (
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold">Business Photo</h3>
                    <p className="text-xs text-muted-foreground">
                      Main photo of the surveyed business
                    </p>
                  </div>
                  <div className="aspect-video relative">
                    <Image
                      src={business.businessImage}
                      alt="Business"
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                </div>
              )}
              {business?.enumeratorSelfie && (
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold">Enumerator Selfie</h3>
                    <p className="text-xs text-muted-foreground">
                      Photo verification of surveyor
                    </p>
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={business.enumeratorSelfie}
                      alt="Enumerator Selfie"
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Info Grid with Location */}
          <BusinessInfoGrid
            //@ts-ignore
            business={business}
            locationDetails={
              business?.gps && gpsSchema.safeParse(business.gps).success
                ? {
                    coordinates: [
                      business.gps.coordinates[1],
                      business.gps.coordinates[0],
                    ],
                    gpsAccuracy: business.gpsAccuracy
                      ? Number(business.gpsAccuracy)
                      : undefined,
                    altitude: business.altitude
                      ? Number(business.altitude)
                      : undefined,
                  }
                : undefined
            }
          />

          {/* Animal and Crop Details */}
          <BusinessDetailsSection
            animals={business?.animals}
            animalProducts={business?.animalProducts}
            crops={business?.crops}
          />
        </div>
      )}
    </ContentLayout>
  );
}
