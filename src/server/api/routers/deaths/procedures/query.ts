import { publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { and, eq, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { KerabariDeath } from "@/server/db/schema/family/deaths";

const deathQuerySchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  sortBy: z.string().default("id"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  filters: z
    .object({
      wardNo: z.number().optional(),
      deceasedName: z.string().optional(),
      deceasedGender: z.string().optional(),
    })
    .optional(),
});

export const getAll = publicProcedure
  .input(deathQuerySchema)
  .query(async ({ ctx, input }) => {
    const { limit, offset, sortBy, sortOrder, filters } = input;

    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];
      if (filters.wardNo) {
        filterConditions.push(eq(KerabariDeath.wardNo, filters.wardNo));
      }
      if (filters.deceasedName) {
        filterConditions.push(
          ilike(KerabariDeath.deceasedName, `%${filters.deceasedName}%`),
        );
      }
      if (filters.deceasedGender) {
        filterConditions.push(
          eq(KerabariDeath.deceasedGender, filters.deceasedGender),
        );
      }
      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const [data, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(KerabariDeath)
        .where(conditions)
        .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(KerabariDeath)
        .where(conditions)
        .then((result) => result[0].count),
    ]);

    return {
      data,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const getById = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const death = await ctx.db
      .select()
      .from(KerabariDeath)
      .where(eq(KerabariDeath.id, input.id))
      .limit(1);

    if (!death[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Death record not found",
      });
    }

    return death[0];
  });

export const getStats = publicProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db
    .select({
      totalDeaths: sql<number>`count(*)`,
      avgAge: sql<number>`avg(${KerabariDeath.deceasedAge})`,
    })
    .from(KerabariDeath);

  return stats[0];
});
