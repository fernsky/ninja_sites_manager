import { KerabariAnimal } from "@/server/db/schema/family/animals";
import { Card } from "@/components/ui/card";
import {
  Grape,
  Bird,
  Fish,
  Dog,
  CircleDollarSign,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnimalSectionProps {
  animals?: KerabariAnimal[] | null;
}

const animalIcons: Record<string, any> = {
  cattle: Grape,
  poultry: Bird,
  fish: Fish,
  other: Dog,
};

function AnimalCard({ animal }: { animal: KerabariAnimal }) {
  const IconComponent =
    animalIcons[animal.animalName?.toLowerCase() ?? ""] || Dog;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">{animal.animalName}</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span>Total Count</span>
          </div>
          <span>{animal.totalAnimals}</span>
        </div>

        {Number(animal.animalSales) > 0 && (
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="h-4 w-4" />
              <span>Sales Count</span>
            </div>
            <span>{animal.animalSales}</span>
          </div>
        )}

        {Number(animal.animalRevenue) > 0 && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CircleDollarSign className="h-4 w-4" />
              <span>Revenue</span>
            </div>
            <span className="font-medium text-primary">
              Rs. {animal.animalRevenue}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AnimalSection({ animals }: AnimalSectionProps) {
  if (!animals || animals.length === 0) return null;

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="animals">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Dog className="h-5 w-5 text-primary" />
              <span>Livestock & Animals</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({animals.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {animals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
