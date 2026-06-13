import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDb } from "./config/db.js";
import { requireAdmin, requireAuth } from "./middleware/auth.js";
import { expertsRouter } from "./routes/experts.js";
import { chatRouter } from "./routes/chat.js";
import { couponsRouter } from "./routes/coupons.js";
import { adminRouter } from "./routes/admin.js";
import { webhooksRouter } from "./routes/webhooks.js";

const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use("/api/webhooks", express.raw({ type: "application/json", limit: "1mb" }), webhooksRouter);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/experts", expertsRouter);
app.use("/api/chat", requireAuth, chatRouter);
app.use("/api/coupons", requireAuth, couponsRouter);
app.use("/api/admin", requireAuth, requireAdmin, adminRouter);

connectDb()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`RocketBrain API listening on ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
  });
