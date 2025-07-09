import ListDeaths from "@/components/dashboard/list-deaths";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function DeathsPage() {
  const { user } = await validateRequest();
  if (!user) return redirect(Paths.Login);
  return <ListDeaths user={user} />;
}
