import { NextResponse } from "next/server";
import { auth } from "./auth";
import type { Session } from "next-auth";

// Middleware is not a security boundary on its own, so every mutating route calls this too.
export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return session;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "UnauthorizedError";
  }
}

// Wraps a route handler so auth failures, validation errors and Prisma errors all
// return a predictable JSON shape instead of leaking a stack trace.
export async function withAdmin(handler: (session: Session) => Promise<NextResponse>) {
  try {
    const session = await requireAdmin();
    return await handler(session);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message, fields: error.fields }, { status: error.status });
    }
    console.error("[api]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string[]>;
  constructor(message: string, status = 400, fields?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}
