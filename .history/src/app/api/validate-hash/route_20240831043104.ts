// src/app/api/auth/telegram/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Ensure you have this set in your environment variables

export async function POST(request: Request) {
  const { data, hash } = await request.json();

  // Sort and concatenate data key-value pairs
  const dataCheckString = Object.keys(data)
    .filter((key) => key !== "hash" && data[key] !== undefined)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  // Create a SHA-256 hash of the bot token to derive a secret key
  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN!).digest();

  // Compute HMAC using the secret key and the check string
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // Compare computed HMAC with Telegram's hash
  if (hmac === hash) {
    return NextResponse.json({ success: true, token: "YOUR_GENERATED_TOKEN" });
  } else {
    return NextResponse.json(
      { success: false, error: "Invalid data" },
      { status: 401 }
    );
  }
}
