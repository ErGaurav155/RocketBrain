import Razorpay from "razorpay";
import { couponPacks } from "@rocketbrain/shared";
import { NextResponse } from "next/server";
import { requireApiAuth } from "../../../../lib/server/auth";
import { CouponPurchase } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
    : null;

export async function POST(request: Request) {
  try {
    const auth = await requireApiAuth(request);
    const body = await request.json();
    const pack = couponPacks.find((item) => item.id === body.packId);

    if (!pack) return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    if (!razorpay) return NextResponse.json({ error: "Razorpay is not configured" }, { status: 500 });

    const order = await razorpay.orders.create({
      amount: pack.amount * 100,
      currency: "INR",
      receipt: `${auth.userId}-${Date.now()}`,
      notes: { packId: pack.id, coupons: String(pack.coupons) }
    });

    await CouponPurchase.create({
      userId: auth.userId,
      packId: pack.id,
      razorpayOrderId: order.id,
      amount: pack.amount,
      coupons: pack.coupons,
      status: "created"
    });

    return NextResponse.json({ order, pack });
  } catch (error) {
    return errorResponse(error);
  }
}
