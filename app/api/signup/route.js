import { NextResponse } from "next/server";

import createUser from "@lib/createUser";

export async function GET() {
  return NextResponse.json(
    {
      error: "Method Not Allowed",
      message: "This endpoint only accepts POST requests.",
    },
    { status: 405 }
  );
}

export async function POST(req) {
  let body;

  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  return await createUser(body);
}
