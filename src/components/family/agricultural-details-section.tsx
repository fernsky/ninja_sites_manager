import { Card } from "@/components/ui/card";
import { KerabariAgriculturalLand } from "@/server/db/schema/family/agricultural-lands";
import { KerabariCrop } from "@/server/db/schema/family/crops";
import {
  Sprout,
  Droplets,
  Ruler,
  Target,
  Warehouse,
  PieChart,
  LineChart,
  BadgeCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AgriculturalDetailsSectionProps {
  lands?: KerabariAgriculturalLand[] | null;
  crops?: KerabariCrop[] | null;
}

export function AgriculturalDetailsSection({
  lands,
  crops,
}: AgriculturalDetailsSectionProps) {
  if (!lands?.length && !crops?.length) return null;

  // Calculate metrics
  const totalLandArea = lands?.reduce(
    (sum, land) => sum + (Number(land.landArea) || 0),
    0,
  );
  const totalIrrigatedArea = lands?.reduce(
    (sum, land) => sum + (Number(land.irrigatedLandArea) || 0),
    0,
  );
  const irrigationPercentage = totalLandArea
    ? ((totalIrrigatedArea ?? 0) / totalLandArea) * 100
    : 0;
  const uniqueCrops = Array.from(new Set(crops?.map((crop) => crop.cropType)));

  // Group lands by ownership type
  const landsByOwnership = lands?.reduce(
    (acc, land) => {
      const type = land.landOwnershipType || "Other";
      acc[type] = (acc[type] || 0) + Number(land.landArea);
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate irrigation sources distribution
  const irrigationSources = lands?.reduce(
    (acc, land) => {
      if (land.irrigationSource) {
        acc[land.irrigationSource] =
          (acc[land.irrigationSource] || 0) + Number(land.irrigatedLandArea);
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="grid gap-6">
      {/* Main Overview Card */}
      <Card className="overflow-hidden">
        <div className="border-b bg-muted/50 px-4 py-3">
          <h3 className="font-medium flex items-center gap-2">
            <Sprout className="h-4 w-4 text-primary" />
            Agricultural Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Land */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <Ruler className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Land</p>
                  <p className="text-2xl font-bold">
                    {((totalLandArea ?? 0) / 10000).toFixed(2)} ha
                  </p>
                </div>
              </div>
              <Progress value={100} className="bg-primary/10" />
            </div>

            {/* Irrigation Coverage */}
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2">
                  <Droplets className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Irrigated Area
                  </p>
                  <p className="text-2xl font-bold">
                    {((totalIrrigatedArea ?? 0) / 10000).toFixed(2)} ha
                  </p>
                </div>
              </div>
              <Progress value={irrigationPercentage} className="bg-blue-100" />
              <p className="text-xs text-muted-foreground">
                {irrigationPercentage.toFixed(1)}% of total land
              </p>
            </div>

            {/* Crop Diversity */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-2">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crop Types</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{uniqueCrops.length}</p>
                    <p className="text-xs text-muted-foreground">varieties</p>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {uniqueCrops.slice(0, 3).map((crop) => (
                  <span
                    key={crop}
                    className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs text-green-700"
                  >
                    <Sprout className="mr-1 h-3 w-3" />
                    {crop}
                  </span>
                ))}
                {uniqueCrops.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">
                    +{uniqueCrops.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Land Distribution */}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-orange-100 p-2">
                  <Warehouse className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ownership Types
                  </p>
                  <p className="text-2xl font-bold">
                    {Object.keys(landsByOwnership || {}).length}
                  </p>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                {Object.entries(landsByOwnership || {}).map(([type, area]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{type}</span>
                    <span className="font-medium">
                      {(area / 10000).toFixed(2)} ha
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Stats Section */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Irrigation Sources */}
            {irrigationSources && Object.keys(irrigationSources).length > 0 && (
              <Card className="p-4">
                <h4 className="font-medium flex items-center gap-2 mb-4">
                  <Droplets className="h-4 w-4 text-blue-600" />
                  Irrigation Sources
                </h4>
                <div className="space-y-3">
                  {Object.entries(irrigationSources).map(([source, area]) => (
                    <div key={source} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{source}</span>
                        <span className="font-medium">
                          {(area / 10000).toFixed(2)} ha
                        </span>
                      </div>
                      <Progress
                        value={(area / (totalIrrigatedArea ?? 1)) * 100}
                        className="h-2 bg-blue-100 [&>div]:bg-blue-600"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Land Distribution by Ward */}
            <Card className="p-4">
              <h4 className="font-medium flex items-center gap-2 mb-4">
                <LineChart className="h-4 w-4 text-primary" />
                Ward-wise Distribution
              </h4>
              <div className="space-y-3">
                {Object.entries(
                  lands?.reduce(
                    (acc, land) => {
                      const wardNo = land.wardNo ?? 0;
                      acc[wardNo] = (acc[wardNo] || 0) + Number(land.landArea);
                      return acc;
                    },
                    {} as Record<number, number>,
                  ) ?? {},
                ).map(([ward, area]: [string, number]) => (
                  <div key={ward} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Ward {ward}</span>
                      <span className="font-medium">
                        {(area / 10000).toFixed(2)} ha
                      </span>
                    </div>
                    <Progress
                      value={(area / (totalLandArea ?? 1)) * 100}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
