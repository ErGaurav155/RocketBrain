import { Router } from "express";
import crypto from "node:crypto";
import Razorpay from "razorpay";
import { Resend } from "resend";
import { couponPacks } from "@rocketbrain/shared";
import { env } from "../config/env.js";
import { CouponBalance } from "../models/CouponBalance.js";
import { CouponPurchase } from "../models/CouponPurchase.js";
import { CouponUsage } from "../models/CouponUsage.js";
import type { AuthedRequest } from "../middleware/auth.js";

export const couponsRouter = Router();

const razorpay =
  env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
    : null;
const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

couponsRouter.get("/balance", async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const balance = await CouponBalance.findOneAndUpdate(
    { userId: auth.userId },
    { $setOnInsert: { userId: auth.userId, balance: 3, totalPurchased: 3, totalUsed: 0 } },
    { new: true, upsert: true }
  );
  res.json({ balance: balance.balance, totalPurchased: balance.totalPurchased, totalUsed: balance.totalUsed });
});

couponsRouter.post("/purchase", async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const pack = couponPacks.find((item) => item.id === req.body.packId);
  if (!pack) return res.status(400).json({ error: "Invalid pack" });
  if (!razorpay) return res.status(500).json({ error: "Razorpay is not configured" });

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

  res.json({ order, pack });
});

couponsRouter.post("/verify-payment", async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!env.RAZORPAY_KEY_SECRET) return res.status(500).json({ error: "Razorpay secret is not configured" });

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) return res.status(400).json({ error: "Invalid payment signature" });

  const purchase = await CouponPurchase.findOneAndUpdate(
    { userId: auth.userId, razorpayOrderId: razorpay_order_id, status: "created" },
    { $set: { razorpayPaymentId: razorpay_payment_id, status: "paid" } },
    { new: true }
  );

  if (!purchase) return res.status(409).json({ error: "Payment already verified or not found" });

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
    if (env.OWNER_EMAIL && purchase.amount >= 999) {
      await resend.emails.send({
        from: "RocketBrain <alerts@rocketbrain.ai>",
        to: env.OWNER_EMAIL,
        subject: "Large coupon purchase",
        html: `<p>User ${auth.email} purchased ${purchase.coupons} coupons.</p>`
      });
    }
  }

  res.json({ success: true, balance: balance.balance });
});

couponsRouter.get("/history", async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const purchases = await CouponPurchase.find({ userId: auth.userId }).sort({ createdAt: -1 }).limit(25);
  const usage = await CouponUsage.find({ userId: auth.userId }).sort({ createdAt: -1 }).limit(25);
  res.json({ purchases, usage });
});
