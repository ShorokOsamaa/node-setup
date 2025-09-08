import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const CreateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  name: z.string().optional().nullable(),
  role: UserRoleSchema.default("USER"),
});

export const UpdateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),
  name: z.string().optional().nullable(),
  role: UserRoleSchema.optional(),
});

export const PasswordResetSchema = z.object({
  resetOtp: z.string().optional().nullable(),
  resetSessionToken: z.string().optional().nullable(),
});

// Infer TypeScript types from Zod schemas
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;
