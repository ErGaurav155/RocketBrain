import mongoose, { Schema } from "mongoose";

const couponUsageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expertId: { type: String, required: true },
    expertName: { type: String, required: true },
    couponUsed: { type: Number, required: true },
    mode: { type: String, enum: ["normal", "deep"], required: true },
    tokenEstimate: { type: Number, default: 0 },
    status: { type: String, enum: ["success", "failed"], required: true }
  },
  { timestamps: true }
);

export const CouponUsage = mongoose.models.CouponUsage || mongoose.model("CouponUsage", couponUsageSchema);
