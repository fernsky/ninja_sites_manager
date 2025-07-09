import { FormsList } from "@/components/dashboard/forms-list";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FormsPage() {
  return (
    <ContentLayout title="Forms">
      <div className="flex justify-end mb-4">
        <Link href="/forms/create">
          <Button type="button">Create Form</Button>
        </Link>
      </div>
      <FormsList />
    </ContentLayout>
  );
}
