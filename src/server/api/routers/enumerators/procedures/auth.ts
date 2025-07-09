import { protectedProcedure } from "@/server/api/trpc";
// ...existing code...
import {
  createEnumeratorSchema,
  resetEnumeratorPasswordSchema,
  updateEnumeratorSchema,
} from "../enumerators.schema";
import { areas, users } from "@/server/db/schema/basic";
import { TRPCError } from "@trpc/server";
import { Scrypt } from "lucia";
import { generateId } from "lucia";
import { eq } from "drizzle-orm";
import { z } from "zod";

// ...existing code...

export const enumeratorAuthProcedures = {
  create: protectedProcedure
    .input(createEnumeratorSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an admin to manage enumerators",
        });
      }

      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.userName, input.userName),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const hashedPassword = await new Scrypt().hash(input.password);
      const userId = generateId(21);

      await ctx.db.insert(users).values({
        id: userId,
        ...input,
        hashedPassword,
        role: "enumerator",
      });

      return { success: true };
    }),

  resetPassword: protectedProcedure
    .input(resetEnumeratorPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an admin to reset passwords",
        });
      }

      const hashedPassword = await new Scrypt().hash(input.password);
      console.log("Ressting password", input.enumeratorId, hashedPassword);
      await ctx.db
        .update(users)
        .set({ hashedPassword })
        .where(eq(users.id, input.enumeratorId));

      return { success: true };
    }),

  update: protectedProcedure
    .input(updateEnumeratorSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "superadmin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Must be an admin to update enumerator details",
        });
      }

      const { enumeratorId, ...updateData } = input;

      if (updateData.userName) {
        const existingUser = await ctx.db.query.users.findFirst({
          where: (users, { eq }) =>
            updateData.userName
              ? eq(users.userName, updateData.userName)
              : undefined,
        });

        if (existingUser && existingUser.id !== enumeratorId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Username already exists",
          });
        }
      }

      await ctx.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, enumeratorId));

      return { success: true };
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const enumerator = await ctx.db
        .select({
          id: users.id,
          name: users.name,
          userName: users.userName,
          role: users.role,
          phoneNumber: users.phoneNumber,
          email: users.email,
          isActive: users.isActive,
          wardNumber: users.wardNumber,
          avatar: users.avatar,
          nepaliName: users.nepaliName,
          nepaliAddress: users.nepaliAddress,
          nepaliPhone: users.nepaliPhone,
          area: {
            id: areas.id,
            code: areas.code,
            wardNumber: areas.wardNumber,
            areaStatus: areas.areaStatus,
          },
        })
        .from(users)
        .leftJoin(areas, eq(areas.assignedTo, users.id))
        .where(eq(users.id, input));

      if (!enumerator || enumerator.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Enumerator not found",
        });
      }
      return enumerator[0];
    }),
};
