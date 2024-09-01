import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramAuth } from "../../../lib/auth";
import generateToken from "../../../lib/auth";

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
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
