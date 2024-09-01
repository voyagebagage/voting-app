import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramAuth, generateToken } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  const { initData } = await request.json();
  console.log("Received initData:", initData);

  try {
    const isValid = verifyTelegramAuth(initData);
    console.log("Is valid:", isValid);
    if (isValid) {
      const userData = JSON.parse(
        new URLSearchParams(initData).get("user") || "{}"
      );
      const token = generateToken(userData.id.toString());
      console.log("Generated token:", token);
      return NextResponse.json({ token });
    } else {
      console.log("Invalid authentication");
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
