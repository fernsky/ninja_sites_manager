"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EnumeratorAssignment } from "@/components/business/enumerator-assignment";
import { WardAssignment } from "@/components/business/ward-assignment";
import { BusinessAreaAssignment } from "@/components/business/area-assignment";
import { EditPageLayout } from "@/components/business/edit/edit-page-layout";

export default function EditBusiness({ params }: { params: { id: string } }) {
  const router = useRouter();
  const decodedId = decodeURIComponent(params.id);

  const {
    data: business,
    isLoading,
    refetch: refetchBusiness,
  } = api.business.getById.useQuery({
    id: decodedId,
  });

  if (isLoading) {
    return (
      <ContentLayout title="Edit Business">
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
      title="Edit Business"
      subtitle={`ID: ${decodedId}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/businesses/${decodedId}`)}
            className="hover:border-destructive hover:text-destructive"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="business-form"
            className="bg-primary hover:bg-primary/90"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <EditPageLayout>
        <EnumeratorAssignment
          refetchBusiness={refetchBusiness}
          businessId={decodedId}
          currentEnumeratorId={business?.enumeratorId ?? undefined}
        />

        <WardAssignment
          businessId={decodedId}
          currentWardNumber={business?.wardId?.toString() ?? undefined}
          isWardValid={business?.isWardValid ?? false}
          refetchBusiness={refetchBusiness}
        />

        <BusinessAreaAssignment
          //@ts-ignore
          businessId={decodedId}
          currentAreaId={business?.areaId ?? undefined}
          currentBuildingToken={business?.buildingToken ?? undefined}
          isAreaValid={business?.isAreaValid ?? false}
          refetchBusiness={refetchBusiness}
        />
      </EditPageLayout>
    </ContentLayout>
  );
}
