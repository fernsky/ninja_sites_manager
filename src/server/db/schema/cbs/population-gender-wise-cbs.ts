import {
pgTable,
    varchar,
    integer,
  } from "drizzle-orm/pg-core";
  
  export const populationGenderWiseCBS = pgTable(
    "population_gender_wise_cbs",
    {
      id: varchar("id", { length: 48 }).primaryKey().notNull(),
      wardNo: integer("ward_no"),
      totalPopulation: integer("total_population"),
      totalMale: integer("total_male"),
      totalFemale: integer("total_female")
    }
)