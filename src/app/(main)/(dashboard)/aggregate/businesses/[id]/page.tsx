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
  // Fetch business data
  let business;
  try {
    business = await api.aggregate.getBusinessById.query({
      id: params.id,
    });
  } catch (error) {
    // If business not found, metadata will use defaults
  }

  const businessTitle = business?.business_name || "Business";

  return {
    title: `${businessTitle} | Business Details`,
    description: `Business information for ${businessTitle} in Buddha Shanti Municipality survey`,
  };
}

export default async function BusinessDetailPage({ params }: Props) {
  try {
    const business = await api.aggregate.getBusinessById.query({
      id: params.id,
    });

    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Business Detail Page</h1>
        <p className="mb-4">This page is currently under development.</p>
        <p>Details for business ID: {params.id}</p>
        <pre className="bg-muted p-4 rounded-md mt-6 text-sm overflow-auto max-h-[500px]">
          {JSON.stringify(business, null, 2)}
        </pre>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
