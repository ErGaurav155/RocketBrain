import { NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../lib/server/auth";
import { CouponPurchase } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

export async function GET(request: Request) {
  try {
    await requireAdminAuth(request);
    const purchases = await CouponPurchase.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ purchases });
  } catch (error) {
    return errorResponse(error);
  }
}
