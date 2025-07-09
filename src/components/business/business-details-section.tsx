import { BusinessAnimalProduct } from "@/server/db/schema/business/business-animal-products";
import { BusinessAnimal } from "@/server/db/schema/business/business-animals";
import { BusinessCrop } from "@/server/db/schema/business/business-crops";
import { CropDetailsSection } from "./crop-details-section";
import { AnimalDetailsSection } from "./animal-details-section";
import { AnimalProductsSection } from "./animal-products-section";

interface BusinessDetailsProps {
  animals?: BusinessAnimal[] | null;
  animalProducts?: BusinessAnimalProduct[] | null;
  crops?: BusinessCrop[] | null;
}

export function BusinessDetailsSection({
  animals,
  animalProducts,
  crops,
}: BusinessDetailsProps) {
  return (
    <div className="space-y-6">
      {crops && crops.length > 0 && <CropDetailsSection crops={crops} />}
      {animals && animals.length > 0 && (
        <AnimalDetailsSection animals={animals} />
      )}
      {animalProducts && animalProducts.length > 0 && (
        <AnimalProductsSection products={animalProducts} />
      )}
    </div>
  );
}
