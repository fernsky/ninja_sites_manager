import { Heart, User, Home, Users } from "lucide-react";
import { DetailsCard } from "../details-card";
import { Individual } from "@/server/api/routers/individuals/individuals.schema";

export function HealthSection({ individual }: { individual?: Individual }) {
  return (
    <div className="space-y-4">
      <DetailsCard
        title="Health Status"
        icon={<Heart className="h-5 w-5 text-primary" />}
        items={[
          {
            label: "Chronic Disease",
            value: individual?.hasChronicDisease,
            icon: <Heart className="h-4 w-4" />,
          },
          {
            label: "Primary Disease",
            value: individual?.primaryChronicDisease,
            icon: <Heart className="h-4 w-4" />,
          },
          {
            label: "Sanitization",
            value: individual?.isSanitized,
            icon: <Home className="h-4 w-4" />,
          },
          {
            label: "Disability Status",
            value: individual?.isDisabled,
            icon: <User className="h-4 w-4" />,
          },
          {
            label: "Disability Type",
            value: individual?.disabilityType,
            icon: <User className="h-4 w-4" />,
          },
          {
            label: "Disability Cause",
            value: individual?.disabilityCause,
            icon: <User className="h-4 w-4" />,
          },
        ]}
      />
      {individual?.gaveLiveBirth === "Yes" && (
        <DetailsCard
          title="Fertility Information"
          icon={<Users className="h-5 w-5 text-primary" />}
          items={[
            {
              label: "Living Children",
              value: `Sons: ${individual.aliveSons || 0}, Daughters: ${
                individual.aliveDaughters || 0
              }`,
              icon: <Users className="h-4 w-4" />,
            },
            {
              label: "Recent Birth",
              value: individual?.gaveRecentLiveBirth,
              icon: <User className="h-4 w-4" />,
            },
            {
              label: "Delivery Location",
              value: individual?.recentDeliveryLocation,
              icon: <Home className="h-4 w-4" />,
            },
            {
              label: "Prenatal Checkups",
              value: individual?.prenatalCheckups?.toString(),
              icon: <Heart className="h-4 w-4" />,
            },
          ]}
        />
      )}
    </div>
  );
}
