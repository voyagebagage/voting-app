import { NextRequest, NextResponse } from "next/server";
import verifyTelegramAuth from "../../../lib/auth";
import { TelegramAuthData } from "@/app/login/page";

export async function POST(request: NextRequest) {
  const userData: TelegramAuthData = await request.json();

  try {
    const isValid = verifyTelegramAuth(userData);
    if (isValid) {
      const token = generateToken(userData);
      return NextResponse.json({ token });
    } else {
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

function generateToken(userData: TelegramAuthData): string {
  // Implement your token generation logic here
  return "your-generated-token";
}
