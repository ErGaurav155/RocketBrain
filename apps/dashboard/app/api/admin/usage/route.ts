import { NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../lib/server/auth";
import { CouponUsage } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

export async function GET(request: Request) {
  try {
    await requireAdminAuth(request);
    const usage = await CouponUsage.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ usage });
  } catch (error) {
    return errorResponse(error);
  }
}
