import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  const { hash } = await request.json();

  console.log("Received hash:", hash);
  console.log("BOT_TOKEN:", BOT_TOKEN ? "Set" : "Not set");

  if (!hash) {
    return NextResponse.json(
      { error: "Hash is required", valid: false },
      { status: 400 }
    );
  }

  const dataCheckString = hash
    .split("&")
    .filter((param: string) => !param.startsWith("hash="))
    .sort()
    .join("\n");

  console.log("Data check string:", dataCheckString);

  const secretKey = crypto
    .createHash("sha256")
    .update(BOT_TOKEN || "")
    .digest();
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  console.log("Calculated hash:", calculatedHash);

  const receivedHash = hash
    .split("&")
    .find((param: string) => param.startsWith("hash="))
    ?.split("=")[1];

  console.log("Received hash:", receivedHash);

  if (calculatedHash === receivedHash) {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json(
      { error: "Invalid hash", valid: false },
      { status: 401 }
    );
  }
}
