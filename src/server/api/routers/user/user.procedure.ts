import { users, areas } from "@/server/db/schema";
import { protectedProcedure, createTRPCRouter } from "../../trpc";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
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
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    return user[0];
  }),
});
