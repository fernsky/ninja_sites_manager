import { RawFamily } from "./types";
import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";

export async function parseAnimals(r: RawFamily, ctx: any) {
  for (const i of r.agri.animal_details) {
    const animal = {
      id: i.__id,
      family_id: r.__id,
      ward_no: r.id.ward_no,
      animal_name: i.animal,
      animal_name_other: null as string | null,
      total_animals: null as number | null,
      animal_sales: null as number | null,
      animal_revenue: null as number | null,
    };

    if ((i.animal && i.animal == "अन्य पशु") || i.animal == "अन्य पन्छी") {
      if (i.anim.animal_oth) animal.animal_name_other = i.anim.animal_oth;
      if (i.anim.oth_total_animals)
        animal.total_animals = i.anim.oth_total_animals;
      if (i.anim.oth_animal_sales)
        animal.animal_sales = i.anim.oth_animal_sales;
      if (i.anim.oth_animal_revenue)
        animal.animal_revenue = i.anim.oth_animal_revenue;
    }

    if (i.animal && i.animal != "अन्य पशु" && i.animal != "अन्य पन्छी") {
      if (i.animn.total_animals) animal.total_animals = i.animn.total_animals;
    }

    const animalStatement = jsonToPostgres(
      "staging_Kerabari_animal",
      animal,
    );

    if (animalStatement) {
      await ctx.db.execute(sql.raw(animalStatement));
    }
  }
}
