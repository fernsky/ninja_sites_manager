import { z } from "zod";

export const signupSchema = z.object({
  userName: z.string().min(1, "Please enter a valid username."),
  name:z.string().min(1, "Please enter your name."),
  email:z.string().email(),
  phoneNumber: z.string().min(10, "Please enter a valid phone number."),
  password: z.string().min(1, "Please provide your password.").max(255),
  wardNumber: z.number().int()
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  userName: z.string().min(1, "Please enter a valid username."),
  password: z.string().min(8, "Password is too short. Minimum 8 characters required.").max(255),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(8, "Password is too short.").max(255),
  password: z.string().min(8, "Password is too short").max(255),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const createNewUserSchema = z.object({
  userName: z.string().min(1, "Please enter a valid username."),
  password: z.string().min(8, "Password is too short. Minimum 8 characters required.").max(255),
  role: z.enum(["admin", "editor", "viewer"]),
  domain: z.enum(["municipality", "ward"]),
  wardNumber: z.string().optional(),
});
export type CreateNewUserInput = z.infer<typeof createNewUserSchema>;
