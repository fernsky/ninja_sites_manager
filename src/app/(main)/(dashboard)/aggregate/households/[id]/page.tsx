import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Fetch household data
  let household;
  try {
    household = await api.aggregate.getHouseholdById.query({
      id: params.id,
    });
  } catch (error) {
    // If household not found, metadata will use defaults
  }

  const householdTitle = household?.head_name || "Household";

  return {
    title: `${householdTitle} | Household Details`,
    description: `Household information for ${householdTitle} in Buddha Shanti Municipality survey`,
  };
}

export default async function HouseholdDetailPage({ params }: Props) {
  try {
    const household = await api.aggregate.getHouseholdById.query({
      id: params.id,
    });

    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Household Detail Page</h1>
        <p className="mb-4">This page is currently under development.</p>
        <p>Details for household ID: {params.id}</p>
        <pre className="bg-muted p-4 rounded-md mt-6 text-sm overflow-auto max-h-[500px]">
          {JSON.stringify(household, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
