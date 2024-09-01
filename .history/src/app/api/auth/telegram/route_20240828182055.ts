import { verifyTelegramAuth } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "../auth";
// import { verifyTelegramAuth } from "@/lib/auth";
// import { generateToken } from "@/lib/auth"; // Make sure this function exists in your auth.ts file

export async function POST(request: NextRequest) {
  const userData = await request.json();

  try {
    const isValid = verifyTelegramAuth(userData);
    if (isValid) {
      const token = generateToken(userData.id.toString());
      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
