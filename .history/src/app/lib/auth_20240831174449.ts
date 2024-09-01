import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

export async function verifyTokenAndGetUser(
  token: string
): Promise<TelegramUser | null> {
  try {
    const response = await fetch("/api/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      return response.json();
    }
    return null;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

function parseInitData(initData: string) {
  const q = new URLSearchParams(initData);
  const hash = q.get("hash");
  q.delete("hash");
  const v = Array.from(q.entries());
  v.sort(([aN], [bN]) => aN.localeCompare(bN));
  const data_check_string = v.map(([n, v]) => `${n}=${v}`).join("\n");
  return { hash, data_check_string };
}

export function verifyTelegramAuth(initData: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");
  const dataCheckString = urlParams.toString();

  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not set");
    return false;
  }

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  console.log("Data check string:", dataCheckString);
  console.log("Generated HMAC:", hmac);
  console.log("Received hash:", hash);

  return hmac === hash;
}
