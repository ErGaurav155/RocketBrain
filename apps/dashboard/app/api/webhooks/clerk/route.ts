import { verifyWebhook } from "@clerk/backend/webhooks";
import { NextResponse } from "next/server";
import { disableUserFromClerk, upsertUserFromClerk } from "../../../../lib/server/clerk-user-sync";

export async function POST(request: Request) {
  if (!process.env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SIGNING_SECRET is not configured" }, { status: 500 });
  }

  try {
    const event = await verifyWebhook(request, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET
    });

    if (event.type === "user.created" || event.type === "user.updated") {
      const user = await upsertUserFromClerk(event.data);
      return NextResponse.json({ received: true, type: event.type, userId: user._id });
    }

    if (event.type === "user.deleted" && event.data.id) {
      await disableUserFromClerk(event.data.id);
      return NextResponse.json({ received: true, type: event.type });
    }

    return NextResponse.json({ received: true, type: event.type, ignored: true });
  } catch (error) {
    console.error("Clerk webhook verification failed", error);
    return NextResponse.json({ error: "Invalid Clerk webhook" }, { status: 400 });
  }
}
