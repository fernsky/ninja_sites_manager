import { protectedProcedure } from "../../../trpc";
import { z } from "zod";
import { sites } from "@/server/db/schema/sites-manager/sites";
import { issues } from "@/server/db/schema/sites-manager/issues";
import { solutions } from "@/server/db/schema/sites-manager/solutions";
import { and, eq, or, like, inArray, desc, asc, sql, gte, lte, isNull, isNotNull } from "drizzle-orm";
import {
  siteQuerySchema,
  issueQuerySchema,
  solutionQuerySchema,
  siteStatisticsSchema,
  issueStatisticsSchema,
  Site,
  Issue,
  Solution,
  SiteWithIssues,
  IssueWithSite,
  SiteStatistics,
  IssueStatistics,
} from "../manager.schema";
import { TRPCError } from "@trpc/server";

// Site Queries
export const getSites = protectedProcedure
  .input(siteQuerySchema.extend({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
    sortBy: z.enum([
      "nameOfAgency",
      "province",
      "district",
      "createdAt",
      "updatedAt",
      "hasIssues",
      "hasTakenManualBackup"
    ]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }))
  .query(async ({ ctx, input }) => {
    const {
      province,
      district,
      hasIssues,
      isCpanel,
      isVm,
      hasTakenManualBackup,
      backupLocation,
      search,
      limit,
      offset,
      sortBy,
      sortOrder,
    } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    // Basic filters
    if (province) {
      filterConditions.push(eq(sites.province, province));
    }
    if (district) {
      filterConditions.push(eq(sites.district, district));
    }
    if (hasIssues !== undefined) {
      filterConditions.push(eq(sites.hasIssues, hasIssues));
    }
    if (isCpanel !== undefined) {
      filterConditions.push(eq(sites.isCpanel, isCpanel));
    }
    if (isVm !== undefined) {
      filterConditions.push(eq(sites.isVm, isVm));
    }
    if (hasTakenManualBackup !== undefined) {
      filterConditions.push(eq(sites.hasTakenManualBackup, hasTakenManualBackup));
    }
    if (backupLocation) {
      filterConditions.push(eq(sites.backupLocation, backupLocation));
    }

    // Search functionality
    if (search) {
      const searchCondition = or(
        like(sites.nameOfAgency, `%${search}%`),
        like(sites.url, `%${search}%`),
        like(sites.province, `%${search}%`),
        like(sites.district, `%${search}%`),
        like(sites.cpanelUsername || "", `%${search}%`),
        like(sites.vmIp || "", `%${search}%`)
      );
      filterConditions.push(searchCondition);
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    // Map camelCase sort fields to snake_case column names
    const getSortColumn = (sortBy: string) => {
      switch (sortBy) {
        case "nameOfAgency":
          return sites.nameOfAgency;
        case "province":
          return sites.province;
        case "district":
          return sites.district;
        case "createdAt":
          return sites.createdAt;
        case "updatedAt":
          return sites.updatedAt;
        case "hasIssues":
          return sites.hasIssues;
        case "hasTakenManualBackup":
          return sites.hasTakenManualBackup;
        default:
          return sites.createdAt;
      }
    };

    const [sitesData, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(sites)
        .where(conditions)
        .orderBy(sortOrder === "desc" ? desc(getSortColumn(sortBy)) : asc(getSortColumn(sortBy)))
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(sites)
        .where(conditions)
        .then((result) => result[0].count),
    ]);

    return {
      data: sitesData as Site[],
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  });

export const getSiteById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const site = await ctx.db
      .select()
      .from(sites)
      .where(eq(sites.id, input.id))
      .limit(1);

    if (!site[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Site not found",
      });
    }

    return site[0] as Site;
  });

export const getSiteWithIssuesById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const site = await ctx.db
      .select()
      .from(sites)
      .where(eq(sites.id, input.id))
      .limit(1);

    if (!site[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Site not found",
      });
    }

    // Get issues for this site
    const siteIssues = await ctx.db
      .select()
      .from(issues)
      .where(eq(issues.siteId, input.id))
      .orderBy(desc(issues.createdAt));

    return {
      ...site[0],
      issues: siteIssues,
    } as Site & { issues: Issue[] };
  });

export const getSitesWithIssues = protectedProcedure
  .input(siteQuerySchema.extend({
    includeSolved: z.boolean().default(false),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
  }))
  .query(async ({ ctx, input }) => {
    const {
      province,
      district,
      hasIssues,
      isCpanel,
      isVm,
      hasTakenManualBackup,
      backupLocation,
      includeSolved,
      limit,
      offset,
    } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    // Basic filters
    if (province) {
      filterConditions.push(eq(sites.province, province));
    }
    if (district) {
      filterConditions.push(eq(sites.district, district));
    }
    if (hasIssues !== undefined) {
      filterConditions.push(eq(sites.hasIssues, hasIssues));
    }
    if (isCpanel !== undefined) {
      filterConditions.push(eq(sites.isCpanel, isCpanel));
    }
    if (isVm !== undefined) {
      filterConditions.push(eq(sites.isVm, isVm));
    }
    if (hasTakenManualBackup !== undefined) {
      filterConditions.push(eq(sites.hasTakenManualBackup, hasTakenManualBackup));
    }
    if (backupLocation) {
      filterConditions.push(eq(sites.backupLocation, backupLocation));
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    const sitesWithIssues = await ctx.db.execute(sql`
      SELECT 
        s.*,
        COUNT(i.id) as "issueCount",
        COUNT(CASE WHEN i.is_solved = true THEN 1 END) as "solvedIssueCount",
        COUNT(CASE WHEN i.priority = 'critical' THEN 1 END) as "criticalIssueCount"
      FROM ${sites} s
      LEFT JOIN ${issues} i ON s.id = i.site_id ${includeSolved ? sql`` : sql`AND i.is_solved = false`}
      WHERE ${conditions}
      GROUP BY s.id, s.name_of_agency, s.url, s.is_cpanel, s.cpanel_username, s.cpanel_password, 
               s.is_vm, s.vpn_username, s.vpn_password, s.vm_ip, s.vm_username, s.vm_password,
               s.province, s.district, s.has_taken_manual_backup, s.last_manual_backup_date,
               s.last_database_backup_date, s.backup_location, s.has_issues, s.created_at, s.updated_at
      ORDER BY s.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `);

    return sitesWithIssues as unknown as SiteWithIssues[];
  });

// Issue Queries
export const getIssues = protectedProcedure
  .input(issueQuerySchema.extend({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
    sortBy: z.enum([
      "createdAt",
      "updatedAt",
      "priority",
      "isSolved"
    ]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    dateRange: z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const {
      siteId,
      issueTypes,
      priority,
      isSolved,
      search,
      limit,
      offset,
      sortBy,
      sortOrder,
      dateRange,
    } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    // Basic filters
    if (siteId) {
      filterConditions.push(eq(issues.siteId, siteId));
    }
    if (issueTypes && issueTypes.length > 0) {
      filterConditions.push(sql`${issues.issueTypes} && ${issueTypes}`);
    }
    if (priority) {
      filterConditions.push(eq(issues.priority, priority));
    }
    if (isSolved !== undefined) {
      filterConditions.push(eq(issues.isSolved, isSolved));
    }

    // Date range filter
    if (dateRange?.startDate) {
      filterConditions.push(gte(issues.createdAt, dateRange.startDate));
    }
    if (dateRange?.endDate) {
      filterConditions.push(lte(issues.createdAt, dateRange.endDate));
    }

    // Search functionality
    if (search) {
      const searchCondition = like(issues.description, `%${search}%`);
      filterConditions.push(searchCondition);
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    const [issuesData, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(issues)
        .where(conditions)
        .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(issues)
        .where(conditions)
        .then((result) => result[0].count),
    ]);

    return {
      data: issuesData as Issue[],
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  });

export const getIssueById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const issue = await ctx.db
      .select()
      .from(issues)
      .where(eq(issues.id, input.id))
      .limit(1);

    if (!issue[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Issue not found",
      });
    }

    return issue[0] as Issue;
  });

export const getIssuesWithSite = protectedProcedure
  .input(issueQuerySchema.extend({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
    includeSolutions: z.boolean().default(false),
    dateRange: z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional(),
    sortBy: z.enum([
      "createdAt",
      "updatedAt", 
      "priority",
      "isSolved"
    ]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  }))
  .query(async ({ ctx, input }) => {
    const {
      siteId,
      issueTypes,
      priority,
      isSolved,
      search,
      limit,
      offset,
      includeSolutions,
      dateRange,
      sortBy,
      sortOrder,
    } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    // Basic filters
    if (siteId) {
      filterConditions.push(eq(issues.siteId, siteId));
    }
    if (issueTypes && issueTypes.length > 0) {
      filterConditions.push(sql`${issues.issueTypes} && ${issueTypes}`);
    }
    if (priority) {
      filterConditions.push(eq(issues.priority, priority));
    }
    if (isSolved !== undefined) {
      filterConditions.push(eq(issues.isSolved, isSolved));
    }

    // Date range filter
    if (dateRange?.startDate) {
      filterConditions.push(gte(issues.createdAt, dateRange.startDate));
    }
    if (dateRange?.endDate) {
      filterConditions.push(lte(issues.createdAt, dateRange.endDate));
    }

    // Search functionality
    if (search) {
      const searchCondition = like(issues.description, `%${search}%`);
      filterConditions.push(searchCondition);
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    // Get total count for pagination - need to use raw SQL to match the main query structure
    const totalCountResult = await ctx.db.execute(sql`
      SELECT COUNT(*) as count
      FROM ${issues} i
      LEFT JOIN ${sites} s ON i.site_id = s.id
      WHERE ${conditions}
    `);
    const totalCount = (totalCountResult as any[])[0]?.count || 0;

    const issuesWithSite = await ctx.db.execute(sql`
      SELECT 
        i.id,
        i.site_id as "siteId",
        i.issue_types as "issueTypes",
        i.description,
        i.priority,
        i.is_solved as "isSolved",
        i.created_at as "createdAt",
        i.updated_at as "updatedAt",
        s.id as "siteId",
        s.name_of_agency as "siteName",
        s.url as "siteUrl",
        s.province as "siteProvince",
        s.district as "siteDistrict"
        ${includeSolutions ? sql`, 
        COALESCE(
          json_agg(
            json_build_object(
              'id', sol.id,
              'whoSolved', sol.who_solved,
              'howSolved', sol.how_solved,
              'solvedAt', sol.solved_at,
              'createdAt', sol.created_at
            )
          ) FILTER (WHERE sol.id IS NOT NULL), '[]'
        ) as "solutions"
        ` : sql``}
      FROM ${issues} i
      LEFT JOIN ${sites} s ON i.site_id = s.id
      ${includeSolutions ? sql`LEFT JOIN ${solutions} sol ON i.id = sol.issue_id` : sql``}
      WHERE ${conditions}
      ${includeSolutions ? sql`GROUP BY i.id, i.site_id, i.issue_types, i.description, i.priority, i.is_solved, i.created_at, i.updated_at, s.id, s.name_of_agency, s.url, s.province, s.district` : sql``}
      ORDER BY ${sql.identifier(sortBy)} ${sql.raw(sortOrder)}
      LIMIT ${limit}
      OFFSET ${offset}
    `);

    return {
      data: issuesWithSite as unknown as IssueWithSite[],
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  });

// Solution Queries
export const getSolutions = protectedProcedure
  .input(solutionQuerySchema.extend({
    search: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
    sortBy: z.enum([
      "solvedAt",
      "createdAt",
      "whoSolved"
    ]).default("solvedAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    dateRange: z.object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    }).optional(),
  }))
  .query(async ({ ctx, input }) => {
    const {
      issueId,
      whoSolved,
      search,
      limit,
      offset,
      sortBy,
      sortOrder,
      dateRange,
    } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    // Basic filters
    if (issueId) {
      filterConditions.push(eq(solutions.issueId, issueId));
    }
    if (whoSolved) {
      filterConditions.push(eq(solutions.whoSolved, whoSolved));
    }

    // Date range filter
    if (dateRange?.startDate) {
      filterConditions.push(gte(solutions.solvedAt, dateRange.startDate));
    }
    if (dateRange?.endDate) {
      filterConditions.push(lte(solutions.solvedAt, dateRange.endDate));
    }

    // Search functionality
    if (search) {
      const searchCondition = or(
        like(solutions.whoSolved, `%${search}%`),
        like(solutions.howSolved, `%${search}%`)
      );
      filterConditions.push(searchCondition);
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    const [solutionsData, totalCount] = await Promise.all([
      ctx.db
        .select()
        .from(solutions)
        .where(conditions)
        .orderBy(sql`${sql.identifier(sortBy)} ${sql.raw(sortOrder)}`)
        .limit(limit)
        .offset(offset),

      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(solutions)
        .where(conditions)
        .then((result) => result[0].count),
    ]);

    return {
      data: solutionsData as Solution[],
      pagination: {
        total: totalCount,
        pageSize: limit,
        offset,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  });

export const getSolutionById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const solution = await ctx.db
      .select()
      .from(solutions)
      .where(eq(solutions.id, input.id))
      .limit(1);

    if (!solution[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Solution not found",
      });
    }

    return solution[0] as Solution;
  });

// Statistics Queries
export const getSiteStatistics = protectedProcedure
  .input(siteStatisticsSchema)
  .query(async ({ ctx, input }) => {
    const { province, district, dateRange } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    if (province) {
      filterConditions.push(eq(sites.province, province));
    }
    if (district) {
      filterConditions.push(eq(sites.district, district));
    }
    if (dateRange?.startDate) {
      filterConditions.push(gte(sites.createdAt, dateRange.startDate));
    }
    if (dateRange?.endDate) {
      filterConditions.push(lte(sites.createdAt, dateRange.endDate));
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    const [totalSites, sitesWithIssues, sitesWithBackup, provinceStats, districtStats, backupStats] = await Promise.all([
      // Total sites
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(sites)
        .where(conditions)
        .then((result) => result[0].count),

      // Sites with issues
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(sites)
        .where(and(conditions, eq(sites.hasIssues, true)))
        .then((result) => result[0].count),

      // Sites with backup
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(sites)
        .where(and(conditions, eq(sites.hasTakenManualBackup, true)))
        .then((result) => result[0].count),

      // Sites by province
      ctx.db.execute(sql`
        SELECT province, COUNT(*) as count
        FROM ${sites}
        WHERE ${conditions}
        GROUP BY province
        ORDER BY count DESC
      `),

      // Sites by district
      ctx.db.execute(sql`
        SELECT district, COUNT(*) as count
        FROM ${sites}
        WHERE ${conditions}
        GROUP BY district
        ORDER BY count DESC
      `),

      // Backup locations
      ctx.db.execute(sql`
        SELECT backup_location, COUNT(*) as count
        FROM ${sites}
        WHERE ${conditions} AND backup_location IS NOT NULL
        GROUP BY backup_location
        ORDER BY count DESC
      `),
    ]);

    return {
      totalSites,
      sitesWithIssues,
      sitesWithBackup,
      sitesByProvince: Object.fromEntries(
        (provinceStats as any[]).map(({ province, count }) => [province, count])
      ),
      sitesByDistrict: Object.fromEntries(
        (districtStats as any[]).map(({ district, count }) => [district, count])
      ),
      backupLocations: Object.fromEntries(
        (backupStats as any[]).map(({ backup_location, count }) => [backup_location, count])
      ),
    } as SiteStatistics;
  });

export const getIssueStatistics = protectedProcedure
  .input(issueStatisticsSchema)
  .query(async ({ ctx, input }) => {
    const { siteId, issueTypes, priority, dateRange } = input;

    let conditions = sql`TRUE`;
    const filterConditions = [];

    if (siteId) {
      filterConditions.push(eq(issues.siteId, siteId));
    }
    if (issueTypes && issueTypes.length > 0) {
      filterConditions.push(sql`${issues.issueTypes} && ${issueTypes}`);
    }
    if (priority) {
      filterConditions.push(eq(issues.priority, priority));
    }
    if (dateRange?.startDate) {
      filterConditions.push(gte(issues.createdAt, dateRange.startDate));
    }
    if (dateRange?.endDate) {
      filterConditions.push(lte(issues.createdAt, dateRange.endDate));
    }

    if (filterConditions.length > 0) {
      const andCondition = and(...filterConditions);
      if (andCondition) conditions = andCondition;
    }

    const [totalIssues, solvedIssues, typeStats, priorityStats, siteStats, avgResolutionTime] = await Promise.all([
      // Total issues
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(issues)
        .where(conditions)
        .then((result) => result[0].count),

      // Solved issues
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(issues)
        .where(and(conditions, eq(issues.isSolved, true)))
        .then((result) => result[0].count),

      // Issues by type
      ctx.db.execute(sql`
        SELECT unnest(issue_types) as issue_type, COUNT(*) as count
        FROM ${issues}
        WHERE ${conditions}
        GROUP BY issue_type
        ORDER BY count DESC
      `),

      // Issues by priority
      ctx.db.execute(sql`
        SELECT priority, COUNT(*) as count
        FROM ${issues}
        WHERE ${conditions}
        GROUP BY priority
        ORDER BY count DESC
      `),

      // Issues by site - need to rebuild conditions for aliased table
      ctx.db.execute(sql`
        SELECT s.name_of_agency, COUNT(i.id) as count
        FROM ${issues} i
        LEFT JOIN ${sites} s ON i.site_id = s.id
        WHERE ${siteId ? sql`i.site_id = ${siteId}` : sql`TRUE`}
        ${issueTypes && issueTypes.length > 0 ? sql`AND i.issue_types && ${issueTypes}` : sql``}
        ${priority ? sql`AND i.priority = ${priority}` : sql``}
        ${dateRange?.startDate ? sql`AND i.created_at >= ${dateRange.startDate}` : sql``}
        ${dateRange?.endDate ? sql`AND i.created_at <= ${dateRange.endDate}` : sql``}
        GROUP BY s.id, s.name_of_agency
        ORDER BY count DESC
      `),

      // Average resolution time - need to rebuild conditions for aliased table
      ctx.db.execute(sql`
        SELECT AVG(EXTRACT(EPOCH FROM (sol.solved_at - i.created_at))/86400) as avg_days
        FROM ${issues} i
        LEFT JOIN ${solutions} sol ON i.id = sol.issue_id
        WHERE ${siteId ? sql`i.site_id = ${siteId}` : sql`TRUE`}
        ${issueTypes && issueTypes.length > 0 ? sql`AND i.issue_types && ${issueTypes}` : sql``}
        ${priority ? sql`AND i.priority = ${priority}` : sql``}
        ${dateRange?.startDate ? sql`AND i.created_at >= ${dateRange.startDate}` : sql``}
        ${dateRange?.endDate ? sql`AND i.created_at <= ${dateRange.endDate}` : sql``}
        AND i.is_solved = true AND sol.solved_at IS NOT NULL
      `),
    ]);

    return {
      totalIssues,
      solvedIssues,
      issuesByType: Object.fromEntries(
        (typeStats as any[]).map(({ issue_type, count }) => [issue_type, count])
      ),
      issuesByPriority: Object.fromEntries(
        (priorityStats as any[]).map(({ priority, count }) => [priority, count])
      ),
      issuesBySite: Object.fromEntries(
        (siteStats as any[]).map(({ name_of_agency, count }) => [name_of_agency, count])
      ),
      averageResolutionTime: (avgResolutionTime as any[])[0]?.avg_days || 0,
    } as IssueStatistics;
  });

// Utility Queries
export const getProvinces = protectedProcedure.query(async ({ ctx }) => {
  const provinces = await ctx.db
    .selectDistinct({ province: sites.province })
    .from(sites)
    .orderBy(sites.province);

  return provinces.map(p => p.province);
});

export const getDistricts = protectedProcedure
  .input(z.object({ province: z.string().optional() }))
  .query(async ({ ctx, input }) => {
    let conditions = sql`TRUE`;
    if (input.province) {
      conditions = eq(sites.province, input.province);
    }

    const districts = await ctx.db
      .selectDistinct({ district: sites.district })
      .from(sites)
      .where(conditions)
      .orderBy(sites.district);

    return districts.map(d => d.district);
  });

export const getIssueTypes = protectedProcedure.query(async ({ ctx }) => {
  const issueTypes = await ctx.db.execute(sql`
    SELECT DISTINCT unnest(issue_types) as issue_type
    FROM ${issues}
    ORDER BY issue_type
  `);

  return (issueTypes as any[]).map(it => it.issue_type);
});

export const getSolvers = protectedProcedure.query(async ({ ctx }) => {
  const solvers = await ctx.db
    .selectDistinct({ whoSolved: solutions.whoSolved })
    .from(solutions)
    .orderBy(solutions.whoSolved);

  return solvers.map(s => s.whoSolved);
});

export const getSiteStats = protectedProcedure.query(async ({ ctx }) => {
  const stats = await ctx.db
    .select({
      totalSites: sql<number>`count(*)`,
      sitesWithIssues: sql<number>`count(CASE WHEN has_issues = true THEN 1 END)`,
      sitesWithBackup: sql<number>`count(CASE WHEN has_taken_manual_backup = true THEN 1 END)`,
      cpanelSites: sql<number>`count(CASE WHEN is_cpanel = true THEN 1 END)`,
      vmSites: sql<number>`count(CASE WHEN is_vm = true THEN 1 END)`,
    })
    .from(sites);

  return stats[0];
});
