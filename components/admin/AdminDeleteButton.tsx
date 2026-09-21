"use client";

import { adminConfirmDelete } from "@/lib/admin-ui-messages";

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
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(adminConfirmDelete(noun))) e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded border border-black/20 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50"
      >
        {label}
      </button>
    </form>
  );
}
