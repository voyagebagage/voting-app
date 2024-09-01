import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const authToken = cookies().get("auth_token")?.value;

  if (!authToken) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const userData = verifyToken(authToken);
    if (userData) {
      return NextResponse.json({ user: userData });
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Token verification failed" },
      { status: 500 }
    );
  }
}
