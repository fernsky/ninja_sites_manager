import { BusinessAnimal } from "@/server/db/schema/business/business-animals";
import { Card } from "./card";
import {
  Grape,
  Bird,
  Fish,
  Dog,
  CircleDollarSign,
  Scale,
  ArrowUpRight,
  Shell,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnimalDetailsSectionProps {
  animals?: BusinessAnimal[] | null;
}

const animalIcons: Record<string, any> = {
  cattle: Grape,
  poultry: Bird,
  fish: Fish,
  other: Dog,
};

const getAnimalTypeLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case "cattle":
      return "Cattle & Livestock";
    case "poultry":
      return "Poultry Birds";
    case "fish":
      return "Fish & Aquatic";
    default:
      return "Animals";
  }
};

function AnimalCard({ animal }: { animal: BusinessAnimal }) {
  const IconComponent =
    animalIcons[animal.animalType?.toLowerCase() ?? ""] || Dog;
  const hasMetrics =
    (animal.totalCount && Number(animal.totalCount) > 0) ||
    (animal.salesCount && Number(animal.salesCount) > 0) ||
    (animal.revenue && Number(animal.revenue) > 0);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">{animal.animalName}</h3>
      </div>

      {hasMetrics && (
        <div className="space-y-2 text-sm">
          {animal.totalCount && Number(animal.totalCount) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-4 w-4" />
                <span>Total Count</span>
              </div>
              <span>{animal.totalCount.toString()}</span>
            </div>
          )}

          {animal.salesCount && Number(animal.salesCount) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowUpRight className="h-4 w-4" />
                <span>Sales Count</span>
              </div>
              <span>{animal.salesCount.toString()}</span>
            </div>
          )}

          {animal.revenue && Number(animal.revenue) > 0 && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CircleDollarSign className="h-4 w-4" />
                <span>Revenue</span>
              </div>
              <span className="font-medium text-primary">
                Rs. {animal.revenue.toString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AnimalDetailsSection({ animals }: AnimalDetailsSectionProps) {
  if (!animals || animals.length === 0) return null;

  // Filter out animals with zero values
  const nonZeroAnimals = animals.filter(
    (animal) =>
      (animal.totalCount && Number(animal.totalCount) > 0) ||
      (animal.salesCount && Number(animal.salesCount) > 0) ||
      (animal.revenue && Number(animal.revenue) > 0),
  );

  if (nonZeroAnimals.length === 0) return null;

  const groupedAnimals = nonZeroAnimals.reduce(
    (acc, animal) => {
      const type = animal.animalType?.toLowerCase() ?? "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(animal);
      return acc;
    },
    {} as Record<string, BusinessAnimal[]>,
  );

  return (
    <Card title="Livestock Information" icon={Shell}>
      <Accordion type="multiple" className="w-full">
        {Object.entries(groupedAnimals).map(([type, animals]) => {
          const IconComponent = animalIcons[type] || Dog;
          return (
            <AccordionItem value={type} key={type}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  <span>{getAnimalTypeLabel(type)}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({animals.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {animals.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
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
