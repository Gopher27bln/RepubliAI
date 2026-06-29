import { NextRequest, NextResponse } from "next/server";
import { repurposeContent } from "@/lib/repurpose";
import type { RepurposeRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: RepurposeRequest = await req.json();

    if (!body.title?.trim() || !body.body?.trim()) {
      return NextResponse.json(
        { error: "title and body are required" },
        { status: 400 }
      );
    }

    if (!body.channels || body.channels.length === 0) {
      return NextResponse.json(
        { error: "at least one channel must be selected" },
        { status: 400 }
      );
    }

    const result = await repurposeContent(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[repurpose] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
