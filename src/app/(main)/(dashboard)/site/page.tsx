import { ContentLayout } from "@/components/admin-panel/content-layout";
import { WardsList } from "@/components/dashboard/wards-list";
import { SitesList } from "@/components/dashboard/sites-list";

export default function WardPage() {
  return (
    <ContentLayout title="Sites">
      <SitesList />
    </ContentLayout>
  );
}
