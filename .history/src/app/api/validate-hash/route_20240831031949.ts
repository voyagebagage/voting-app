import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(request: NextRequest) {
  const { hash } = await request.json();

  if (!hash) {
    return NextResponse.json({ error: "Hash is required" }, { status: 400 });
  }

  const dataCheckString = hash
    .split("&")
    .filter((param: string) => !param.startsWith("hash="))
    .sort()
    .join("\n");

  const secretKey = crypto
    .createHash("sha256")
    .update(BOT_TOKEN || "")
    .digest();
  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  const receivedHash = hash
    .split("&")
    .find((param: string) => param.startsWith("hash="))
    ?.split("=")[1];
  console.log([
    "Received hash:",
    receivedHash,
    "Calculated hash:",
    calculatedHash,
  ]);

  if (calculatedHash === receivedHash) {
    return NextResponse.json({ valid: true });
  } else {
    return NextResponse.json({ error: "Invalid hash" }, { status: 401 });
  }
}
