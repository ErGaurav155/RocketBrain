import type { NextFunction, Request, Response } from "express";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export type AuthedRequest = Request & {
  auth: {
    clerkId: string;
    userId: string;
    role: "user" | "admin";
    email: string;
  };
};

const clerk = env.CLERK_SECRET_KEY ? createClerkClient({ secretKey: env.CLERK_SECRET_KEY }) : null;

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Missing bearer token" });
    if (!clerk) return res.status(500).json({ error: "CLERK_SECRET_KEY is not configured" });

    const session = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    const clerkId = String(session.sub);
    const clerkUser = await clerk.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || "";
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ");

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $setOnInsert: { clerkId, email, name }, $set: { email, name } },
      { new: true, upsert: true }
    );

    if (user.disabled) return res.status(403).json({ error: "User disabled" });

    (req as AuthedRequest).auth = {
      clerkId,
      userId: String(user._id),
      role: user.role,
      email
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid session" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if ((req as AuthedRequest).auth.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
