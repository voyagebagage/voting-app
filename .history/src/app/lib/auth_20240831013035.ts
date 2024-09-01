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
  console.log("Auth data received:", authData);

  if (!authData.hash) {
    console.error("No hash provided in auth data");
    return false;
  }

  const { hash, ...data } = authData;
  console.log("Data keys sorted:", Object.keys(data).sort());
  const checkString = Object.keys(data)
    .filter((key) => data[key as keyof typeof data] !== undefined)
    .sort()
    .map((key) => `${key}=${data[key as keyof typeof data]}`)
    .join("\n");

  console.log("Check string:", checkString);

  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not set");
    return false;
  }

  const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  console.log("Secret Key:", secretKey.toString("hex"));

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  console.log(
    "Secret key (first 10 chars):",
    secretKey.toString("hex").substring(0, 10)
  );
  console.log("Generated HMAC:", hmac);
  console.log("Received hash:", hash);

  return hmac === hash;
}
