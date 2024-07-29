import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export default function middleware(request: NextRequest) {
  console.log("Middleware executed for:", request.nextUrl.pathname);

  const token = request.cookies.get("accessToken");

  // Check if the path is protected and requires an access token
  const isProtectedPath = [
    "/inventory",
    "/hr",
    "/dashboard",
    "/hr/payroll",
  ].some((path) => request.nextUrl.pathname.startsWith(path));

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath) {
    if (typeof token?.value === "string" && token.value !== "") {
      try {
        const decoded = jwtDecode(token.value);
        console.log("Decoded token:", decoded);
        // Check if the user has the required role
      } catch (error) {
        console.error("Token decoding error:", error);
        return NextResponse.redirect("/login");
      }
    } else {
      return NextResponse.redirect("/login");
    }
  }

  return NextResponse.next();
}
