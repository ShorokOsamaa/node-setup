import { z } from "zod";

export const UserRoleSchema = z.enum(["USER", "ADMIN"]);

export const CreateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string(),
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
});

export const UpdateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
  username: z.string().optional().nullable(),
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
});

export const PasswordResetSchema = z.object({
  resetOtp: z.string().optional().nullable(),
  resetSessionToken: z.string().optional().nullable(),
});

export type UserRoleType = z.infer<typeof UserRoleSchema>;
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
export type PasswordResetSchemaType = z.infer<typeof PasswordResetSchema>;
