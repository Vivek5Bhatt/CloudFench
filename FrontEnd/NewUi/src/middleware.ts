import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "utils/commonFunctions";

export async function middleware(req: NextRequest) {
  let token = req.cookies.get("token")?.value;
  if (isTokenExpired(token)) {
    if (token) {
      req.cookies.delete("token");
    }
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.delete("token");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
