import { z } from "zod";

export const createEnumeratorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().length(10, "Phone number must be 10 digits"),
  email: z.string().email("Invalid email").optional(),
  userName: z.string().min(3, "Username must be at least 3 characters"),
  wardNumber: z.number().min(1, "Ward number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isActive: z.boolean().optional(),
});

export const resetEnumeratorPasswordSchema = z
  .object({
    enumeratorId: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateEnumeratorSchema = z.object({
  enumeratorId: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  phoneNumber: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  wardNumber: z.number().min(1, "Ward number is required").optional(),
  isActive: z.boolean().optional(),
});

export type CreateEnumeratorInput = z.infer<typeof createEnumeratorSchema>;
export type ResetEnumeratorPasswordInput = z.infer<
  typeof resetEnumeratorPasswordSchema
>;
export type UpdateEnumeratorInput = z.infer<typeof updateEnumeratorSchema>;
