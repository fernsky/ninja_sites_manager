"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { InvalidAssignments } from "@/components/dashboard/invalid-buildings/invalid-assignments";

export default function InvalidAssignmentsPage() {
  return (
    <ContentLayout title="Invalid Assignments">
      <div className="p-6">
        <InvalidAssignments />
      </div>
    </ContentLayout>
  );
}
