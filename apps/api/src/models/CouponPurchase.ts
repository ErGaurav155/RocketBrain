import mongoose, { Schema } from "mongoose";

const couponPurchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    packId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true },
    coupons: { type: Number, required: true },
    status: { type: String, enum: ["created", "paid", "failed"], default: "created" }
  },
  { timestamps: true }
);

export const CouponPurchase = mongoose.models.CouponPurchase || mongoose.model("CouponPurchase", couponPurchaseSchema);
