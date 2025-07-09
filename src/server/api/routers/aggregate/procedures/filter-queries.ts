import { publicProcedure } from "@/server/api/trpc";
import { sql } from "drizzle-orm";
import { KerabariAggregateBuilding } from "@/server/db/schema/aggregate-building";

export const getDistinctWardNumbers = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      wardNumber: KerabariAggregateBuilding.ward_number,
    })
    .from(KerabariAggregateBuilding)
    .where(sql`${KerabariAggregateBuilding.ward_number} IS NOT NULL`)
    .orderBy(KerabariAggregateBuilding.ward_number);

  return results
    .filter(({ wardNumber }) => wardNumber !== null)
    .map(({ wardNumber }) => ({
      id: wardNumber!.toString(),
      wardNumber: wardNumber!,
    }));
});

export const getDistinctAreaCodes = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      areaCode: KerabariAggregateBuilding.area_code,
    })
    .from(KerabariAggregateBuilding)
    .where(sql`${KerabariAggregateBuilding.area_code} IS NOT NULL`)
    .orderBy(KerabariAggregateBuilding.area_code);

  return results
    .filter(({ areaCode }) => areaCode !== null)
    .map(({ areaCode }) => ({
      id: areaCode!.toString(),
      areaCode: areaCode!,
    }));
});

export const getDistinctEnumerators = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      enumeratorId: KerabariAggregateBuilding.enumerator_id,
      enumeratorName: KerabariAggregateBuilding.enumerator_name,
    })
    .from(KerabariAggregateBuilding)
    .where(sql`${KerabariAggregateBuilding.enumerator_id} IS NOT NULL`)
    .orderBy(KerabariAggregateBuilding.enumerator_name);

  return results
    .filter(({ enumeratorId }) => enumeratorId !== null)
    .map(({ enumeratorId, enumeratorName }) => ({
      id: enumeratorId!,
      name: enumeratorName || "Unknown Enumerator",
    }));
});

export const getDistinctMapStatuses = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      mapStatus: KerabariAggregateBuilding.map_status,
    })
    .from(KerabariAggregateBuilding)
    .where(sql`${KerabariAggregateBuilding.map_status} IS NOT NULL`)
    .orderBy(KerabariAggregateBuilding.map_status);

  return results
    .filter(({ mapStatus }) => mapStatus !== null)
    .map(({ mapStatus }) => ({
      id: mapStatus!,
      name: mapStatus!,
    }));
});

export const getDistinctBuildingOwnerships = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingOwnership: KerabariAggregateBuilding.building_ownership_status,
      })
      .from(KerabariAggregateBuilding)
      .where(
        sql`${KerabariAggregateBuilding.building_ownership_status} IS NOT NULL`,
      )
      .orderBy(KerabariAggregateBuilding.building_ownership_status);

    return results
      .filter(({ buildingOwnership }) => buildingOwnership !== null)
      .map(({ buildingOwnership }) => ({
        id: buildingOwnership!,
        name: buildingOwnership!.replace(/_/g, " "),
      }));
  },
);

export const getDistinctBuildingBases = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingBase: KerabariAggregateBuilding.building_base,
      })
      .from(KerabariAggregateBuilding)
      .where(sql`${KerabariAggregateBuilding.building_base} IS NOT NULL`)
      .orderBy(KerabariAggregateBuilding.building_base);

    return results
      .filter(({ buildingBase }) => buildingBase !== null)
      .map(({ buildingBase }) => ({
        id: buildingBase!,
        name: buildingBase!.replace(/_/g, " "),
      }));
  },
);
