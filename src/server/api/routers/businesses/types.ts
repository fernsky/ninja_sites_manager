import { business } from "@/server/db/schema";
import { businessAnimalProducts } from "@/server/db/schema/business/business-animal-products";
import { businessAnimals } from "@/server/db/schema/business/business-animals";
import { businessCrops } from "@/server/db/schema/business/business-crops";

export type BusinessResult = typeof business.$inferSelect & {
  animals: (typeof businessAnimals.$inferSelect)[];
  animalProducts: (typeof businessAnimalProducts.$inferSelect)[];
  crops: (typeof businessCrops.$inferSelect)[];
};
