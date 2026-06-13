import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAuth } from "../../../../../../lib/server/auth";
import { CouponBalance, User } from "../../../../../../lib/server/models";
import { errorResponse } from "../../../../../../lib/server/responses";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    await requireAdminAuth(request);
    const { id } = await context.params;
    const parsed = z.object({ coupons: z.number().int().positive().max(10000) }).safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const balance = await CouponBalance.findOneAndUpdate(
      { userId: user._id },
      { $inc: { balance: parsed.data.coupons, totalPurchased: parsed.data.coupons } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ balance });
  } catch (error) {
    return errorResponse(error);
  }
}
