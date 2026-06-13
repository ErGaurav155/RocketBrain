import { Router } from "express";
import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";
import { CouponBalance } from "../models/CouponBalance.js";
import { CouponUsage } from "../models/CouponUsage.js";
import { getExpert, getMessageCost } from "../data/experts.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const chatRouter = Router();

const requestSchema = z.object({
  message: z.string().trim().min(1).max(8000),
  mode: z.enum(["normal", "deep"]).default("normal")
});

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

chatRouter.post("/:expertId", async (req, res) => {
  const auth = (req as unknown as AuthedRequest).auth;
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const expert = getExpert(req.params.expertId);
  if (!expert || !expert.isActive) return res.status(404).json({ error: "Expert not found" });

  const couponUsed = getMessageCost(expert, parsed.data.mode);
  const balance = await CouponBalance.findOneAndUpdate(
    { userId: auth.userId, balance: { $gte: couponUsed } },
    { $inc: { balance: -couponUsed, totalUsed: couponUsed } },
    { new: true }
  );

  if (!balance) {
    return res.status(402).json({ error: "Not enough coupons", required: couponUsed });
  }

  try {
    if (!openai) throw new Error("OPENAI_API_KEY is not configured");

    const response = await openai.chat.completions.create({
      model: parsed.data.mode === "deep" ? "gpt-4.1" : "gpt-4.1-mini",
      messages: [
        { role: "system", content: expert.systemPrompt },
        {
          role: "user",
          content:
            parsed.data.mode === "deep"
              ? `Deep answer mode. Be thorough, structured, and careful.\n\n${parsed.data.message}`
              : parsed.data.message
        }
      ],
      temperature: 0.6
    });

    const answer = response.choices[0]?.message?.content || "I could not generate a response.";
    await CouponUsage.create({
      userId: auth.userId,
      expertId: expert.id,
      expertName: expert.name,
      couponUsed,
      mode: parsed.data.mode,
      tokenEstimate: response.usage?.total_tokens || Math.ceil((parsed.data.message.length + answer.length) / 4),
      status: "success"
    });

    res.json({ answer, balance: balance.balance, couponUsed });
  } catch (error) {
    await CouponBalance.findOneAndUpdate(
      { userId: auth.userId },
      { $inc: { balance: couponUsed, totalUsed: -couponUsed } }
    );
    await CouponUsage.create({
      userId: auth.userId,
      expertId: expert.id,
      expertName: expert.name,
      couponUsed,
      mode: parsed.data.mode,
      tokenEstimate: 0,
      status: "failed"
    });
    res.status(500).json({ error: "AI response failed. Coupon was restored." });
  }
});
