import { createHmac, createHash } from "crypto";
import jwt from "jsonwebtoken";
import { TelegramUser } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET as string;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;

// export interface TelegramUser {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code?: string;
//   photo_url?: string;
//   auth_date: number;
//   hash: string;
// }

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
  const { hash, data_check_string } = parseInitData(initData);

  if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is not set");
    return false;
  }

  const secret_key = createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();
  const key = createHmac("sha256", secret_key)
    .update(data_check_string)
    .digest("hex");

  console.log("Data check string:", data_check_string);
  console.log("Generated key:", key);
  console.log("Received hash:", hash);

  return key === hash;
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

// export function verifyToken(token: string): any {
// try {
//   return jwt.verify(token, JWT_SECRET);
// } catch (error) {
//   return null;
// }
// }
export function verifyToken(token: string): TelegramUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    return {
      id: parseInt(decoded.userId),
      first_name: "User",
    };
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}
