import ListFamilies from "@/components/dashboard/list-families";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function FamiliesPage() {
  const { user } = await validateRequest();
  if (!user) return redirect(Paths.Login);
  return <ListFamilies user={user} />;
}
