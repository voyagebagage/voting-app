import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

export async function verifyTokenAndGetUser(token: string) {
  const response = await fetch("/api/auth/verify", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok) {
    return response.json();
  }
  throw new Error("Invalid token");
}
