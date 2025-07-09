import { fetchSubmissionsSchema, surveyFormSchema } from "./superadmin.schema";
import { eq } from "drizzle-orm";
import { areas, surveyForms } from "@/server/db/schema";
import { createTRPCRouter, superAdminProcedure } from "../../trpc";
import { FormAttachment } from "@/types";
import * as z from "zod";
import { fetchSurveySubmissions } from "@/server/utils";
import { TRPCError } from "@trpc/server";
import dotenv from "dotenv";

dotenv.config();

/**
 * Router for superadmin procedures related to survey forms.
 */
export const superadminRouter = createTRPCRouter({
  /**
   * Retrieves all survey forms.
   *
   * @returns {Promise<Array>} A promise that resolves to an array of all survey forms.
   */
  getSurveyForms: superAdminProcedure.query(async ({ ctx }) => {
    const allSurveyForms = await ctx.db.select().from(surveyForms);
    return allSurveyForms;
  }),

  /**
   * Retrieves a specific survey form by ID.
   *
   * @param {string} id - The ID of the survey form.
   * @returns {Promise<Object>} A promise that resolves to the survey form.
   */
  getForm: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const form = await ctx.db
        .select()
        .from(surveyForms)
        .where(eq(surveyForms.id, input.id))
        .limit(1);

      if (!form.length) {
        throw new Error("Survey form not found");
      }

      return form[0];
    }),

  /**
   * Creates a new survey form.
   *
   * @param {Object} input - The input data for the new survey form.
   * @returns {Promise<Object>} A promise that resolves to the newly created survey form.
   */
  createSurveyForm: superAdminProcedure
    .input(surveyFormSchema)
    .mutation(async ({ ctx, input }) => {
      const newSurveyForm = await ctx.db
        .insert(surveyForms)
        .values(input)
        .returning();
      return newSurveyForm;
    }),

  /**
   * Updates an existing survey form.
   *
   * @param {Object} input - The input data for updating the survey form.
   * @returns {Promise<Object>} A promise that resolves to the updated survey form.
   */
  updateSurveyForm: superAdminProcedure
    .input(surveyFormSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedSurveyForm = await ctx.db
        .update(surveyForms)
        .set(input)
        .where(eq(surveyForms.id, input.id))
        .returning();

      return updatedSurveyForm;
    }),

  /**
   * Creates or updates a survey form based on whether the ID exists.
   *
   * @param {Object} input - The input data for creating/updating the survey form.
   * @returns {Promise<Object>} A promise that resolves to the created/updated survey form.
   */
  createOrUpdateResourceForm: superAdminProcedure
    .input(surveyFormSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if form exists
      const existingForm = await ctx.db
        .select()
        .from(surveyForms)
        .where(eq(surveyForms.id, input.id))
        .limit(1);

      if (existingForm.length === 0) {
        // Form doesn't exist, create new
        const newForm = await ctx.db
          .insert(surveyForms)
          .values(input)
          .returning();

        return newForm[0];
      } else {
        // Form exists, update it
        const updatedForm = await ctx.db
          .update(surveyForms)
          .set(input)
          .where(eq(surveyForms.id, input.id))
          .returning();

        return updatedForm[0];
      }
    }),

  fetchSurveySubmissions: superAdminProcedure
    .input(fetchSubmissionsSchema)
    .mutation(async ({ ctx, input }) => {
      const surveyForm = await ctx.db
        .select()
        .from(surveyForms)
        .where(eq(surveyForms.id, input.id))
        .limit(1);

      if (!surveyForm.length) {
        throw new Error("Survey form not found");
      }

      const {
        userName,
        password,
        odkFormId,
        odkProjectId,
        siteEndpoint,
        attachmentPaths,
      } = surveyForm[0];

      console.log("Fetching submissions for form:", surveyForm[0].name);
      await fetchSurveySubmissions(
        {
          siteEndpoint: siteEndpoint as string,
          userName: userName as string,
          password: password as string,
          odkFormId: odkFormId as string,
          odkProjectId: odkProjectId as number,
          attachmentPaths: attachmentPaths as FormAttachment[],
          formId: input.id,
          startDate: input.startDate,
          endDate: input.endDate,
          count: input.count,
        },
        ctx,
      );
    }),

  /**
   * Request completion on behalf of an enumerator.
   *
   * @param {Object} input - The input data containing enumeratorId.
   * @returns {Promise<Object>} A promise that resolves to the success status.
   */
  requestCompletion: superAdminProcedure
    .input(z.object({ enumeratorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const area = await ctx.db.query.areas.findFirst({
        columns: {
          id: true,
          areaStatus: true,
        },
        where: (areas, { eq }) => eq(areas.assignedTo, input.enumeratorId),
      });

      if (!area) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No assigned area found",
        });
      }

      await ctx.db
        .update(areas)
        .set({ areaStatus: "asked_for_completion" })
        .where(eq(areas.id, area.id));

      return { success: true };
    }),

  /**
   * Request revision completion on behalf of an enumerator.
   *
   * @param {Object} input - The input data containing enumeratorId.
   * @returns {Promise<Object>} A promise that resolves to the success status.
   */
  requestRevisionCompletion: superAdminProcedure
    .input(z.object({ enumeratorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const area = await ctx.db.query.areas.findFirst({
        columns: {
          id: true,
          areaStatus: true,
        },
        where: (areas, { eq }) => eq(areas.assignedTo, input.enumeratorId),
      });

      if (!area || area.areaStatus !== "revision") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Area must be in revision status",
        });
      }

      await ctx.db
        .update(areas)
        .set({ areaStatus: "asked_for_revision_completion" })
        .where(eq(areas.id, area.id));

      return { success: true };
    }),

  /**
   * Request withdrawal on behalf of an enumerator.
   *
   * @param {Object} input - The input data containing enumeratorId.
   * @returns {Promise<Object>} A promise that resolves to the success status.
   */
  requestWithdrawal: superAdminProcedure
    .input(z.object({ enumeratorId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const area = await ctx.db.query.areas.findFirst({
        columns: {
          id: true,
          areaStatus: true,
        },
        where: (areas, { eq }) => eq(areas.assignedTo, input.enumeratorId),
      });

      if (!area) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No assigned area found",
        });
      }

      await ctx.db
        .update(areas)
        .set({ areaStatus: "asked_for_withdrawl" })
        .where(eq(areas.id, area.id));

      return { success: true };
    }),
});
