"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/actions";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { LogOut } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { ProfileCard } from "./_components/profile-card";
import { QuickActionsCard } from "./_components/quick-actions-card";
import { HelpCard } from "./_components/help-card";
import { NepaliIdCard } from "./_components/nepali-id-card";
import { api } from "@/trpc/react";
import { IdCardGenerator } from "@/components/id-card/id-card-generator";
import React from "react";
import { useIdCardStore } from "@/store/id-card-store";

export default function AccountPage() {
  const utils = api.useUtils();
  const { data: user } = api.user.get.useQuery();
  const setDetails = useIdCardStore((state) => state.setDetails);
  const resetDetails = useIdCardStore((state) => state.resetDetails);

  // Initialize ID card store with user data
  React.useEffect(() => {
    if (user?.id) {
      // Get enumerator details
      utils.enumerator.getById.fetch(user.id).then((enumerator) => {
        if (enumerator) {
          setDetails({
            nepaliName: enumerator.nepaliName || null,
            nepaliAddress: enumerator.nepaliAddress || null,
            nepaliPhone: enumerator.phoneNumber || null,
          });
        }
      });
    }
    return () => resetDetails();
  }, [user?.id, setDetails, resetDetails, utils.enumerator.getById]);

  return (
    <ContentLayout title="Account Settings">
      <main className="container mx-auto min-h-screen space-y-6 p-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Account Settings
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your account preferences and settings
              </p>
            </div>
            {/* @ts-ignore */}
            <form action={logout}>
              <Button variant="outline" className="gap-2 flex">
                <LogOut className="h-4 w-4" />
                <p>Sign Out</p>
              </Button>
            </form>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <ProfileCard user={user} />
              <QuickActionsCard />
            </div>

            {/*<div className="space-y-6">
              {user && (
                <>
                  <NepaliIdCard
                    userId={user.id}
                    initialData={{
                      nepaliName: user?.nepaliName || null,
                      nepaliAddress: user?.nepaliAddress || null,
                      nepaliPhone: user?.nepaliPhone || null,
                    }}
                  />
                  <div className="mt-4">
                    <IdCardGenerator
                      userId={user.id}
                      className="max-w-[400px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
                    />
                  </div>
                </>
              )}
            </div>*/}
          </div>

          <HelpCard />
        </div>
      </main>
    </ContentLayout>
  );
}
