import { Router } from "express";
import { z } from "zod";
import { User } from "../models/User.js";
import { CouponBalance } from "../models/CouponBalance.js";
import { CouponPurchase } from "../models/CouponPurchase.js";
import { CouponUsage } from "../models/CouponUsage.js";
import { AIExpertModel } from "../models/AIExpert.js";

export const adminRouter = Router();

adminRouter.get("/users", async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();
  const balances = await CouponBalance.find({ userId: { $in: users.map((user) => user._id) } }).lean();
  res.json({ users, balances });
});

adminRouter.post("/users/:id/add-coupons", async (req, res) => {
  const parsed = z.object({ coupons: z.number().int().positive().max(10000) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const balance = await CouponBalance.findOneAndUpdate(
    { userId: req.params.id },
    { $inc: { balance: parsed.data.coupons, totalPurchased: parsed.data.coupons } },
    { new: true, upsert: true }
  );
  res.json({ balance });
});

adminRouter.get("/purchases", async (_req, res) => {
  const purchases = await CouponPurchase.find().sort({ createdAt: -1 }).limit(100);
  res.json({ purchases });
});

adminRouter.get("/usage", async (_req, res) => {
  const usage = await CouponUsage.find().sort({ createdAt: -1 }).limit(100);
  res.json({ usage });
});

adminRouter.patch("/experts/:id", async (req, res) => {
  const parsed = z
    .object({
      systemPrompt: z.string().min(20).optional(),
      couponCost: z.number().int().min(1).max(10).optional(),
      isActive: z.boolean().optional()
    })
    .safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const expert = await AIExpertModel.findOneAndUpdate({ slug: req.params.id }, { $set: parsed.data }, { new: true });
  res.json({ expert });
});
