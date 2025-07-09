"use server";

/* eslint @typescript-eslint/no-explicit-any:0, @typescript-eslint/prefer-optional-chain:0 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateId, Scrypt } from "lucia";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/auth";
import { db } from "@/server/db";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { users } from "@/server/db/schema/basic";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "../constants";

export interface ActionResponse<T> {
  fieldError?: Partial<Record<keyof T, string | undefined>>;
  formError?: string;
  success?: boolean;
}

export async function login(
  _: any,
  formData: FormData,
): Promise<ActionResponse<LoginInput>> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = loginSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        userName: err.fieldErrors.userName?.[0],
        password: err.fieldErrors.password?.[0],
      },
    };
  }

  const { userName, password } = parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.userName, userName),
  });

  if (!existingUser || !existingUser?.hashedPassword) {
    return {
      formError: "Incorrect username or password",
    };
  }

  const validPassword = await new Scrypt().verify(
    existingUser.hashedPassword,
    password,
  );
  if (!validPassword) {
    return {
      formError: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(Paths.Dashboard);
}

export async function signup(
  _: any,
  formData: FormData,
): Promise<ActionResponse<SignupInput>> {
  const obj = Object.fromEntries(formData.entries());
  if (obj.wardNumber) {
    obj.wardNumber = parseInt(
      obj.wardNumber as unknown as string,
    ) as unknown as FormDataEntryValue;
  }
  const parsed = signupSchema.safeParse(obj);
  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      fieldError: {
        userName: err.fieldErrors.userName?.[0],
        password: err.fieldErrors.password?.[0],
        name: err.fieldErrors.name?.[0],
        email: err.fieldErrors.email?.[0],
        phoneNumber: err.fieldErrors.phoneNumber?.[0],
        wardNumber: err.fieldErrors.wardNumber?.[0],
      },
    };
  }

  const { userName, password, name, email, phoneNumber, wardNumber } =
    parsed.data;

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.userName, userName),
    columns: { userName: true },
  });

  if (existingUser) {
    return {
      formError: "Cannot create account with that username",
    };
  }

  const userId = generateId(21);

  const hashedPassword = await new Scrypt().hash(password);

  await db.insert(users).values({
    id: userId,
    userName,
    hashedPassword,
    name,
    email,
    phoneNumber,
    wardNumber,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect(Paths.Dashboard);
}

export async function logout(): Promise<{ error: string } | void> {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "No session found",
    };
  }
  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

export async function resetPassword(
  _: any,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = resetPasswordSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      error: err.fieldErrors.password?.[0] ?? err.fieldErrors.oldPassword?.[0],
    };
  }
  const { oldPassword, password } = parsed.data;

  const { user } = await validateRequest();
  if (!user) {
    return { error: "User not authenticated" };
  }

  const existingUser = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, user.id),
  });

  if (!existingUser || !existingUser.hashedPassword) {
    return { error: "User not found" };
  }

  const validOldPassword = await new Scrypt().verify(
    existingUser.hashedPassword,
    oldPassword,
  );
  if (!validOldPassword) {
    return { error: "Incorrect old password" };
  }

  const hashedPassword = await new Scrypt().hash(password);
  await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));
  await lucia.invalidateUserSessions(user.id);
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  redirect(Paths.Dashboard);
}

// export async function createUser(
//   _: any,
//   formData: FormData,
// ): Promise<{ error?: string; success?: boolean }> {
//   try {
//     // Verify current user is admin
//     const { user: currentUser } = await validateRequest();
//     if (!currentUser || currentUser.role !== "admin") {
//       return { error: "Unauthorized access" };
//     }

//     const obj = Object.fromEntries(formData.entries());
//     const parsed = createNewUserSchema.safeParse(obj);

//     if (!parsed.success) {
//       const err = parsed.error.flatten();
//       console.log(err, obj);
//       return {
//         error:
//           err.fieldErrors.userName?.[0] ??
//           err.fieldErrors.password?.[0] ??
//           err.fieldErrors.role?.[0] ??
//           err.fieldErrors.domain?.[0] ??
//           err.fieldErrors.wardNumber?.[0],
//       };
//     }

//     const { userName, password, role, domain, wardNumber } = parsed.data;

//     // Check if username already exists
//     const existingUser = await db.query.users.findFirst({
//       where: (users, { eq }) => eq(users.userName, userName),
//     });

//     if (existingUser) {
//       return { error: "Username already exists" };
//     }

//     // Hash password
//     const hashedPassword = await new Scrypt().hash(password);

//     // Create user
//     const userId = generateId(21);
//     await db.insert(users).values({
//       id: userId,
//       userName,
//       hashedPassword,
//       role,
//       domain,
//       wardNumber: domain === "ward" ? wardNumber : null,
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return { error: "Failed to create user" };
//   }
// }
