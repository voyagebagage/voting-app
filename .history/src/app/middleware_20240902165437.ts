// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token");
//   if (!token && !request.nextUrl.pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import Cors from "cors";
import { NextRequest, NextResponse } from "next/server";

const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
  origin: [process.env.NEXT_PUBLIC_APP_URL as string, "http://localhost:3000"],
  credentials: true,
});

export function runMiddleware(
  req: NextRequest,
  res: NextResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
