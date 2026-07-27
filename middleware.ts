import NextAuth from "next-auth";
import { authConfig } from "./src/lib/auth.config";

// Uses only the edge-safe config, so no Prisma or bcrypt is pulled into the edge bundle.
export const { auth: middleware } = NextAuth(authConfig);

export default middleware;

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
