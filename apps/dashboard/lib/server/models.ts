import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    disabled: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const couponBalanceSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    totalPurchased: { type: Number, default: 0 },
    totalUsed: { type: Number, default: 0 }
  },
  { timestamps: true }
);

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

const aiExpertSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    systemPrompt: { type: String, required: true },
    couponCost: { type: Number, default: 1 },
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    examples: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const CouponBalance = mongoose.models.CouponBalance || mongoose.model("CouponBalance", couponBalanceSchema);
export const CouponPurchase = mongoose.models.CouponPurchase || mongoose.model("CouponPurchase", couponPurchaseSchema);
export const CouponUsage = mongoose.models.CouponUsage || mongoose.model("CouponUsage", couponUsageSchema);
export const AIExpertModel = mongoose.models.AIExpert || mongoose.model("AIExpert", aiExpertSchema);
