import ListBuildings from "@/components/dashboard/list-buildings";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function BuildingsPage() {
  const { user } = await validateRequest();
  if (!user) return redirect(Paths.Login);
  return <ListBuildings user={user} />;
}
