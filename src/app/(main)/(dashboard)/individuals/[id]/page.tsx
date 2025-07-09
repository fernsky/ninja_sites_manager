"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, ArrowLeft, User, Home } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/individual/loading-state";
import { QuickStatsCard } from "@/components/individual/quick-stats-card";
import { PersonalSection } from "@/components/individual/sections/personal-section";
import { CulturalSection } from "@/components/individual/sections/cultural-section";
import { HealthSection } from "@/components/individual/sections/health-section";
import { EducationSection } from "@/components/individual/sections/education-section";
import { OccupationSection } from "@/components/individual/sections/occupation-section";
import { FertilitySection } from "@/components/individual/sections/fertility-section";
import { MigrationSection } from "@/components/individual/sections/migration-section";

export default function IndividualDetails({
  params,
}: {
  params: { id: string };
}) {
  const decodedId = decodeURIComponent(params.id);
  const {
    data: individual,
    isLoading,
    error,
  } = api.individual.getById.useQuery({ id: decodedId });

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
      title="Individual Profile"
      actions={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/individuals">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Button>
          </Link>
          {individual?.familyId && (
            <Link href={`/families/${individual.familyId}`}>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4" /> Back to Family
              </Button>
            </Link>
          )}
          <Link href={`/individuals/edit/${params.id}`}>
            <Button size="sm" className="w-full sm:w-auto">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </Link>
        </div>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6 p-4 md:p-6">
          {/* Header Card */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {individual?.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      ID: {individual?.id}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="px-4 py-1">
                    Ward {individual?.wardNo}
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-1">
                    {individual?.familyRole || "Role N/A"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Quick Stats */}
          <QuickStatsCard
            individual={{
              age: individual?.age ?? undefined,
              gender: individual?.gender,
              educationalLevel: individual?.educationalLevel ?? undefined,
              religion: individual?.religion ?? undefined,
            }}
          />

          {/* Sequential Sections */}
          <div className="space-y-6">
            {/* @ts-ignore */}
            <PersonalSection individual={individual} />
            {/* @ts-ignore */}
            <CulturalSection individual={individual} />
            {/* @ts-ignore */}
            <FertilitySection individual={individual} />
            {/* @ts-ignore */}
            <HealthSection individual={individual} />
            {/* @ts-ignore */}
            <EducationSection individual={individual} />
            {/* @ts-ignore */}
            <OccupationSection individual={individual} />
            {/* @ts-ignore */}
            <MigrationSection individual={individual} />
          </div>
        </div>
      )}
    </ContentLayout>
  );
}
