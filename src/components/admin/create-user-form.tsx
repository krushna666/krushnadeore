"use client";

import { useActionState } from "react";
import { createUserAction, type CreateUserState } from "@/app/admin/(dashboard)/users/actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState<CreateUserState, FormData>(createUserAction, undefined);

  return (
    <form action={formAction} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-3">
      <Input name="name" placeholder="Full name" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Select name="role" defaultValue="EDITOR">
        <option value="EDITOR">Editor</option>
        <option value="ADMIN">Admin</option>
      </Select>
      <Button type="submit" className="sm:col-span-3" disabled={pending}>
        {pending ? "Creating…" : "Create user"}
      </Button>
      {state?.error && <p className="text-sm text-danger sm:col-span-3">{state.error}</p>}
      {state?.tempPassword && (
        <p className="text-sm text-success sm:col-span-3">
          User created. Temporary password: <strong>{state.tempPassword}</strong> (also emailed to them).
        </p>
      )}
    </form>
  );
}
