import type { FamilySchema } from "@/server/db/schema/family/family";

interface FamilyInfoGridProps {
  family: FamilySchema;
}

export function FamilyInfoGrid({ family }: FamilyInfoGridProps) {
  const infoItems = [
    { label: "Head Phone", value: family.headPhone },
    { label: "Locality", value: family.locality },
    { label: "Water Source", value: family.waterSource?.join(", ") },
    { label: "Toilet Type", value: family.toiletType },
    { label: "Solid Waste", value: family.solidWaste },
    { label: "Primary Cooking Fuel", value: family.primaryCookingFuel },
    { label: "Primary Energy Source", value: family.primaryEnergySource },
    { label: "Facilities", value: family.facilities?.join(", ") },
    { label: "Income Sources", value: family.incomeSources?.join(", ") },
  ];

  return (
    <div className="grid gap-4 rounded-lg border bg-card p-6">
      <h3 className="font-semibold">Family Information</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {infoItems.map(
          (item) =>
            item.value && (
              <div key={item.label} className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
                <div className="font-medium">{item.value}</div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
