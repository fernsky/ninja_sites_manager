"use server";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { EnumeratorArea } from "@/components/dashboard/enumerator-area";
// import { ListSites } from "@/components/dashboard/list-sites";
import { validateRequest } from "@/lib/auth/validate-request";

const DashboardPage = async () => {
  const { user } = await validateRequest();
  if (!user) return null;
  return (
    <ContentLayout title="Dashboard">
      <EnumeratorArea />
    </ContentLayout>
  );
};

export default DashboardPage;
