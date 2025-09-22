import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const CreateUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }).toLowerCase(),
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

export const UserLoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }).toLowerCase(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const UpdateUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }).toLowerCase().optional(),
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

export const PasswordResetRequestSchema = z.object({
  email: z.email({ message: "Invalid email address" }).toLowerCase(),
});

export const PasswordResetVerifySchema = z.object({
  email: z.email({ message: "Invalid email address" }).toLowerCase(),
  otp: z.coerce
    .string()
    .min(6, { message: "OTP must be at least 6 characters long" }),
});

export const PasswordResetConfirmSchema = z.object({
  email: z.email({ message: "Invalid email address" }).toLowerCase(),
  newPassword: z
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
  resetToken: z.string().min(1, { message: "Reset token is required" }),
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UserLoginSchemaType = z.infer<typeof UserLoginSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
export type UserRoleType = z.infer<typeof UserRoleSchema>;
export type UserIdParamSchemaType = z.infer<typeof UserIdParamSchema>;
export type GetAllUsersSchemaType = z.infer<typeof GetAllUsersSchema>;
export type PasswordResetRequestSchemaType = z.infer<
  typeof PasswordResetRequestSchema
>;
export type PasswordResetVerifySchemaType = z.infer<
  typeof PasswordResetVerifySchema
>;
export type PasswordResetConfirmSchemaType = z.infer<
  typeof PasswordResetConfirmSchema
>;
