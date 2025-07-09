import { RawFamily } from "./types";
import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";

export async function parseAnimalProducts(r: RawFamily, ctx: any) {
  for (const i of r.agri.aprod_details) {
    const animalProduct = {
      id: i.__id,
      family_id: r.__id,
      ward_no: r.id.ward_no,
      animal_product_name: i.aprod,
      animal_product_name_other: i.apo.aprod_oth,
      animal_product_unit: i.apon.aprod_unit,
      animal_product_unit_other: i.apon.aprod_unit_oth,
      animal_product_production: i.apon.aprod_prod,
    };

    const animalProductStatement = jsonToPostgres(
      "staging_Kerabari_animal_product",
      animalProduct,
    );

    if (animalProductStatement) {
      await ctx.db.execute(sql.raw(animalProductStatement));
    }
  }
}
