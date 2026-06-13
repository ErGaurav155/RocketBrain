import { NextResponse } from "next/server";
import { requireApiAuth } from "../../../../lib/server/auth";
import { CouponPurchase, CouponUsage } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

export async function GET(request: Request) {
  try {
    const auth = await requireApiAuth(request);
    const purchases = await CouponPurchase.find({ userId: auth.userId }).sort({ createdAt: -1 }).limit(25);
    const usage = await CouponUsage.find({ userId: auth.userId }).sort({ createdAt: -1 }).limit(25);

    return NextResponse.json({ purchases, usage });
  } catch (error) {
    return errorResponse(error);
  }
}
