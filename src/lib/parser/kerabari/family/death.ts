import { RawFamily } from "./types";
import { jsonToPostgres } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { decodeSingleChoice } from "@/lib/resources/utils";
import { familyChoices } from "@/lib/resources/family";

export async function parseDeaths(r: RawFamily, ctx: any) {
  for (const i of r.death.dno.death_details) {
    const death = {
      id: i.__id,
      family_id: r.__id,
      ward_no: r.id.ward_no,
      deceased_name: i.death_name,
      deceased_gender: decodeSingleChoice(
        i.death_gender,
        familyChoices.genders,
      ),
      deceased_age: i.death_age,
      deceased_death_cause: decodeSingleChoice(
        i.death_cause,
        familyChoices.death_causes,
      ),
      deceased_fertility_death_condition: decodeSingleChoice(
        i.fertile_death_condition,
        familyChoices.fertile_death_conditions,
      ),
    };

    const deathStatement = jsonToPostgres("staging_Kerabari_death", death);

    if (deathStatement) {
      await ctx.db.execute(sql.raw(deathStatement));
    }
  }
}
