// import { NextRequest, NextResponse } from "next/server";
// import { verifyTelegramAuth, generateToken } from "@/app/lib/auth";

// export async function POST(request: NextRequest) {
//   const { initData } = await request.json();
//   console.log("Received initData:", initData);

//   try {
//     const isValid = verifyTelegramAuth(initData);
//     console.log("Is valid:", isValid);
//     if (isValid) {
//       const userData = JSON.parse(
//         new URLSearchParams(initData).get("user") || "{}"
//       );
//       const token = generateToken(userData.id.toString());
//       // console.log("Generated token:", token);
//       return NextResponse.json({ token });
//     } else {
//       console.log("Invalid authentication");
//       return NextResponse.json(
//         { error: "Invalid authentication" },
//         { status: 401 }
//       );
//     }
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return NextResponse.json(
//       { error: "Authentication failed" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramAuth, generateToken } from "@/app/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const { initData } = await request.json();
  console.log("Received initData:", initData);

  try {
    const isValid = verifyTelegramAuth(initData);
    console.log("Is valid:", isValid);
    if (isValid) {
      const userData = JSON.parse(
        new URLSearchParams(initData).get("user") || "{}"
      );
      const token = generateToken(userData.id.toString());

      // Set the token in an HTTP-only cookie
      cookies().set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // Changed from 'strict' to allow cross-site requests
        maxAge: 86400, // 1 day
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      console.log("Invalid authentication");
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
