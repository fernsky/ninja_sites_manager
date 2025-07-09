import { Baby, Heart } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function FertilitySection({ individual }: { individual?: Individual }) {
  if (!individual?.gaveLiveBirth && !individual?.gaveRecentLiveBirth)
    return null;

  return (
    <div className="space-y-4">
      {individual.gaveLiveBirth === "Yes" && (
        <DetailsCard
          title="Birth History"
          icon={<Heart className="h-5 w-5 text-primary" />}
          items={[
            {
              label: "Total Born Children",
              value: individual.totalBornChildren?.toString(),
              icon: <Baby className="h-4 w-4" />,
            },
            {
              label: "Living Sons",
              value: individual.aliveSons?.toString(),
              icon: <Baby className="h-4 w-4" />,
            },
            {
              label: "Living Daughters",
              value: individual.aliveDaughters?.toString(),
              icon: <Baby className="h-4 w-4" />,
            },
            {
              label: "Deceased Children",
              value: individual.hasDeadChildren === "Yes" ? "Yes" : "No",
              icon: <Heart className="h-4 w-4" />,
            },
            ...(individual.hasDeadChildren === "Yes"
              ? [
                  {
                    label: "Deceased Sons",
                    value: individual.deadSons?.toString(),
                    icon: <Baby className="h-4 w-4" />,
                  },
                  {
                    label: "Deceased Daughters",
                    value: individual.deadDaughters?.toString(),
                    icon: <Baby className="h-4 w-4" />,
                  },
                ]
              : []),
          ]}
        />
      )}

      {individual.gaveRecentLiveBirth === "Yes" && (
        <DetailsCard
          title="Recent Birth Details"
          icon={<Baby className="h-5 w-5 text-primary" />}
          items={[
            {
              label: "Recent Born Sons",
              value: individual.recentBornSons?.toString(),
              icon: <Baby className="h-4 w-4" />,
            },
            {
              label: "Recent Born Daughters",
              value: individual.recentBornDaughters?.toString(),
              icon: <Baby className="h-4 w-4" />,
            },
            {
              label: "Delivery Location",
              value: individual.recentDeliveryLocation,
              icon: <Heart className="h-4 w-4" />,
            },
            {
              label: "Prenatal Checkups",
              value: individual.prenatalCheckups?.toString(),
              icon: <Heart className="h-4 w-4" />,
            },
            {
              label: "First Delivery Age",
              value: individual.firstDeliveryAge?.toString(),
              icon: <Baby className="h-4 w-4" />,
            },
          ]}
        />
      )}
    </div>
  );
}
