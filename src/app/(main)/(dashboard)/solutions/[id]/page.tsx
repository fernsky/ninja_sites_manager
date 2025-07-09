import { ContentLayout } from "@/components/admin-panel/content-layout";
import { validateRequest } from "@/lib/auth/validate-request";
import { SolutionDetail } from "@/components/dashboard/solution-detail";
import { notFound } from "next/navigation";

interface SolutionPageProps {
  params: {
    id: string;
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { user } = await validateRequest();
  if (!user) return null;

  if (!params.id) {
    notFound();
  }

  return (
    <ContentLayout title="Solution Details">
      <SolutionDetail solutionId={params.id} />
    </ContentLayout>
  );
}
