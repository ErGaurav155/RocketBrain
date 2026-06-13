import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  OWNER_EMAIL: z.string().email().optional(),
  PORT: z.coerce.number().default(4000),
  CLIENT_URL: z.string().default("http://localhost:3000")
});

export const env = envSchema.parse(process.env);
