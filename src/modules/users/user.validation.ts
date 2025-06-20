import { z } from "zod";

export const userValidationSchema = z.object({
  userName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "contributor", "viewer"]).optional(),
  isVerified: z.boolean().optional(),
  forgotPasswordToken: z.string().optional(),
  forgotPasswordTokenExpiry: z.date().optional(),
  verifyToken: z.string().optional(),
  verifyTokenExpiry: z.date().optional(),
});

export const userUpdateSchema = userValidationSchema.partial();

