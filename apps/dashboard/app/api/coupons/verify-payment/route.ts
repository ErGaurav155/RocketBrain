import crypto from "node:crypto";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { requireApiAuth } from "../../../../lib/server/auth";
import { CouponBalance, CouponPurchase } from "../../../../lib/server/models";
import { errorResponse } from "../../../../lib/server/responses";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const auth = await requireApiAuth(request);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay secret is not configured" }, { status: 500 });
    }

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const purchase = await CouponPurchase.findOneAndUpdate(
      { userId: auth.userId, razorpayOrderId: razorpay_order_id, status: "created" },
      { $set: { razorpayPaymentId: razorpay_payment_id, status: "paid" } },
      { new: true }
    );

    if (!purchase) {
      return NextResponse.json({ error: "Payment already verified or not found" }, { status: 409 });
    }

    const balance = await CouponBalance.findOneAndUpdate(
      { userId: auth.userId },
      { $inc: { balance: purchase.coupons, totalPurchased: purchase.coupons } },
      { new: true, upsert: true }
    );

    if (resend) {
      await resend.emails.send({
        from: "RocketBrain <receipts@rocketbrain.ai>",
        to: auth.email,
        subject: "Your RocketBrain coupon receipt",
        html: `<p>Payment successful.</p><p>${purchase.coupons} coupons were added to your account.</p>`
      });

      if (process.env.OWNER_EMAIL && purchase.amount >= 999) {
        await resend.emails.send({
          from: "RocketBrain <alerts@rocketbrain.ai>",
          to: process.env.OWNER_EMAIL,
          subject: "Large coupon purchase",
          html: `<p>User ${auth.email} purchased ${purchase.coupons} coupons.</p>`
        });
      }
    }

    return NextResponse.json({ success: true, balance: balance.balance });
  } catch (error) {
    return errorResponse(error);
  }
}
