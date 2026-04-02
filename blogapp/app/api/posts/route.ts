import { NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/v1/posts`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to reach blog-api" }, { status: 502 });
  }
}
