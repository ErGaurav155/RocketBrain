import { NextResponse } from "next/server";
import { requireAdminAuth } from "../../../../lib/server/auth";
import { CouponBalance, User } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

export async function GET(request: Request) {
  try {
    await requireAdminAuth(request);

    const users = await User.find().sort({ createdAt: -1 }).limit(100).lean();
    const balances = await CouponBalance.find({ userId: { $in: users.map((user) => user._id) } }).lean();
    const balanceByUserId = new Map(balances.map((balance) => [String(balance.userId), balance]));

    return NextResponse.json({
      users: users.map((user) => ({
        ...user,
        balance: balanceByUserId.get(String(user._id)) || null
      }))
    });
  } catch (error) {
    return errorResponse(error);
  }
}
