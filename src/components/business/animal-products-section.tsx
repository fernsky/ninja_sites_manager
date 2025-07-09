import { BusinessAnimalProduct } from "@/server/db/schema/business/business-animal-products";
import { Card } from "./card";
import {
  Milk,
  Egg,
  Beef,
  CircleDollarSign,
  Scale,
  ArrowUpRight,
  Clock,
  Container,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnimalProductsSectionProps {
  products?: BusinessAnimalProduct[] | null;
}

const productIcons: Record<string, any> = {
  milk: Milk,
  egg: Egg,
  meat: Beef,
};

const getProductTypeLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case "milk":
      return "Dairy Products";
    case "egg":
      return "Poultry Products";
    case "meat":
      return "Meat Products";
    default:
      return "Products";
  }
};

function ProductCard({ product }: { product: BusinessAnimalProduct }) {
  const IconComponent =
    productIcons[product.animalProduct?.toLowerCase() ?? ""] || Container;
  const hasMetrics =
    (product.productionAmount && Number(product.productionAmount) > 0) ||
    (product.salesAmount && Number(product.salesAmount) > 0) ||
    (product.monthlyProduction && Number(product.monthlyProduction) > 0) ||
    (product.revenue && Number(product.revenue) > 0);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <IconComponent className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-medium">{product.productName}</h3>
      </div>

      {hasMetrics && (
        <div className="space-y-2 text-sm">
          {product.productionAmount && Number(product.productionAmount) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-4 w-4" />
                <span>Production</span>
              </div>
              <span>
                {product.productionAmount.toString()} {product.unit}
              </span>
            </div>
          )}

          {product.monthlyProduction &&
            Number(product.monthlyProduction) > 0 && (
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Production Months per Year</span>
                </div>
                <span>{product.monthlyProduction.toString()} Months</span>
              </div>
            )}

          {product.salesAmount && Number(product.salesAmount) > 0 && (
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowUpRight className="h-4 w-4" />
                <span>Sales</span>
              </div>
              <span>
                {product.salesAmount.toString()} {product.unit}
              </span>
            </div>
          )}

          {product.revenue && Number(product.revenue) > 0 && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CircleDollarSign className="h-4 w-4" />
                <span>Revenue</span>
              </div>
              <span className="font-medium text-primary">
                Rs. {product.revenue.toString()}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AnimalProductsSection({
  products,
}: AnimalProductsSectionProps) {
  if (!products || products.length === 0) return null;

  // Filter out products with zero values
  const nonZeroProducts = products.filter(
    (product) =>
      (product.productionAmount && Number(product.productionAmount) > 0) ||
      (product.salesAmount && Number(product.salesAmount) > 0) ||
      (product.monthlyProduction && Number(product.monthlyProduction) > 0) ||
      (product.revenue && Number(product.revenue) > 0),
  );

  if (nonZeroProducts.length === 0) return null;

  const groupedProducts = nonZeroProducts.reduce(
    (acc, product) => {
      const type = product.animalProduct?.toLowerCase() ?? "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    },
    {} as Record<string, BusinessAnimalProduct[]>,
  );

  return (
    <Card title="Animal Products" icon={Container}>
      <Accordion type="multiple" className="w-full">
        {Object.entries(groupedProducts).map(([type, products]) => {
          const IconComponent = productIcons[type] || Container;
          return (
            <AccordionItem value={type} key={type}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  <span>{getProductTypeLabel(type)}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({products.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
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
