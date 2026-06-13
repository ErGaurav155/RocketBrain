import { createClerkClient, verifyToken } from "@clerk/backend";
import { connectDb } from "./db";
import { upsertUserFromClerk } from "./clerk-user-sync";

export type ApiAuth = {
  clerkId: string;
  userId: string;
  role: "user" | "admin";
  email: string;
};

const clerk = process.env.CLERK_SECRET_KEY ? createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY }) : null;

export async function requireApiAuth(request: Request): Promise<ApiAuth> {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Missing bearer token");
  if (!process.env.CLERK_SECRET_KEY || !clerk) throw new Error("CLERK_SECRET_KEY is not configured");

  await connectDb();

  const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
  const clerkId = String(session.sub);
  const clerkUser = await clerk.users.getUser(clerkId);
  const user = await upsertUserFromClerk({
    id: clerkId,
    username: clerkUser.username,
    first_name: clerkUser.firstName,
    last_name: clerkUser.lastName,
    primary_email_address_id: clerkUser.primaryEmailAddressId,
    email_addresses: clerkUser.emailAddresses.map((email) => ({
      id: email.id,
      email_address: email.emailAddress
    })),
    banned: clerkUser.banned,
    locked: clerkUser.locked
  });

  if (user.disabled) throw new Error("User disabled");

  return {
    clerkId,
    userId: String(user._id),
    role: user.role,
    email: user.email
  };
}

export async function requireAdminAuth(request: Request) {
  const auth = await requireApiAuth(request);
  if (auth.role !== "admin") throw new Error("Admin access required");
  return auth;
}
