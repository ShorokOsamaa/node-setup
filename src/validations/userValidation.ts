import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const CreateUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),
  role: UserRoleSchema.default("USER"),
  username: z.string(),
});

export const UpdateUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }).optional(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    })
    .optional(),
  role: UserRoleSchema.optional(),
  username: z.string().optional().nullable(),
});

export const GetAllUsersSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(1).default(1),
  search: z.string().optional(),
});

export const UserIdParamSchema = z.object({
  id: z.coerce.number({ message: "Invalid user ID format" }),
});

export const PasswordResetSchema = z.object({
  resetOtp: z.string().optional().nullable(),
  resetSessionToken: z.string().optional().nullable(),
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
export type UserRoleType = z.infer<typeof UserRoleSchema>;
