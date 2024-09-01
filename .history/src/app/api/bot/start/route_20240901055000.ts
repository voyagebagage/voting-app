import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startPayload = searchParams.get("start");

  if (!startPayload) {
    return NextResponse.json(
      { error: "Invalid start command" },
      { status: 400 }
    );
  }

  // Here you would typically verify the user with Telegram's API
  // For this example, we'll just create a mock user
  const mockUser = {
    id: 12345,
    first_name: "Test",
    username: "testuser",
  };

  const token = generateToken(mockUser.id.toString());

  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400, // 1 day
    path: "/",
  });

  // Redirect to the app's main page
  return NextResponse.redirect(new URL("/", request.url));
}
