import { connectDb } from "./db";
import { CouponBalance, User } from "./models";

type ClerkEmailAddress = {
  id: string;
  email_address: string;
};

export type ClerkUserProfile = {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  primary_email_address_id: string | null;
  email_addresses: ClerkEmailAddress[];
  banned?: boolean;
  locked?: boolean;
};

function getClerkUserEmail(user: ClerkUserProfile) {
  const primaryEmail = user.email_addresses.find((email) => email.id === user.primary_email_address_id);
  return primaryEmail?.email_address || user.email_addresses[0]?.email_address || "";
}

function getClerkUserName(user: ClerkUserProfile) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username || "";
}

export async function upsertUserFromClerk(user: ClerkUserProfile) {
  await connectDb();

  const dbUser = await User.findOneAndUpdate(
    { clerkId: user.id },
    {
      $set: {
        email: getClerkUserEmail(user),
        name: getClerkUserName(user),
        disabled: user.banned || user.locked,
        deletedAt: null
      },
      $setOnInsert: { clerkId: user.id }
    },
    { new: true, upsert: true }
  );

  await CouponBalance.findOneAndUpdate(
    { userId: dbUser._id },
    { $setOnInsert: { userId: dbUser._id, balance: 3, totalPurchased: 3, totalUsed: 0 } },
    { new: true, upsert: true }
  );

  return dbUser;
}

export async function disableUserFromClerk(clerkId: string) {
  await connectDb();
  return User.findOneAndUpdate({ clerkId }, { $set: { disabled: true, deletedAt: new Date() } }, { new: true });
}
