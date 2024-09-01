import { verifyToken } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "../auth";
// import { verifyToken } from "@/app/auth/auth";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  const userData = verifyToken(token);

  if (userData) {
    return NextResponse.json(userData);
  } else {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
