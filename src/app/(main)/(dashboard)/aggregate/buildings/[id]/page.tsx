// import { AggregateBuildingDetail } from "@/components/aggregate/AggregateBuildingDetail";
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
  // Fetch building data
  let building;
  try {
    building = await api.aggregate.getBuildingById.query({
      id: params.id,
      includeHouseholds: false,
      includeBusinesses: false,
    });
  } catch (error) {
    // If building not found, metadata will use defaults
  }

  const buildingTitle =
    building?.locality || building?.building_id || "Building";

  return {
    title: `${buildingTitle} | Aggregate Data`,
    description: `Details for building ${buildingTitle} in Buddha Shanti Municipality survey data`,
  };
}

export default async function BuildingDetailPage({ params }: Props) {
  try {
    const building = await api.aggregate.getBuildingById.query({
      id: params.id,
      includeHouseholds: true,
      includeBusinesses: true,
    });

    // return <AggregateBuildingDetail building={building} />;
    return <p></p>;
  } catch (error) {
    return notFound();
  }
}
