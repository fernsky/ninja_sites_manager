import { ContentLayout } from "@/components/admin-panel/content-layout";
import { validateRequest } from "@/lib/auth/validate-request";
import { SolutionsList } from "@/components/dashboard/solutions-list";

export default async function SolutionsPage() {
  const { user } = await validateRequest();
  if (!user) return null;

  return (
    <ContentLayout title="Solutions">
      <SolutionsList />
    </ContentLayout>
  );
}
