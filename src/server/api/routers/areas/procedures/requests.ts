import { createTRPCRouter, protectedProcedure } from "../../../trpc";
import {
  areaRequests,
  areas,
  enumeratorAssignments,
  users,
} from "@/server/db/schema/basic";
import { eq, and, sql } from "drizzle-orm";
import {
  createAreaRequestSchema,
  updateAreaRequestStatusSchema,
} from "../area.schema";
import * as z from "zod";
import { nanoid } from "nanoid";

export const requestArea = protectedProcedure
  .input(createAreaRequestSchema)
  .mutation(async ({ ctx, input }) => {
    const request = await ctx.db.insert(areaRequests).values({
      areaId: input.areaId,
      userId: ctx.user!.id,
      message: input.message,
    });
    return request;
  });

export const getUserAreaRequests = protectedProcedure.query(async ({ ctx }) => {
  const requests = await ctx.db
    .select()
    .from(areaRequests)
    .where(eq(areaRequests.userId, ctx.user!.id))
    .orderBy(areaRequests.createdAt);
  return requests;
});

export const getAllAreaRequests = protectedProcedure
  .input(
    z.object({
      filters: z
        .object({
          code: z.number().optional(),
          wardNumber: z.number().optional(),
          enumeratorId: z.string().optional(),
          status: z.enum(["pending", "approved", "rejected"]).optional(),
        })
        .optional(),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      sortBy: z
        .enum(["created_at", "status", "ward_number"])
        .default("created_at"),
      sortOrder: z.enum(["asc", "desc"]).default("desc"),
    }),
  )
  .query(async ({ ctx, input }) => {
    const { filters, limit, offset, sortBy, sortOrder } = input;

    let conditions = sql`TRUE`;
    if (filters) {
      const filterConditions = [];
      if (filters.code) {
        filterConditions.push(eq(areas.code, filters.code));
      }
      if (filters.wardNumber) {
        filterConditions.push(eq(areas.wardNumber, filters.wardNumber));
      }
      if (filters.enumeratorId) {
        filterConditions.push(eq(areaRequests.userId, filters.enumeratorId));
      }
      if (filters.status) {
        filterConditions.push(eq(areaRequests.status, filters.status));
      }
      if (filterConditions.length > 0) {
        const andCondition = and(...filterConditions);
        if (andCondition) conditions = andCondition;
      }
    }

    const [requests, totalCount] = await Promise.all([
      ctx.db
        .select({
          request: areaRequests,
          user: {
            name: users.name,
            phoneNumber: users.phoneNumber,
            wardNumber: users.wardNumber,
          },
          area: {
            id: areas.id,
            code: areas.code,
            wardNumber: areas.wardNumber,
            geometry: sql`ST_AsGeoJSON(${areas.geometry})`,
          },
        })
        .from(areaRequests)
        .leftJoin(users, eq(areaRequests.userId, users.id))
        .leftJoin(areas, eq(areaRequests.areaId, areas.id))
        .where(conditions)
        .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(areaRequests)
        .leftJoin(users, eq(areaRequests.userId, users.id))
        .leftJoin(areas, eq(areaRequests.areaId, areas.id))
        .where(conditions)
        .then((result) => result[0].count),
    ]);

    return {
      data: requests,
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
      },
    };
  });

export const updateAreaRequestStatus = protectedProcedure
  .input(updateAreaRequestStatusSchema)
  .mutation(async ({ ctx, input }) => {
    const { areaId, userId, status } = input;

    await ctx.db.transaction(async (tx) => {
      await tx
        .update(areaRequests)
        .set({ status, updatedAt: new Date() })
        .where(
          sql`${areaRequests.areaId} = ${areaId} AND ${areaRequests.userId} = ${userId}`,
        );

      if (status === "approved") {
        await tx
          .update(areas)
          .set({ assignedTo: userId, areaStatus: "newly_assigned" })
          .where(eq(areas.id, areaId));

        // Also add to enumerator assignments
        await tx.insert(enumeratorAssignments).values({
          id: nanoid(),
          areaId,
          assignedTo: userId,
          status: "newly_assigned",
        });

        // Once approved delete all requests for that area
        await tx
          .delete(areaRequests)
          .where(sql`${areaRequests.areaId} = ${areaId}`);

        // Also delete all other requests for the user
        await tx
          .delete(areaRequests)
          .where(sql`${areaRequests.userId} = ${userId}`);
      } else if (status === "rejected") {
        await tx
          .delete(areaRequests)
          .where(
            sql`${areaRequests.areaId} = ${areaId} AND ${areaRequests.userId} = ${userId}`,
          );
      }
    });

    return { success: true };
  });
