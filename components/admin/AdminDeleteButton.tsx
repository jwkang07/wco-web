"use client";

import { useTransition } from "react";
import { adminConfirmDelete } from "@/lib/admin-ui-messages";

/**
 * 삭제 버튼 — 부모 AdminActionForm 안에 중첩 <form>을 만들지 않음
 * (Hydration: form cannot contain a nested form)
 */
export function AdminDeleteButton({
  action,
  id,
  label = "삭제",
  noun,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  /** confirm 문구용 대상명 — adminConfirmDelete(noun) */
  noun: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="rounded border border-black/20 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-60"
      onClick={() => {
        if (!window.confirm(adminConfirmDelete(noun))) return;
        const fd = new FormData();
        fd.set("id", id);
        // transition이 서버 액션 완료(또는 redirect)까지 pending 유지
        startTransition(async () => {
          await action(fd);
        });
      }}
    >
      {pending ? "삭제 중…" : label}
    </button>
  );
}
