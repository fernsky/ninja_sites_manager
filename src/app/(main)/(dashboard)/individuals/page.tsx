import ListIndividuals from "@/components/dashboard/list-individuals";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";

export default async function IndividualsPage() {
  const { user } = await validateRequest();
  if (!user) return redirect(Paths.Login);
  return <ListIndividuals user={user} />;
}
