import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminAuth } from "../../../../../lib/server/auth";
import { AIExpertModel } from "../../../../../lib/server/models";
import { errorResponse } from "../../../../../lib/server/responses";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminAuth(request);
    const { id } = await context.params;
    const parsed = z
      .object({
        systemPrompt: z.string().min(20).optional(),
        couponCost: z.number().int().min(1).max(10).optional(),
        isActive: z.boolean().optional()
      })
      .safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const expert = await AIExpertModel.findOneAndUpdate({ slug: id }, { $set: parsed.data }, { new: true });
    return NextResponse.json({ expert });
  } catch (error) {
    return errorResponse(error);
  }
}
