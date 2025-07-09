import { BusinessCrop } from "@/server/db/schema/business/business-crops";
import { Card } from "./card";
import {
  Wheat,
  Sprout,
  Trees,
  Carrot,
  Apple,
  Coffee,
  Grape,
  CircleDollarSign,
  Scale,
  ArrowUpRight,
  LayoutGrid,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CropDetailsSectionProps {
  crops?: BusinessCrop[] | null;
}

const cropIcons: Record<string, any> = {
  fcrop: Wheat,
  pulse: Sprout,
  oseed: Trees,
  vtable: Carrot,
  fruit: Apple,
  spice: Coffee,
  ccrop: Grape,
};

const getCropTypeLabel = (type: string): string => {
  console.log(type);
  switch (type.toLowerCase()) {
    case "अन्नबाली":
      return "Food Crops";
    case "दलहन":
      return "Pulses";
    case "तेलहन":
      return "Oil Seeds";
    case "फलफूल":
      return "Vegetables";
    case "मसला":
      return "Fruits";
    case "मसला":
      return "Spices";
    case "नगदेबाली":
      return "Cash Crops";
    default:
      return "Other Crops";
  }
};

function CropCard({ crop }: { crop: BusinessCrop }) {
  const IconComponent = cropIcons[crop.cropType?.toLowerCase() ?? ""] || Wheat;
  const hasMetrics =
    (crop.cropArea && Number(crop.cropArea) > 0) ||
    (crop.cropProduction && Number(crop.cropProduction) > 0) ||
    (crop.cropSales && Number(crop.cropSales) > 0) ||
    (crop.cropRevenue && Number(crop.cropRevenue) > 0);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">{crop.cropName}</h3>
      </div>

      {hasMetrics && (
        <div className="space-y-2 text-sm">
          {crop.cropArea && Number(crop.cropArea) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <LayoutGrid className="h-4 w-4" />
                <span>Area</span>
              </div>
              <span>{crop.cropArea.toString()} sq.m</span>
            </div>
          )}

          {crop.cropProduction && Number(crop.cropProduction) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-4 w-4" />
                <span>Production</span>
              </div>
              <span>{crop.cropProduction.toString()} kg</span>
            </div>
          )}

          {crop.cropSales && Number(crop.cropSales) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowUpRight className="h-4 w-4" />
                <span>Sales</span>
              </div>
              <span>{crop.cropSales.toString()} kg</span>
            </div>
          )}

          {crop.cropRevenue && Number(crop.cropRevenue) > 0 && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CircleDollarSign className="h-4 w-4" />
                <span>Revenue</span>
              </div>
              <span className="font-medium text-primary">
                Rs. {crop.cropRevenue.toString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function CropDetailsSection({ crops }: CropDetailsSectionProps) {
  if (!crops || crops.length === 0) return null;

  const groupedCrops = crops.reduce(
    (acc, crop) => {
      const type = crop.cropType?.toLowerCase() ?? "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(crop);
      return acc;
    },
    {} as Record<string, BusinessCrop[]>,
  );

  return (
    <Card title="Agricultural Information" icon={Wheat}>
      <Accordion type="multiple" className="w-full">
        {Object.entries(groupedCrops).map(([type, crops], index) => {
          const IconComponent = cropIcons[type] || Wheat;
          return (
            <AccordionItem value={type} key={type}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  <span>{getCropTypeLabel(type)}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({crops.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {crops.map((crop) => (
                    <CropCard key={crop.id} crop={crop} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}
