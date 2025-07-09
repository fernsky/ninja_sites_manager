import { Card } from "@/components/ui/card";
import { KerabariCrop } from "@/server/db/schema/family/crops";
import { Sprout, CircleDollarSign, Scale, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CropsSectionProps {
  crops?: KerabariCrop[] | null;
}

function CropCard({ crop }: { crop: KerabariCrop }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <Sprout className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">{crop.cropName}</h3>
      </div>

      <div className="space-y-2 text-sm">
        {crop.cropProduction && Number(crop.cropProduction) > 0 && (
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>Total Production</span>
            </div>
            <span>{crop.cropProduction} kg</span>
          </div>
        )}

        {crop.cropSales && Number(crop.cropSales) > 0 && (
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="h-4 w-4" />
              <span>Sales Amount</span>
            </div>
            <span>{crop.cropSales} kg</span>
          </div>
        )}

        {crop.cropRevenue && Number(crop.cropRevenue) > 0 && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleDollarSign className="h-4 w-4" />
              <span>Revenue</span>
            </div>
            <span className="font-medium text-primary">
              Rs. {crop.cropRevenue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function CropsSection({ crops }: CropsSectionProps) {
  if (!crops || crops.length === 0) return null;

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="crops">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              <span>Agricultural Crops</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({crops.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {crops.map((crop) => (
                <CropCard key={crop.id} crop={crop} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
