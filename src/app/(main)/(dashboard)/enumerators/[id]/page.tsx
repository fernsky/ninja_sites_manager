"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, User2, UserCheck } from "lucide-react";
import { SuperadminAreaStatusActions } from "@/components/area/superadmin-area-status-actions";
import { NepaliIdCard } from "@/app/(main)/account/_components/nepali-id-card";
import { UserAvatarUpload } from "@/app/(main)/account/_components/user-avatar-upload";
import { IdCardGenerator } from "@/components/id-card/id-card-generator";
import React from "react";
import { useIdCardStore } from "@/store/id-card-store";
import Link from "next/link";

export default function EnumeratorDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const utils = api.useUtils();
  const { data: enumerator, isLoading } = api.enumerator.getById.useQuery(
    params.id,
  );

  const { data: assignedArea } = api.area.getAreaCodesByEnumeratorId.useQuery({
    enumeratorId: params.id,
  });

  console.log("Assigned Area: ", assignedArea);

  const resetDetails = useIdCardStore((state) => state.resetDetails);
  const setDetails = useIdCardStore((state) => state.setDetails);

  React.useEffect(() => {
    // Initialize store when enumerator data loads with safe defaults
    if (enumerator) {
      setDetails({
        nepaliName: enumerator.nepaliName || null,
        nepaliAddress: enumerator.nepaliAddress || null,
        nepaliPhone: enumerator.nepaliPhone || null,
      });
    }
    // Cleanup store on unmount
    return () => resetDetails();
  }, [enumerator, setDetails, resetDetails]);

  const handleUploadSuccess = () => {
    // Only invalidate the avatar URL
    utils.enumerator.getAvatarUrl.invalidate(params.id);
  };

  const handleIdCardDetailsUpdate = () => {
    // Refetch enumerator data to update ID card details
    utils.enumerator.getById.invalidate(params.id);
  };

  if (isLoading) {
    return (
      <ContentLayout title="Enumerator Details">
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </ContentLayout>
    );
  }

  if (!enumerator) {
    return (
      <ContentLayout title="Enumerator Not Found">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              The requested enumerator could not be found
            </p>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  const FormCard = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | number | null;
  }) => (
    <div className="flex items-start space-x-3">
      <div className="mt-0.5">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 font-medium">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <ContentLayout
      title="Enumerator Details"
      subtitle={`ID: ${params.id}`}
      actions={
        <div className="flex gap-2">
          <Button onClick={() => router.push("/enumerators")}>
            Back to List
          </Button>
          <Button onClick={() => router.push(`/enumerators/${params.id}/edit`)}>
            Edit Enumerator
          </Button>
        </div>
      }
    >
      <div className="space-y-6 px-2 lg:px-10">
        <FormCard
          title="Profile Photo"
          description="Upload or update enumerator's profile photo"
        >
          <div className="flex items-center justify-center py-4">
            <UserAvatarUpload
              userId={params.id}
              currentAvatar={enumerator?.avatar}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        </FormCard>

        <FormCard
          title="Basic Information"
          description="Personal and contact details of the enumerator"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem icon={User2} label="Full Name" value={enumerator.name} />
            <InfoItem
              icon={Phone}
              label="Phone Number"
              value={enumerator.phoneNumber}
            />
            <InfoItem
              icon={Mail}
              label="Email Address"
              value={enumerator.email}
            />
          </div>
        </FormCard>

        <FormCard
          title="Account Information"
          description="Account credentials and work assignment details"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={UserCheck}
              label="Username"
              value={enumerator.userName}
            />
            <InfoItem
              icon={MapPin}
              label="Assigned Ward"
              value={`Ward ${enumerator.wardNumber}`}
            />
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <User2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="mt-1">
                  <Badge
                    variant={enumerator.isActive ? "default" : "secondary"}
                    className={
                      enumerator.isActive
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }
                  >
                    {enumerator.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </FormCard>

        <FormCard
          title="Area Status"
          description="Details about the enumerator's area status"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={UserCheck}
              label="Assigned Area"
              value={assignedArea ? assignedArea.join(", ") : null}
            />

            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <User2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assign the Area
                </p>
                <div className="mt-2">
                  {typeof assignedArea?.[0] !== "number" ? (
                    <Link href={`/enumerators/${params.id}/manual-assign`}>
                      <Button>Assign Area</Button>
                    </Link>
                  ) : (
                    <Button disabled>Assign Area</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FormCard>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NepaliIdCard
            userId={params.id}
            initialData={{
              nepaliName: enumerator.nepaliName,
              nepaliAddress: enumerator.nepaliAddress,
              nepaliPhone: enumerator.nepaliPhone,
            }}
            onUpdate={handleIdCardDetailsUpdate}
          />

          <FormCard
            title="ID Card"
            description="Generate and download enumerator ID card"
          >
            <IdCardGenerator
              userId={params.id}
              className="max-w-[400px] mx-auto"
            />
          </FormCard>
        </div>  */}

        <SuperadminAreaStatusActions
          //@ts-ignore
          area={enumerator.area}
          enumeratorId={params.id}
        />
        {/* Add more sections as needed */}
      </div>
    </ContentLayout>
  );
}
