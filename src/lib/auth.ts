import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { db } from "./db";
import { checkLoginRateLimit, clientIp, pruneLoginAttempts, recordLoginAttempt } from "./rate-limit";
import { credentialsSchema } from "./validation/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      // The rate limit is enforced here rather than in the login form, because the
      // /api/auth/callback/credentials endpoint can be posted to directly and would
      // otherwise skip the check entirely.
      async authorize(raw, request) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const ip = clientIp(request.headers);
        const limit = await checkLoginRateLimit(ip);
        if (!limit.allowed) return null;

        const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
        // Comparing against a dummy hash keeps the response time even whether or not the email exists.
        const hash = user?.hashedPassword ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
        const passwordOk = await bcrypt.compare(password, hash);
        const success = Boolean(user) && passwordOk;

        await recordLoginAttempt(ip, email, success);
        if (!success) return null;

        void pruneLoginAttempts();
        return { id: user!.id, email: user!.email, name: user!.name };
      },
    }),
  ],
});
