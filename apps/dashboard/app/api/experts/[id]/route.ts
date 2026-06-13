import { getExpert } from "@rocketbrain/shared";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const expert = getExpert(id);

  if (!expert || !expert.isActive) {
    return NextResponse.json({ error: "Expert not found" }, { status: 404 });
  }

  return NextResponse.json({ expert });
}
