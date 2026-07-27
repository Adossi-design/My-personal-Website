import { auth } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await auth();

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Account</h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Signed in as {session?.user?.email}
        </p>
      </div>
      <PasswordForm />
    </div>
  );
}
