import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await validateRequest();

  if (!user) redirect(Paths.Login);
  return <AdminPanelLayout user={user}>{children}</AdminPanelLayout>;
}
