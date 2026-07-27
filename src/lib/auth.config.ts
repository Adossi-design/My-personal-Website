import type { NextAuthConfig } from "next-auth";

const isProduction = process.env.NODE_ENV === "production";

// Edge-safe half of the config: no Prisma and no bcrypt, so middleware can import it.
export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/admin/login", error: "/admin/login" },
  cookies: {
    sessionToken: {
      name: isProduction ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: isProduction },
    },
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
    // Guards every /admin route except the login screen itself.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const signedIn = Boolean(auth?.user);

      // API routes answer with JSON, because redirecting a fetch to an HTML
      // login page turns a 401 into an unparseable response.
      if (pathname.startsWith("/api/admin")) {
        if (signedIn) return true;
        return Response.json({ error: "Not authenticated" }, { status: 401 });
      }

      if (pathname === "/admin/login") return true;
      if (pathname.startsWith("/admin")) return signedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
