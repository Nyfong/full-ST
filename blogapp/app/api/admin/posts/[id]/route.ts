import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:5001";

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const auth = req.headers.get("authorization") ?? "";
  try {
    const res = await fetch(`${API_URL}/api/v1/posts/admin/${id}`, {
      method: "DELETE",
      headers: { Authorization: auth },
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Failed to reach blog-api" }, { status: 502 });
  }
}
