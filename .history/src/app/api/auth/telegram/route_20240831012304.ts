import { verifyTelegramAuth, generateToken } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
// import { verifyTelegramAuth, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const userData = await request.json();
  console.log("ROUTE User data:", userData, " " + request.body);

  try {
    console.log(
      "BOT_TOKEN (first 4 chars):",
      process.env.TELEGRAM_BOT_TOKEN?.substring(0, 4)
    );

    const isValid = verifyTelegramAuth(userData);
    console.log("Is valid:", isValid);
    if (isValid) {
      const token = generateToken(userData.id.toString());
      console.log("ROUTE Generated token:", token);
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
