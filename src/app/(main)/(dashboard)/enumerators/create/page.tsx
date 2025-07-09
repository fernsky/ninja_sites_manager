"use client";

import { CreateEnumerator } from "@/components/dashboard/create-enumerator";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";

export default function CreateEnumeratorPage() {
  return (
    <ContentLayout title="Create Enumerator">
      <CreateEnumerator />
    </ContentLayout>
  );
}
