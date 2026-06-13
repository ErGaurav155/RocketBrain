import mongoose, { Schema } from "mongoose";

const couponBalanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    totalPurchased: { type: Number, default: 0 },
    totalUsed: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const CouponBalance = mongoose.models.CouponBalance || mongoose.model("CouponBalance", couponBalanceSchema);
