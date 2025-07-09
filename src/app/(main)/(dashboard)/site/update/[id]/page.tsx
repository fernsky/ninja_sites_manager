import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import UpdateWardAreaCode from "@/components/dashboard/update-ward";
import { ContentLayout } from "@/components/admin-panel/content-layout";

interface WardUpdatePageProps {
  params: {
    id: string;
  };
}

export default async function EditorPage({ params }: WardUpdatePageProps) {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);
  console.log(params);

  return (
    <ContentLayout title="Update Ward">
      <div className="mb-6 space-y-2"></div>
      <UpdateWardAreaCode wardNumber={parseInt(params.id)} />
    </ContentLayout>
  );
}
