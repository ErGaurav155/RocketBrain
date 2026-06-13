import OpenAI from "openai";
import { getExpert, getMessageCost } from "@rocketbrain/shared";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth } from "../../../../lib/server/auth";
import { CouponBalance, CouponUsage } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";

const requestSchema = z.object({
  message: z.string().trim().min(1).max(8000),
  mode: z.enum(["normal", "deep"]).default("normal")
});

const deepseek = process.env.DEEPSEEK_API_KEY
  ? new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: DEEPSEEK_BASE_URL
    })
  : null;

type RouteContext = {
  params: Promise<{ expertId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  let couponUsed = 0;
  let auth: Awaited<ReturnType<typeof requireApiAuth>> | null = null;
  let expert: ReturnType<typeof getExpert> | null = null;
  let mode: "normal" | "deep" = "normal";

  try {
    auth = await requireApiAuth(request);
    const { expertId } = await context.params;
    const body = await request.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    mode = parsed.data.mode;
    expert = getExpert(expertId);
    if (!expert || !expert.isActive) {
      return NextResponse.json({ error: "Expert not found" }, { status: 404 });
    }

    couponUsed = getMessageCost(expert, mode);
    const balance = await CouponBalance.findOneAndUpdate(
      { userId: auth.userId, balance: { $gte: couponUsed } },
      { $inc: { balance: -couponUsed, totalUsed: couponUsed } },
      { new: true }
    );

    if (!balance) {
      return NextResponse.json({ error: "Not enough coupons", required: couponUsed }, { status: 402 });
    }

    if (!deepseek) throw new Error("DEEPSEEK_API_KEY is not configured");

    const response = await deepseek.chat.completions.create({
      model: mode === "deep" ? "deepseek-reasoner" : "deepseek-chat",
      messages: [
        { role: "system", content: expert.systemPrompt },
        {
          role: "user",
          content:
            mode === "deep"
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
      mode,
      tokenEstimate: response.usage?.total_tokens || Math.ceil((parsed.data.message.length + answer.length) / 4),
      status: "success"
    });

    return NextResponse.json({ answer, balance: balance.balance, couponUsed });
  } catch (error) {
    if (auth && expert && couponUsed > 0) {
      await CouponBalance.findOneAndUpdate(
        { userId: auth.userId },
        { $inc: { balance: couponUsed, totalUsed: -couponUsed } }
      );
      await CouponUsage.create({
        userId: auth.userId,
        expertId: expert.id,
        expertName: expert.name,
        couponUsed,
        mode,
        tokenEstimate: 0,
        status: "failed"
      });
      return NextResponse.json({ error: "AI response failed. Coupon was restored." }, { status: 500 });
    }

    return errorResponse(error);
  }
}
