"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, Field, inputClass, primaryButtonClass } from "@/components/admin/ui";
import { changePassword } from "./actions";

const BLANK = { currentPassword: "", newPassword: "", confirmPassword: "" };

export function PasswordForm() {
  const [values, setValues] = useState(BLANK);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [pending, startTransition] = useTransition();

  function submit() {
    setErrors({});
    startTransition(async () => {
      const result = await changePassword(values);
      if (!result.ok) {
        if (result.fields) setErrors(result.fields);
        toast.error(result.error);
        return;
      }
      setValues(BLANK);
      toast.success("Password changed");
    });
  }

  return (
    <Card title="Change password" description="At least ten characters. Hashed with bcrypt at cost 12.">
      <div className="space-y-4">
        <Field label="Current password" htmlFor="currentPassword" required error={errors.currentPassword?.[0]}>
          <input
            id="currentPassword"
            type="password"
            autoComplete="current-password"
            value={values.currentPassword}
            onChange={(e) => setValues({ ...values, currentPassword: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="New password" htmlFor="newPassword" required error={errors.newPassword?.[0]}>
          <input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            value={values.newPassword}
            onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Confirm new password" htmlFor="confirmPassword" required error={errors.confirmPassword?.[0]}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
            className={inputClass}
          />
        </Field>
        <button type="button" className={primaryButtonClass} onClick={submit} disabled={pending}>
          {pending ? "Saving" : "Change password"}
        </button>
      </div>
    </Card>
  );
}
