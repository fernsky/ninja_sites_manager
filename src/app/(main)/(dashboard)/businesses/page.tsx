import ListBusinesses from "@/components/dashboard/list-businesses";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function BusinessesPage() {
  const { user } = await validateRequest();
  if (!user) return redirect(Paths.Login);
  return <ListBusinesses user={user} />;
}
