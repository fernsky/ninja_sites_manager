import { RawFamily } from "./types";
import { parseFamilyBase } from "./base";
import { parseIndividuals } from "./individual";
import { parseAgriculturalLand } from "./land";
import { parseCrops } from "./crops";
import { parseAnimals } from "./animals";
import { parseAnimalProducts } from "./animal-products";
import { parseDeaths } from "./death";

export async function parseAndInsertInStaging(r: RawFamily, ctx: any) {
  try {
    console.log("Parsing and inserting family data into staging database");
    await parseFamilyBase(r, ctx);

    if (r.individual?.length > 0) {
      await parseIndividuals(r, ctx);
    }

    if (r.agri?.agricultural_land?.length > 0) {
      await parseAgriculturalLand(r, ctx);
    }

    if (r.agri?.food) {
      await parseCrops(r, ctx);
    }

    if (r.agri?.animal_details?.length > 0) {
      await parseAnimals(r, ctx);
    }

    if (r.agri?.aprod_details?.length > 0) {
      await parseAnimalProducts(r, ctx);
    }

    if (r.death?.dno?.death_details?.length > 0) {
      await parseDeaths(r, ctx);
    }
  } catch (error) {
    console.error("Fatal error in parseAndInsertInStaging:", error);
    throw new Error(`Fatal error in family data processing: ${error}`);
  }
}
