import { Router } from "express";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { env } from "../config/env.js";
import { disableUserFromClerk, upsertUserFromClerk } from "../services/users.js";

export const webhooksRouter = Router();

webhooksRouter.post("/clerk", async (req, res) => {
  if (!env.CLERK_WEBHOOK_SIGNING_SECRET) {
    return res.status(500).json({ error: "CLERK_WEBHOOK_SIGNING_SECRET is not configured" });
  }

  try {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) headers.set(key, value.join(", "));
      else if (value) headers.set(key, value);
    }

    const request = new Request(`${req.protocol}://${req.get("host")}${req.originalUrl}`, {
      method: "POST",
      headers,
      body: new Uint8Array(req.body as Buffer)
    });

    const event = await verifyWebhook(request, { signingSecret: env.CLERK_WEBHOOK_SIGNING_SECRET });

    if (event.type === "user.created" || event.type === "user.updated") {
      const user = await upsertUserFromClerk(event.data);
      return res.json({ received: true, type: event.type, userId: user._id });
    }

    if (event.type === "user.deleted" && event.data.id) {
      await disableUserFromClerk(event.data.id);
      return res.json({ received: true, type: event.type });
    }

    return res.json({ received: true, type: event.type, ignored: true });
  } catch (error) {
    console.error("Clerk webhook verification failed", error);
    return res.status(400).json({ error: "Invalid Clerk webhook" });
  }
});
