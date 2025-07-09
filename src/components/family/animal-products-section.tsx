import { KerabariAnimalProduct } from "@/server/db/schema/family/animal-products";
import { Card } from "@/components/ui/card";
import {
  CircleDollarSign,
  Bird,
  MilkOff,
  EggFried,
  Scale,
  ArrowUpRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnimalProductsSectionProps {
  products?: KerabariAnimalProduct[] | null;
}

const productIcons: Record<string, any> = {
  milk: MilkOff,
  egg: EggFried,
  other: Bird,
};

function ProductCard({ product }: { product: KerabariAnimalProduct }) {
  const IconComponent =
    productIcons[product.animalProductName?.toLowerCase() ?? ""] || Bird;

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">{product.animalProductName}</h3>
      </div>

      <div className="space-y-2 text-sm"></div>
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Scale className="h-4 w-4" />
          <span>Production</span>
        </div>
        <span>
          {product.animalProductProduction} {product.animalProductUnit}
        </span>
      </div>

      {Number(product.animalProductSales) > 0 && (
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowUpRight className="h-4 w-4" />
            <span>Sales</span>
          </div>
          <span>
            {product.animalProductSales} {product.animalProductUnit}
          </span>
        </div>
      )}

      {Number(product.animalProductRevenue) > 0 && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleDollarSign className="h-4 w-4" />
            <span>Revenue</span>
          </div>
          <span className="font-medium text-primary">
            Rs. {product.animalProductRevenue}
          </span>
        </div>
      )}
    </div>
  );
}

export function AnimalProductsSection({
  products,
}: AnimalProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="products">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <EggFried className="h-5 w-5 text-primary" />
              <span>Animal Products</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({products.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
