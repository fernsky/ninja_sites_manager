import { family } from "@/server/db/schema";
import { KerabariAnimalProduct } from "@/server/db/schema/family/animal-products";
import { KerabariAnimal } from "@/server/db/schema/family/animals";
import { KerabariCrop } from "@/server/db/schema/family/crops";
import KerabariAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { KerabariIndividual } from "@/server/db/schema/family/individual";

export type FamilyResult = typeof family.$inferSelect & {
  agriculturalLands: (typeof KerabariAgriculturalLand.$inferSelect)[];
  animals: (typeof KerabariAnimal.$inferSelect)[];
  animalProducts: (typeof KerabariAnimalProduct.$inferSelect)[];
  crops: (typeof KerabariCrop.$inferSelect)[];
  individuals: (typeof KerabariIndividual.$inferSelect)[];
};
