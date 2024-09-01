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

export function verifyTelegramAuth(authData: TelegramUser): boolean {
  const { hash, ...data } = authData;

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  console.log("Secret Key:", secretKey);

  const checkString = Object.keys(data)
    .sort()
    .map((k) => `${k}=${data[k as keyof typeof data]}`)
    .join("\n");

  console.log("Check String:", checkString);

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  console.log("Check String:", checkString);
  console.log("Generated HMAC:", hmac);
  console.log("Received Hash:", hash);

  return hmac === hash;
}
