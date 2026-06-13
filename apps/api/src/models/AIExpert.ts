import mongoose, { Schema } from "mongoose";

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

export const AIExpertModel = mongoose.models.AIExpert || mongoose.model("AIExpert", aiExpertSchema);
