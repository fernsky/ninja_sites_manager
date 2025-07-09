"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Edit,
  Trash2,
  ArrowLeft,
  User,
  Home,
  CircleDollarSign,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { FamilyLoadingState } from "@/components/family/family-loading-state";
import { FamilyStatsGrid } from "@/components/family/family-stats-grid";
import { LocationDetailsSection } from "@/components/family/location-details-section";
import { FamilyActions } from "@/components/family/family-actions";
import { AgriculturalSection } from "@/components/family/agricultural-section";
import { AnimalProductsSection } from "@/components/family/animal-products-section";
import { Card, CardContent } from "@/components/ui/card";
import { CropsSection } from "@/components/family/crops-section";
import { AnimalSection } from "@/components/family/animal-section";
import { CustomAudioPlayer } from "@/components/ui/audio-player";
import Image from "next/image";
import { AgriculturalDetailsSection } from "@/components/family/agricultural-details-section";
import { IndividualsSection } from "@/components/family/individuals-section";

const gpsSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
});

export default function FamilyDetails({ params }: { params: { id: string } }) {
  const decodedId = decodeURIComponent(params.id);
  const {
    data: family,
    isLoading,
    error,
    refetch: familyRefetch,
  } = api.family.getById.useQuery({ id: decodedId });

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
      title="Family Details"
      actions={
        <div className="flex gap-2">
          <Link href="/families">
            <Button size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Families
            </Button>
          </Link>
          <Link href={`/families/edit/${params.id}`}>
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
        <FamilyLoadingState />
      ) : (
        <div className="space-y-6 lg:px-10 px-2">
          {/* Main Grid Layout */}
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            {/* Left Column - Audio and Stats */}
            <div className="space-y-4">
              {family?.surveyAudioRecording && (
                <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="border-b bg-muted/50 px-4 py-3">
                    <h3 className="text-sm font-medium">Audio Monitoring</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Survey recording for verification
                    </p>
                  </div>
                  <div className="p-4">
                    <CustomAudioPlayer src={family.surveyAudioRecording} />
                  </div>
                </div>
              )}

              <FamilyStatsGrid
                totalMembers={family?.totalMembers ?? 0}
                wardNo={family?.wardNo ?? 0}
                headName={family?.headName ?? "N/A"}
              />
            </div>

            {/* Right Column - Verification Status */}
            <div className="h-full">
              <FamilyActions
                familyId={family.id}
                currentStatus={family.status ?? "pending"}
                onStatusChange={familyRefetch}
              />
            </div>
          </div>

          {/* Media Section */}
          {(family?.familyImage || family?.enumeratorSelfie) && (
            <div className="grid grid-cols-1 lg:grid-cols-[3fr,1fr] gap-6">
              {family?.familyImage && (
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold">Family Photo</h3>
                    <p className="text-xs text-muted-foreground">
                      Photo of the family head
                    </p>
                  </div>
                  <div className="aspect-video relative">
                    <Image
                      src={family.familyImage}
                      alt="Family Head"
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                </div>
              )}
              {family?.enumeratorSelfie && (
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold">Enumerator Selfie</h3>
                    <p className="text-xs text-muted-foreground">
                      Photo verification of surveyor
                    </p>
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={family.enumeratorSelfie}
                      alt="Enumerator Selfie"
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {family?.gps && (
            <LocationDetailsSection
              coordinates={[
                family.gps.coordinates[1],
                family.gps.coordinates[0],
              ]}
              gpsAccuracy={
                family.gpsAccuracy
                  ? parseFloat(family.gpsAccuracy.toString())
                  : undefined
              }
              altitude={
                family.altitude
                  ? parseFloat(family.altitude.toString())
                  : undefined
              }
              locality={family.locality ?? undefined}
              wardNo={family.wardNo}
            />
          )}

          {/* Add this section just before the Basic Information Card */}
          <IndividualsSection individuals={family?.individuals} />

          {/* Basic Information */}
          <Card>
            <div className="border-b bg-muted/50 px-4 py-3">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Basic Information
              </h3>
            </div>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <InfoItem label="Head Name" value={family?.headName} />
              <InfoItem label="Head Phone" value={family?.headPhone} />
              <InfoItem label="Ward No" value={family?.wardNo?.toString()} />
              <InfoItem label="Locality" value={family?.locality} />
              <InfoItem label="Development Org" value={family?.devOrg} />
            </CardContent>
          </Card>

          {/* Living Conditions */}
          <Card>
            <div className="border-b bg-muted/50 px-4 py-3">
              <h3 className="font-medium flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Living Conditions
              </h3>
            </div>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <InfoItem
                label="House Ownership"
                value={family?.houseOwnership}
              />
              <InfoItem
                label="Water Source"
                value={family?.waterSource?.join(", ")}
              />
              <InfoItem label="Toilet Type" value={family?.toiletType} />
              <InfoItem label="Solid Waste" value={family?.solidWaste} />
              <InfoItem
                label="Primary Cooking Fuel"
                value={family?.primaryCookingFuel}
              />
              <InfoItem
                label="Primary Energy Source"
                value={family?.primaryEnergySource}
              />
              <InfoItem
                label="Facilities"
                value={family?.facilities?.join(", ")}
              />
            </CardContent>
          </Card>

          {/* Agricultural Overview Section */}
          <AgriculturalDetailsSection
            lands={family?.agriculturalLands}
            crops={family?.crops}
          />

          {/* Agricultural and Livestock Sections */}
          <AgriculturalSection lands={family?.agriculturalLands} />
          <CropsSection crops={family?.crops} />
          <AnimalSection animals={family?.animals} />
          <AnimalProductsSection products={family?.animalProducts} />

          {/* Economic Information */}
          <Card>
            <div className="border-b bg-muted/50 px-4 py-3">
              <h3 className="font-medium flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-primary" />
                Economic Information
              </h3>
            </div>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <InfoItem
                label="Female Properties"
                value={family?.femaleProperties}
              />
              <InfoItem
                label="Loaned Organizations"
                value={family?.loanedOrganizations?.join(", ")}
              />
              <InfoItem label="Loan Use" value={family?.loanUse} />
              <InfoItem label="Has Bank Account" value={family?.hasBank} />
              <InfoItem label="Has Insurance" value={family?.hasInsurance} />
              <InfoItem
                label="Income Sources"
                value={family?.incomeSources?.join(", ")}
              />
              <InfoItem
                label="Has Remittance"
                value={family?.hasRemittance ? "Yes" : "No"}
              />
              <InfoItem
                label="Remittance Expenses"
                value={family?.remittanceExpenses?.join(", ")}
              />
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card>
            <div className="border-b bg-muted/50 px-4 py-3">
              <h3 className="font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Health & Welfare
              </h3>
            </div>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <InfoItem
                label="Is Sanitized"
                value={family?.isSanitized ? "Yes" : "No"}
              />
              <InfoItem label="Health Organization" value={family?.healthOrg} />
              <InfoItem
                label="Municipal Suggestions"
                value={family?.municipalSuggestions}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </ContentLayout>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
