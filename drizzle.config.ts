import { defineConfig } from "drizzle-kit";
import { DATABASE_PREFIX } from "@/lib/constants";
import { env } from "@/env";

export default defineConfig({
  schema: "./src/server/db/schema/**/*.ts",
  out: "./drizzle",
  dialect: "postgresql",

  dbCredentials: {
    url: env.DATABASE_URL!,
  },
  extensionsFilters: ["postgis"],
  tablesFilter: [`${DATABASE_PREFIX}_*`],
});
