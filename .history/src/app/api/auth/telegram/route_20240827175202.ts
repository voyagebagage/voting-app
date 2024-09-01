import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const userData: any = await request.json();

  try {
    const isValid = await verifyTelegramAuth(userData);
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

function generateToken(userData: any): string {
  // Implement your token generation logic here
  return "your-generated-token";
}
