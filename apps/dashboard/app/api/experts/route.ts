import { experts } from "@rocketbrain/shared";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ experts: experts.filter((expert) => expert.isActive) });
}
