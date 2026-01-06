export { default } from "next-auth/middleware";

// Protect these routes with authentication
export const config = {
  matcher: ["/dashboard/:path*", "/quotes/:path*"],
};
