import { createTRPCRouter, protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { areas, users, pointRequests, areaWithStatus } from "@/server/db/schema/basic";
import { and, cosineDistance, eq, sql } from "drizzle-orm";
import {
  Area,
  areaQuerySchema,
  createAreaSchema,
  createPointRequestSchema,
  updateAreaSchema,
  areaWithStatusSchema,
} from "../area.schema";
import { nanoid } from "nanoid";
import { BuildingToken, buildingTokens } from "@/server/db/schema/building";

export const createArea = protectedProcedure
  .input(createAreaSchema)
  .mutation(async ({ ctx, input }) => {
    const geoJson = JSON.stringify(input.geometry.geometry);
    console.log(geoJson);
    try {
      JSON.parse(geoJson);
    } catch (error) {
      throw new Error("Invalid GeoJSON representation");
    }
    const id = nanoid();
    const newArea = await ctx.db.insert(areas).values({
      id,
      ...input,
      geometry: sql`ST_GeomFromGeoJSON(${geoJson})`,
    });
    // Create 200 tokens for the newly created area
    const tokens = Array.from({ length: 200 }, (_, index) => ({
      token: `0${input.wardNumber}L${input.code}G${(index + 1).toString().padStart(3, '0')}`,
      areaId: id as string,
      status: "unallocated",
    })) as BuildingToken[];

    await ctx.db.insert(buildingTokens).values(tokens);
    return newArea;
  });
  
export const getAreas = protectedProcedure
  .input(areaQuerySchema)
  .query(async ({ ctx, input }) => {
    let conditions = sql`TRUE`;
    const filterConditions = [];

    if (input.wardNumber) {
      filterConditions.push(eq(areas.wardNumber, input.wardNumber));
    }
    if (input.code) {
      filterConditions.push(eq(areas.code, input.code));
    }
    if (input.status && input.status !== "all") {
      filterConditions.push(eq(areas.areaStatus, input.status));
    }
    if (input.assignedTo) {
      filterConditions.push(eq(areas.assignedTo, input.assignedTo));
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }
    const allAreas = await ctx.db
      .select({
        area: {
          id: areas.id,
          code: areas.code,
          wardNumber: areas.wardNumber,
          assignedTo: areas.assignedTo,
          areaStatus: areas.areaStatus,
          geometry: sql`ST_AsGeoJSON(${areas.geometry})`,
          centroid: sql`ST_AsGeoJSON(ST_Centroid(${areas.geometry}))`,
        },
        user: {
          name: users.name,
        },
      })
      .from(areas)
      .leftJoin(users, eq(areas.assignedTo, users.id))
      .where(conditions)
      .orderBy(areas.code);

    return allAreas.map((result) => {
      try {
        return {
          ...result.area,
          assignedTo: result.user
            ? { id: result.area.assignedTo, name: result.user.name }
            : null,
          geometry: result.area.geometry
            ? JSON.parse(result.area.geometry as string)
            : null,
          centroid: result.area.centroid
            ? JSON.parse(result.area.centroid as string)
            : null,
        };
      } catch (e) {
        console.error(`Error parsing geometry for area ${result.area.id}:`, e);
        return {
          ...result.area,
          assignedTo: null,
          geometry: null,
          centroid: null,
        };
      }
    });
  });

export const getAreaById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const area = await ctx.db.execute(
      sql`SELECT ${areas.id} as "id", 
          ${areas.code} as "code", 
          ${areas.wardNumber} as "wardNumber", 
          ST_AsGeoJSON(${areas.geometry}) as "geometry"
          FROM ${areas} WHERE ${areas.id} = ${input.id} LIMIT 1`,
    );
    return {
      ...area[0],
      geometry: area[0].geometry
        ? JSON.parse(area[0].geometry as string)
        : null,
    } as Area;
  });

export const updateArea = protectedProcedure
  .input(updateAreaSchema)
  .mutation(async ({ ctx, input }) => {
    if (input.geometry.geometry) {
      const geoJson = JSON.stringify(input.geometry.geometry);
      try {
        JSON.parse(geoJson);
      } catch (error) {
        throw new Error("Invalid GeoJSON representation");
      }

      const updatedArea = await ctx.db
        .update(areas)
        .set({
          wardNumber: input.wardNumber,
          geometry: sql`ST_GeomFromGeoJSON(${geoJson})`,
        })
        .where(eq(areas.id, input.id));
      return { success: true };
    }

    const { geometry, ...payload } = input;
    console.log(payload);
    const updatedArea = await ctx.db
      .update(areas)
      .set({
        wardNumber: payload.wardNumber,
        code: payload.code,
      })
      .where(eq(areas.id, input.id));
    return { success: true };
  });

export const getAvailableAreaCodes = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const startCode = input.wardNumber * 1000 + 1;
    const endCode = input.wardNumber * 1000 + 999;

    // Get all used codes for this ward
    const usedCodes = await ctx.db
      .select({ code: areas.code })
      .from(areas)
      .where(eq(areas.wardNumber, input.wardNumber));

    const usedCodesSet = new Set(usedCodes.map((a) => a.code));

    // Generate available codes
    const availableCodes = Array.from(
      { length: endCode - startCode + 1 },
      (_, i) => startCode + i,
    ).filter((code) => !usedCodesSet.has(code));

    return availableCodes;
  });

export const getLayerAreas = protectedProcedure.query(async ({ ctx }) => {
  const allAreas = await ctx.db.execute(
    sql`SELECT 
        ${areas.id} as "id",
        ${areas.code} as "code",
        ${areas.wardNumber} as "wardNumber",
        ${areas.assignedTo} as "assignedTo",
        ST_AsGeoJSON(${areas.geometry}) as "geometry",
        ST_AsGeoJSON(ST_Centroid(${areas.geometry})) as "centroid"
      FROM ${areas}
      ORDER BY ${areas.code}`,
  );

  return allAreas.map((area) => {
    try {
      return {
        ...area,
        geometry: area.geometry ? JSON.parse(area.geometry as string) : null,
        centroid: area.centroid ? JSON.parse(area.centroid as string) : null,
      };
    } catch (e) {
      console.error(`Error parsing geometry for area ${area.id}:`, e);
      return {
        ...area,
        geometry: null,
        centroid: null,
      };
    }
  }) as Area[];
});

export const getAreaBoundaryByCode = protectedProcedure
  .input(z.object({ code: z.number() }))
  .query(async ({ ctx, input }) => {
    const area = await ctx.db.execute(
      sql`SELECT 
          ${areas.id} as "id",
          ${areas.code} as "code",
          ${areas.wardNumber} as "wardNumber",
          ST_AsGeoJSON(${areas.geometry}) as "boundary"
          FROM ${areas} 
          WHERE ${areas.code} = ${input.code} 
          LIMIT 1`
    );

    if (!area[0]) {
      throw new Error("Area not found");
    }

    return {
      ...area[0],
      boundary: area[0].boundary ? JSON.parse(area[0].boundary as string) : null,
    };
  });

export const getAreaBoundariesByCodes = protectedProcedure
  .input(z.object({ codes: z.array(z.number()) }))
  .query(async ({ ctx, input }) => {
    if (!input.codes.length) return [];

    const boundaries = await Promise.all(
      input.codes.map(async (code) => {
        const areaResult = await ctx.db.execute(
          sql`SELECT 
              ${areas.id} as "id",
              ${areas.code} as "code",
              ${areas.wardNumber} as "wardNumber",
              ST_AsGeoJSON(${areas.geometry}) as "boundary"
              FROM ${areas} 
              WHERE ${areas.code} = ${code}
              LIMIT 1`
        );

        if (!areaResult[0]) return null;

        return {
          id: areaResult[0].id,
          code: areaResult[0].code,
          wardNumber: areaResult[0].wardNumber,
          boundary: areaResult[0].boundary ? JSON.parse(areaResult[0].boundary as string) : null
        };
      })
    );

    return boundaries.filter((b): b is NonNullable<typeof b> => b !== null);
  });

export const getAreasWithSubmissionCounts = protectedProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = sql`
      SELECT 
        a.id,
        a.code,
        COUNT(b.id) as "submissionCount"
      FROM ${areas} a
      LEFT JOIN ${buildingTokens} b ON a.id = b.area_id
      WHERE b.status = 'submitted'
      ${input.wardNumber ? sql`AND a.ward_number = ${input.wardNumber}` : sql``}
      GROUP BY a.id, a.code
      ORDER BY a.code
    `;

    const result = await ctx.db.execute(query);
    return result;
  });

export const getAreaCodesByUserId = protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const assignedAreas = await ctx.db
      .select({
        code: areas.code
      })
      .from(areas)
      .where(eq(areas.assignedTo, input.userId))
      .orderBy(areas.code);

    return assignedAreas.map(area => area.code);
  });

export const createPointRequest = protectedProcedure
  .input(createPointRequestSchema)
  .mutation(async ({ ctx, input }) => {
    // Create a Point geometry from coordinates
    const point = {
      type: "Point",
      coordinates: [input.coordinates.lng, input.coordinates.lat] // GeoJSON uses [longitude, latitude]
    };

    const pointGeojson = JSON.stringify(point);

    try {
      const newRequest = await ctx.db.insert(pointRequests).values({
        id: nanoid(),
        wardNumber: input.wardNumber,
        enumeratorId: ctx.user!.id,
        coordinates: sql`ST_GeomFromGeoJSON(${pointGeojson})`,
        message: input.message,
        status: 'pending',
      }).returning({ id: pointRequests.id });

      return { success: true, id: newRequest[0].id };
    } catch (error) {
      throw new Error("Failed to create point request");
    }
  });

export const getPointRequestsByWard = protectedProcedure
  .input(z.object({ wardNumber: z.number() }))
  .query(async ({ ctx, input }) => {
    const requests = await ctx.db.execute(
      sql`SELECT 
          p.id,
          p.ward_number as "wardNumber",
          p.enumerator_id as "enumeratorId",
          u.name as "enumeratorName",
          ST_AsGeoJSON(p.coordinates) as coordinates,
          p.message,
          p.status,
          p.created_at as "createdAt"
        FROM ${pointRequests} p
        LEFT JOIN ${users} u ON p.enumerator_id = u.id
        WHERE p.ward_number = ${input.wardNumber}
        ORDER BY p.created_at DESC`
    );

    return requests.map(request => ({
      ...request,
      coordinates: request.coordinates && typeof request.coordinates === 'string' ? JSON.parse(request.coordinates) : null
    }));
  });

export const getAreasByEnumeratorName = protectedProcedure
  .input(z.object({ 
    enumeratorName: z.string(),
    wardNumber: z.number().optional() 
  }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        id: areaWithStatus.id,
        code: areaWithStatus.code,
        wardNumber: areaWithStatus.wardNumber,
        areaStatus: areaWithStatus.areaStatus,
        assignedTo: areaWithStatus.assignedTo,
        assignedToName: areaWithStatus.assigned_to_name,
        completedBy: areaWithStatus.completedBy,
        completedByName: areaWithStatus.completed_by_name,
      })
      .from(areaWithStatus)
      .where(
        input.wardNumber
          ? and(
              eq(areaWithStatus.assigned_to_name, input.enumeratorName),
              eq(areaWithStatus.wardNumber, input.wardNumber)
            )
          : eq(areaWithStatus.assigned_to_name, input.enumeratorName)
      )
      .orderBy(areaWithStatus.code);
    
    const result = await query;
    
    return result;
  });

export const getAreasSummaryByEnumerator = protectedProcedure
  .query(async ({ ctx }) => {
    const query = ctx.db
      .select({
        enumeratorName: areaWithStatus.assigned_to_name,
        totalAreas: sql<number>`COUNT(*)::int`,
        completed: sql<number>`SUM(CASE WHEN ${areaWithStatus.areaStatus} = 'completed' THEN 1 ELSE 0 END)::int`,
        ongoingSurvey: sql<number>`SUM(CASE WHEN ${areaWithStatus.areaStatus} = 'ongoing_survey' THEN 1 ELSE 0 END)::int`,
        revision: sql<number>`SUM(CASE WHEN ${areaWithStatus.areaStatus} = 'revision' THEN 1 ELSE 0 END)::int`,
        askedForCompletion: sql<number>`SUM(CASE WHEN ${areaWithStatus.areaStatus} = 'asked_for_completion' THEN 1 ELSE 0 END)::int`,
        newlyAssigned: sql<number>`SUM(CASE WHEN ${areaWithStatus.areaStatus} = 'newly_assigned' THEN 1 ELSE 0 END)::int`,
      })
      .from(areaWithStatus)
      .where(sql`${areaWithStatus.assigned_to_name} IS NOT NULL`)
      .groupBy(areaWithStatus.assigned_to_name)
      .orderBy(areaWithStatus.assigned_to_name);
    
    return await query;
  });

export const getAllAreasWithStatus = protectedProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select()
      .from(areaWithStatus)
      .orderBy(areaWithStatus.code);
    
    if (input.wardNumber) {
      query.where(eq(areaWithStatus.wardNumber, input.wardNumber));
    }
    
    return await query;
  });



export const getAreaCodesByEnumeratorId = protectedProcedure
  .input(z.object({ enumeratorId: z.string() }))
  .query(async ({ ctx, input }) => {
    const assignedAreas = await ctx.db
      .select({
        code: areas.code
      })
      .from(areas)
      .where(eq(areas.assignedTo, input.enumeratorId))
      .orderBy(areas.code);

    // Return "Not Assigned" if no areas are found
    if (assignedAreas.length === 0) {
      return ["Not Assigned"];
    }

    // Return array of area codes
    return assignedAreas.map(area => area.code);
  });