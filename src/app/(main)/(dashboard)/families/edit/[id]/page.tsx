"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EnumeratorAssignment } from "@/components/family/enumerator-assignment";
import { WardAssignment } from "@/components/family/ward-assignment";
import { AreaAssignment } from "@/components/family/area-assignment";
import { EditPageLayout } from "@/components/business/edit/edit-page-layout";

export default function EditFamily({ params }: { params: { id: string } }) {
  const router = useRouter();
  const decodedId = decodeURIComponent(params.id);

  const {
    data: family,
    isLoading,
    refetch: refetchFamily,
  } = api.family.getById.useQuery({
    id: decodedId,
  });

  if (isLoading) {
    return (
      <ContentLayout title="Edit Family">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Edit Family"
      subtitle={`ID: ${decodedId}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/families/${decodedId}`)}
            className="hover:border-destructive hover:text-destructive"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="family-form"
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <EditPageLayout>
        <EnumeratorAssignment
          refetchFamily={refetchFamily}
          familyId={decodedId}
          currentEnumeratorId={family?.enumeratorId ?? undefined}
        />

        <WardAssignment
          familyId={decodedId}
          currentWardNumber={family?.wardId?.toString() ?? undefined}
          isWardValid={family?.isWardValid ?? false}
          refetchFamily={refetchFamily}
        />

        <AreaAssignment
          familyId={decodedId}
          currentAreaId={family?.areaId ?? undefined}
          currentBuildingToken={family?.buildingToken ?? undefined}
          isAreaValid={family?.isAreaValid ?? false}
          refetchFamily={refetchFamily}
        />
      </EditPageLayout>
    </ContentLayout>
  );
}
