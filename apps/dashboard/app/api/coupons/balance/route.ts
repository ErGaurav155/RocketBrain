import { NextResponse } from "next/server";
import { requireApiAuth } from "../../../../lib/server/auth";
import { CouponBalance } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

export async function GET(request: Request) {
  try {
    const auth = await requireApiAuth(request);
    const balance = await CouponBalance.findOneAndUpdate(
      { userId: auth.userId },
      { $setOnInsert: { userId: auth.userId, balance: 3, totalPurchased: 3, totalUsed: 0 } },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      balance: balance.balance,
      totalPurchased: balance.totalPurchased,
      totalUsed: balance.totalUsed
    });
  } catch (error) {
    return errorResponse(error);
  }
}
