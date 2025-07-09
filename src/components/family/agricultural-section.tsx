import { Card } from "@/components/ui/card";
import { KerabariAgriculturalLand } from "@/server/db/schema/family/agricultural-lands";
import { Grape, Ruler, CircleDollarSign, Droplets } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AgriculturalSectionProps {
  lands?: KerabariAgriculturalLand[] | null;
}

function LandCard({ land }: { land: KerabariAgriculturalLand }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <Grape className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">Ward {land.wardNo}</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="h-4 w-4" />
            <span>Total Area</span>
          </div>
          <span>{land.landArea} hectares</span>
        </div>

        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleDollarSign className="h-4 w-4" />
            <span>Ownership Type</span>
          </div>
          <span>{land.landOwnershipType}</span>
        </div>

        {land.isLandIrrigated === "Yes" && (
          <>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-4 w-4" />
                <span>Irrigated Area</span>
              </div>
              <span>{land.irrigatedLandArea} hectares</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Droplets className="h-4 w-4" />
                <span>Source</span>
              </div>
              <span>{land.irrigationSource}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AgriculturalSection({ lands }: AgriculturalSectionProps) {
  if (!lands || lands.length === 0) return null;

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="lands">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Grape className="h-5 w-5 text-primary" />
              <span>Agricultural Lands</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({lands.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {lands.map((land) => (
                <LandCard key={land.id} land={land} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
