"use client";

import { useActionState } from "react";
import { AdminFormFeedback } from "@/components/admin/AdminFormFeedback";
import { adminLoginAction, type AdminLoginState } from "@/app/admin/actions";
import { ADMIN_LOGIN_DEFAULTS } from "@/lib/admin-credentials";
import type { AdminFeedback } from "@/lib/admin-ui-messages";

const initial: AdminLoginState = {};

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, pending] = useActionState(adminLoginAction, initial);
  const feedback: AdminFeedback | null = state.error
    ? { tone: "error", message: state.error }
    : null;

  return (
    <form
      action={action}
      className="mx-auto w-full max-w-sm space-y-4 rounded border border-black/10 bg-white p-6 shadow-sm"
      noValidate
    >
      <input type="hidden" name="next" value={nextPath} />
      <AdminFormFeedback feedback={feedback} />
      <div>
        <label className="text-sm font-semibold" htmlFor="username">
          아이디
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          defaultValue={ADMIN_LOGIN_DEFAULTS.username}
          className="mt-1.5 w-full rounded border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#5a554c]"
        />
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          defaultValue={ADMIN_LOGIN_DEFAULTS.password}
          className="mt-1.5 w-full rounded border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#5a554c]"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-[#5a554c] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "로그인 중…" : "로그인"}
      </button>
    </form>
  );
}
