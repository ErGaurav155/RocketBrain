import { NextResponse } from "next/server";

export function errorResponse(error: unknown, fallback = "Request failed") {
  const message = error instanceof Error ? error.message : fallback;
  const status = message.includes("Missing bearer") || message.includes("Invalid session")
    ? 401
    : message.includes("Admin access")
      ? 403
      : message.includes("disabled")
        ? 403
        : 500;

  return NextResponse.json({ error: message || fallback }, { status });
}
